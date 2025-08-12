import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { api } from '@/lib/api'
import Seo from '@/components/Seo'
import { Video, Play, Car, Mic } from 'lucide-react'

interface Video {
  id: string
  title: string
  url: string
  kind: 'LIVESTREAM' | 'HANDOVER' | 'INTERVIEW'
  publishedAt: Date
}

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [q, setQ] = useState('')
  const [kind, setKind] = useState<'ALL'|'LIVESTREAM'|'HANDOVER'|'INTERVIEW'>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 12

  useEffect(() => { 
    (async () => { 
      setLoading(true)
      setError(null)
      try { 
        const data = await api<Video[]>(endpoints.videos)
        // Demo data for rich content
        const demoVideos: Video[] = [
          { id: '1', title: 'Round #1234 - Livestream', url: 'https://youtube.com/watch?v=demo1', kind: 'LIVESTREAM', publishedAt: new Date('2024-01-15') },
          { id: '2', title: 'Avtomobil topshirish marosimi - Chevrolet', url: 'https://youtube.com/watch?v=demo2', kind: 'HANDOVER', publishedAt: new Date('2024-01-14') },
          { id: '3', title: 'G\'olib bilan intervyu - Aziz Karimov', url: 'https://youtube.com/watch?v=demo3', kind: 'INTERVIEW', publishedAt: new Date('2024-01-13') },
          { id: '4', title: 'Round #1233 - Livestream', url: 'https://youtube.com/watch?v=demo4', kind: 'LIVESTREAM', publishedAt: new Date('2024-01-12') },
          { id: '5', title: 'Avtomobil topshirish marosimi - Toyota', url: 'https://youtube.com/watch?v=demo5', kind: 'HANDOVER', publishedAt: new Date('2024-01-11') },
          { id: '6', title: 'G\'olib bilan intervyu - Malika Yusupova', url: 'https://youtube.com/watch?v=demo6', kind: 'INTERVIEW', publishedAt: new Date('2024-01-10') },
          { id: '7', title: 'Round #1232 - Livestream', url: 'https://youtube.com/watch?v=demo7', kind: 'LIVESTREAM', publishedAt: new Date('2024-01-09') },
          { id: '8', title: 'Avtomobil topshirish marosimi - Hyundai', url: 'https://youtube.com/watch?v=demo8', kind: 'HANDOVER', publishedAt: new Date('2024-01-08') },
          { id: '9', title: 'G\'olib bilan intervyu - Rustam Toshmatov', url: 'https://youtube.com/watch?v=demo9', kind: 'INTERVIEW', publishedAt: new Date('2024-01-07') },
          { id: '10', title: 'Round #1231 - Livestream', url: 'https://youtube.com/watch?v=demo10', kind: 'LIVESTREAM', publishedAt: new Date('2024-01-06') },
          { id: '11', title: 'Avtomobil topshirish marosimi - Kia', url: 'https://youtube.com/watch?v=demo11', kind: 'HANDOVER', publishedAt: new Date('2024-01-05') },
          { id: '12', title: 'G\'olib bilan intervyu - Dilfuza Karimova', url: 'https://youtube.com/watch?v=demo12', kind: 'INTERVIEW', publishedAt: new Date('2024-01-04') },
        ]
        setVideos([...data, ...demoVideos])
      } catch (e: any) {
        setError(e.message || 'Server bilan ulanishda xato')
      } finally {
        setLoading(false)
      }
    })() 
  }, [])

  const filtered = useMemo(() => videos.filter(v =>
    v.title.toLowerCase().includes(q.toLowerCase()) && (kind === 'ALL' || v.kind === kind)
  ), [videos, q, kind])

  const paged = useMemo(() => filtered.slice(0, page * pageSize), [filtered, page])

  const stats = useMemo(() => ({
    total: videos.length,
    livestreams: videos.filter(v => v.kind === 'LIVESTREAM').length,
    handovers: videos.filter(v => v.kind === 'HANDOVER').length,
    interviews: videos.filter(v => v.kind === 'INTERVIEW').length,
  }), [videos])

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Video arxiv | FairRNG" description="Livestream, topshirish marosimlari va intervyular" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Video arxiv</h1>
        <p className="text-muted-foreground">Barcha livestream yozuvlari, avtomobil topshirish marosimlari va g'oliblar bilan intervyular</p>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input className="h-10" placeholder="Qidirish..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={kind} onValueChange={(value) => setKind(value as any)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Video turi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barcha turlar</SelectItem>
              <SelectItem value="LIVESTREAM">Livestream</SelectItem>
              <SelectItem value="HANDOVER">Topshirish</SelectItem>
              <SelectItem value="INTERVIEW">Intervyu</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami videolar</CardTitle>
            <Video className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Livestreamlar</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.livestreams}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Topshirishlar</CardTitle>
            <Car className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.handovers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Intervyular</CardTitle>
            <Mic className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.interviews}</div>
          </CardContent>
        </Card>
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-md border bg-muted/30 p-6 text-center text-sm text-muted-foreground">Video topilmadi. Filtrlarni o'zgartiring.</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paged.map(v => (
              <Card key={v.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    {v.kind === 'LIVESTREAM' && <Play className="h-4 w-4 text-red-500" />}
                    {v.kind === 'HANDOVER' && <Car className="h-4 w-4 text-blue-500" />}
                    {v.kind === 'INTERVIEW' && <Mic className="h-4 w-4 text-green-500" />}
                    <CardTitle className="text-lg">{v.title}</CardTitle>
                  </div>
                  <CardDescription>
                    {v.kind === 'LIVESTREAM' && 'Livestream'}
                    {v.kind === 'HANDOVER' && 'Topshirish marosimi'}
                    {v.kind === 'INTERVIEW' && 'Intervyu'}
                    {' • '}{new Date(v.publishedAt).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="outline" className="w-full">
                    <a href={v.url} target="_blank" rel="noreferrer">
                      <Play className="mr-2 h-4 w-4" />
                      Videoni ko'rish
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {paged.length < filtered.length && (
            <div className="flex justify-center">
              <Button onClick={() => setPage(p => p + 1)} variant="outline">
                Yana yuklash ({filtered.length - paged.length} ta qoldi)
              </Button>
            </div>
          )}
        </>
      )}
    </main>
  )
}


