import { Router } from 'express'
import { z } from 'zod'
import { auth } from '../middlewares/auth.middleware.js'
import Wallet from '../models/Wallet.js'

const router = Router()

router.get('/me', auth(), async (req, res) => {
  res.json({ user: req.user })
})

router.get('/wallets', auth(), async (req, res) => {
  const wallets = await Wallet.find({ userId: req.user._id }).lean()
  res.json(wallets)
})

router.post('/transactions/deposit', auth(), async (req, res) => {
  const schema = z.object({ amount: z.number().positive(), currency: z.enum(['UZS','USD','RUB']), method: z.string() })
  const data = schema.parse(req.body)
  let wallet = await Wallet.findOne({ userId: req.user._id, currency: data.currency })
  if (!wallet) wallet = await Wallet.create({ userId: req.user._id, currency: data.currency, balance: 0 })
  wallet.balance += data.amount
  await wallet.save()
  res.json(wallet)
})

export default router


