import { sequelize } from '../config/database.js'
import { Address, CartItem, Coupon, CouponUsage, InventoryLog, Order, OrderItem, OrderStatusHistory, Product, ProductVariant, User } from '../models/index.js'
import { calculateCartTotals } from '../services/commerce.service.js'
import { makeOrderNumber, pagination, paginationMeta, success } from '../utils/helpers.js'
import { ApiError } from '../utils/ApiError.js'

const orderInclude = [
  { model: OrderItem, as: 'items' },
  { model: OrderStatusHistory, as: 'history' }
]

async function uniqueOrderNumber(transaction) {
  for (let i = 0; i < 8; i += 1) {
    const number = makeOrderNumber()
    if (!(await Order.findOne({ where: { orderNumber: number }, transaction }))) return number
  }
  throw new ApiError(500, 'Could not generate order number', 'ORDER_NUMBER_ERROR')
}

export async function createOrder(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    let shippingAddress = req.body.shippingAddress || null
    if (req.body.addressId) {
      const address = await Address.findOne({ where: { id: req.body.addressId, userId: req.user.id }, transaction })
      if (!address) throw new ApiError(404, 'Delivery address not found', 'ADDRESS_NOT_FOUND')
      shippingAddress = {
        firstName: address.firstName, lastName: address.lastName, phone: address.phone,
        addressLine1: address.addressLine1, addressLine2: address.addressLine2, city: address.city,
        county: address.county, postcode: address.postcode, country: address.country
      }
    }
    const pricing = await calculateCartTotals(req.user.id, req.body.couponCode || null, req.body.shippingMethod, transaction, { requireItems: true, validateStock: true, lock: true })
    if (!pricing.totals.codEnabled) throw new ApiError(503, 'Cash on Delivery is temporarily unavailable', 'COD_UNAVAILABLE')
    const locked = []
    for (const item of pricing.items) {
      const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE })
      if (!product || !product.isActive) throw new ApiError(409, `${item.name} is no longer available`, 'PRODUCT_UNAVAILABLE')
      let variant = null
      if (item.variantId) {
        variant = await ProductVariant.findOne({ where: { id: item.variantId, productId: product.id }, transaction, lock: transaction.LOCK.UPDATE })
        if (!variant || !variant.isActive) throw new ApiError(409, `${item.name} variant is no longer available`, 'VARIANT_UNAVAILABLE')
      }
      const stock = Number(variant ? variant.stock : product.stock)
      if (product.trackInventory && stock < item.quantity) throw new ApiError(409, `${item.name} only has ${stock} item(s) left`, 'INSUFFICIENT_STOCK')
      locked.push({ item, product, variant })
    }
    const order = await Order.create({
      userId: req.user.id,
      couponId: pricing.coupon?.id || null,
      orderNumber: await uniqueOrderNumber(transaction),
      status: 'PENDING',
      paymentMethod: 'COD',
      paymentStatus: 'COD_PENDING',
      shippingMethod: req.body.shippingMethod,
      currency: pricing.totals.currency,
      subtotal: pricing.totals.subtotal,
      discountAmount: pricing.totals.discountAmount,
      shippingAmount: pricing.totals.shippingAmount,
      codFee: pricing.totals.codFee,
      totalAmount: pricing.totals.totalAmount,
      couponCode: pricing.coupon?.code || null,
      customerNote: req.body.customerNote || null,
      shippingAddress,
      billingAddress: shippingAddress
    }, { transaction })
    for (const { item, product, variant } of locked) {
      await OrderItem.create({
        orderId: order.id, productId: item.productId, variantId: item.variantId,
        productName: item.name, variantName: item.variantName, sku: item.sku, imageUrl: item.imageUrl,
        unitPrice: item.unitPrice, quantity: item.quantity, lineTotal: item.lineTotal
      }, { transaction })
      if (product.trackInventory) {
        const beforeQuantity = Number(variant ? variant.stock : product.stock)
        const afterQuantity = beforeQuantity - Number(item.quantity)
        if (variant) await variant.decrement('stock', { by: item.quantity, transaction })
        else await product.decrement('stock', { by: item.quantity, transaction })
        await InventoryLog.create({
          productId: product.id, variantId: variant?.id || null, changeQuantity: -Number(item.quantity),
          beforeQuantity, afterQuantity, reason: 'ORDER_PLACED', reference: order.orderNumber, changedByUserId: req.user.id
        }, { transaction })
      }
    }
    await OrderStatusHistory.create({ orderId: order.id, status: 'PENDING', note: 'Order placed with Cash on Delivery', changedByUserId: req.user.id }, { transaction })
    if (pricing.coupon) {
      await CouponUsage.create({ couponId: pricing.coupon.id, userId: req.user.id, orderId: order.id, discountAmount: pricing.totals.discountAmount }, { transaction })
      await pricing.coupon.increment('usedCount', { by: 1, transaction })
    }
    await CartItem.destroy({ where: { cartId: pricing.cart.id }, transaction })
    await transaction.commit()
    const created = await Order.findByPk(order.id, { include: orderInclude })
    return success(res, created, 'Order placed successfully. Payment will be collected on delivery.', 201)
  } catch (error) {
    await transaction.rollback()
    next(error)
  }
}

