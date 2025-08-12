import MiniGame from '../models/MiniGame.js'
import MiniGameSession from '../models/MiniGameSession.js'
import User from '../models/User.js'

export async function listMiniGames(_req, res) {
  const items = await MiniGame.find().lean()
  res.json(items)
}

export async function createMiniGame(req, res) {
  const item = await MiniGame.create(req.body)
  res.json(item)
}

export async function addSession(req, res) {
  const { miniGameId, points } = req.body
  const user = await User.findById(req.user._id)
  if (!user) return res.status(404).json({ error: 'User not found' })
  const factor = user.isVip ? 1.5 : 1.0
  const earned = points * factor
  await MiniGameSession.create({ miniGameId, userId: user._id, pointsEarned: earned })
  user.points += earned
  await user.save()
  res.json({ points: user.points })
}


