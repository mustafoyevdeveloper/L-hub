import Round from '../models/Round.js'
import Ticket from '../models/Ticket.js'
import Reward from '../models/Reward.js'
import Wallet from '../models/Wallet.js'

export async function listRounds(_req, res) {
  const rounds = await Round.find().lean()
  res.json(rounds)
}

export async function createRound(req, res) {
  const { entryFee, currency, maxPlayers = 5000, startsAt, endsAt, prizes } = req.body
  const round = await Round.create({ entryFee, currency, maxPlayers, startsAt, endsAt, prizes })
  res.json(round)
}

export async function activateRound(req, res) {
  const round = await Round.findById(req.params.roundId)
  if (!round) return res.status(404).json({ error: 'Round not found' })
  round.status = 'ACTIVE'
  round.startsAt = new Date()
  await round.save()
  res.json(round)
}

export async function buyTicket(req, res) {
  const { numbers } = req.body
  const round = await Round.findById(req.params.roundId)
  if (!round) return res.status(404).json({ error: 'Round not found' })
  if (round.status !== 'ACTIVE') return res.status(400).json({ error: 'Round not active' })
  const count = await Ticket.countDocuments({ roundId: round._id })
  if (count >= (round.maxPlayers || 0)) return res.status(400).json({ error: 'Round full' })
  let wallet = await Wallet.findOne({ userId: req.user._id, currency: round.currency })
  if (!wallet || wallet.balance < (round.entryFee || 0)) return res.status(400).json({ error: 'Insufficient funds' })
  wallet.balance -= round.entryFee
  await wallet.save()
  const numbersCsv = [...numbers].sort((a, b) => a - b).join(',')
  const ticket = await Ticket.create({ userId: req.user._id, roundId: round._id, numbers: numbersCsv })
  res.json(ticket)
}

export async function closeRound(req, res) {
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
}


