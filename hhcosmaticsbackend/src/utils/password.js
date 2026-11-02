import crypto from 'node:crypto'

const KEYLEN = 64

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex')
  const derived = crypto.scryptSync(String(password), salt, KEYLEN).toString('hex')
  return `scrypt$${salt}$${derived}`
}

export function verifyPassword(password, storedHash) {
  try {
    const [scheme, salt, hash] = String(storedHash || '').split('$')
    if (scheme !== 'scrypt' || !salt || !hash) return false
    const expected = Buffer.from(hash, 'hex')
    const actual = crypto.scryptSync(String(password), salt, expected.length)
    return expected.length === actual.length && crypto.timingSafeEqual(expected, actual)
  } catch {
    return false
  }
}
