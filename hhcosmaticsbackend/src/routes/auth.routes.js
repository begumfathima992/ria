import { Router } from 'express'
import { forgotPassword, login, logout, refresh, register, resetPassword } from '../controllers/auth.controller.js'
import { validate } from '../middleware/validate.js'
import { authSchemas } from '../validators/schemas.js'

const router = Router()
router.post('/register', validate(authSchemas.register), register)
router.post('/login', validate(authSchemas.login), login)
router.post('/refresh', validate(authSchemas.refresh), refresh)
router.post('/logout', validate(authSchemas.refresh), logout)
router.post('/forgot-password', validate(authSchemas.forgot), forgotPassword)
router.post('/reset-password', validate(authSchemas.reset), resetPassword)
export default router
