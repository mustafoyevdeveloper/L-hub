import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Seo from '@/components/Seo'
import { api } from '@/lib/api'

type Video = { id: string; title: string; url: string; kind: 'LIVESTREAM'|'HANDOVER'|'INTERVIEW'; publishedAt: string }

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  useEffect(() => { (async () => { try { setVideos(await api<Video[]>('/api/videos')) } catch {} })() }, [])

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Video arxiv | FairRNG" description="Livestream, topshirish marosimlari va intervyular" />
      <h1 className="text-3xl font-bold tracking-tight">Video arxiv</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {videos.map(v => (
          <Card key={v.id}>
            <CardHeader>
              <CardTitle className="text-lg">{v.title}</CardTitle>
              <CardDescription>{v.kind} • {new Date(v.publishedAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <a className="text-primary hover:underline" href={v.url} target="_blank" rel="noreferrer">Videoni ko‘rish</a>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}


