import rateLimit from 'express-rate-limit'
import { RateLimit } from '../models.js'

// General API rate limiting
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later'
    })
  }
})

// Auth endpoints rate limiting (more strict)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Please try again later'
    })
  }
})

// File upload rate limiting
export const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // limit each IP to 10 uploads per hour
  message: 'Too many file uploads, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too many file uploads',
      message: 'Please try again later'
    })
  }
})

// Database-based rate limiting for specific actions
export async function checkRateLimit(ipAddress, endpoint, maxRequests, windowMs) {
  const now = new Date()
  const resetAt = new Date(now.getTime() + windowMs)
  
  let rateLimitRecord = await RateLimit.findOne({ ipAddress, endpoint })
  
  if (!rateLimitRecord) {
    rateLimitRecord = new RateLimit({
      ipAddress,
      endpoint,
      count: 1,
      resetAt
    })
  } else if (now > rateLimitRecord.resetAt) {
    // Reset window
    rateLimitRecord.count = 1
    rateLimitRecord.resetAt = resetAt
  } else {
    rateLimitRecord.count += 1
  }
  
  await rateLimitRecord.save()
  
  return rateLimitRecord.count <= maxRequests
}
