import { Router } from 'express'
import { auth } from '../middleware.js'
import { me, getWallets, deposit } from '../controllers/user.controller.js'

const router = Router()

router.get('/me', auth(), me)
router.get('/wallets', auth(), getWallets)
router.post('/transactions/deposit', auth(), deposit)

export default router

import { Router } from 'express'
import { me, wallets, deposit } from '../controllers/user.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/me', auth(), me)
router.get('/wallets', auth(), wallets)
router.post('/transactions/deposit', auth(), deposit)

export default router

import { Router } from 'express'
import { auth } from '../middleware.js'
import { getMe, getWallets, deposit } from '../controllers/user.controller.js'

const router = Router()
router.get('/me', auth(), getMe)
router.get('/wallets', auth(), getWallets)
router.post('/transactions/deposit', auth(), deposit)
export default router


