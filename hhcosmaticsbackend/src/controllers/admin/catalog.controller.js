import { Op } from 'sequelize'
import { Category, Subcategory, Product, ProductVariant, ProductImage, InventoryLog } from '../../models/index.js'
import { pagination, paginationMeta, slugify, success } from '../../utils/helpers.js'
import { ApiError } from '../../utils/ApiError.js'
import { adminLog } from '../../utils/adminLog.js'

export async function listCategories(req, res, next) {
  try {
    const rows = await Category.findAll({ paranoid: false, include: [{ model: Subcategory, as: 'subcategories', required: false, paranoid: false }], order: [['sortOrder','ASC'],['name','ASC']] })
    return success(res, rows)
  } catch (error) { next(error) }
}

export async function createCategory(req, res, next) {
  try {
    const row = await Category.create({ ...req.body, slug: req.body.slug || slugify(req.body.name) })
    await adminLog(req, 'CATEGORY_CREATED', 'CATEGORY', row.id, { name: row.name })
    return success(res, row, 'Category created', 201)
  } catch (error) { next(error) }
}

export async function updateCategory(req, res, next) {
  try {
    const row = await Category.findByPk(req.params.id, { paranoid: false })
    if (!row) throw new ApiError(404, 'Category not found', 'CATEGORY_NOT_FOUND')
    const payload = { ...req.body }
    if (payload.name && !payload.slug) payload.slug = slugify(payload.name)
    await row.update(payload)
    await adminLog(req, 'CATEGORY_UPDATED', 'CATEGORY', row.id, payload)
    return success(res, row, 'Category updated')
  } catch (error) { next(error) }
}

export async function deleteCategory(req, res, next) {
  try {
    const row = await Category.findByPk(req.params.id)
    if (!row) throw new ApiError(404, 'Category not found', 'CATEGORY_NOT_FOUND')
    if (await Product.count({ where: { categoryId: row.id } })) throw new ApiError(409, 'Move or delete products in this category first', 'CATEGORY_HAS_PRODUCTS')
    await row.destroy()
    await adminLog(req, 'CATEGORY_DELETED', 'CATEGORY', row.id, { name: row.name })
    return success(res, null, 'Category deleted')
  } catch (error) { next(error) }
}

export async function restoreCategory(req, res, next) {
  try {
    const row = await Category.findByPk(req.params.id, { paranoid: false })
    if (!row) throw new ApiError(404, 'Category not found', 'CATEGORY_NOT_FOUND')
    await row.restore()
    await adminLog(req, 'CATEGORY_RESTORED', 'CATEGORY', row.id)
    return success(res, row, 'Category restored')
  } catch (error) { next(error) }
}

export async function listSubcategories(req, res, next) {
  try {
    const where = req.query.categoryId ? { categoryId: req.query.categoryId } : {}
    const rows = await Subcategory.findAll({ where, paranoid: false, include: [{ model: Category, as: 'category', paranoid: false, attributes: ['id','name','slug'] }], order: [['sortOrder','ASC'],['name','ASC']] })
    return success(res, rows)
  } catch (error) { next(error) }
}

export async function createSubcategory(req, res, next) {
  try {
    if (!(await Category.findByPk(req.body.categoryId))) throw new ApiError(404, 'Category not found', 'CATEGORY_NOT_FOUND')
    const row = await Subcategory.create({ ...req.body, slug: req.body.slug || slugify(req.body.name) })
    await adminLog(req, 'SUBCATEGORY_CREATED', 'SUBCATEGORY', row.id, { name: row.name })
    return success(res, row, 'Subcategory created', 201)
  } catch (error) { next(error) }
}

export async function updateSubcategory(req, res, next) {
  try {
    const row = await Subcategory.findByPk(req.params.id, { paranoid: false })
    if (!row) throw new ApiError(404, 'Subcategory not found', 'SUBCATEGORY_NOT_FOUND')
    if (req.body.categoryId && !(await Category.findByPk(req.body.categoryId))) throw new ApiError(404, 'Category not found', 'CATEGORY_NOT_FOUND')
    const payload = { ...req.body }
    if (payload.name && !payload.slug) payload.slug = slugify(payload.name)
    await row.update(payload)
    await adminLog(req, 'SUBCATEGORY_UPDATED', 'SUBCATEGORY', row.id, payload)
    return success(res, row, 'Subcategory updated')
  } catch (error) { next(error) }
}

export async function deleteSubcategory(req, res, next) {
  try {
    const row = await Subcategory.findByPk(req.params.id)
    if (!row) throw new ApiError(404, 'Subcategory not found', 'SUBCATEGORY_NOT_FOUND')
    if (await Product.count({ where: { subcategoryId: row.id } })) throw new ApiError(409, 'Move or delete products in this subcategory first', 'SUBCATEGORY_HAS_PRODUCTS')
    await row.destroy()
    await adminLog(req, 'SUBCATEGORY_DELETED', 'SUBCATEGORY', row.id)
    return success(res, null, 'Subcategory deleted')
  } catch (error) { next(error) }
}

