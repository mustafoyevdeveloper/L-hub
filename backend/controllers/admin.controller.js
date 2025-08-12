import { User, Wallet, Round, Ticket, Withdrawal, DepositRequest, Transaction, SupportTicket } from '../models.js'

export async function getDashboardStats(req, res) {
  try {
    const totalUsers = await User.countDocuments()
    const totalRounds = await Round.countDocuments()
    const activeRounds = await Round.countDocuments({ status: 'ACTIVE' })
    const pendingDeposits = await DepositRequest.countDocuments({ status: 'PENDING' })
    const pendingWithdrawals = await Withdrawal.countDocuments({ status: 'PENDING' })
    
    const totalRevenue = await Transaction.aggregate([
      { $match: { type: 'PURCHASE', status: 'COMPLETED' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ])
    
    res.json({
      totalUsers,
      totalRounds,
      activeRounds,
      pendingDeposits,
      pendingWithdrawals,
      totalRevenue: totalRevenue[0]?.total || 0
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function listUsers(req, res) {
  try {
    const { page = 1, limit = 20, search } = req.query
    const skip = (page - 1) * limit
    
    const where = {}
    if (search) {
      where.$or = [
        { email: { $regex: search, $options: 'i' } },
        { fullName: { $regex: search, $options: 'i' } }
      ]
    }
    
    const users = await User.find(where)
      .select('-passwordHash')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean()
    
    const total = await User.countDocuments(where)
    
    res.json({
      users,
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

export async function updateUser(req, res) {
  try {
    const { userId } = req.params
    const { role, isVip, points } = req.body
    
    const updates = {}
    if (role !== undefined) updates.role = role
    if (isVip !== undefined) updates.isVip = isVip
    if (points !== undefined) updates.points = points
    
    const user = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true, runValidators: true }
    ).select('-passwordHash')
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function approveWithdrawal(req, res) {
  try {
    const { withdrawalId } = req.params
    const { adminNote } = req.body
    
    const withdrawal = await Withdrawal.findById(withdrawalId)
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' })
    }
    
    if (withdrawal.status !== 'PENDING') {
      return res.status(400).json({ error: 'Already processed' })
    }
    
    withdrawal.status = 'APPROVED'
    withdrawal.adminNote = adminNote
    await withdrawal.save()
    
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function rejectWithdrawal(req, res) {
  try {
    const { withdrawalId } = req.params
    const { adminNote } = req.body
    
    const withdrawal = await Withdrawal.findById(withdrawalId)
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' })
    }
    
    if (withdrawal.status !== 'PENDING') {
      return res.status(400).json({ error: 'Already processed' })
    }
    
    // Return money to user's wallet
    const wallet = await Wallet.findOne({ 
      userId: withdrawal.userId, 
      currency: withdrawal.currency 
    })
    
    if (wallet) {
      wallet.balance += withdrawal.amount
      await wallet.save()
    }
    
    withdrawal.status = 'REJECTED'
    withdrawal.adminNote = adminNote
    await withdrawal.save()
    
    res.json({ ok: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function getRoundStats(req, res) {
  try {
    const { roundId } = req.params
    
    const round = await Round.findById(roundId)
    if (!round) {
      return res.status(404).json({ error: 'Round not found' })
    }
    
    const tickets = await Ticket.countDocuments({ roundId })
    const totalRevenue = tickets * round.entryFee
    
    res.json({
      round,
      tickets,
      totalRevenue
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function assignSupportTicket(req, res) {
  try {
    const { ticketId } = req.params
    const { adminId, status, adminNote } = req.body
    
    const ticket = await SupportTicket.findById(ticketId)
    if (!ticket) {
      return res.status(404).json({ error: 'Support ticket not found' })
    }
    
    ticket.status = status || ticket.status
    ticket.adminId = adminId || ticket.adminId
    ticket.adminNote = adminNote || ticket.adminNote
    ticket.updatedAt = new Date()
    
    await ticket.save()
    
    res.json(ticket)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function exportData(req, res) {
  try {
    const { type, startDate, endDate } = req.query
    
    let data = []
    let filename = ''
    
    switch (type) {
      case 'users':
        data = await User.find().select('-passwordHash').lean()
        filename = 'users_export.json'
        break
      case 'transactions':
        const where = {}
        if (startDate && endDate) {
          where.createdAt = {
            $gte: new Date(startDate),
            $lte: new Date(endDate)
          }
        }
        data = await Transaction.find(where).lean()
        filename = 'transactions_export.json'
        break
      case 'rounds':
        data = await Round.find().lean()
        filename = 'rounds_export.json'
        break
      default:
        return res.status(400).json({ error: 'Invalid export type' })
    }
    
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`)
    res.json(data)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

export async function processWithdrawal(req, res) {
  try {
    const { withdrawalId } = req.params
    const { action, adminNote } = req.body
    
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ error: 'Invalid action. Use "approve" or "reject"' })
    }
    
    const withdrawal = await Withdrawal.findById(withdrawalId)
    if (!withdrawal) {
      return res.status(404).json({ error: 'Withdrawal not found' })
    }
    
    if (withdrawal.status !== 'PENDING') {
      return res.status(400).json({ error: 'Already processed' })
    }
    
    if (action === 'approve') {
      withdrawal.status = 'APPROVED'
      withdrawal.adminNote = adminNote
      await withdrawal.save()
      
      res.json({ message: 'Withdrawal approved', withdrawal })
    } else {
      // Reject and return money to wallet
      const wallet = await Wallet.findOne({ 
        userId: withdrawal.userId, 
        currency: withdrawal.currency 
      })
      
      if (wallet) {
        wallet.balance += withdrawal.amount
        await wallet.save()
      }
      
      withdrawal.status = 'REJECTED'
      withdrawal.adminNote = adminNote
      await withdrawal.save()
      
      res.json({ message: 'Withdrawal rejected and money returned', withdrawal })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
