import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { authSchemas, partialSchema, userSchemas } from '../validators/schemas.js'
import { addWishlist, changePassword, createAddress, deleteAddress, listAddresses, listWishlist, me, removeWishlist, setDefaultAddress, updateAddress, updateMe } from '../controllers/user.controller.js'
const router = Router()
router.use(authenticate)
router.get('/me', me)
router.patch('/me', validate(userSchemas.profile), updateMe)
router.post('/change-password', validate(authSchemas.changePassword), changePassword)
router.get('/addresses', listAddresses)
router.post('/addresses', validate(userSchemas.address), createAddress)
router.patch('/addresses/:id', validate(partialSchema(userSchemas.address), 'body', { noDefaults: true }), updateAddress)
router.delete('/addresses/:id', deleteAddress)
router.patch('/addresses/:id/default', setDefaultAddress)
router.get('/wishlist', listWishlist)
router.post('/wishlist/:productId', addWishlist)
router.delete('/wishlist/:productId', removeWishlist)
export default router
