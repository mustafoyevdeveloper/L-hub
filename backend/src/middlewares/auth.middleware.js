import jwt from 'jsonwebtoken'
import User from '../models/User.js'

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

export const auth = (requiredAdmin = false) => async (req, res, next) => {
  try {
    const header = req.headers.authorization || ''
    const token = header.startsWith('Bearer ') ? header.slice(7) : ''
    if (!token) return res.status(401).json({ error: 'Unauthorized' })
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = await User.findById(decoded.sub).lean()
    if (!user) return res.status(401).json({ error: 'Unauthorized' })
    if (requiredAdmin && user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' })
    req.user = user
    next()
  } catch {
    return res.status(401).json({ error: 'Unauthorized' })
  }
}

export const signToken = (payload) => jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })


