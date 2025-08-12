import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { api, endpoints } from '@/lib/api'
import Seo from '@/components/Seo'
import { Newspaper, Megaphone, FileText, HelpCircle, Calendar, Clock } from 'lucide-react'

interface News {
  id: string
  title: string
  body: string
  category: 'NEWS' | 'ANNOUNCEMENT' | 'RULES' | 'FAQ'
  publishedAt: Date
}

export default function NewsPage() {
  const [items, setItems] = useState<News[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState<'ALL'|'NEWS'|'ANNOUNCEMENT'|'RULES'|'FAQ'>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const pageSize = 9

  useEffect(() => { 
    (async () => { 
      setLoading(true)
      setError(null)
      try { 
        const data = await api<News[]>(endpoints.news)
        // Demo data for rich content
        const demoNews: News[] = [
          { id: '1', title: 'Yangi raund boshlanmoqda!', body: 'Round #1235 2024-yil 20-yanvar kuni soat 18:00 da boshlanadi. Entry fee: 50,000 UZS. Maksimal ishtirokchilar: 5,000 kishi.', category: 'ANNOUNCEMENT', publishedAt: new Date('2024-01-16') },
          { id: '2', title: 'G\'oliblar ro\'yxati e\'lon qilindi', body: 'Round #1234 yakunlandi. 90 ta g\'olib aniqlanildi. Avtomobil g\'olibi: Aziz Karimov. Barcha g\'oliblar ro\'yxati arxivda ko\'rinadi.', category: 'NEWS', publishedAt: new Date('2024-01-15') },
          { id: '3', title: 'O\'yin qoidalari yangilandi', body: 'Yangi qoidalar kuchga kirdi. KYC jarayoni majburiy bo\'ldi. To\'lov usullari kengaytirildi. Batafsil ma\'lumot uchun qoidalar bo\'limiga o\'ting.', category: 'RULES', publishedAt: new Date('2024-01-14') },
          { id: '4', title: 'VIP tarif yangi imkoniyatlar', body: 'VIP obunachilar uchun yangi imkoniyatlar: 1.5x ball koeffitsiyent, bepul mini-o\'yinlar, maxsus support. 350,000 UZS oyiga.', category: 'ANNOUNCEMENT', publishedAt: new Date('2024-01-13') },
          { id: '5', title: 'To\'lov tizimi yangilandi', body: 'PCI-DSS sertifikati olingan. Yangi to\'lov usullari qo\'shildi: crypto, mobile money. Xavfsizlik kuchaytirildi.', category: 'NEWS', publishedAt: new Date('2024-01-12') },
          { id: '6', title: 'Tez-tez so\'raladigan savollar', body: 'Q: KYC jarayoni qancha vaqt oladi? A: 24 soat ichida. Q: Pul yechish qancha vaqt oladi? A: 1-3 ish kuni. Q: Raund qachon yakunlanadi? A: 5000 ishtirokchi yoki vaqt tugaganda.', category: 'FAQ', publishedAt: new Date('2024-01-11') },
          { id: '7', title: 'Mini-o\'yinlar qo\'shildi', body: 'Yangi mini-o\'yinlar: Slot machine, Memory game, Lucky wheel. VIP obunachilar uchun bepul. Ballar yig\'ish imkoniyati.', category: 'ANNOUNCEMENT', publishedAt: new Date('2024-01-10') },
          { id: '8', title: 'Telegram bot yangilandi', body: 'Yangi xususiyatlar: avtomatik bildirishnomalar, support ticket yaratish, balans tekshirish. @fairrng_bot', category: 'NEWS', publishedAt: new Date('2024-01-09') },
          { id: '9', title: 'Xavfsizlik yangilanishlari', body: '2FA qo\'shildi. Rate limiting kuchaytirildi. CAPTCHA qo\'shildi. Audit loglar kengaytirildi. RNG verifikatsiya osonlashtirildi.', category: 'RULES', publishedAt: new Date('2024-01-08') },
          { id: '10', title: 'Mobil ilova ishga tushdi', body: 'iOS va Android uchun mobil ilova chiqdi. Barcha funksiyalar mavjud. Push bildirishnomalar. Offline rejim.', category: 'ANNOUNCEMENT', publishedAt: new Date('2024-01-07') },
          { id: '11', title: 'Statistikalar yangilandi', body: 'Yangi dashboard: real-time statistikalar, grafiklar, eksport imkoniyati. Admin panel kengaytirildi.', category: 'NEWS', publishedAt: new Date('2024-01-06') },
          { id: '12', title: 'Yutuqlar haqida ma\'lumot', body: 'Avtomobillar: rasmiy shartnoma, sug\'urta, ro\'yxatga olish. Naqd pul: bank o\'tkazma, 1-3 kun. Bepul chiptalar: avtomatik yoziladi.', category: 'FAQ', publishedAt: new Date('2024-01-05') },
        ]
        setItems([...data, ...demoNews])
      } catch (e: any) {
        setError(e.message || 'Server bilan ulanishda xato')
      } finally {
        setLoading(false)
      }
    })() 
  }, [])

  const filtered = useMemo(() => items.filter(n =>
    (cat === 'ALL' || n.category === cat) && (n.title.toLowerCase().includes(q.toLowerCase()) || n.body.toLowerCase().includes(q.toLowerCase()))
  ), [items, q, cat])

  const paged = useMemo(() => filtered.slice(0, page * pageSize), [filtered, page])

  const stats = useMemo(() => ({
    total: items.length,
    news: items.filter(n => n.category === 'NEWS').length,
    announcements: items.filter(n => n.category === 'ANNOUNCEMENT').length,
    rules: items.filter(n => n.category === 'RULES').length,
    faq: items.filter(n => n.category === 'FAQ').length,
  }), [items])

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'NEWS': return <Newspaper className="h-4 w-4" />
      case 'ANNOUNCEMENT': return <Megaphone className="h-4 w-4" />
      case 'RULES': return <FileText className="h-4 w-4" />
      case 'FAQ': return <HelpCircle className="h-4 w-4" />
      default: return <Newspaper className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'NEWS': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'ANNOUNCEMENT': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'RULES': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'FAQ': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Yangiliklar | FairRNG" description="Yangiliklar, e'lonlar va qoidalar" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Yangiliklar</h1>
        <p className="text-muted-foreground">Yangi raundlar, e'lonlar, qoidalar va tez-tez so'raladigan savollar</p>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input className="h-10" placeholder="Qidirish..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={cat} onValueChange={(value) => setCat(value as any)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Kategoriya" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barchasi</SelectItem>
              <SelectItem value="NEWS">Yangilik</SelectItem>
              <SelectItem value="ANNOUNCEMENT">E'lon</SelectItem>
              <SelectItem value="RULES">Qoidalar</SelectItem>
              <SelectItem value="FAQ">FAQ</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Yangiliklar</CardTitle>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.news}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E'lonlar</CardTitle>
            <Megaphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.announcements}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Qoidalar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rules}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">FAQ</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.faq}</div>
          </CardContent>
        </Card>
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-md border bg-muted/30 p-6 text-center text-sm text-muted-foreground">Yangilik topilmadi. Filtrlarni o'zgartiring.</div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {paged.map(item => (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg flex-1">{item.title}</CardTitle>
                    <Badge className={getCategoryColor(item.category)}>
                      {getCategoryIcon(item.category)}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-3 w-3" />
                    {new Date(item.publishedAt).toLocaleDateString()}
                    <Clock className="h-3 w-3" />
                    {new Date(item.publishedAt).toLocaleTimeString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3">{item.body}</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Batafsil o'qish
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


