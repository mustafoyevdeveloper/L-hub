import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { User, VerificationCode } from '../models.js'
import { generateSixDigitCode, sendEmail } from '../utils/email.js'

// Step 1: request registration code
export async function requestRegisterCode(req, res) {
  try {
    const { email, password, fullName, country, phone } = req.body
    if (!email || !password || !fullName || !country || !phone) {
      return res.status(400).json({ error: 'All fields are required' })
    }
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' })
    }
    const code = generateSixDigitCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await VerificationCode.create({
      email,
      code,
      purpose: 'REGISTER',
      expiresAt,
      payload: { password, fullName, country, phone },
    })
    await sendEmail({
      to: email,
      subject: 'Tasdiqlash kodi (ro‘yxatdan o‘tish)',
      text: `Sizning tasdiqlash kodingiz: ${code}. Kod 10 daqiqa davomida amal qiladi.`,
      html: `<p>Sizning tasdiqlash kodingiz: <b>${code}</b></p><p>Kod 10 daqiqa davomida amal qiladi.</p>`
    })
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Step 2: verify code and create account
export async function verifyRegisterCode(req, res) {
  try {
    const { email, code } = req.body
    if (!email || !code) return res.status(400).json({ error: 'Email and code are required' })
    const record = await VerificationCode.findOne({ email, code, purpose: 'REGISTER', used: false })
    if (!record) return res.status(400).json({ error: 'Invalid code' })
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ error: 'Code expired' })
    const existingUser = await User.findOne({ email })
    if (existingUser) return res.status(400).json({ error: 'Email already exists' })

    const { password, fullName, country, phone } = record.payload || {}
    if (!password || !fullName || !country || !phone) return res.status(400).json({ error: 'Invalid registration payload' })
    const passwordHash = await bcrypt.hash(password, 12)
    const user = await User.create({ email, passwordHash, fullName, country, phone, role: 'USER' })
    record.used = true
    await record.save()

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'dev-secret', { expiresIn: '7d' })
    res.json({
      token,
      user: { id: user._id, email: user.email, fullName: user.fullName, role: user.role, isVip: user.isVip, points: user.points }
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

// Forgot password: request reset code
export async function requestPasswordReset(req, res) {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })
    const user = await User.findOne({ email })
    if (!user) return res.status(204).end() // do not disclose existence
    const code = generateSixDigitCode()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000)
    await VerificationCode.create({ email, code, purpose: 'RESET_PASSWORD', expiresAt })
    await sendEmail({
      to: email,
      subject: 'Parolni tiklash kodi',
      text: `Parolni tiklash kodingiz: ${code}. Kod 10 daqiqa amal qiladi.`,
      html: `<p>Parolni tiklash kodingiz: <b>${code}</b></p><p>Kod 10 daqiqa amal qiladi.</p>`
    })
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// Forgot password: verify code and set new password
export async function resetPassword(req, res) {
  try {
    const { email, code, newPassword } = req.body
    if (!email || !code || !newPassword) return res.status(400).json({ error: 'All fields are required' })
    const record = await VerificationCode.findOne({ email, code, purpose: 'RESET_PASSWORD', used: false })
    if (!record) return res.status(400).json({ error: 'Invalid code' })
    if (record.expiresAt.getTime() < Date.now()) return res.status(400).json({ error: 'Code expired' })
    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ error: 'User not found' })
    user.passwordHash = await bcrypt.hash(newPassword, 12)
    await user.save()
    record.used = true
    await record.save()
    res.status(204).end()
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


