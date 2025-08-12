import { useEffect, useMemo, useState } from 'react'
import Seo from '@/components/Seo'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { api, endpoints } from '@/lib/api'
import { Select } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Skeleton } from '@/components/ui/skeleton'

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
  const [prizeFilter, setPrizeFilter] = useState<string>('ALL')
  const [from, setFrom] = useState<string>('')
  const [to, setTo] = useState<string>('')
  const [page, setPage] = useState(1)
  const pageSize = 10
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState<Round | null>(null)

  useEffect(() => {
    (async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await api<Round[]>(endpoints.rounds)
        let list = data.filter(r => r.status === 'COMPLETED')
        if (list.length < 12) {
          const dup: Round[] = []
          for (let i = 0; i < 3; i++) dup.push(...list.map(r => ({ ...r, id: r.id + '-' + i })))
          list = dup
        }
        setRounds(list)
      } catch (e: any) {
        setError(e.message || 'Server bilan ulanishda xato')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  const filtered = useMemo(() => {
    let list = rounds.filter(r => r.id.toLowerCase().includes(q.toLowerCase()))
    if (from) list = list.filter(r => new Date(r.startsAt) >= new Date(from))
    if (to) list = list.filter(r => r.endsAt ? new Date(r.endsAt) <= new Date(to) : true)
    if (prizeFilter !== 'ALL') {
      list = list.filter(r => r.prizes.some(p => p.type === prizeFilter))
    }
    return list
  }, [rounds, q, from, to, prizeFilter])

  const paged = useMemo(() => filtered.slice(0, page * pageSize), [filtered, page])

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Raund arxivi | FairRNG" description="Oldingi raund natijalari va g‘oliblar" />
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Raund arxivi</h1>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input placeholder="ID bo‘yicha qidirish" value={q} onChange={(e) => setQ(e.target.value)} />
          <select className="h-10 rounded-md border px-3" value={prizeFilter} onChange={(e) => setPrizeFilter(e.target.value)}>
            <option value="ALL">Barcha yutuq turlari</option>
            <option value="CAR">Avtomobil</option>
            <option value="CASH">Naqd (USD/UZS)</option>
            <option value="RUB_CASH">Naqd (RUB)</option>
            <option value="FREE_TICKET">Bepul chipta</option>
            <option value="POINTS">Ball</option>
          </select>
          <input type="date" className="h-10 rounded-md border px-3" value={from} onChange={(e) => setFrom(e.target.value)} />
          <input type="date" className="h-10 rounded-md border px-3" value={to} onChange={(e) => setTo(e.target.value)} />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader><CardTitle>Yakunlangan</CardTitle><CardDescription>Jami raundlar</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-bold">{filtered.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>O‘rtacha sovrin</CardTitle><CardDescription>Naqd pul (demo)</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-bold">$2,450</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>G‘oliblar</CardTitle><CardDescription>Har raund o‘rtacha</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-bold">90</div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Max ishtirokchilar</CardTitle><CardDescription>Cheklov</CardDescription></CardHeader>
          <CardContent><div className="text-3xl font-bold">5,000</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Natijalar</CardTitle>
          <CardDescription>Yakunlangan raundlar va yutuqlar</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="grid grid-cols-4 gap-2">
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                  <Skeleton className="h-6" />
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm">{error}</div>
          ) : filtered.length === 0 ? (
            <div className="rounded-md border bg-muted/30 p-6 text-center text-sm text-muted-foreground">Natija topilmadi. Filtrlarni o‘zgartiring.</div>
          ) : (
            <>
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
                  {paged.map((r) => (
                    <TableRow key={r.id} className="cursor-pointer" onClick={() => { setSelected(r); setOpen(true); }}>
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
              {paged.length < filtered.length && (
                <div className="mt-4 flex justify-center">
                  <button onClick={() => setPage(p => p + 1)} className="rounded-md border px-4 py-2 text-sm hover:bg-accent">Yana yuklash</button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Round details modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Round tafsilotlari</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-3">
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <div className="text-xs text-muted-foreground">Round ID</div>
                  <div className="font-mono">{selected.id}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Holat</div>
                  <div>{selected.status}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Boshlanish</div>
                  <div>{new Date(selected.startsAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Yakunlash</div>
                  <div>{selected.endsAt ? new Date(selected.endsAt).toLocaleString() : '—'}</div>
                </div>
              </div>
              <div>
                <div className="text-xs text-muted-foreground">Yutuqlar</div>
                <ul className="list-disc ml-5 text-sm">
                  {selected.prizes.map((p) => (
                    <li key={p.id}>{p.type}{p.amount ? ` ${p.amount} ${p.currency ?? ''}` : ''} ×{p.quantity}</li>
                  ))}
                </ul>
              </div>
              <div className="text-xs text-muted-foreground">G‘oliblar va ishtirokchilar ro‘yxati tez orada qo‘shiladi.</div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}


