import { Router } from 'express'
import { auth } from '../middleware.js'
import { 
  getDashboardStats, 
  listUsers, 
  updateUser, 
  processWithdrawal, 
  assignSupportTicket, 
  exportData 
} from '../controllers/admin.controller.js'

const router = Router()

// All admin routes require admin authentication
router.use(auth(true))

// Dashboard and statistics
router.get('/admin/dashboard', getDashboardStats)

// User management
router.get('/admin/users', listUsers)
router.put('/admin/users/:userId', updateUser)

// Withdrawal processing
router.post('/admin/withdrawals/:withdrawalId/process', processWithdrawal)

// Support ticket management
router.put('/admin/support/:ticketId', assignSupportTicket)

// Data export
router.get('/admin/export', exportData)

export default router
