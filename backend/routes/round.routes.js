import { Router } from 'express'
import { auth } from '../middleware.js'
import { listRounds, createRound, activateRound, buyTicket, closeRound } from '../controllers/round.controller.js'

const router = Router()
router.get('/', listRounds)
router.post('/', auth(true), createRound)
router.post('/:roundId/activate', auth(true), activateRound)
router.post('/:roundId/tickets', auth(), buyTicket)
router.post('/:roundId/close', auth(true), closeRound)
export default router


