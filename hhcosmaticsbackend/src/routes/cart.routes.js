import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { cartSchemas } from '../validators/schemas.js'
import { addItem, clearCart, getCart, quote, removeItem, updateItem } from '../controllers/cart.controller.js'
const router = Router()
router.use(authenticate)
router.get('/', getCart)
router.post('/items', validate(cartSchemas.add), addItem)
router.patch('/items/:itemId', validate(cartSchemas.quantity), updateItem)
router.delete('/items/:itemId', removeItem)
router.delete('/', clearCart)
router.post('/quote', validate(cartSchemas.quote), quote)
export default router
