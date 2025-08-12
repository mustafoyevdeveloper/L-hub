import { Router } from 'express'
import { auth } from '../middleware.js'
import { getMe, getWallets, deposit, withdraw } from '../controllers/user.controller.js'

const router = Router()

router.get('/me', auth(), getMe)
router.get('/wallets', auth(), getWallets)
router.post('/deposit', auth(), deposit)
router.post('/withdraw', auth(), withdraw)

export { router as userRouter }


