import { Op } from 'sequelize'
import { User, Cart, RefreshToken, PasswordReset } from '../models/index.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { durationToMs, hashToken, randomToken, signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js'
import { normalizeEmail, publicUser, success } from '../utils/helpers.js'
import { ApiError } from '../utils/ApiError.js'

async function issueTokens(user, req) {
  const placeholder = hashToken(randomToken())
  const expiresMs = durationToMs(process.env.JWT_REFRESH_EXPIRES_IN || '30d', 30 * 86400000)
  const row = await RefreshToken.create({
    userId: user.id,
    tokenHash: placeholder,
    expiresAt: new Date(Date.now() + expiresMs),
    userAgent: req.headers['user-agent'] || null,
    ipAddress: req.ip || null
  })
  const refreshToken = signRefreshToken(user, row.id)
  row.tokenHash = hashToken(refreshToken)
  await row.save()
  return { accessToken: signAccessToken(user), refreshToken }
}

export async function register(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email)
    if (await User.findOne({ where: { email } })) throw new ApiError(409, 'An account with this email already exists', 'EMAIL_EXISTS')
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email,
      phone: req.body.phone || null,
      passwordHash: hashPassword(req.body.password),
      role: 'USER',
      status: 'ACTIVE'
    })
    await Cart.create({ userId: user.id })
    const tokens = await issueTokens(user, req)
    return success(res, { user: publicUser(user), ...tokens }, 'Account created successfully', 201)
  } catch (error) { next(error) }
}

export async function login(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email)
    const user = await User.findOne({ where: { email } })
    if (!user || !verifyPassword(req.body.password, user.passwordHash)) throw new ApiError(401, 'Invalid email or password', 'INVALID_CREDENTIALS')
    if (user.status !== 'ACTIVE') throw new ApiError(403, 'This account has been blocked', 'ACCOUNT_BLOCKED')
    user.lastLoginAt = new Date()
    await user.save()
    await Cart.findOrCreate({ where: { userId: user.id }, defaults: { userId: user.id } })
    const tokens = await issueTokens(user, req)
    return success(res, { user: publicUser(user), ...tokens }, 'Login successful')
  } catch (error) { next(error) }
}

export async function refresh(req, res, next) {
  try {
    const raw = req.body.refreshToken
    let payload
    try { payload = verifyRefreshToken(raw) } catch { throw new ApiError(401, 'Invalid or expired refresh token', 'INVALID_REFRESH_TOKEN') }
    const row = await RefreshToken.findByPk(payload.jti)
    if (!row || row.userId !== Number(payload.sub) || row.revokedAt || row.expiresAt <= new Date() || row.tokenHash !== hashToken(raw)) {
      throw new ApiError(401, 'Refresh token is no longer valid', 'INVALID_REFRESH_TOKEN')
    }
    const user = await User.findByPk(payload.sub)
    if (!user || user.status !== 'ACTIVE') throw new ApiError(401, 'Account is unavailable', 'ACCOUNT_UNAVAILABLE')
    row.revokedAt = new Date()
    await row.save()
    const tokens = await issueTokens(user, req)
    return success(res, { user: publicUser(user), ...tokens }, 'Token refreshed')
  } catch (error) { next(error) }
}

export async function logout(req, res, next) {
  try {
    const raw = req.body.refreshToken
    if (raw) {
      try {
        const payload = verifyRefreshToken(raw)
        await RefreshToken.update({ revokedAt: new Date() }, { where: { id: payload.jti, tokenHash: hashToken(raw), revokedAt: null } })
      } catch { /* logout stays idempotent */ }
    }
    return success(res, null, 'Logged out successfully')
  } catch (error) { next(error) }
}

export async function forgotPassword(req, res, next) {
  try {
    const email = normalizeEmail(req.body.email)
    const user = await User.findOne({ where: { email } })
    let resetToken
    if (user) {
      await PasswordReset.update({ usedAt: new Date() }, { where: { userId: user.id, usedAt: null } })
      resetToken = randomToken(32)
      const ttl = Number(process.env.RESET_TOKEN_TTL_MINUTES || 30) * 60000
      await PasswordReset.create({ userId: user.id, tokenHash: hashToken(resetToken), expiresAt: new Date(Date.now() + ttl) })
    }
    const data = process.env.NODE_ENV === 'production' ? null : { resetToken: resetToken || null, note: 'Development only: send this token through your email provider in production.' }
    return success(res, data, 'If the email exists, password reset instructions have been prepared')
  } catch (error) { next(error) }
}

export async function resetPassword(req, res, next) {
  try {
    const tokenHash = hashToken(req.body.token)
    const row = await PasswordReset.findOne({ where: { tokenHash, usedAt: null, expiresAt: { [Op.gt]: new Date() } } })
    if (!row) throw new ApiError(400, 'Reset token is invalid or expired', 'INVALID_RESET_TOKEN')
    const user = await User.findByPk(row.userId)
    if (!user) throw new ApiError(404, 'Account not found', 'USER_NOT_FOUND')
    user.passwordHash = hashPassword(req.body.password)
    await user.save()
    row.usedAt = new Date()
    await row.save()
    await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: user.id, revokedAt: null } })
    return success(res, null, 'Password changed successfully')
  } catch (error) { next(error) }
}
