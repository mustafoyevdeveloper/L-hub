import { useEffect, useState } from 'react'
import Seo from '@/components/Seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { api, endpoints } from '@/lib/api'

type Prize = {
  id: string
  type: string
  amount?: number
  currency?: string
  quantity: number
}
type Round = {
  id: string
  status: string
  startsAt: string
  endsAt?: string
  prizes: Prize[]
}

export default function ArchiveRoundsPage() {
  const [rounds, setRounds] = useState<Round[]>([])
  const [q, setQ] = useState('')

  useEffect(() => {
    (async () => {
      const data = await api<Round[]>(endpoints.rounds)
      setRounds(data.filter(r => r.status === 'COMPLETED'))
    })()
  }, [])

  const filtered = rounds.filter(r => r.id.toLowerCase().includes(q.toLowerCase()))

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Raund arxivi | FairRNG" description="Oldingi raund natijalari va g‘oliblar" />
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Raund arxivi</h1>
        <Input placeholder="ID bo‘yicha qidirish" className="w-64" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Natijalar</CardTitle>
          <CardDescription>Yakunlangan raundlar va yutuqlar</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Round ID</TableHead>
                <TableHead>Start</TableHead>
                <TableHead>End</TableHead>
                <TableHead>Prizes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((r) => (
                <TableRow key={r.id}>
                  <TableCell>#{r.id.slice(0,6)}</TableCell>
                  <TableCell>{new Date(r.startsAt).toLocaleString()}</TableCell>
                  <TableCell>{r.endsAt ? new Date(r.endsAt).toLocaleString() : '—'}</TableCell>
                  <TableCell>
                    {r.prizes.map((p) => `${p.type}${p.amount ? ` ${p.amount} ${p.currency ?? ''}` : ''} ×${p.quantity}`).join(', ')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  )
}


