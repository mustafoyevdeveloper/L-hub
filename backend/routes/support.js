import { Router } from 'express'
import { auth } from '../middleware.js'
import { createTicket, getTickets, updateTicketStatus } from '../controllers/support.controller.js'

const router = Router()

// User routes
router.post('/support/tickets', auth(), createTicket)
router.get('/support/tickets', auth(), getTickets)

// Admin routes
router.put('/admin/support/tickets/:id', auth(true), updateTicketStatus)

export { router as supportRouter }


