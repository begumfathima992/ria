import crypto from 'node:crypto'
import jwt from 'jsonwebtoken'

export function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, email: user.email, type: 'access' },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || '15m' }
  )
}

export function signRefreshToken(user, tokenId) {
  return jwt.sign(
    { sub: String(user.id), role: user.role, jti: String(tokenId), type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
  )
}

export function verifyAccessToken(token) {
  return jwt.verify(token, process.env.JWT_ACCESS_SECRET)
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, process.env.JWT_REFRESH_SECRET)
}

export function hashToken(token) {
  return crypto.createHash('sha256').update(String(token)).digest('hex')
}

export function randomToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

export function durationToMs(value, fallbackMs) {
  const text = String(value || '').trim().toLowerCase()
  const match = text.match(/^(\d+)\s*(s|m|h|d|w|y)$/)
  if (!match) return fallbackMs
  const amount = Number(match[1])
  const unit = match[2]
  const factors = { s: 1000, m: 60000, h: 3600000, d: 86400000, w: 604800000, y: 31536000000 }
  return amount * factors[unit]
}
