import { useEffect, useState } from 'react'
import Seo from '@/components/Seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { api } from '@/lib/api'

type News = { id: string; title: string; body: string; category: 'NEWS'|'ANNOUNCEMENT'|'RULES'|'FAQ'; publishedAt: string }

export default function NewsPage() {
  const [items, setItems] = useState<News[]>([])
  useEffect(() => { (async () => { try { setItems(await api<News[]>('/api/news')) } catch {} })() }, [])

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Yangiliklar | FairRNG" description="Yangiliklar, e’lonlar va qoidalar" />
      <h1 className="text-3xl font-bold tracking-tight">Yangiliklar</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {items.map(n => (
          <Card key={n.id}>
            <CardHeader>
              <CardTitle className="text-lg">{n.title}</CardTitle>
              <CardDescription>{n.category} • {new Date(n.publishedAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{n.body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}


