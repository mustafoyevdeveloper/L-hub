import { Router } from 'express'
import { auth } from '../middleware.js'
import { getRounds, createRound, activateRound, closeRound, buyTicket } from '../controllers/rounds.controller.js'

const router = Router()

// Public routes
router.get('/', getRounds)

// Protected routes
router.post('/buy-ticket', auth(), buyTicket)

// Admin routes
router.post('/', auth(true), createRound)
router.post('/:id/activate', auth(true), activateRound)
router.post('/:id/close', auth(true), closeRound)

export { router as roundsRouter }


