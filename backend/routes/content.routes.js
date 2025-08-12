import { Router } from 'express'
import { auth } from '../middleware.js'
import { listVideos, createVideo, listNews, createNews } from '../controllers/content.controller.js'

const router = Router()

router.get('/videos', listVideos)
router.post('/videos', auth(true), createVideo)
router.get('/news', listNews)
router.post('/news', auth(true), createNews)

export default router

import { Router } from 'express'
import { listVideos, createVideo, listNews, createNews } from '../controllers/content.controller.js'
import { auth } from '../middlewares/auth.middleware.js'

const router = Router()

router.get('/videos', listVideos)
router.post('/videos', auth(true), createVideo)
router.get('/news', listNews)
router.post('/news', auth(true), createNews)

export default router

import { Router } from 'express'
import { auth } from '../middleware.js'
import { listVideos, createVideo, listNews, createNews } from '../controllers/content.controller.js'

const router = Router()
router.get('/videos', listVideos)
router.post('/videos', auth(true), createVideo)
router.get('/news', listNews)
router.post('/news', auth(true), createNews)
export default router


