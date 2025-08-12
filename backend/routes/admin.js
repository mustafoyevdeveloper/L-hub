import { Router } from 'express'
import { auth } from '../middleware.js'
import { 
  getDashboardStats,
  listUsers,
  updateUser,
  approveWithdrawal,
  rejectWithdrawal,
  getRoundStats
} from '../controllers/admin.controller.js'

const router = Router()

// All admin routes require admin authentication
router.use(auth(true))

router.get('/dashboard/stats', getDashboardStats)
router.get('/users', listUsers)
router.put('/users/:userId', updateUser)
router.post('/withdrawals/:withdrawalId/approve', approveWithdrawal)
router.post('/withdrawals/:withdrawalId/reject', rejectWithdrawal)
router.get('/rounds/:roundId/stats', getRoundStats)

export default router
