import { Op } from 'sequelize'
import { Category, Subcategory, Product, ProductVariant, ProductImage, Review, User, Banner, Setting } from '../models/index.js'
import { pagination, paginationMeta, success } from '../utils/helpers.js'
import { ApiError } from '../utils/ApiError.js'

const productIncludes = [
  { model: Category, as: 'category', required: true, where: { isActive: true }, attributes: ['id','name','slug'] },
  { model: Subcategory, as: 'subcategory', attributes: ['id','name','slug'], required: false, where: { isActive: true } },
  { model: ProductVariant, as: 'variants', required: false, where: { isActive: true }, attributes: ['id','name','sku','attributes','price','compareAtPrice','stock','isDefault'] },
  { model: ProductImage, as: 'images', required: false, attributes: ['id','variantId','imageUrl','altText','sortOrder','isPrimary'] }
]

export async function listCategories(req, res, next) {
  try {
    const rows = await Category.findAll({
      where: { isActive: true },
      include: [{ model: Subcategory, as: 'subcategories', where: { isActive: true }, required: false, attributes: ['id','name','slug','description','imageUrl','sortOrder'] }],
      order: [['sortOrder','ASC'],['name','ASC'],[{ model: Subcategory, as: 'subcategories' },'sortOrder','ASC']]
    })
    return success(res, rows)
  } catch (error) { next(error) }
}

export async function getCategory(req, res, next) {
  try {
    const row = await Category.findOne({ where: { slug: req.params.slug, isActive: true }, include: [{ model: Subcategory, as: 'subcategories', where: { isActive: true }, required: false }] })
    if (!row) throw new ApiError(404, 'Category not found', 'CATEGORY_NOT_FOUND')
    return success(res, row)
  } catch (error) { next(error) }
}

export async function listProducts(req, res, next) {
  try {
    const { page, limit, offset } = pagination(req.query)
    const where = { isActive: true }
    if (req.query.featured === 'true') where.isFeatured = true
    if (req.query.new === 'true') where.isNew = true
    if (req.query.search) {
      const q = `%${String(req.query.search).trim()}%`
      where[Op.or] = [{ name: { [Op.like]: q } }, { brand: { [Op.like]: q } }, { shortDescription: { [Op.like]: q } }, { sku: { [Op.like]: q } }]
    }
    if (req.query.minPrice || req.query.maxPrice) {
      where.basePrice = {}
      if (req.query.minPrice) where.basePrice[Op.gte] = Number(req.query.minPrice)
      if (req.query.maxPrice) where.basePrice[Op.lte] = Number(req.query.maxPrice)
    }
    const include = [...productIncludes]
    if (req.query.category) include[0] = { ...include[0], required: true, where: { slug: req.query.category, isActive: true } }
    if (req.query.subcategory) include[1] = { ...include[1], required: true, where: { slug: req.query.subcategory, isActive: true } }
    const sortMap = {
      newest: [['createdAt','DESC']],
      price_asc: [['basePrice','ASC']],
      price_desc: [['basePrice','DESC']],
      rating: [['ratingAverage','DESC'],['reviewCount','DESC']],
      name: [['name','ASC']]
    }
    const order = sortMap[req.query.sort] || [['isFeatured','DESC'],['createdAt','DESC']]
    const { rows, count } = await Product.findAndCountAll({ where, include, order, distinct: true, limit, offset })
    return success(res, rows, 'OK', 200, paginationMeta(count, page, limit))
  } catch (error) { next(error) }
}

export async function getProduct(req, res, next) {
  try {
    const where = /^\d+$/.test(req.params.slugOrId) ? { id: req.params.slugOrId, isActive: true } : { slug: req.params.slugOrId, isActive: true }
    const row = await Product.findOne({ where, include: productIncludes })
    if (!row) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    return success(res, row)
  } catch (error) { next(error) }
}

export async function productReviews(req, res, next) {
  try {
    const { page, limit, offset } = pagination(req.query)
    const product = await Product.findOne({ where: /^\d+$/.test(req.params.slugOrId) ? { id: req.params.slugOrId } : { slug: req.params.slugOrId } })
    if (!product) throw new ApiError(404, 'Product not found', 'PRODUCT_NOT_FOUND')
    const { rows, count } = await Review.findAndCountAll({
      where: { productId: product.id, status: 'APPROVED' },
      include: [{ model: User, as: 'user', attributes: ['id','firstName','lastName'] }],
      order: [['createdAt','DESC']], limit, offset
    })
    return success(res, rows, 'OK', 200, paginationMeta(count, page, limit))
  } catch (error) { next(error) }
}

export async function publicBanners(req, res, next) {
  try {
    const now = new Date()
    const rows = await Banner.findAll({
      where: { isActive: true, [Op.and]: [{ [Op.or]: [{ startsAt: null }, { startsAt: { [Op.lte]: now } }] }, { [Op.or]: [{ endsAt: null }, { endsAt: { [Op.gte]: now } }] }] },
      order: [['position','ASC'],['sortOrder','ASC']]
    })
    return success(res, rows)
  } catch (error) { next(error) }
}

export async function publicSettings(req, res, next) {
  try {
    const rows = await Setting.findAll({ where: { isPublic: true }, attributes: ['key','value'] })
    return success(res, Object.fromEntries(rows.map(row => [row.key, row.value])))
  } catch (error) { next(error) }
}
