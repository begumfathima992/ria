import { Op, fn, col, literal } from 'sequelize'
import { User, Order, OrderItem, Product, ProductVariant } from '../../models/index.js'
import { success } from '../../utils/helpers.js'

export async function dashboard(req, res, next) {
  try {
    const startToday = new Date(); startToday.setHours(0,0,0,0)
    const startMonth = new Date(startToday.getFullYear(), startToday.getMonth(), 1)
    const [users, orders, pendingOrders, todayOrders, revenue, monthRevenue, lowStockProducts, lowStockVariants, topProducts] = await Promise.all([
      User.count({ where: { role: 'USER' } }),
      Order.count(),
      Order.count({ where: { status: { [Op.in]: ['PENDING','CONFIRMED','PROCESSING'] } } }),
      Order.count({ where: { createdAt: { [Op.gte]: startToday } } }),
      Order.sum('totalAmount', { where: { status: { [Op.notIn]: ['CANCELLED','RETURNED'] } } }),
      Order.sum('totalAmount', { where: { status: { [Op.notIn]: ['CANCELLED','RETURNED'] }, createdAt: { [Op.gte]: startMonth } } }),
      Product.count({ where: { isActive: true, trackInventory: true, stock: { [Op.lte]: literal('low_stock_threshold') } } }),
      ProductVariant.count({ where: { isActive: true, stock: { [Op.lte]: literal('low_stock_threshold') } } }),
      OrderItem.findAll({
        attributes: ['productId','productName',[fn('SUM', col('quantity')), 'unitsSold'],[fn('SUM', col('line_total')), 'sales']],
        include: [{ model: Order, attributes: [], where: { status: { [Op.notIn]: ['CANCELLED','RETURNED'] } } }],
        group: ['productId','productName'], order: [[literal('unitsSold'),'DESC']], limit: 5, raw: true
      })
    ])
    return success(res, {
      users,
      orders,
      pendingOrders,
      todayOrders,
      revenue: Number(revenue || 0),
      monthRevenue: Number(monthRevenue || 0),
      lowStockCount: lowStockProducts + lowStockVariants,
      topProducts
    })
  } catch (error) { next(error) }
}

export async function activityLog(req, res, next) {
  try {
    const { AdminActivityLog, User } = await import('../../models/index.js')
    const { pagination, paginationMeta } = await import('../../utils/helpers.js')
    const { page, limit, offset } = pagination(req.query)
    const { rows, count } = await AdminActivityLog.findAndCountAll({ include: [{ model: User, as: 'admin', attributes: ['id','firstName','lastName','email'] }], order: [['createdAt','DESC']], limit, offset })
    return success(res, rows, 'OK', 200, paginationMeta(count, page, limit))
  } catch (error) { next(error) }
}
