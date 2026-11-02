import crypto from 'node:crypto'

export const ORDER_STATUSES = ['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED','RETURN_REQUESTED','RETURNED']
export const PAYMENT_STATUSES = ['COD_PENDING','PAID','REFUNDED','VOID']

export function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function publicUser(user) {
  if (!user) return null
  const plain = user.get ? user.get({ plain: true }) : { ...user }
  delete plain.passwordHash
  return plain
}

export function pagination(query = {}) {
  const page = Math.max(1, Number(query.page || 1))
  const limit = Math.min(100, Math.max(1, Number(query.limit || 20)))
  return { page, limit, offset: (page - 1) * limit }
}

export function paginationMeta(count, page, limit) {
  return { page, limit, total: count, pages: Math.max(1, Math.ceil(count / limit)) }
}

export function money(value) {
  return Number(Number(value || 0).toFixed(2))
}

export function makeOrderNumber() {
  const now = new Date()
  const y = String(now.getFullYear()).slice(-2)
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const suffix = crypto.randomInt(1000, 10000)
  return `HH-${y}${m}${d}-${suffix}`
}

export function success(res, data = null, message = 'OK', status = 200, meta) {
  const body = { success: true, message, data }
  if (meta) body.meta = meta
  return res.status(status).json(body)
}

export function normalizeEmail(email) {
  return String(email || '').trim().toLowerCase()
}
