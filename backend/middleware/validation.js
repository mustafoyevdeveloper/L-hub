import { z } from 'zod'

// User registration validation
export const registerSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  country: z.string().min(2, 'Country must be at least 2 characters')
})

// User login validation
export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
})

// Round creation validation
export const createRoundSchema = z.object({
  maxPlayers: z.number().min(1, 'Max players must be at least 1'),
  entryFee: z.number().min(0, 'Entry fee must be non-negative'),
  currency: z.enum(['UZS', 'USD', 'RUB'], 'Invalid currency'),
  startsAt: z.string().datetime('Invalid start date'),
  prizes: z.array(z.object({
    type: z.enum(['CAR', 'CASH', 'RUB_CASH', 'FREE_TICKET', 'POINTS']),
    amount: z.number().optional(),
    currency: z.enum(['UZS', 'USD', 'RUB']).optional(),
    quantity: z.number().min(1, 'Quantity must be at least 1')
  })).optional()
})

// Ticket purchase validation
export const buyTicketSchema = z.object({
  numbers: z.string().regex(/^\d{1,2}(,\d{1,2}){5}$/, 'Invalid number format'),
  roundId: z.string().min(24, 'Invalid round ID')
})

// Deposit request validation
export const depositSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  currency: z.enum(['UZS', 'USD', 'RUB'], 'Invalid currency'),
  method: z.string().min(1, 'Payment method is required')
})

// Withdrawal request validation
export const withdrawalSchema = z.object({
  amount: z.number().min(1, 'Amount must be at least 1'),
  currency: z.enum(['UZS', 'USD', 'RUB'], 'Invalid currency'),
  bankDetails: z.string().min(1, 'Bank details are required')
})

// Support ticket validation
export const supportTicketSchema = z.object({
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  category: z.enum(['TECHNICAL', 'PAYMENT', 'GENERAL']).optional()
})

// KYC document validation
export const kycDocumentSchema = z.object({
  type: z.enum(['PASSPORT', 'ID_CARD', 'DRIVERS_LICENSE'], 'Invalid document type'),
  documentNumber: z.string().min(1, 'Document number is required')
})

// RNG seed validation
export const rngSeedSchema = z.object({
  seed: z.string().min(32, 'Seed must be at least 32 characters')
})

// Validation middleware factory
export function validate(schema) {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.body)
      req.body = validatedData
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        return res.status(400).json({
          error: 'Validation failed',
          details: errors
        })
      }
      next(error)
    }
  }
}

// Query parameter validation
export function validateQuery(schema) {
  return (req, res, next) => {
    try {
      const validatedData = schema.parse(req.query)
      req.query = validatedData
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        return res.status(400).json({
          error: 'Query validation failed',
          details: errors
        })
      }
      next(error)
    }
  }
}
