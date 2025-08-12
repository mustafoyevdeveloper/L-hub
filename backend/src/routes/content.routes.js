import { Router } from 'express'
import { z } from 'zod'
import { auth } from '../middlewares/auth.middleware.js'
import Video from '../models/Video.js'
import News from '../models/News.js'

const router = Router()

router.get('/videos', async (_req, res) => {
  const videos = await Video.find().lean()
  res.json(videos)
})

router.post('/videos', auth(true), async (req, res) => {
  const schema = z.object({ title: z.string().min(3), url: z.string().url(), kind: z.enum(['LIVESTREAM','HANDOVER','INTERVIEW']), roundId: z.string().optional() })
  const data = schema.parse(req.body)
  const video = await Video.create(data)
  res.json(video)
})

router.get('/news', async (_req, res) => {
  const news = await News.find().sort({ publishedAt: -1 }).lean()
  res.json(news)
})

router.post('/news', auth(true), async (req, res) => {
  const schema = z.object({ title: z.string().min(3), body: z.string().min(3), category: z.enum(['NEWS','ANNOUNCEMENT','RULES','FAQ']) })
  const data = schema.parse(req.body)
  const item = await News.create(data)
  res.json(item)
})

export default router


