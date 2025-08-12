import { Router } from 'express'
import { auth } from '../middleware.js'
import { getNews, createNews, getVideos, createVideo } from '../controllers/content.controller.js'

const router = Router()

// Public routes
router.get('/news', getNews)
router.get('/videos', getVideos)

// Admin routes
router.post('/news', auth(true), createNews)
router.post('/videos', auth(true), createVideo)

export { router as contentRouter }


