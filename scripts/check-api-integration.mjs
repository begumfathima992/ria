import fs from 'node:fs'
import path from 'node:path'

const root = path.resolve('src')
const serviceRoot = path.join(root, 'services')
const expected = [
  '/auth/register','/auth/login','/auth/refresh','/auth/logout','/auth/forgot-password','/auth/reset-password',
  '/users/me','/users/change-password','/users/addresses','/users/wishlist',
  '/catalog/categories','/catalog/products','/catalog/banners','/catalog/settings',
  '/cart','/cart/items','/cart/quote',
  '/orders','/orders/track','/return-request',
  '/reviews/products','/contact','/newsletter/subscribe','/newsletter/unsubscribe'
]

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    return entry.isDirectory() ? walk(full) : [full]
  })
}
const serviceText = walk(serviceRoot).filter((file) => /\.js$/.test(file)).map((file) => fs.readFileSync(file, 'utf8')).join('\n')
const sourceText = walk(root).filter((file) => /\.(js|jsx)$/.test(file)).map((file) => fs.readFileSync(file, 'utf8')).join('\n')
const missing = expected.filter((needle) => !serviceText.includes(needle))
if (missing.length) {
  console.error('Missing customer API service references:', missing.join(', '))
  process.exit(1)
}
if (/['"`]\/admin(?:\/|['"`])/.test(sourceText)) {
  console.error('Admin API reference found in customer frontend.')
  process.exit(1)
}
if (/\bfetch\s*\(/.test(sourceText)) {
  console.error('Direct fetch() found; customer HTTP calls must use Axios services.')
  process.exit(1)
}
console.log('Customer API integration check passed: expected service routes found, no admin endpoints and no direct fetch().')
