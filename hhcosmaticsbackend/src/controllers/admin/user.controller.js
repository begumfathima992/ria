import { Op } from 'sequelize'
import { User, Address, Order } from '../../models/index.js'
import { pagination, paginationMeta, publicUser, success } from '../../utils/helpers.js'
import { ApiError } from '../../utils/ApiError.js'
import { adminLog } from '../../utils/adminLog.js'

export async function listUsers(req, res, next) {
  try {
    const { page, limit, offset } = pagination(req.query)
    const where = { role: 'USER' }
    if (req.query.status) where.status = req.query.status
    if (req.query.search) {
      const q = `%${String(req.query.search).trim()}%`
      where[Op.or] = [{ firstName: { [Op.like]: q } }, { lastName: { [Op.like]: q } }, { email: { [Op.like]: q } }, { phone: { [Op.like]: q } }]
    }
    const { rows, count } = await User.findAndCountAll({ where, attributes: { exclude: ['passwordHash'] }, order: [['createdAt','DESC']], limit, offset })
    return success(res, rows, 'OK', 200, paginationMeta(count, page, limit))
  } catch (error) { next(error) }
}

export async function getUser(req, res, next) {
  try {
    const user = await User.findOne({ where: { id: req.params.id, role: 'USER' }, include: [{ model: Address, as: 'addresses' }, { model: Order, as: 'orders', limit: 10, separate: true, order: [['createdAt','DESC']] }] })
    if (!user) throw new ApiError(404, 'User not found', 'USER_NOT_FOUND')
    return success(res, publicUser(user))
  } catch (error) { next(error) }
}


export async function updateUser(req, res, next) {
  try {
    const user = await User.findOne({ where: { id: req.params.id, role: 'USER' } })
    if (!user) throw new ApiError(404, 'User not found', 'USER_NOT_FOUND')
    const payload = { ...req.body }
    if (payload.email) payload.email = String(payload.email).trim().toLowerCase()
    await user.update(payload)
    await adminLog(req, 'USER_UPDATED', 'USER', user.id, payload)
    return success(res, publicUser(user), 'User updated')
  } catch (error) { next(error) }
}

export async function updateUserStatus(req, res, next) {
  try {
    const user = await User.findOne({ where: { id: req.params.id, role: 'USER' } })
    if (!user) throw new ApiError(404, 'User not found', 'USER_NOT_FOUND')
    await user.update({ status: req.body.status })
    await adminLog(req, 'USER_STATUS_UPDATED', 'USER', user.id, { status: user.status })
    return success(res, publicUser(user), 'User status updated')
  } catch (error) { next(error) }
}
