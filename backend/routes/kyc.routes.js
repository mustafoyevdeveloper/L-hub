import { Router } from 'express'
import { auth } from '../middleware.js'
import { upload } from '../middleware/upload.js'
import { uploadDocument, getKYCStatus, adminListKYC, adminVerifyKYC } from '../controllers/kyc.controller.js'

const router = Router()

// User KYC endpoints
router.post('/kyc/documents', auth(), upload.single('document'), uploadDocument)
router.get('/kyc/status', auth(), getKYCStatus)

// Admin KYC endpoints
router.get('/admin/kyc', auth(true), adminListKYC)
router.post('/admin/kyc/:userId/verify', auth(true), adminVerifyKYC)

export default router
