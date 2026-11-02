import { Router } from 'express'
import { authenticate, requireRole } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { imageUpload } from '../middleware/upload.js'
import { adminSchemas, adminSupportSchemas, adminUserEditSchema, partialSchema } from '../validators/schemas.js'
import { dashboard, activityLog } from '../controllers/admin/dashboard.controller.js'
import { getUser, listUsers, updateUser, updateUserStatus } from '../controllers/admin/user.controller.js'
import * as catalog from '../controllers/admin/catalog.controller.js'
import * as orders from '../controllers/admin/order.controller.js'
import * as marketing from '../controllers/admin/marketing.controller.js'
import * as reviews from '../controllers/admin/review.controller.js'
import * as reports from '../controllers/admin/report.controller.js'
import { uploadImage } from '../controllers/admin/upload.controller.js'

const router = Router()
router.use(authenticate, requireRole('SUPERADMIN'))

router.get('/dashboard', dashboard)
router.get('/activity', activityLog)

router.get('/users', listUsers)
router.get('/users/:id', getUser)
router.patch('/users/:id', validate(adminUserEditSchema, 'body', { noDefaults: true }), updateUser)
router.patch('/users/:id/status', validate(adminSchemas.userStatus), updateUserStatus)

router.get('/categories', catalog.listCategories)
router.post('/categories', validate(adminSchemas.category), catalog.createCategory)
router.patch('/categories/:id', validate(partialSchema(adminSchemas.category), 'body', { noDefaults: true }), catalog.updateCategory)
router.delete('/categories/:id', catalog.deleteCategory)
router.post('/categories/:id/restore', catalog.restoreCategory)

router.get('/subcategories', catalog.listSubcategories)
router.post('/subcategories', validate(adminSchemas.subcategory), catalog.createSubcategory)
router.patch('/subcategories/:id', validate(partialSchema(adminSchemas.subcategory), 'body', { noDefaults: true }), catalog.updateSubcategory)
router.delete('/subcategories/:id', catalog.deleteSubcategory)
router.post('/subcategories/:id/restore', catalog.restoreSubcategory)

router.get('/products', catalog.listProducts)
router.get('/products/:id', catalog.getProduct)
router.post('/products', validate(adminSchemas.product), catalog.createProduct)
router.patch('/products/:id', validate(partialSchema(adminSchemas.product), 'body', { noDefaults: true }), catalog.updateProduct)
router.delete('/products/:id', catalog.deleteProduct)
router.post('/products/:id/restore', catalog.restoreProduct)
router.post('/products/:productId/variants', validate(adminSchemas.variant), catalog.createVariant)
router.patch('/products/:productId/variants/:variantId', validate(partialSchema(adminSchemas.variant), 'body', { noDefaults: true }), catalog.updateVariant)
router.delete('/products/:productId/variants/:variantId', catalog.deleteVariant)
router.post('/products/:productId/variants/:variantId/restore', catalog.restoreVariant)
router.post('/products/:productId/images', validate(adminSchemas.image), catalog.addProductImage)
router.patch('/products/:productId/images/:imageId', validate(partialSchema(adminSchemas.image), 'body', { noDefaults: true }), catalog.updateProductImage)
router.delete('/products/:productId/images/:imageId', catalog.deleteProductImage)
router.put('/products/:productId/inventory', validate(adminSchemas.inventory), catalog.setProductStock)
router.put('/products/:productId/variants/:variantId/inventory', validate(adminSchemas.inventory), catalog.setVariantStock)

router.get('/orders', orders.listOrders)
router.get('/orders/:id', orders.getOrder)
router.patch('/orders/:id/status', validate(adminSchemas.orderStatus), orders.updateOrderStatus)
router.patch('/orders/:id/note', validate(adminSupportSchemas.orderNote), orders.updateOrderNotes)

router.get('/coupons', marketing.listCoupons)
router.post('/coupons', validate(adminSchemas.coupon), marketing.createCoupon)
router.patch('/coupons/:id', validate(partialSchema(adminSchemas.coupon), 'body', { noDefaults: true }), marketing.updateCoupon)
router.delete('/coupons/:id', marketing.deleteCoupon)
router.post('/coupons/:id/restore', marketing.restoreCoupon)

router.get('/banners', marketing.listBanners)
router.post('/banners', validate(adminSchemas.banner), marketing.createBanner)
router.patch('/banners/:id', validate(partialSchema(adminSchemas.banner), 'body', { noDefaults: true }), marketing.updateBanner)
router.delete('/banners/:id', marketing.deleteBanner)
router.post('/banners/:id/restore', marketing.restoreBanner)

router.get('/settings', marketing.listSettings)
router.put('/settings/:key', validate(adminSchemas.setting), marketing.upsertSetting)
router.get('/contact-messages', marketing.listContactMessages)
router.patch('/contact-messages/:id', validate(adminSupportSchemas.contactUpdate), marketing.updateContactMessage)
router.get('/newsletter-subscribers', marketing.listSubscribers)

router.get('/reviews', reviews.listReviews)
router.patch('/reviews/:id/status', validate(adminSchemas.reviewStatus), reviews.moderateReview)
router.delete('/reviews/:id', reviews.deleteReview)

router.get('/reports/sales', reports.salesReport)
router.get('/reports/inventory', reports.inventoryReport)
router.get('/reports/inventory-logs', reports.inventoryLogs)

router.post('/uploads/images', imageUpload.single('image'), uploadImage)

export default router