export async function restoreSubcategory(req, res, next) {
  try {
    const row = await Subcategory.findByPk(req.params.id, { paranoid: false })
    if (!row) throw new ApiError(404, 'Subcategory not found', 'SUBCATEGORY_NOT_FOUND')
    await row.restore()
    await adminLog(req, 'SUBCATEGORY_RESTORED', 'SUBCATEGORY', row.id)
    return success(res, row, 'Subcategory restored')
  } catch (error) { next(error) }
}

export async function listProducts(req, res, next) {
  try {
    const { page, limit, offset } = pagination(req.query)
    const where = {}
    if (req.query.search) {
      const q = `%${String(req.query.search).trim()}%`
      where[Op.or] = [{ name: { [Op.like]: q } }, { sku: { [Op.like]: q } }, { slug: { [Op.like]: q } }, { brand: { [Op.like]: q } }]
    }
    if (req.query.categoryId) where.categoryId = req.query.categoryId
    if (req.query.subcategoryId) where.subcategoryId = req.query.subcategoryId
    if (req.query.active === 'true') where.isActive = true
    if (req.query.active === 'false') where.isActive = false
    const { rows, count } = await Product.findAndCountAll({
      where, paranoid: false,
      include: [
        { model: Category, as: 'category', attributes: ['id','name','slug'], paranoid: false },
        { model: Subcategory, as: 'subcategory', attributes: ['id','name','slug'], required: false, paranoid: false },
        { model: ProductVariant, as: 'variants', required: false, paranoid: false },
        { model: ProductImage, as: 'images', required: false }
      ],
      order: [['createdAt','DESC']], distinct: true, limit, offset
    })
    return success(res, rows, 'OK', 200, paginationMeta(count, page, limit))
  } catch (error) { next(error) }
}

export async function getProduct(req, res, next) {
  try {
    const row = await Product.findByPk(req.params.id, { paranoid: false, include: [{ model: ProductVariant, as: 'variants', required: false, paranoid: false }, { model: ProductImage, as: 'images', required: false }, { model: Category, as: 'category', paranoid: false }, { model: Subcategory, as: 'subcategory', required: false, paranoid: false }] })
    if (!row) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    return success(res, row)
  } catch (error) { next(error) }
}

export async function createProduct(req, res, next) {
  try {
    if (!(await Category.findByPk(req.body.categoryId))) throw new ApiError(404, 'Category not found', 'CATEGORY_NOT_FOUND')
    if (req.body.subcategoryId) {
      const sub = await Subcategory.findOne({ where: { id: req.body.subcategoryId, categoryId: req.body.categoryId } })
      if (!sub) throw new ApiError(400, 'Subcategory does not belong to selected category', 'INVALID_SUBCATEGORY')
    }
    const row = await Product.create({ ...req.body, slug: req.body.slug || slugify(req.body.name) })
    await adminLog(req, 'PRODUCT_CREATED', 'PRODUCT', row.id, { name: row.name, sku: row.sku })
    return success(res, row, 'Product created', 201)
  } catch (error) { next(error) }
}

export async function updateProduct(req, res, next) {
  try {
    const row = await Product.findByPk(req.params.id, { paranoid: false })
    if (!row) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    const categoryId = req.body.categoryId || row.categoryId
    if (req.body.categoryId && !(await Category.findByPk(categoryId))) throw new ApiError(404, 'Category not found', 'CATEGORY_NOT_FOUND')
    if (req.body.subcategoryId) {
      const sub = await Subcategory.findOne({ where: { id: req.body.subcategoryId, categoryId } })
      if (!sub) throw new ApiError(400, 'Subcategory does not belong to selected category', 'INVALID_SUBCATEGORY')
    }
    const payload = { ...req.body }
    if (payload.name && !payload.slug) payload.slug = slugify(payload.name)
    await row.update(payload)
    await adminLog(req, 'PRODUCT_UPDATED', 'PRODUCT', row.id, payload)
    return success(res, row, 'Product updated')
  } catch (error) { next(error) }
}

export async function deleteProduct(req, res, next) {
  try {
    const row = await Product.findByPk(req.params.id)
    if (!row) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    await row.destroy()
    await adminLog(req, 'PRODUCT_DELETED', 'PRODUCT', row.id, { name: row.name })
    return success(res, null, 'Product deleted')
  } catch (error) { next(error) }
}

export async function restoreProduct(req, res, next) {
  try {
    const row = await Product.findByPk(req.params.id, { paranoid: false })
    if (!row) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    await row.restore()
    await adminLog(req, 'PRODUCT_RESTORED', 'PRODUCT', row.id)
    return success(res, row, 'Product restored')
  } catch (error) { next(error) }
}

export async function createVariant(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.productId)
    if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    if (req.body.isDefault) await ProductVariant.update({ isDefault: false }, { where: { productId: product.id } })
    const row = await ProductVariant.create({ ...req.body, productId: product.id })
    await adminLog(req, 'VARIANT_CREATED', 'PRODUCT_VARIANT', row.id, { productId: product.id, sku: row.sku })
    return success(res, row, 'Variant created', 201)
  } catch (error) { next(error) }
}

