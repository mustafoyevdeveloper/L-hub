import crypto from 'crypto'
import { RNGSeed, RNGLog, Round, AuditLog } from '../models.js'

export async function commitSeed(req, res) {
  try {
    const { roundId } = req.params
    const { seed } = req.body
    
    if (!seed) {
      return res.status(400).json({ error: 'Seed is required' })
    }
    
    const round = await Round.findById(roundId)
    if (!round) {
      return res.status(404).json({ error: 'Round not found' })
    }
    
    if (round.status !== 'PLANNED') {
      return res.status(400).json({ error: 'Round is not in planned status' })
    }
    
    const hash = crypto.createHash('sha256').update(seed).digest('hex')
    
    const rngSeed = await RNGSeed.create({
      roundId,
      seed,
      hash,
      committedAt: new Date()
    })
    
    await AuditLog.create({
      userId: req.user._id,
      action: 'ADMIN_ACTION',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: { action: 'RNG_SEED_COMMIT', roundId, hash }
    })
    
    res.json({ hash, committedAt: rngSeed.committedAt })
  } catch (error) {
    res.status(500).json({ error: 'Failed to commit seed' })
  }
}

export async function revealSeed(req, res) {
  try {
    const { roundId } = req.params
    
    const rngSeed = await RNGSeed.findOne({ roundId })
    if (!rngSeed) {
      return res.status(404).json({ error: 'Seed not found' })
    }
    
    if (rngSeed.revealedAt) {
      return res.status(400).json({ error: 'Seed already revealed' })
    }
    
    // Generate winning numbers using the seed
    const numbers = generateWinningNumbers(rngSeed.seed)
    const verificationHash = crypto.createHash('sha256').update(numbers).digest('hex')
    
    rngSeed.revealedAt = new Date()
    rngSeed.numbers = numbers
    rngSeed.verificationHash = verificationHash
    await rngSeed.save()
    
    // Log the RNG generation
    await RNGLog.create({
      roundId,
      seed: rngSeed.seed,
      hash: rngSeed.hash,
      numbers,
      timestamp: new Date()
    })
    
    // Update round with winning numbers
    await Round.findByIdAndUpdate(roundId, {
      winningNumbers: numbers,
      status: 'COMPLETED',
      endsAt: new Date()
    })
    
    await AuditLog.create({
      userId: req.user._id,
      action: 'ADMIN_ACTION',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: { action: 'RNG_SEED_REVEAL', roundId, numbers, verificationHash }
    })
    
    res.json({
      seed: rngSeed.seed,
      hash: rngSeed.hash,
      numbers,
      verificationHash,
      revealedAt: rngSeed.revealedAt
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to reveal seed' })
  }
}

export async function verifyRNG(req, res) {
  try {
    const { roundId } = req.params
    
    const rngSeed = await RNGSeed.findOne({ roundId })
    if (!rngSeed) {
      return res.status(404).json({ error: 'Seed not found' })
    }
    
    if (!rngSeed.revealedAt) {
      return res.status(400).json({ error: 'Seed not yet revealed' })
    }
    
    // Verify the hash matches the seed
    const expectedHash = crypto.createHash('sha256').update(rngSeed.seed).digest('hex')
    const hashValid = expectedHash === rngSeed.hash
    
    // Verify the numbers were generated from the seed
    const expectedNumbers = generateWinningNumbers(rngSeed.seed)
    const numbersValid = expectedNumbers === rngSeed.numbers
    
    // Verify the verification hash
    const expectedVerificationHash = crypto.createHash('sha256').update(rngSeed.numbers).digest('hex')
    const verificationHashValid = expectedVerificationHash === rngSeed.verificationHash
    
    res.json({
      roundId,
      seed: rngSeed.seed,
      hash: rngSeed.hash,
      numbers: rngSeed.numbers,
      verificationHash: rngSeed.verificationHash,
      verification: {
        hashValid,
        numbersValid,
        verificationHashValid,
        overallValid: hashValid && numbersValid && verificationHashValid
      },
      committedAt: rngSeed.committedAt,
      revealedAt: rngSeed.revealedAt
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to verify RNG' })
  }
}

export async function getRNGLogs(req, res) {
  try {
    const { roundId } = req.params
    
    const logs = await RNGLog.find({ roundId })
      .sort({ timestamp: -1 })
      .lean()
    
    res.json(logs)
  } catch (error) {
    res.status(500).json({ error: 'Failed to get RNG logs' })
  }
}

export async function exportRNGData(req, res) {
  try {
    const { roundId } = req.params
    const { format = 'json' } = req.query
    
    const rngSeed = await RNGSeed.findOne({ roundId })
    const logs = await RNGLog.find({ roundId }).sort({ timestamp: -1 })
    
    const data = {
      roundId,
      seed: rngSeed,
      logs
    }
    
    if (format === 'csv') {
      // Create CSV with seed and log data
      let csv = 'Type,Timestamp,Data\n'
      csv += `Seed,${rngSeed?.committedAt || ''},${rngSeed?.hash || ''}\n`
      csv += `Reveal,${rngSeed?.revealedAt || ''},${rngSeed?.numbers || ''}\n`
      
      logs.forEach(log => {
        csv += `Log,${log.timestamp},${log.hash}\n`
      })
      
      res.setHeader('Content-Type', 'text/csv')
      res.setHeader('Content-Disposition', `attachment; filename=rng_${roundId}_${Date.now()}.csv`)
      res.send(csv)
    } else {
      res.json(data)
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to export RNG data' })
  }
}

function generateWinningNumbers(seed) {
  // Simple deterministic number generation based on seed
  const hash = crypto.createHash('sha256').update(seed).digest('hex')
  const numbers = []
  
  for (let i = 0; i < 6; i++) {
    const start = i * 8
    const end = start + 8
    const hexSlice = hash.slice(start, end)
    const number = parseInt(hexSlice, 16) % 49 + 1
    numbers.push(number)
  }
  
  return numbers.sort((a, b) => a - b).join(',')
}
