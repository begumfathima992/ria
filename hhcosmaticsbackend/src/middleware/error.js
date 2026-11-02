import multer from 'multer'
import { ValidationError, UniqueConstraintError, ForeignKeyConstraintError } from 'sequelize'

export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}`, code: 'ROUTE_NOT_FOUND' })
}

export function errorHandler(err, req, res, next) { // eslint-disable-line no-unused-vars
  if (process.env.NODE_ENV !== 'test') console.error(err)
  if (err instanceof multer.MulterError) return res.status(422).json({ success: false, message: err.message, code: 'UPLOAD_ERROR' })
  if (err instanceof UniqueConstraintError) return res.status(409).json({ success: false, message: 'A record with this value already exists', code: 'DUPLICATE_RECORD', errors: err.errors?.map(e => ({ field: e.path, message: e.message })) })
  if (err instanceof ForeignKeyConstraintError) return res.status(409).json({ success: false, message: 'This record is referenced by other data', code: 'FOREIGN_KEY_CONSTRAINT' })
  if (err instanceof ValidationError) return res.status(422).json({ success: false, message: 'Database validation failed', code: 'DB_VALIDATION_ERROR', errors: err.errors?.map(e => ({ field: e.path, message: e.message })) })
  const status = Number(err.status || 500)
  res.status(status).json({ success: false, message: err.message || 'Internal server error', code: err.code || 'INTERNAL_ERROR', ...(err.details ? { details: err.details } : {}) })
}
