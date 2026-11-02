import fs from 'node:fs'
import path from 'node:path'
import multer from 'multer'

const uploadDir = path.resolve('uploads')
fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const base = path.basename(file.originalname, ext).replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase()
    cb(null, `${Date.now()}-${base || 'image'}${ext}`)
  }
})

export const imageUpload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg','image/png','image/webp','image/gif','image/svg+xml']
    if (!allowed.includes(file.mimetype)) return cb(new Error('Only JPG, PNG, WEBP, GIF and SVG images are allowed'))
    cb(null, true)
  }
})
