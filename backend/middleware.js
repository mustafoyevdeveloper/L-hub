import jwt from 'jsonwebtoken'
import { User } from './models.js'

export function auth(requireAdmin = false) {
  return async (req, res, next) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '')
      if (!token) return res.status(401).json({ error: 'No token provided' })
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
      const user = await User.findById(decoded.userId).select('-passwordHash')
      if (!user) return res.status(401).json({ error: 'Invalid token' })
      
      if (requireAdmin && user.role !== 'ADMIN') {
        return res.status(403).json({ error: 'Admin access required' })
      }
      
      req.user = user
      next()
    } catch (error) {
      res.status(401).json({ error: 'Invalid token' })
    }
  }
}

export function rateLimit(maxRequests = 100, windowMs = 15 * 60 * 1000) {
  const requests = new Map()
  
  return (req, res, next) => {
    const ip = req.ip
    const now = Date.now()
    const windowStart = now - windowMs
    
    if (!requests.has(ip)) {
      requests.set(ip, [])
    }
    
    const userRequests = requests.get(ip)
    const validRequests = userRequests.filter(time => time > windowStart)
    
    if (validRequests.length >= maxRequests) {
      return res.status(429).json({ error: 'Too many requests' })
    }
    
    validRequests.push(now)
    requests.set(ip, validRequests)
    next()
  }
}

export function validate(schema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body)
      next()
    } catch (error) {
      res.status(400).json({ error: 'Validation failed', details: error.errors })
    }
  }
}


