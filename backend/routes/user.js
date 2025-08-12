import { Router } from 'express'
import { auth } from '../middleware.js'
import { getMe, getWallets, deposit, withdraw, updateProfile, uploadAvatar } from '../controllers/user.controller.js'
import { upload } from '../middleware/upload.js'

const router = Router()

router.get('/me', auth(), getMe)
router.get('/wallets', auth(), getWallets)
router.post('/deposit', auth(), deposit)
router.post('/withdraw', auth(), withdraw)
router.put('/profile', auth(), updateProfile)
router.post('/avatar', auth(), upload.single('avatar'), uploadAvatar)

export { router as userRouter }


