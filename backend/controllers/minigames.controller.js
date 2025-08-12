import { MiniGame, MiniGameSession, User } from '../models.js'

export async function getMiniGames(req, res) {
  try {
    const { isActive } = req.query
    const filter = isActive !== undefined ? { isActive: isActive === 'true' } : {}
    const games = await MiniGame.find(filter).sort({ startsAt: -1 }).lean()
    res.json(games)
  } catch (error) {
    console.error('Get mini games error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createMiniGameSession(req, res) {
  try {
    const { miniGameId } = req.body
    
    if (!miniGameId) {
      return res.status(400).json({ error: 'Mini game ID is required' })
    }

    const game = await MiniGame.findById(miniGameId)
    if (!game || !game.isActive) {
      return res.status(400).json({ error: 'Game not available' })
    }

    if (game.subscriptionRequired && !req.user.isVip) {
      return res.status(403).json({ error: 'VIP subscription required' })
    }

    // Check if user already has a session for this game
    const existingSession = await MiniGameSession.findOne({
      miniGameId,
      userId: req.user._id
    })

    if (existingSession) {
      return res.status(400).json({ error: 'Session already exists' })
    }

    const session = await MiniGameSession.create({
      miniGameId,
      userId: req.user._id,
      pointsEarned: 0
    })

    res.json(session)
  } catch (error) {
    console.error('Create game session error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function earnPoints(req, res) {
  try {
    const { sessionId, points } = req.body
    
    if (!sessionId || !points) {
      return res.status(400).json({ error: 'Session ID and points are required' })
    }

    if (points <= 0) {
      return res.status(400).json({ error: 'Points must be positive' })
    }

    const session = await MiniGameSession.findById(sessionId)
    if (!session || session.userId.toString() !== req.user._id.toString()) {
      return res.status(404).json({ error: 'Session not found' })
    }

    session.pointsEarned += points
    await session.save()

    // Update user's total points
    await User.findByIdAndUpdate(req.user._id, {
      $inc: { points: points }
    })

    res.json({ success: true, totalPoints: session.pointsEarned })
  } catch (error) {
    console.error('Earn points error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getGameStats(req, res) {
  try {
    const stats = await MiniGameSession.aggregate([
      {
        $group: {
          _id: null,
          totalSessions: { $sum: 1 },
          totalPoints: { $sum: '$pointsEarned' },
          avgPoints: { $avg: '$pointsEarned' }
        }
      }
    ])

    const totalGames = await MiniGame.countDocuments()
    const activeGames = await MiniGame.countDocuments({ isActive: true })

    res.json({
      totalGames,
      activeGames,
      totalSessions: stats[0]?.totalSessions || 0,
      totalPoints: stats[0]?.totalPoints || 0,
      avgPoints: Math.round(stats[0]?.avgPoints || 0)
    })
  } catch (error) {
    console.error('Get game stats error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


