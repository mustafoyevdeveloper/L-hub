import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import path from 'path'
import { fileURLToPath } from 'url'

import { authRouter } from './routes/auth.js'
import { userRouter } from './routes/user.js'
import { roundsRouter } from './routes/rounds.js'
import { contentRouter } from './routes/content.js'
import { supportRouter } from './routes/support.js'
import { minigamesRouter } from './routes/minigames.js'
import depositRouter from './routes/deposit.routes.js'
import kycRouter from './routes/kyc.routes.js'
import adminRouter from './routes/admin.routes.js'
import rngRouter from './routes/rng.routes.js'
import bot from './bot.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8080').split(',').map(s => s.trim())
app.use(cors({ origin: corsOrigins, credentials: true }))
app.use(helmet())
app.use(express.json())
app.use(morgan('dev'))

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.get('/health', (_req, res) => res.json({ ok: true }))

// API Routes
app.use('/api/auth', authRouter)
app.use('/api', userRouter)
app.use('/api/rounds', roundsRouter)
app.use('/api', contentRouter)
app.use('/api', supportRouter)
app.use('/api', minigamesRouter)
app.use('/api', depositRouter)
app.use('/api', kycRouter)
app.use('/api', adminRouter)
app.use('/api', rngRouter)

async function start() {
  const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/lotoreya_dev'
  await mongoose.connect(mongoUrl)
  
  const port = Number(process.env.PORT || 4000)
  app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`API server listening on http://localhost:${port}`)
  })
  
  // Start Telegram bot if token is provided
  if (process.env.TELEGRAM_BOT_TOKEN) {
    console.log('Telegram bot is running')
  }
}

start().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start server', e)
  process.exit(1)
})


