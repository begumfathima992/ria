import { User } from '../models/index.js'
import { verifyAccessToken } from '../utils/tokens.js'

export async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : null
    if (!token) return res.status(401).json({ success: false, message: 'Authentication required', code: 'AUTH_REQUIRED' })
    const payload = verifyAccessToken(token)
    const user = await User.findByPk(payload.sub)
    if (!user || user.status !== 'ACTIVE') return res.status(401).json({ success: false, message: 'Account is unavailable', code: 'ACCOUNT_UNAVAILABLE' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ success: false, message: 'Invalid or expired access token', code: 'INVALID_TOKEN' })
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) return res.status(403).json({ success: false, message: 'You do not have permission to perform this action', code: 'FORBIDDEN' })
    next()
  }
}
