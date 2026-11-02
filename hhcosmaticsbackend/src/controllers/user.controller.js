import { Address, User, Wishlist, Product, ProductImage, Category, Subcategory, ProductVariant, RefreshToken } from '../models/index.js'
import { hashPassword, verifyPassword } from '../utils/password.js'
import { publicUser, success } from '../utils/helpers.js'
import { ApiError } from '../utils/ApiError.js'

export async function me(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id, { include: [{ model: Address, as: 'addresses' }] })
    return success(res, publicUser(user))
  } catch (error) { next(error) }
}

export async function updateMe(req, res, next) {
  try {
    await req.user.update(req.body)
    return success(res, publicUser(req.user), 'Profile updated')
  } catch (error) { next(error) }
}

export async function changePassword(req, res, next) {
  try {
    if (!verifyPassword(req.body.currentPassword, req.user.passwordHash)) throw new ApiError(400, 'Current password is incorrect', 'INVALID_CURRENT_PASSWORD')
    req.user.passwordHash = hashPassword(req.body.newPassword)
    await req.user.save()
    await RefreshToken.update({ revokedAt: new Date() }, { where: { userId: req.user.id, revokedAt: null } })
    return success(res, null, 'Password updated. Please login again on other devices.')
  } catch (error) { next(error) }
}

export async function listAddresses(req, res, next) {
  try { return success(res, await Address.findAll({ where: { userId: req.user.id }, order: [['isDefault','DESC'],['createdAt','DESC']] })) } catch (error) { next(error) }
}

export async function createAddress(req, res, next) {
  try {
    if (req.body.isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } })
    const count = await Address.count({ where: { userId: req.user.id } })
    const row = await Address.create({ ...req.body, userId: req.user.id, isDefault: req.body.isDefault || count === 0 })
    return success(res, row, 'Address added', 201)
  } catch (error) { next(error) }
}

async function ownedAddress(userId, id) {
  const row = await Address.findOne({ where: { id, userId } })
  if (!row) throw new ApiError(404, 'Address not found', 'ADDRESS_NOT_FOUND')
  return row
}

export async function updateAddress(req, res, next) {
  try {
    const row = await ownedAddress(req.user.id, req.params.id)
    if (req.body.isDefault) await Address.update({ isDefault: false }, { where: { userId: req.user.id } })
    await row.update(req.body)
    return success(res, row, 'Address updated')
  } catch (error) { next(error) }
}

export async function deleteAddress(req, res, next) {
  try {
    const row = await ownedAddress(req.user.id, req.params.id)
    const wasDefault = row.isDefault
    await row.destroy()
    if (wasDefault) {
      const nextAddress = await Address.findOne({ where: { userId: req.user.id }, order: [['createdAt','ASC']] })
      if (nextAddress) await nextAddress.update({ isDefault: true })
    }
    return success(res, null, 'Address removed')
  } catch (error) { next(error) }
}

export async function setDefaultAddress(req, res, next) {
  try {
    const row = await ownedAddress(req.user.id, req.params.id)
    await Address.update({ isDefault: false }, { where: { userId: req.user.id } })
    await row.update({ isDefault: true })
    return success(res, row, 'Default address updated')
  } catch (error) { next(error) }
}

export async function listWishlist(req, res, next) {
  try {
    const rows = await Wishlist.findAll({ where: { userId: req.user.id } })
    const productIds = rows.map(r => r.productId)
    const products = productIds.length ? await Product.findAll({
      where: { id: productIds, isActive: true },
      include: [
        { model: Category, as: 'category', attributes: ['id','name','slug'] },
        { model: Subcategory, as: 'subcategory', attributes: ['id','name','slug'], required: false },
        { model: ProductImage, as: 'images', required: false },
        { model: ProductVariant, as: 'variants', required: false, where: { isActive: true } }
      ]
    }) : []
    return success(res, products)
  } catch (error) { next(error) }
}

export async function addWishlist(req, res, next) {
  try {
    const product = await Product.findOne({ where: { id: req.params.productId, isActive: true } })
    if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    await Wishlist.findOrCreate({ where: { userId: req.user.id, productId: product.id }, defaults: { userId: req.user.id, productId: product.id } })
    return success(res, { productId: product.id }, 'Added to wishlist', 201)
  } catch (error) { next(error) }
}

export async function removeWishlist(req, res, next) {
  try {
    await Wishlist.destroy({ where: { userId: req.user.id, productId: req.params.productId } })
    return success(res, null, 'Removed from wishlist')
  } catch (error) { next(error) }
}
