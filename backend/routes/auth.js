import { Router } from 'express'
import { login, requestRegisterCode, verifyRegisterCode, requestPasswordReset, resetPassword } from '../controllers/auth.controller.js'

const router = Router()

// Registration 2-step
router.post('/register/request', requestRegisterCode)
router.post('/register/verify', verifyRegisterCode)

router.post('/login', login)

// Forgot password
router.post('/password/forgot', requestPasswordReset)
router.post('/password/reset', resetPassword)

export { router as authRouter }


