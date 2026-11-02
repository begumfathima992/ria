import { CartItem, Product, ProductVariant } from '../models/index.js'
import { calculateCartTotals, getOrCreateCart } from '../services/commerce.service.js'
import { success } from '../utils/helpers.js'
import { ApiError } from '../utils/ApiError.js'

export async function getCart(req, res, next) {
  try {
    const result = await calculateCartTotals(req.user.id, req.query.couponCode || null, req.query.shippingMethod || 'STANDARD')
    return success(res, { items: result.items, totals: result.totals, coupon: result.coupon ? { id: result.coupon.id, code: result.coupon.code, name: result.coupon.name, type: result.coupon.type, value: Number(result.coupon.value) } : null })
  } catch (error) { next(error) }
}

export async function addItem(req, res, next) {
  try {
    const product = await Product.findOne({ where: { id: req.body.productId, isActive: true } })
    if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    let variant = null
    if (req.body.variantId) {
      variant = await ProductVariant.findOne({ where: { id: req.body.variantId, productId: product.id, isActive: true } })
      if (!variant) throw new ApiError(404, 'Product variant not found', 'VARIANT_NOT_FOUND')
    } else {
      variant = await ProductVariant.findOne({ where: { productId: product.id, isActive: true }, order: [['isDefault','DESC'],['id','ASC']] })
    }
    const stock = Number(variant ? variant.stock : product.stock)
    const cart = await getOrCreateCart(req.user.id)
    const existing = await CartItem.findOne({ where: { cartId: cart.id, productId: product.id, variantId: variant?.id || null } })
    const newQty = Number(req.body.quantity) + Number(existing?.quantity || 0)
    if (product.trackInventory && newQty > stock) throw new ApiError(409, `Only ${stock} item(s) available`, 'INSUFFICIENT_STOCK')
    if (existing) await existing.update({ quantity: newQty })
    else await CartItem.create({ cartId: cart.id, productId: product.id, variantId: variant?.id || null, quantity: req.body.quantity })
    const result = await calculateCartTotals(req.user.id, null, 'STANDARD')
    return success(res, { items: result.items, totals: result.totals }, 'Cart updated', 201)
  } catch (error) { next(error) }
}

export async function updateItem(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id)
    const item = await CartItem.findOne({ where: { id: req.params.itemId, cartId: cart.id }, include: [{ model: Product, as: 'product' }, { model: ProductVariant, as: 'variant', required: false }] })
    if (!item) throw new ApiError(404, 'Cart item not found', 'CART_ITEM_NOT_FOUND')
    if (!item.product || !item.product.isActive || (item.variantId && (!item.variant || !item.variant.isActive))) throw new ApiError(409, 'This cart item is no longer available', 'PRODUCT_UNAVAILABLE')
    const stock = Number(item.variant ? item.variant.stock : item.product.stock)
    if (item.product.trackInventory && req.body.quantity > stock) throw new ApiError(409, `Only ${stock} item(s) available`, 'INSUFFICIENT_STOCK')
    await item.update({ quantity: req.body.quantity })
    const result = await calculateCartTotals(req.user.id, null, 'STANDARD')
    return success(res, { items: result.items, totals: result.totals }, 'Cart updated')
  } catch (error) { next(error) }
}

export async function removeItem(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id)
    await CartItem.destroy({ where: { id: req.params.itemId, cartId: cart.id } })
    const result = await calculateCartTotals(req.user.id, null, 'STANDARD')
    return success(res, { items: result.items, totals: result.totals }, 'Item removed')
  } catch (error) { next(error) }
}

export async function clearCart(req, res, next) {
  try {
    const cart = await getOrCreateCart(req.user.id)
    await CartItem.destroy({ where: { cartId: cart.id } })
    return success(res, { items: [], totals: { subtotal: 0, discountAmount: 0, shippingAmount: 0, codFee: 0, totalAmount: 0 } }, 'Cart cleared')
  } catch (error) { next(error) }
}

export async function quote(req, res, next) {
  try {
    const result = await calculateCartTotals(req.user.id, req.body.couponCode || null, req.body.shippingMethod, null, { requireItems: true, validateStock: true })
    return success(res, { items: result.items, totals: result.totals, coupon: result.coupon ? { code: result.coupon.code, name: result.coupon.name, type: result.coupon.type, value: Number(result.coupon.value) } : null, paymentMethods: ['COD'] })
  } catch (error) { next(error) }
}
