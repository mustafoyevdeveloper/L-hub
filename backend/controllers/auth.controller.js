import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User } from '../models.js'

export async function register(req, res) {
  try {
    const { email, password, fullName, country } = req.body
    
    if (!email || !password || !fullName || !country) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({
      email,
      passwordHash,
      fullName,
      country,
      role: 'USER'
    })
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVip: user.isVip,
        points: user.points
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    const isValidPassword = await bcrypt.compare(password, user.passwordHash)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid credentials' })
    }
    
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '7d' }
    )
    
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        isVip: user.isVip,
        points: user.points
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


