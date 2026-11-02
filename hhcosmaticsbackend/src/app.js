import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import path from 'node:path'
import { sequelize } from './config/database.js'
import authRoutes from './routes/auth.routes.js'
import catalogRoutes from './routes/catalog.routes.js'
import publicRoutes from './routes/public.routes.js'
import userRoutes from './routes/user.routes.js'
import cartRoutes from './routes/cart.routes.js'
import orderRoutes from './routes/order.routes.js'
import reviewRoutes from './routes/review.routes.js'
import adminRoutes from './routes/admin.routes.js'
import { errorHandler, notFound } from './middleware/error.js'

const app = express()
app.disable('x-powered-by')
app.set('trust proxy', 1)

const allowedOrigins = String(process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',').map(v => v.trim()).filter(Boolean)

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({
  origin(origin, cb) {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true)
    return cb(new Error('Origin is not allowed by CORS'))
  },
  credentials: true
}))
app.use(express.json({ limit: '2mb' }))
app.use(express.urlencoded({ extended: true, limit: '2mb' }))
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))
app.use('/uploads', express.static(path.resolve('uploads'), { maxAge: '1d' }))

const limiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  limit: Number(process.env.RATE_LIMIT_MAX || 300),
  standardHeaders: 'draft-7', legacyHeaders: false
})
const authLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 900000),
  limit: Number(process.env.AUTH_RATE_LIMIT_MAX || 30),
  standardHeaders: 'draft-7', legacyHeaders: false
})
app.use(limiter)

const prefix = process.env.API_PREFIX || '/api/v1'
app.get(`${prefix}/health`, async (_req, res) => {
  try {
    await sequelize.authenticate()
    res.json({ success: true, message: 'H&H Hair & Cosmetics API is healthy', data: { database: 'connected', timestamp: new Date().toISOString() } })
  } catch (error) {
    res.status(503).json({ success: false, message: 'Database is unavailable', code: 'DB_UNAVAILABLE' })
  }
})
app.use(`${prefix}/auth`, authLimiter, authRoutes)
app.use(`${prefix}/catalog`, catalogRoutes)
app.use(`${prefix}`, publicRoutes)
app.use(`${prefix}/users`, userRoutes)
app.use(`${prefix}/cart`, cartRoutes)
app.use(`${prefix}/orders`, orderRoutes)
app.use(`${prefix}/reviews`, reviewRoutes)
app.use(`${prefix}/admin`, adminRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
