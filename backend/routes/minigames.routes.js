import { Router } from 'express'
import { auth } from '../middleware.js'
import { listMiniGames, createMiniGame, addSession } from '../controllers/minigames.controller.js'

const router = Router()

router.get('/minigames', listMiniGames)
router.post('/minigames', auth(true), createMiniGame)
router.post('/minigame/sessions', auth(), addSession)

export default router

import { Router } from 'express'
import { listMiniGames, createMiniGame, addMiniGameSession } from '../controllers/minigames.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/minigames', listMiniGames)
router.post('/minigames', auth(true), createMiniGame)
router.post('/minigame/sessions', auth(), addMiniGameSession)

export default router