export async function updateVariant(req, res, next) {
  try {
    const row = await ProductVariant.findOne({ where: { id: req.params.variantId, productId: req.params.productId }, paranoid: false })
    if (!row) throw new ApiError(404, 'Variant not found', 'VARIANT_NOT_FOUND')
    if (req.body.isDefault) await ProductVariant.update({ isDefault: false }, { where: { productId: row.productId } })
    await row.update(req.body)
    await adminLog(req, 'VARIANT_UPDATED', 'PRODUCT_VARIANT', row.id, req.body)
    return success(res, row, 'Variant updated')
  } catch (error) { next(error) }
}

export async function deleteVariant(req, res, next) {
  try {
    const row = await ProductVariant.findOne({ where: { id: req.params.variantId, productId: req.params.productId } })
    if (!row) throw new ApiError(404, 'Variant not found', 'VARIANT_NOT_FOUND')
    await row.destroy()
    await adminLog(req, 'VARIANT_DELETED', 'PRODUCT_VARIANT', row.id)
    return success(res, null, 'Variant deleted')
  } catch (error) { next(error) }
}

export async function restoreVariant(req, res, next) {
  try {
    const row = await ProductVariant.findOne({ where: { id: req.params.variantId, productId: req.params.productId }, paranoid: false })
    if (!row) throw new ApiError(404, 'Variant not found', 'VARIANT_NOT_FOUND')
    await row.restore()
    await adminLog(req, 'VARIANT_RESTORED', 'PRODUCT_VARIANT', row.id)
    return success(res, row, 'Variant restored')
  } catch (error) { next(error) }
}

export async function addProductImage(req, res, next) {
  try {
    const product = await Product.findByPk(req.params.productId)
    if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    if (req.body.variantId) {
      const variant = await ProductVariant.findOne({ where: { id: req.body.variantId, productId: product.id } })
      if (!variant) throw new ApiError(400, 'Variant does not belong to product', 'INVALID_VARIANT')
    }
    if (req.body.isPrimary) await ProductImage.update({ isPrimary: false }, { where: { productId: product.id } })
    const row = await ProductImage.create({ ...req.body, productId: product.id })
    await adminLog(req, 'PRODUCT_IMAGE_ADDED', 'PRODUCT_IMAGE', row.id, { productId: product.id })
    return success(res, row, 'Product image added', 201)
  } catch (error) { next(error) }
}

export async function updateProductImage(req, res, next) {
  try {
    const row = await ProductImage.findOne({ where: { id: req.params.imageId, productId: req.params.productId } })
    if (!row) throw new ApiError(404, 'Product image not found', 'PRODUCT_IMAGE_NOT_FOUND')
    if (req.body.isPrimary) await ProductImage.update({ isPrimary: false }, { where: { productId: row.productId } })
    await row.update(req.body)
    return success(res, row, 'Product image updated')
  } catch (error) { next(error) }
}

export async function deleteProductImage(req, res, next) {
  try {
    const count = await ProductImage.destroy({ where: { id: req.params.imageId, productId: req.params.productId } })
    if (!count) throw new ApiError(404, 'Product image not found', 'PRODUCT_IMAGE_NOT_FOUND')
    await adminLog(req, 'PRODUCT_IMAGE_DELETED', 'PRODUCT_IMAGE', req.params.imageId, { productId: req.params.productId })
    return success(res, null, 'Product image deleted')
  } catch (error) { next(error) }
}

export async function setProductStock(req, res, next) {
  try {
    const row = await Product.findByPk(req.params.productId)
    if (!row) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    const before = Number(row.stock)
    await row.update({ stock: req.body.quantity })
    await InventoryLog.create({ productId: row.id, changeQuantity: req.body.quantity - before, beforeQuantity: before, afterQuantity: req.body.quantity, reason: req.body.reason, reference: req.body.reference || null, changedByUserId: req.user.id })
    await adminLog(req, 'PRODUCT_STOCK_SET', 'PRODUCT', row.id, { before, after: req.body.quantity, reason: req.body.reason })
    return success(res, row, 'Product stock updated')
  } catch (error) { next(error) }
}

export async function setVariantStock(req, res, next) {
  try {
    const row = await ProductVariant.findOne({ where: { id: req.params.variantId, productId: req.params.productId } })
    if (!row) throw new ApiError(404, 'Variant not found', 'VARIANT_NOT_FOUND')
    const before = Number(row.stock)
    await row.update({ stock: req.body.quantity })
    await InventoryLog.create({ productId: row.productId, variantId: row.id, changeQuantity: req.body.quantity - before, beforeQuantity: before, afterQuantity: req.body.quantity, reason: req.body.reason, reference: req.body.reference || null, changedByUserId: req.user.id })
    await adminLog(req, 'VARIANT_STOCK_SET', 'PRODUCT_VARIANT', row.id, { before, after: req.body.quantity, reason: req.body.reason })
    return success(res, row, 'Variant stock updated')
  } catch (error) { next(error) }
}
