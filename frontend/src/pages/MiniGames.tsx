import { useState } from 'react'
import Seo from '@/components/Seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { api } from '@/lib/api'

export default function MiniGamesPage() {
  const { token } = useAuth()
  const [status, setStatus] = useState<string | null>(null)

  async function earn(points: number) {
    if (!token) return setStatus('Iltimos, tizimga kiring')
    try {
      await api('/api/minigame/sessions', { method: 'POST', token, body: { miniGameId: 'demo', points } })
      setStatus('Ball qo‘shildi')
    } catch (e: any) { setStatus(e.message) }
  }

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Mini-o‘yinlar | FairRNG" description="Obuna asosidagi mini-o‘yinlar va ball yig‘ish" />
      <h1 className="text-3xl font-bold tracking-tight">Mini-o‘yinlar</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Clicker</CardTitle>
            <CardDescription>Soddalashtirilgan demo</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button onClick={() => earn(1)}>1 ball olish</Button>
            {status && <div className="text-sm text-muted-foreground">{status}</div>}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}


