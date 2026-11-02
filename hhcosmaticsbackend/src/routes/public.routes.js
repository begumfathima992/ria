import { Router } from 'express'
import { submitContact, subscribeNewsletter, unsubscribeNewsletter } from '../controllers/public.controller.js'
import { validate } from '../middleware/validate.js'
import { publicSchemas } from '../validators/schemas.js'
const router = Router()
router.post('/contact', validate(publicSchemas.contact), submitContact)
router.post('/newsletter/subscribe', validate(publicSchemas.newsletter), subscribeNewsletter)
router.post('/newsletter/unsubscribe', validate(publicSchemas.newsletter), unsubscribeNewsletter)
export default router
