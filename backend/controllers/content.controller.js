import { NewsDoc, VideoDoc } from '../models.js'

export async function getNews(req, res) {
  try {
    const { category } = req.query
    const filter = category ? { category } : {}
    const news = await NewsDoc.find(filter).sort({ publishedAt: -1 }).lean()
    res.json(news)
  } catch (error) {
    console.error('Get news error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createNews(req, res) {
  try {
    const { title, body, category } = req.body
    
    if (!title || !body) {
      return res.status(400).json({ error: 'Title and body are required' })
    }

    const news = await NewsDoc.create({
      title,
      body,
      category: category || 'NEWS',
      publishedAt: new Date()
    })

    res.json(news)
  } catch (error) {
    console.error('Create news error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function getVideos(req, res) {
  try {
    const { kind } = req.query
    const filter = kind ? { kind } : {}
    const videos = await VideoDoc.find(filter).sort({ publishedAt: -1 }).lean()
    res.json(videos)
  } catch (error) {
    console.error('Get videos error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}

export async function createVideo(req, res) {
  try {
    const { title, url, kind, roundId } = req.body
    
    if (!title || !url || !kind) {
      return res.status(400).json({ error: 'Title, URL and kind are required' })
    }

    const video = await VideoDoc.create({
      title,
      url,
      kind,
      roundId,
      publishedAt: new Date()
    })

    res.json(video)
  } catch (error) {
    console.error('Create video error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
}


