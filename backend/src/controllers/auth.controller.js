import { z } from 'zod'
import User from '../models/User.js'
import { signToken } from '../middlewares/auth.middleware.js'

export const register = async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(6), fullName: z.string().min(2), country: z.string().min(2) })
  const data = schema.parse(req.body)
  const existing = await User.findOne({ email: data.email }).lean()
  if (existing) return res.status(409).json({ error: 'Email already registered' })
  const bcrypt = await import('bcryptjs')
  const passwordHash = await (await bcrypt).hash(data.password, 10)
  const user = await User.create({ ...data, passwordHash })
  const token = signToken({ sub: user._id, role: user.role })
  res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role } })
}

export const login = async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string() })
  const data = schema.parse(req.body)
  const user = await User.findOne({ email: data.email })
  if (!user) return res.status(401).json({ error: 'Invalid credentials' })
  const bcrypt = await import('bcryptjs')
  const ok = await (await bcrypt).compare(data.password, user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' })
  const token = signToken({ sub: user._id, role: user.role })
  res.json({ token, user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role } })
}


