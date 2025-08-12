import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadsDir = path.join(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname || '')
    cb(null, unique + ext)
  },
})

function fileFilter(_req, file, cb) {
  const allowed = ['image/jpeg', 'image/png', 'application/pdf']
  if (allowed.includes(file.mimetype)) cb(null, true)
  else cb(new Error('Invalid file type'))
}

export const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })


