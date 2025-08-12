import { Router } from 'express'
import { z } from 'zod'
import { auth } from '../middlewares/auth.middleware.js'
import MiniGame from '../models/MiniGame.js'
import MiniGameSession from '../models/MiniGameSession.js'
import User from '../models/User.js'

const router = Router()

router.get('/minigames', async (_req, res) => {
  const items = await MiniGame.find().lean()
  res.json(items)
})

router.post('/minigames', auth(true), async (req, res) => {
  const schema = z.object({ title: z.string().min(2), startsAt: z.string(), endsAt: z.string(), isActive: z.boolean().optional().default(true), subscriptionRequired: z.boolean().optional().default(true) })
  const data = schema.parse(req.body)
  const item = await MiniGame.create({ title: data.title, startsAt: new Date(data.startsAt), endsAt: new Date(data.endsAt), isActive: data.isActive, subscriptionRequired: data.subscriptionRequired })
  res.json(item)
})

router.post('/minigame/sessions', auth(), async (req, res) => {
  const schema = z.object({ miniGameId: z.string(), points: z.number().positive() })
  const { miniGameId, points } = schema.parse(req.body)
  const user = await User.findById(req.user._id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const factor = user.isVip ? 1.5 : 1.0
  const earned = points * factor
  await MiniGameSession.create({ miniGameId, userId: user._id, pointsEarned: earned })
  user.points += earned
  await user.save()
  res.json({ points: user.points })
})

export default router


