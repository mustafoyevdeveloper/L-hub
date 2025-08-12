import multer from 'multer'
import path from 'path'
import fs from 'fs'

const uploadsDir = path.join(process.cwd(), 'uploads')
const avatarsDir = path.join(uploadsDir, 'avatars')

// Papkalarni yaratish
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
if (!fs.existsSync(avatarsDir)) fs.mkdirSync(avatarsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Avatar uchun alohida papka
    if (file.fieldname === 'avatar') {
      cb(null, avatarsDir)
    } else {
      cb(null, uploadsDir)
    }
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const ext = path.extname(file.originalname || '')
    cb(null, unique + ext)
  },
})

function fileFilter(req, file, cb) {
  // Avatar uchun faqat rasm formatlari
  if (file.fieldname === 'avatar') {
    const allowed = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Avatar uchun faqat rasm formatlari ruxsat etilgan'))
    }
  } else {
    // Boshqa fayllar uchun
    const allowed = ['image/jpeg', 'image/png', 'application/pdf']
    if (allowed.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Noto\'g\'ri fayl formati'))
    }
  }
}

export const upload = multer({ 
  storage, 
  fileFilter, 
  limits: { 
    fileSize: 5 * 1024 * 1024 // 5MB
  } 
})


