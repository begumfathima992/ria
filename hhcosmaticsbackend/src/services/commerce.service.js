import { Op } from 'sequelize'
import { Cart, CartItem, Product, ProductVariant, ProductImage, Coupon, CouponUsage, Setting } from '../models/index.js'
import { ApiError } from '../utils/ApiError.js'
import { money } from '../utils/helpers.js'


async function pricingSettings(transaction) {
  const keys = ['free_delivery_threshold','standard_delivery_fee','express_delivery_fee','cod_fee','currency','cod_enabled']
  const rows = await Setting.findAll({ where: { key: keys }, transaction })
  const map = Object.fromEntries(rows.map((row) => [row.key, row.value]))
  const value = (key, fallback) => map[key] === undefined || map[key] === null ? fallback : map[key]
  return {
    freeThreshold: Number(value('free_delivery_threshold', process.env.FREE_DELIVERY_THRESHOLD || 45)),
    standardFee: Number(value('standard_delivery_fee', process.env.STANDARD_DELIVERY_FEE || 4.95)),
    expressFee: Number(value('express_delivery_fee', process.env.EXPRESS_DELIVERY_FEE || 7.95)),
    codFee: Number(value('cod_fee', process.env.COD_FEE || 0)),
    currency: String(value('currency', process.env.DEFAULT_CURRENCY || 'GBP')),
    codEnabled: !['false','0'].includes(String(value('cod_enabled', true)).toLowerCase())
  }
}

export async function getOrCreateCart(userId, transaction) {
  const [cart] = await Cart.findOrCreate({ where: { userId }, defaults: { userId }, transaction })
  return cart
}

export async function loadCart(userId, transaction, lock = false) {
  const cart = await getOrCreateCart(userId, transaction)
  const items = await CartItem.findAll({
    where: { cartId: cart.id },
    include: [
      { model: Product, as: 'product', required: true, paranoid: false, include: [{ model: ProductImage, as: 'images', required: false }] },
      { model: ProductVariant, as: 'variant', required: false, paranoid: false }
    ],
    order: [['createdAt', 'ASC']],
    transaction,
    ...(lock && transaction ? { lock: transaction.LOCK.UPDATE } : {})
  })
  return { cart, items }
}

export function cartItemDto(item) {
  const product = item.product
  const variant = item.variant
  const primary = product?.images?.find((img) => img.isPrimary) || product?.images?.[0]
  const variantMissing = Boolean(item.variantId && !variant)
  const unitPrice = Number(variant?.price ?? product?.basePrice ?? 0)
  const availableStock = variantMissing ? 0 : Number(variant ? variant.stock : product.stock)
  return {
    id: item.id,
    productId: item.productId,
    variantId: item.variantId,
    name: product.name,
    slug: product.slug,
    categoryId: product.categoryId,
    variantName: variant?.name || null,
    sku: variant?.sku || product.sku,
    imageUrl: primary?.imageUrl || null,
    quantity: item.quantity,
    unitPrice: money(unitPrice),
    lineTotal: money(unitPrice * item.quantity),
    availableStock,
    inStock: !product.trackInventory || availableStock >= item.quantity,
    productActive: Boolean(product && product.isActive && !product.deletedAt && !variantMissing && (!variant || (variant.isActive && !variant.deletedAt)))
  }
}

export async function validateCoupon(code, userId, subtotal, transaction) {
  if (!code) return null
  const normalized = String(code).trim().toUpperCase()
  const now = new Date()
  const coupon = await Coupon.findOne({
    where: {
      code: normalized,
      isActive: true,
      [Op.and]: [
        { [Op.or]: [{ startsAt: null }, { startsAt: { [Op.lte]: now } }] },
        { [Op.or]: [{ endsAt: null }, { endsAt: { [Op.gte]: now } }] }
      ]
    },
    transaction
  })
  if (!coupon) throw new ApiError(400, 'Coupon is invalid or expired', 'INVALID_COUPON')
  if (Number(subtotal) < Number(coupon.minOrder || 0)) throw new ApiError(400, `Minimum order for this coupon is £${Number(coupon.minOrder).toFixed(2)}`, 'COUPON_MIN_ORDER')
  if (coupon.usageLimit && Number(coupon.usedCount) >= Number(coupon.usageLimit)) throw new ApiError(400, 'Coupon usage limit has been reached', 'COUPON_LIMIT_REACHED')
  if (userId && coupon.perUserLimit) {
    const usageCount = await CouponUsage.count({ where: { couponId: coupon.id, userId }, transaction })
    if (usageCount >= Number(coupon.perUserLimit)) throw new ApiError(400, 'You have already used this coupon the maximum number of times', 'COUPON_USER_LIMIT')
  }
  return coupon
}

export function calculateDiscount(subtotal, coupon) {
  if (!coupon) return 0
  let discount = coupon.type === 'PERCENT'
    ? Number(subtotal) * (Number(coupon.value) / 100)
    : Number(coupon.value)
  if (coupon.maxDiscount != null) discount = Math.min(discount, Number(coupon.maxDiscount))
  return money(Math.min(Number(subtotal), discount))
}

export async function calculateCartTotals(userId, couponCode, shippingMethod = 'STANDARD', transaction, options = {}) {
  const { cart, items } = await loadCart(userId, transaction, Boolean(options.lock))
  const dtoItems = items.map(cartItemDto)
  if (options.requireItems && dtoItems.length === 0) throw new ApiError(400, 'Your cart is empty', 'EMPTY_CART')
  if (options.validateStock) {
    const invalid = dtoItems.find((item) => !item.productActive || !item.inStock)
    if (invalid) throw new ApiError(409, `${invalid.name} is unavailable or does not have enough stock`, 'STOCK_UNAVAILABLE', { item: invalid })
  }
  const subtotal = money(dtoItems.reduce((sum, item) => sum + item.lineTotal, 0))
  const coupon = await validateCoupon(couponCode, userId, subtotal, transaction)
  const discount = calculateDiscount(subtotal, coupon)
  const afterDiscount = money(Math.max(0, subtotal - discount))
  const config = await pricingSettings(transaction)
  const { freeThreshold, standardFee, expressFee, codFee } = config
  const method = String(shippingMethod || 'STANDARD').toUpperCase()
  const shipping = method === 'EXPRESS' ? expressFee : (afterDiscount >= freeThreshold ? 0 : standardFee)
  const total = money(afterDiscount + shipping + codFee)
  return {
    cart,
    rawItems: items,
    items: dtoItems,
    coupon,
    totals: {
      currency: config.currency,
      subtotal,
      discountAmount: discount,
      shippingAmount: money(shipping),
      codFee: money(codFee),
      totalAmount: total,
      freeDeliveryThreshold: freeThreshold,
      amountUntilFreeDelivery: method === 'STANDARD' ? money(Math.max(0, freeThreshold - afterDiscount)) : null,
      codEnabled: config.codEnabled
    }
  }
}
