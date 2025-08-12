import { Router } from 'express'
import { auth } from '../middleware.js'
import { 
  commitSeed, 
  revealSeed, 
  verifyRNG, 
  getRNGLogs, 
  exportRNGData 
} from '../controllers/rng.controller.js'

const router = Router()

// Admin RNG endpoints
router.post('/admin/rng/:roundId/commit', auth(true), commitSeed)
router.post('/admin/rng/:roundId/reveal', auth(true), revealSeed)

// Public RNG verification endpoints
router.get('/rng/:roundId/verify', verifyRNG)
router.get('/rng/:roundId/logs', getRNGLogs)
router.get('/rng/:roundId/export', exportRNGData)

export default router
