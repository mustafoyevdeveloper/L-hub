import { Router } from 'express'
import { z } from 'zod'
import { auth } from '../middlewares/auth.middleware.js'
import Round from '../models/Round.js'
import Ticket from '../models/Ticket.js'
import Wallet from '../models/Wallet.js'
import Reward from '../models/Reward.js'

const router = Router()

router.get('/', async (_req, res) => {
  const rounds = await Round.find().lean()
  res.json(rounds)
})

router.post('/', auth(true), async (req, res) => {
  const schema = z.object({
    entryFee: z.number().positive(),
    currency: z.enum(['UZS','USD','RUB']),
    maxPlayers: z.number().int().min(1).max(5000).default(5000),
    startsAt: z.string(),
    endsAt: z.string().optional(),
    prizes: z.array(z.object({
      type: z.enum(['CAR','CASH','RUB_CASH','FREE_TICKET','POINTS']),
      amount: z.number().optional(),
      currency: z.enum(['UZS','USD','RUB']).optional(),
      quantity: z.number().int().min(1),
    })),
  })
  const data = schema.parse(req.body)
  const round = await Round.create({
    entryFee: data.entryFee,
    currency: data.currency,
    maxPlayers: data.maxPlayers,
    startsAt: new Date(data.startsAt),
    endsAt: data.endsAt ? new Date(data.endsAt) : undefined,
    prizes: data.prizes,
  })
  res.json(round)
})

router.post('/:roundId/activate', auth(true), async (req, res) => {
  const round = await Round.findById(req.params.roundId)
  if (!round) return res.status(404).json({ error: 'Round not found' })
  round.status = 'ACTIVE'
  round.startsAt = new Date()
  await round.save()
  res.json(round)
})

router.post('/:roundId/tickets', auth(), async (req, res) => {
  const schema = z.object({ numbers: z.array(z.number().int().min(1).max(49)).length(6) })
  const { numbers } = schema.parse(req.body)
  const round = await Round.findById(req.params.roundId)
  if (!round) return res.status(404).json({ error: 'Round not found' })
  if (round.status !== 'ACTIVE') return res.status(400).json({ error: 'Round not active' })
  const ticketsCount = await Ticket.countDocuments({ roundId: round._id })
  if (ticketsCount >= (round.maxPlayers || 0)) return res.status(400).json({ error: 'Round full' })

  let wallet = await Wallet.findOne({ userId: req.user._id, currency: round.currency })
  if (!wallet || wallet.balance < (round.entryFee || 0)) return res.status(400).json({ error: 'Insufficient funds' })
  wallet.balance -= round.entryFee
  await wallet.save()

  const numbersCsv = [...numbers].sort((a, b) => a - b).join(',')
  const ticket = await Ticket.create({ userId: req.user._id, roundId: round._id, numbers: numbersCsv })
  res.json(ticket)
})

router.post('/:roundId/close', auth(true), async (req, res) => {
  const round = await Round.findById(req.params.roundId).lean()
  if (!round) return res.status(404).json({ error: 'Round not found' })
  if (round.status === 'COMPLETED') return res.status(400).json({ error: 'Already completed' })

  const tickets = await Ticket.find({ roundId: round._id }).lean()
  const shuffled = [...tickets].sort(() => Math.random() - 0.5)
  let idx = 0
  for (const prize of (round.prizes || [])) {
    for (let i = 0; i < prize.quantity; i++) {
      if (idx >= shuffled.length) break
      const ticket = shuffled[idx++]
      await Reward.create({ ticketId: ticket._id, type: prize.type, amount: prize.amount, currency: prize.currency })
    }
  }
  await Round.updateOne({ _id: round._id }, { $set: { status: 'COMPLETED', endsAt: new Date() } })
  const updated = await Round.findById(round._id)
  res.json(updated)
})

export default router


