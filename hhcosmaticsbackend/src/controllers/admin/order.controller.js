import { Op } from 'sequelize'
import { sequelize } from '../../config/database.js'
import { Coupon, CouponUsage, InventoryLog, Order, OrderItem, OrderStatusHistory, Product, ProductVariant, User } from '../../models/index.js'
import { pagination, paginationMeta, success } from '../../utils/helpers.js'
import { ApiError } from '../../utils/ApiError.js'
import { adminLog } from '../../utils/adminLog.js'

const allowedTransitions = {
  PENDING: ['CONFIRMED','CANCELLED'],
  CONFIRMED: ['PROCESSING','CANCELLED'],
  PROCESSING: ['SHIPPED','CANCELLED'],
  SHIPPED: ['DELIVERED','RETURN_REQUESTED'],
  DELIVERED: ['RETURN_REQUESTED'],
  RETURN_REQUESTED: ['RETURNED','DELIVERED'],
  RETURNED: [],
  CANCELLED: []
}

const include = [
  { model: User, as: 'user', attributes: ['id','firstName','lastName','email','phone'] },
  { model: OrderItem, as: 'items' },
  { model: OrderStatusHistory, as: 'history' }
]

export async function listOrders(req, res, next) {
  try {
    const { page, limit, offset } = pagination(req.query)
    const where = {}
    if (req.query.status) where.status = req.query.status
    if (req.query.paymentStatus) where.paymentStatus = req.query.paymentStatus
    if (req.query.from || req.query.to) {
      where.createdAt = {}
      if (req.query.from) where.createdAt[Op.gte] = new Date(req.query.from)
      if (req.query.to) where.createdAt[Op.lte] = new Date(`${req.query.to}T23:59:59.999`)
    }
    if (req.query.search) {
      const q = `%${String(req.query.search).trim()}%`
      where[Op.or] = [{ orderNumber: { [Op.like]: q } }, { trackingNumber: { [Op.like]: q } }]
    }
    const { rows, count } = await Order.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id','firstName','lastName','email','phone'] }, { model: OrderItem, as: 'items' }],
      order: [['createdAt','DESC']], distinct: true, limit, offset
    })
    return success(res, rows, 'OK', 200, paginationMeta(count, page, limit))
  } catch (error) { next(error) }
}

export async function getOrder(req, res, next) {
  try {
    const row = await Order.findByPk(req.params.id, { include })
    if (!row) throw new ApiError(404, 'Order not found', 'ORDER_NOT_FOUND')
    return success(res, row)
  } catch (error) { next(error) }
}

export async function updateOrderStatus(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const row = await Order.findByPk(req.params.id, { include: [{ model: OrderItem, as: 'items' }], transaction, lock: transaction.LOCK.UPDATE })
    if (!row) throw new ApiError(404, 'Order not found', 'ORDER_NOT_FOUND')
    const nextStatus = req.body.status
    if (nextStatus !== row.status && !allowedTransitions[row.status]?.includes(nextStatus)) {
      throw new ApiError(409, `Order cannot move from ${row.status} to ${nextStatus}`, 'INVALID_ORDER_TRANSITION')
    }
    if ((nextStatus === 'CANCELLED' && row.status !== 'CANCELLED') || (nextStatus === 'RETURNED' && row.status !== 'RETURNED')) {
      const inventoryReason = nextStatus === 'CANCELLED' ? 'ORDER_CANCELLED_ADMIN' : 'ORDER_RETURNED'
      for (const item of row.items) {
        if (item.variantId) {
          const variant = await ProductVariant.findByPk(item.variantId, { transaction, lock: transaction.LOCK.UPDATE })
          if (variant) {
            const beforeQuantity = Number(variant.stock); const afterQuantity = beforeQuantity + Number(item.quantity)
            await variant.increment('stock', { by: item.quantity, transaction })
            await InventoryLog.create({ productId: item.productId, variantId: variant.id, changeQuantity: Number(item.quantity), beforeQuantity, afterQuantity, reason: inventoryReason, reference: row.orderNumber, changedByUserId: req.user.id }, { transaction })
          }
        } else if (item.productId) {
          const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE })
          if (product?.trackInventory) {
            const beforeQuantity = Number(product.stock); const afterQuantity = beforeQuantity + Number(item.quantity)
            await product.increment('stock', { by: item.quantity, transaction })
            await InventoryLog.create({ productId: product.id, changeQuantity: Number(item.quantity), beforeQuantity, afterQuantity, reason: inventoryReason, reference: row.orderNumber, changedByUserId: req.user.id }, { transaction })
          }
        }
      }
      if (nextStatus === 'CANCELLED' && row.couponId) {
        const usage = await CouponUsage.findOne({ where: { orderId: row.id }, transaction, lock: transaction.LOCK.UPDATE })
        if (usage) {
          await usage.destroy({ transaction })
          const coupon = await Coupon.findByPk(row.couponId, { transaction, lock: transaction.LOCK.UPDATE })
          if (coupon && Number(coupon.usedCount) > 0) await coupon.decrement('usedCount', { by: 1, transaction })
        }
      }
    }
    const patch = { status: nextStatus }
    if ('trackingNumber' in req.body) patch.trackingNumber = req.body.trackingNumber || null
    if ('carrier' in req.body) patch.carrier = req.body.carrier || null
    if (req.body.paymentStatus) patch.paymentStatus = req.body.paymentStatus
    if (nextStatus === 'CONFIRMED' && !row.confirmedAt) patch.confirmedAt = new Date()
    if (nextStatus === 'SHIPPED' && !row.shippedAt) patch.shippedAt = new Date()
    if (nextStatus === 'DELIVERED' && !row.deliveredAt) {
      patch.deliveredAt = new Date()
      if (!req.body.paymentStatus) patch.paymentStatus = 'PAID'
    }
    if (nextStatus === 'CANCELLED' && !row.cancelledAt) {
      patch.cancelledAt = new Date()
      if (!req.body.paymentStatus) patch.paymentStatus = 'VOID'
    }
    if (nextStatus === 'RETURNED' && !req.body.paymentStatus) patch.paymentStatus = 'REFUNDED'
    await row.update(patch, { transaction })
    await OrderStatusHistory.create({ orderId: row.id, status: nextStatus, note: req.body.note || null, changedByUserId: req.user.id }, { transaction })
    await adminLog(req, 'ORDER_STATUS_UPDATED', 'ORDER', row.id, patch, transaction)
    await transaction.commit()
    return success(res, await Order.findByPk(row.id, { include }), 'Order updated')
  } catch (error) { await transaction.rollback(); next(error) }
}

export async function updateOrderNotes(req, res, next) {
  try {
    const row = await Order.findByPk(req.params.id)
    if (!row) throw new ApiError(404, 'Order not found', 'ORDER_NOT_FOUND')
    await row.update({ adminNote: req.body.adminNote ?? row.adminNote })
    await adminLog(req, 'ORDER_NOTE_UPDATED', 'ORDER', row.id)
    return success(res, row, 'Order note updated')
  } catch (error) { next(error) }
}
