import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'
import { reviewSchemas } from '../validators/schemas.js'
import { createReview, deleteReview, updateReview } from '../controllers/review.controller.js'
const router = Router()
router.use(authenticate)
router.post('/products/:productId', validate(reviewSchemas.create), createReview)
router.patch('/:id', validate(reviewSchemas.update), updateReview)
router.delete('/:id', deleteReview)
export default router