export async function listMyOrders(req, res, next) {
  try {
    const { page, limit, offset } = pagination(req.query)
    const { rows, count } = await Order.findAndCountAll({ where: { userId: req.user.id }, include: [{ model: OrderItem, as: 'items' }], order: [['createdAt','DESC']], distinct: true, limit, offset })
    return success(res, rows, 'OK', 200, paginationMeta(count, page, limit))
  } catch (error) { next(error) }
}

export async function getMyOrder(req, res, next) {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id }, include: orderInclude })
    if (!order) throw new ApiError(404, 'Order not found', 'ORDER_NOT_FOUND')
    return success(res, order)
  } catch (error) { next(error) }
}

export async function cancelMyOrder(req, res, next) {
  const transaction = await sequelize.transaction()
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id }, include: [{ model: OrderItem, as: 'items' }], transaction, lock: transaction.LOCK.UPDATE })
    if (!order) throw new ApiError(404, 'Order not found', 'ORDER_NOT_FOUND')
    if (!['PENDING','CONFIRMED'].includes(order.status)) throw new ApiError(409, 'This order can no longer be cancelled by the customer', 'CANNOT_CANCEL_ORDER')
    for (const item of order.items) {
      if (item.variantId) {
        const variant = await ProductVariant.findByPk(item.variantId, { transaction, lock: transaction.LOCK.UPDATE })
        if (variant) {
          const beforeQuantity = Number(variant.stock); const afterQuantity = beforeQuantity + Number(item.quantity)
          await variant.increment('stock', { by: item.quantity, transaction })
          await InventoryLog.create({ productId: item.productId, variantId: variant.id, changeQuantity: Number(item.quantity), beforeQuantity, afterQuantity, reason: 'ORDER_CANCELLED', reference: order.orderNumber, changedByUserId: req.user.id }, { transaction })
        }
      } else if (item.productId) {
        const product = await Product.findByPk(item.productId, { transaction, lock: transaction.LOCK.UPDATE })
        if (product?.trackInventory) {
          const beforeQuantity = Number(product.stock); const afterQuantity = beforeQuantity + Number(item.quantity)
          await product.increment('stock', { by: item.quantity, transaction })
          await InventoryLog.create({ productId: product.id, changeQuantity: Number(item.quantity), beforeQuantity, afterQuantity, reason: 'ORDER_CANCELLED', reference: order.orderNumber, changedByUserId: req.user.id }, { transaction })
        }
      }
    }
    if (order.couponId) {
      const usage = await CouponUsage.findOne({ where: { orderId: order.id }, transaction, lock: transaction.LOCK.UPDATE })
      if (usage) {
        await usage.destroy({ transaction })
        const coupon = await Coupon.findByPk(order.couponId, { transaction, lock: transaction.LOCK.UPDATE })
        if (coupon && Number(coupon.usedCount) > 0) await coupon.decrement('usedCount', { by: 1, transaction })
      }
    }
    await order.update({ status: 'CANCELLED', paymentStatus: 'VOID', cancelledAt: new Date() }, { transaction })
    await OrderStatusHistory.create({ orderId: order.id, status: 'CANCELLED', note: req.body.reason || 'Cancelled by customer', changedByUserId: req.user.id }, { transaction })
    await transaction.commit()
    return success(res, await Order.findByPk(order.id, { include: orderInclude }), 'Order cancelled')
  } catch (error) { await transaction.rollback(); next(error) }
}

export async function trackOrder(req, res, next) {
  try {
    const order = await Order.findOne({
      where: { orderNumber: req.body.orderNumber },
      include: [
        { model: User, as: 'user', where: { email: String(req.body.email).toLowerCase() }, attributes: ['id','firstName','lastName','email'] },
        { model: OrderItem, as: 'items' }, { model: OrderStatusHistory, as: 'history' }
      ]
    })
    if (!order) throw new ApiError(404, 'Order was not found for this email address', 'ORDER_NOT_FOUND')
    return success(res, order)
  } catch (error) { next(error) }
}

export async function requestReturn(req, res, next) {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } })
    if (!order) throw new ApiError(404, 'Order not found', 'ORDER_NOT_FOUND')
    if (order.status !== 'DELIVERED') throw new ApiError(409, 'A return can only be requested for a delivered order', 'RETURN_NOT_ALLOWED')
    await order.update({ status: 'RETURN_REQUESTED' })
    await OrderStatusHistory.create({ orderId: order.id, status: 'RETURN_REQUESTED', note: req.body.reason, changedByUserId: req.user.id })
    return success(res, await Order.findByPk(order.id, { include: orderInclude }), 'Return request submitted')
  } catch (error) { next(error) }
}
