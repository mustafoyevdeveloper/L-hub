import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)

export default router

import { Router } from 'express'
import { login, register } from '../controllers/auth.controller.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)

export default router

import { Router } from 'express'
import { register, login } from '../controllers/auth.controller.js'

const router = Router()
router.post('/register', register)
router.post('/login', login)
export default router


