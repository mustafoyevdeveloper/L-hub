import { Router } from 'express'
import { auth } from '../middleware.js'
import { upload } from '../middleware/upload.js'
import { createDeposit, myDeposits, adminListDeposits, approveDeposit, rejectDeposit } from '../controllers/deposit.controller.js'

const router = Router()

// User
router.post('/deposits', auth(), upload.single('receipt'), createDeposit)
router.get('/deposits', auth(), myDeposits)

// Admin
router.get('/admin/deposits', auth(true), adminListDeposits)
router.post('/admin/deposits/:id/approve', auth(true), approveDeposit)
router.post('/admin/deposits/:id/reject', auth(true), rejectDeposit)

export default router


