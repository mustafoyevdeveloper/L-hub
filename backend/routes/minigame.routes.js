import { Router } from 'express'
import { auth } from '../middleware.js'
import { listMiniGames, createMiniGame, addSession } from '../controllers/minigame.controller.js'

const router = Router()
router.get('/minigames', listMiniGames)
router.post('/minigames', auth(true), createMiniGame)
router.post('/minigame/sessions', auth(), addSession)
export default router


