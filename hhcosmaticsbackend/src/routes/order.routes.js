import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { orderSchemas, returnSchema } from '../validators/schemas.js'
import { cancelMyOrder, createOrder, getMyOrder, listMyOrders, requestReturn, trackOrder } from '../controllers/order.controller.js'
const router = Router()
router.post('/track', validate(orderSchemas.track), trackOrder)
router.use(authenticate)
router.post('/', validate(orderSchemas.create), createOrder)
router.get('/', listMyOrders)
router.get('/:id', getMyOrder)
router.post('/:id/cancel', validate(orderSchemas.cancel), cancelMyOrder)
router.post('/:id/return-request', validate(returnSchema), requestReturn)
export default router
