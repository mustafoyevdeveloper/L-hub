import { useState } from 'react'
import Seo from '@/components/Seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/use-auth'
import { api, endpoints } from '@/lib/api'

export default function SupportPage() {
  const { token } = useAuth()
  const [subject, setSubject] = useState('')
  const [status, setStatus] = useState<string | null>(null)

  async function submit() {
    if (!token) return setStatus('Iltimos, tizimga kiring')
    try {
      await api(endpoints.supportTickets, { method: 'POST', token, body: { subject } })
      setStatus('Ariza yaratildi')
      setSubject('')
    } catch (e: any) {
      setStatus(e.message)
    }
  }

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Qo‘llab-quvvatlash | FairRNG" description="Support ariza yaratish va kuzatish" />
      <h1 className="text-3xl font-bold tracking-tight">Qo‘llab-quvvatlash</h1>
      <Card>
        <CardHeader>
          <CardTitle>Yangi ariza</CardTitle>
          <CardDescription>Savol yoki muammoni qisqacha yozing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Masalan: To‘lov qaytmayapti" value={subject} onChange={(e) => setSubject(e.target.value)} />
          <Button onClick={submit}>Yuborish</Button>
          {status && <div className="text-sm text-muted-foreground">{status}</div>}
        </CardContent>
      </Card>
    </main>
  )
}


