import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api, endpoints } from '@/lib/api'
import Seo from '@/components/Seo'
import { 
  Hash, 
  Eye, 
  Download, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Shield,
  FileText,
  Search
} from 'lucide-react'

interface RNGSeed {
  id: string
  roundId: string
  hash: string
  committedAt: string
  revealedAt?: string
  seed: string
  status: 'COMMITTED' | 'REVEALED' | 'VERIFIED'
}

interface RNGLog {
  id: string
  roundId: string
  operation: 'COMMIT' | 'REVEAL' | 'VERIFY'
  timestamp: string
  details: string
  adminId: string
}

export default function RNGVerificationPage() {
  const [roundId, setRoundId] = useState('')
  const [seeds, setSeeds] = useState<RNGSeed[]>([])
  const [logs, setLogs] = useState<RNGLog[]>([])
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(false)

  const verifyRNG = async () => {
    if (!roundId) return

    try {
      setVerifying(true)
      const data = await api<any>(endpoints.verifyRNG(roundId))
      alert('RNG muvaffaqiyatli tekshirildi!')
      
      // Refresh data
      fetchRNGData()
    } catch (error: any) {
      alert('Xatolik: ' + error.message)
    } finally {
      setVerifying(false)
    }
  }

  const fetchRNGData = async () => {
    if (!roundId) return

    try {
      setLoading(true)
      const [seedsData, logsData] = await Promise.all([
        api<RNGSeed[]>(endpoints.rngLogs(roundId)),
        api<RNGLog[]>(endpoints.rngLogs(roundId))
      ])
      setSeeds(seedsData)
      setLogs(logsData)
    } catch (error) {
      console.error('RNG data fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const exportRNGData = async () => {
    if (!roundId) return

    try {
      const data = await api<any>(endpoints.exportRNGData(roundId))
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rng-data-${roundId}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (error: any) {
      alert('Eksport xatosi: ' + error.message)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'bg-green-500'
      case 'REVEALED': return 'bg-blue-500'
      case 'COMMITTED': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED': return 'Tasdiqlangan'
      case 'REVEALED': return 'Ochilgan'
      case 'COMMITTED': return 'Saqlangan'
      default: return 'Noma\'lum'
    }
  }

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="RNG Verifikatsiya | FairRNG" description="Random Number Generator verifikatsiya va audit" />
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">RNG Verifikatsiya</h1>
        <p className="text-muted-foreground">
          Random Number Generator natijalarini tekshirish va audit qilish
        </p>
      </div>

      {/* Round ID Input */}
      <Card>
        <CardHeader>
          <CardTitle>Raund ID</CardTitle>
          <CardDescription>
            Tekshirish uchun raund ID ni kiriting
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Raund ID (masalan: 1234)"
              value={roundId}
              onChange={(e) => setRoundId(e.target.value)}
            />
            <Button onClick={fetchRNGData} disabled={!roundId || loading}>
              {loading ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Yuklanmoqda...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Qidirish
                </>
              )}
            </Button>
            <Button onClick={verifyRNG} disabled={!roundId || verifying} variant="outline">
              {verifying ? (
                <>
                  <Clock className="mr-2 h-4 w-4 animate-spin" />
                  Tekshirilmoqda...
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Tekshirish
                </>
              )}
            </Button>
            <Button onClick={exportRNGData} disabled={!roundId} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Eksport
            </Button>
          </div>
        </CardContent>
      </Card>

      {roundId && (
        <Tabs defaultValue="seeds" className="space-y-4">
          <TabsList>
            <TabsTrigger value="seeds">RNG Seeds</TabsTrigger>
            <TabsTrigger value="logs">Audit Loglari</TabsTrigger>
            <TabsTrigger value="info">Ma'lumot</TabsTrigger>
          </TabsList>

          <TabsContent value="seeds" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RNG Seeds</CardTitle>
                <CardDescription>
                  Raund uchun saqlangan va ochilgan RNG seedlar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {seeds.length ? (
                  <div className="space-y-4">
                    {seeds.map((seed) => (
                      <div key={seed.id} className="p-4 border rounded-lg space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Hash className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Seed #{seed.id}</span>
                          </div>
                          <Badge className={getStatusColor(seed.status)}>
                            {getStatusText(seed.status)}
                          </Badge>
                        </div>
                        
                        <div className="grid gap-2 text-sm">
                          <div>
                            <span className="font-medium">Hash:</span>
                            <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                              {seed.hash}
                            </code>
                          </div>
                          
                          {seed.seed && (
                            <div>
                              <span className="font-medium">Seed:</span>
                              <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                {seed.seed}
                              </code>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4 text-xs text-muted-foreground">
                            <div>
                              <span>Saqlangan:</span>
                              <div>{new Date(seed.committedAt).toLocaleString()}</div>
                            </div>
                            {seed.revealedAt && (
                              <div>
                                <span>Ochilgan:</span>
                                <div>{new Date(seed.revealedAt).toLocaleString()}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Bu raund uchun RNG seedlar topilmadi
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Audit Loglari</CardTitle>
                <CardDescription>
                  RNG operatsiyalari bo'yicha batafsil loglar
                </CardDescription>
              </CardHeader>
              <CardContent>
                {logs.length ? (
                  <div className="space-y-4">
                    {logs.map((log) => (
                      <div key={log.id} className="p-4 border rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{log.operation}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                        
                        <div className="text-sm">
                          <div><span className="font-medium">Admin ID:</span> {log.adminId}</div>
                          <div><span className="font-medium">Tafsilot:</span> {log.details}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Bu raund uchun audit loglari topilmadi
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="info" className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Xavfsizlik</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    RNG natijalari CSPRNG algoritmi orqali yaratiladi va hash orqali tekshiriladi.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="h-5 w-5" />
                    <span>Shaffoflik</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Barcha RNG operatsiyalari audit uchun saqlanadi va eksport qilish mumkin.
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>RNG Jarayoni</CardTitle>
                <CardDescription>
                  Random Number Generator qanday ishlaydi
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">1. Seed Saqlash (Commit)</h4>
                  <p className="text-sm text-muted-foreground">
                    Admin har raund uchun random seed yaratadi va uni hash qilib ommaga e'lon qiladi.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">2. Seed Ochish (Reveal)</h4>
                  <p className="text-sm text-muted-foreground">
                    Raund tugagach, admin seed ni ochadi va hash bilan tekshiriladi.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-medium">3. Verifikatsiya</h4>
                  <p className="text-sm text-muted-foreground">
                    Seed hash bilan tekshiriladi va natijalar audit loglarida saqlanadi.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </main>
  )
}
