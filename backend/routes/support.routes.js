import { Router } from 'express'
import { auth } from '../middleware.js'
import { z } from 'zod'
import SupportTicket from '../models/SupportTicket.js'

const router = Router()

router.post('/support/tickets', auth(), async (req, res) => {
  const schema = z.object({ subject: z.string().min(3) })
  const data = schema.parse(req.body)
  const ticket = await SupportTicket.create({ userId: req.user._id, subject: data.subject })
  res.json(ticket)
})

router.get('/support/tickets', auth(true), async (_req, res) => {
  const tickets = await SupportTicket.find().lean()
  res.json(tickets)
})

export default router

import { Router } from 'express'
import { createTicket, listTickets } from '../controllers/support.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router()

router.post('/support/tickets', auth(), createTicket)
router.get('/support/tickets', auth(true), listTickets)

export default router

import { Router } from 'express'
import { auth } from '../middleware.js'
import { createTicket, listTickets } from '../controllers/support.controller.js'

const router = Router()
router.post('/support/tickets', auth(), createTicket)
router.get('/support/tickets', auth(true), listTickets)
export default router


