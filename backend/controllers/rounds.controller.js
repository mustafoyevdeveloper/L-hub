import { Round, Ticket, Wallet, Transaction } from '../models.js'

export async function getRounds(req, res) {
  try {
    const { status } = req.query
    const filter = status ? { status } : {}
    const rounds = await Round.find(filter).sort({ createdAt: -1 }).lean()
    res.json(rounds)
  } catch (error) {
    console.error('Get rounds error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createRound(req, res) {
  try {
    const { maxPlayers, entryFee, currency, startsAt, prizes } = req.body
    
    if (!entryFee || !currency || !startsAt) {
      return res.status(400).json({ error: 'Required fields missing' })
    }

    const round = await Round.create({
      maxPlayers: maxPlayers || 5000,
      entryFee,
      currency,
      startsAt: new Date(startsAt),
      prizes: prizes || []
    })

    res.json(round)
  } catch (error) {
    console.error('Create round error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function activateRound(req, res) {
  try {
    const round = await Round.findById(req.params.id)
    if (!round) {
      return res.status(404).json({ error: 'Round not found' })
    }

    if (round.status !== 'PLANNED') {
      return res.status(400).json({ error: 'Round cannot be activated' })
    }

    round.status = 'ACTIVE'
    round.startsAt = new Date()
    await round.save()

    res.json(round)
  } catch (error) {
    console.error('Activate round error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function closeRound(req, res) {
  try {
    const round = await Round.findById(req.params.id)
    if (!round) {
      return res.status(404).json({ error: 'Round not found' })
    }

    if (round.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Round cannot be closed' })
    }

    round.status = 'COMPLETED'
    round.endsAt = new Date()
    await round.save()

    res.json(round)
  } catch (error) {
    console.error('Close round error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function buyTicket(req, res) {
  try {
    const { roundId, numbers } = req.body
    
    if (!roundId || !numbers) {
      return res.status(400).json({ error: 'Round ID and numbers are required' })
    }

    const round = await Round.findById(roundId)
    if (!round || round.status !== 'ACTIVE') {
      return res.status(400).json({ error: 'Round not available' })
    }

    // Check user's wallet balance
    const wallet = await Wallet.findOne({ userId: req.user._id, currency: round.currency })
    if (!wallet || wallet.balance < round.entryFee) {
      return res.status(400).json({ error: 'Insufficient balance' })
    }

    // Deduct entry fee
    wallet.balance -= round.entryFee
    await wallet.save()

    // Create ticket
    const ticket = await Ticket.create({
      userId: req.user._id,
      roundId,
      numbers
    })

    // Create transaction record
    await Transaction.create({
      userId: req.user._id,
      type: 'PURCHASE',
      amount: round.entryFee,
      currency: round.currency,
      method: 'TICKET',
      status: 'COMPLETED'
    })

    res.json({ success: true, ticket })
  } catch (error) {
    console.error('Buy ticket error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


