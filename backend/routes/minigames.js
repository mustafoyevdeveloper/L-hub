import { Router } from 'express'
import { auth } from '../middleware.js'
import { getMiniGames, createMiniGameSession, earnPoints, getGameStats } from '../controllers/minigames.controller.js'

const router = Router()

// Public routes
router.get('/minigames', getMiniGames)
router.get('/minigames/stats', getGameStats)

// Protected routes
router.post('/minigames/sessions', auth(), createMiniGameSession)
router.post('/minigames/earn-points', auth(), earnPoints)

export { router as minigamesRouter }


