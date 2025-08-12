import { DepositRequest, Wallet } from '../models.js'

export async function createDeposit(req, res) {
  try {
    const { amount, currency, method } = req.body
    
    if (!amount || !currency || !method) {
      return res.status(400).json({ error: 'Missing fields' })
    }
    
    if (!req.file) {
      return res.status(400).json({ error: 'Receipt is required' })
    }
    
    const receiptUrl = `/uploads/${req.file.filename}`
    
    const deposit = await DepositRequest.create({
      userId: req.user._id,
      amount,
      currency,
      method,
      receiptUrl,
      status: 'PENDING'
    })
    
    res.json(deposit)
  } catch (error) {
    console.error('Create deposit error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function myDeposits(req, res) {
  try {
    const deposits = await DepositRequest.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean()
    
    res.json(deposits)
  } catch (error) {
    console.error('Get deposits error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function adminListDeposits(req, res) {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    
    const deposits = await DepositRequest.find(filter)
      .populate('userId', 'fullName email')
      .sort({ createdAt: -1 })
      .lean()
    
    res.json(deposits)
  } catch (error) {
    console.error('Admin list deposits error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function approveDeposit(req, res) {
  try {
    const { id } = req.params
    const { adminNote } = req.body
    
    const deposit = await DepositRequest.findById(id)
    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' })
    }
    
    if (deposit.status !== 'PENDING') {
      return res.status(400).json({ error: 'Already processed' })
    }
    
    // Find or create wallet
    let wallet = await Wallet.findOne({ userId: deposit.userId, currency: deposit.currency })
    if (!wallet) {
      wallet = await Wallet.create({ userId: deposit.userId, currency: deposit.currency, balance: 0 })
    }
    
    // Credit user's balance
    wallet.balance += deposit.amount
    await wallet.save()
    
    // Update deposit status
    deposit.status = 'APPROVED'
    deposit.adminNote = adminNote
    await deposit.save()
    
    res.json({ success: true, newBalance: wallet.balance })
  } catch (error) {
    console.error('Approve deposit error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function rejectDeposit(req, res) {
  try {
    const { id } = req.params
    const { adminNote } = req.body
    
    const deposit = await DepositRequest.findById(id)
    if (!deposit) {
      return res.status(404).json({ error: 'Deposit not found' })
    }
    
    if (deposit.status !== 'PENDING') {
      return res.status(400).json({ error: 'Already processed' })
    }
    
    deposit.status = 'REJECTED'
    deposit.adminNote = adminNote
    await deposit.save()
    
    res.json({ success: true })
  } catch (error) {
    console.error('Reject deposit error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


