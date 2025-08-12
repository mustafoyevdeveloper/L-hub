import Seo from '@/components/Seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/lib/api'

export default function PlansPage() {
  const { token } = useAuth()

  async function upgrade(type: 'STANDARD'|'VIP', price: number, currency: 'UZS'|'USD'|'RUB') {
    if (!token) return alert('Iltimos, tizimga kiring')
    try {
      await api('/api/subscriptions/upgrade', { method: 'POST', token, body: { type, price, currency } })
      alert('Obuna yangilandi')
    } catch (e: any) { alert(e.message) }
  }

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Tariflar | FairRNG" description="Standart va VIP tariflari" />
      <h1 className="text-3xl font-bold tracking-tight">Tariflar</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Standart</CardTitle>
            <CardDescription>200 000 UZS / oy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
              <li>Asosiy lotereyada qatnashish</li>
              <li>Mini-o‘yinlar uchun alohida obuna talab qilinadi</li>
            </ul>
            <Button onClick={() => upgrade('STANDARD', 200000, 'UZS')}>Obuna bo‘lish</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>VIP</CardTitle>
            <CardDescription>350 000 UZS / oy</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <ul className="list-disc ml-5 text-sm text-muted-foreground space-y-1">
              <li>Lotereya + mini-o‘yinlarga bepul kirish</li>
              <li>Ball yig‘ishda 1.5x koeffitsiyent</li>
              <li>Reyting imtiyozlari</li>
            </ul>
            <Button onClick={() => upgrade('VIP', 350000, 'UZS')}>VIPga o‘tish</Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


