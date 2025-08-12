import { Router } from 'express'
import { z } from 'zod'
import { auth } from '../middlewares/auth.middleware.js'
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


