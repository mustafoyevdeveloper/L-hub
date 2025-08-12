import jwt from 'jsonwebtoken'
import { User } from './models.js'

export function auth(requireAdmin = false) {
  console.log('🔧 Auth function created with requireAdmin:', requireAdmin)
  
  return async (req, res, next) => {
    try {
      console.log('🔐 Auth middleware called, requireAdmin:', requireAdmin)
      console.log('🔧 Function parameter requireAdmin:', requireAdmin)
      console.log('🔧 requireAdmin type:', typeof requireAdmin)
      console.log('🔧 requireAdmin value:', requireAdmin)
      console.log('🔧 requireAdmin === true:', requireAdmin === true)
      console.log('🔧 requireAdmin === false:', requireAdmin === false)
      
      const token = req.headers.authorization?.replace('Bearer ', '')
      console.log('🔑 Token received:', token ? 'Yes' : 'No')
      
      if (!token) {
        console.log('❌ No token provided')
        return res.status(401).json({ error: 'No token provided' })
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret')
      console.log('🔓 Token decoded, userId:', decoded.userId)
      
      const user = await User.findById(decoded.userid).select('-passwordHash')
      console.log('👤 User found:', user ? 'Yes' : 'No', user?.role)
      
      if (!user) {
        console.log('❌ User not found')
        return res.status(401).json({ error: 'Invalid token' })
      }
      
      // requireAdmin parametrini aniq tekshirish
      if (requireAdmin === true && user.role !== 'ADMIN') {
        console.log('❌ Admin access required, user role:', user.role)
        return res.status(403).json({ error: 'Admin access required' })
      }
      
      console.log('✅ Auth successful, user:', user._id, 'role:', user.role)
      req.user = user
      next()
    } catch (error) {
      console.log('❌ Auth error:', error.message)
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
    const validRequests = userRequests.filter(time => time > windowMs)
    
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


