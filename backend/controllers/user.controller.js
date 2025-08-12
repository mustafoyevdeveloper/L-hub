import { User, Wallet, Subscription, Withdrawal, Transaction } from '../models.js'

export async function getMe(req, res) {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash')
    const wallets = await Wallet.find({ userId: req.user._id })
    const activeSubscription = await Subscription.findOne({ 
      userId: req.user._id, 
      validUntil: { $gt: new Date() } 
    })
    
    res.json({
      user,
      wallets,
      activeSubscription
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function updateProfile(req, res) {
  try {
    const { fullName, country } = req.body
    const updates = {}
    
    if (fullName) updates.fullName = fullName
    if (country) updates.country = country
    
    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash')
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getWallets(req, res) {
  try {
    const wallets = await Wallet.find({ userId: req.user._id })
    res.json(wallets)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getTransactions(req, res) {
  try {
    const { page = 1, limit = 20 } = req.query
    const skip = (page - 1) * limit
    
    const transactions = await Transaction.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()
    
    const total = await Transaction.countDocuments({ userId: req.user._id })
    
    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function createWithdrawal(req, res) {
  try {
    const { amount, currency } = req.body
    
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Amount and currency are required' })
    }
    
    const wallet = await Wallet.findOne({ userId: req.user._id, currency })
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }
    
    const withdrawal = await Withdrawal.create({
      userId: req.user._id,
      amount,
      currency,
      status: 'PENDING'
    })
    
    res.json(withdrawal)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getWithdrawals(req, res) {
  try {
    const withdrawals = await Withdrawal.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .lean()
    
    res.json(withdrawals)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function deposit(req, res) {
  try {
    const { amount, currency } = req.body
    
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Amount and currency are required' })
    }
    
    let wallet = await Wallet.findOne({ userId: req.user._id, currency })
    if (!wallet) {
      wallet = await Wallet.create({
        userId: req.user._id,
        currency,
        balance: 0
      })
    }
    
    wallet.balance += parseFloat(amount)
    await wallet.save()
    
    // Create transaction record
    await Transaction.create({
      userId: req.user._id,
      type: 'DEPOSIT',
      amount: parseFloat(amount),
      currency,
      status: 'COMPLETED',
      description: 'Manual deposit'
    })
    
    res.json({ message: 'Deposit successful', wallet })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function withdraw(req, res) {
  try {
    const { amount, currency } = req.body
    
    if (!amount || !currency) {
      return res.status(400).json({ error: 'Amount and currency are required' })
    }
    
    const wallet = await Wallet.findOne({ userId: req.user._id, currency })
    if (!wallet || wallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }
    
    const withdrawal = await Withdrawal.create({
      userId: req.user._id,
      amount,
      currency,
      status: 'PENDING'
    })
    
    res.json(withdrawal)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}


