import { Router } from 'express'
import { getCategory, getProduct, listCategories, listProducts, productReviews, publicBanners, publicSettings } from '../controllers/catalog.controller.js'
const router = Router()
router.get('/categories', listCategories)
router.get('/categories/:slug', getCategory)
router.get('/products', listProducts)
router.get('/products/:slugOrId', getProduct)
router.get('/products/:slugOrId/reviews', productReviews)
router.get('/banners', publicBanners)
router.get('/settings', publicSettings)
export default router
