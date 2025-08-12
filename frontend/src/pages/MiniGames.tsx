import { useState, useEffect, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Progress } from '@/components/ui/progress'
import { api } from '@/lib/api'
import Seo from '@/components/Seo'
import { Gamepad2, Trophy, Star, Zap, Users, Clock, Target, Coins } from 'lucide-react'

interface MiniGame {
  id: string
  title: string
  description: string
  type: 'SLOT' | 'MEMORY' | 'WHEEL' | 'PUZZLE' | 'QUIZ' | 'ARCADE'
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  pointsReward: number
  maxPlayers: number
  currentPlayers: number
  isActive: boolean
  startsAt: Date
  endsAt: Date
  subscriptionRequired: boolean
  image: string
}

export default function MiniGamesPage() {
  const [games, setGames] = useState<MiniGame[]>([])
  const [q, setQ] = useState('')
  const [type, setType] = useState<'ALL'|'SLOT'|'MEMORY'|'WHEEL'|'PUZZLE'|'QUIZ'|'ARCADE'>('ALL')
  const [difficulty, setDifficulty] = useState<'ALL'|'EASY'|'MEDIUM'|'HARD'>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { 
    (async () => { 
      setLoading(true)
      setError(null)
      try { 
        const data = await api<MiniGame[]>('/api/minigames')
        // Demo data for rich content
        const demoGames: MiniGame[] = [
          {
            id: '1',
            title: 'Slot Machine',
            description: 'Klassik slot mashina o\'yini. 3 ta bir xil belgi tushganda yutadi. VIP obunachilar uchun bepul.',
            type: 'SLOT',
            difficulty: 'EASY',
            pointsReward: 50,
            maxPlayers: 100,
            currentPlayers: 23,
            isActive: true,
            startsAt: new Date('2024-01-16T10:00:00'),
            endsAt: new Date('2024-01-16T18:00:00'),
            subscriptionRequired: true,
            image: '/api/placeholder/300/200'
          },
          {
            id: '2',
            title: 'Memory Game',
            description: 'Karta juftlarini topish o\'yini. Xotira va tezlikni sinab ko\'ring. Eng yaxshi natija uchun bonus ballar.',
            type: 'MEMORY',
            difficulty: 'MEDIUM',
            pointsReward: 75,
            maxPlayers: 50,
            currentPlayers: 15,
            isActive: true,
            startsAt: new Date('2024-01-16T12:00:00'),
            endsAt: new Date('2024-01-16T20:00:00'),
            subscriptionRequired: true,
            image: '/api/placeholder/300/200'
          },
          {
            id: '3',
            title: 'Lucky Wheel',
            description: 'Omad g\'ildiragi. Har bir aylanishda yutuq yoki ball olish imkoniyati. Eng katta yutuq: 1000 ball.',
            type: 'WHEEL',
            difficulty: 'EASY',
            pointsReward: 25,
            maxPlayers: 200,
            currentPlayers: 89,
            isActive: true,
            startsAt: new Date('2024-01-16T09:00:00'),
            endsAt: new Date('2024-01-16T21:00:00'),
            subscriptionRequired: false,
            image: '/api/placeholder/300/200'
          },
          {
            id: '4',
            title: 'Puzzle Challenge',
            description: 'Rasmlarni to\'g\'ri joylashtirish. Qiyinlik darajasi ortib boradi. Eng tez hal qilgan uchun maxsus yutuq.',
            type: 'PUZZLE',
            difficulty: 'HARD',
            pointsReward: 100,
            maxPlayers: 30,
            currentPlayers: 8,
            isActive: true,
            startsAt: new Date('2024-01-16T14:00:00'),
            endsAt: new Date('2024-01-16T22:00:00'),
            subscriptionRequired: true,
            image: '/api/placeholder/300/200'
          },
          {
            id: '5',
            title: 'Quiz Master',
            description: 'Bilim va tezlik sinovi. Turli mavzulardagi savollar. Har to\'g\'ri javob uchun ball.',
            type: 'QUIZ',
            difficulty: 'MEDIUM',
            pointsReward: 60,
            maxPlayers: 80,
            currentPlayers: 34,
            isActive: true,
            startsAt: new Date('2024-01-16T11:00:00'),
            endsAt: new Date('2024-01-16T19:00:00'),
            subscriptionRequired: false,
            image: '/api/placeholder/300/200'
          },
          {
            id: '6',
            title: 'Arcade Runner',
            description: 'Klassik arcade o\'yini. To\'siqlardan sakrab, ballar yig\'ing. Eng uzoq masofa uchun bonus.',
            type: 'ARCADE',
            difficulty: 'HARD',
            pointsReward: 80,
            maxPlayers: 60,
            currentPlayers: 12,
            isActive: true,
            startsAt: new Date('2024-01-16T13:00:00'),
            endsAt: new Date('2024-01-16T23:00:00'),
            subscriptionRequired: true,
            image: '/api/placeholder/300/200'
          }
        ]
        setGames([...data, ...demoGames])
      } catch (e: any) {
        setError(e.message || 'Server bilan ulanishda xato')
      } finally {
        setLoading(false)
      }
    })() 
  }, [])

  const filtered = useMemo(() => games.filter(g =>
    (type === 'ALL' || g.type === type) && 
    (difficulty === 'ALL' || g.difficulty === difficulty) &&
    (g.title.toLowerCase().includes(q.toLowerCase()) || g.description.toLowerCase().includes(q.toLowerCase()))
  ), [games, q, type, difficulty])

  const stats = useMemo(() => ({
    total: games.length,
    active: games.filter(g => g.isActive).length,
    totalPlayers: games.reduce((sum, g) => sum + g.currentPlayers, 0),
    totalRewards: games.reduce((sum, g) => sum + g.pointsReward, 0),
  }), [games])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'SLOT': return <Gamepad2 className="h-4 w-4" />
      case 'MEMORY': return <Target className="h-4 w-4" />
      case 'WHEEL': return <Zap className="h-4 w-4" />
      case 'PUZZLE': return <Star className="h-4 w-4" />
      case 'QUIZ': return <Users className="h-4 w-4" />
      case 'ARCADE': return <Trophy className="h-4 w-4" />
      default: return <Gamepad2 className="h-4 w-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'EASY': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'HARD': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const handlePlayGame = (gameId: string) => {
    // TODO: Implement game launch logic
    console.log('Playing game:', gameId)
  }

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="Mini-o'yinlar | FairRNG" description="Obuna asosidagi mini-o'yinlar va ball yig'ish" />
      
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Mini-o'yinlar</h1>
        <p className="text-muted-foreground">Ball yig'ish va qiziqarli o'yinlar. VIP obunachilar uchun barcha o'yinlar bepul.</p>
        
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Input className="h-10" placeholder="O'yin qidirish..." value={q} onChange={(e) => setQ(e.target.value)} />
          <Select value={type} onValueChange={(value) => setType(value as any)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="O'yin turi" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barcha turlar</SelectItem>
              <SelectItem value="SLOT">Slot</SelectItem>
              <SelectItem value="MEMORY">Memory</SelectItem>
              <SelectItem value="WHEEL">Wheel</SelectItem>
              <SelectItem value="PUZZLE">Puzzle</SelectItem>
              <SelectItem value="QUIZ">Quiz</SelectItem>
              <SelectItem value="ARCADE">Arcade</SelectItem>
            </SelectContent>
          </Select>
          <Select value={difficulty} onValueChange={(value) => setDifficulty(value as any)}>
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Qiyinlik" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">Barcha</SelectItem>
              <SelectItem value="EASY">Oson</SelectItem>
              <SelectItem value="MEDIUM">O'rtacha</SelectItem>
              <SelectItem value="HARD">Qiyin</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami o'yinlar</CardTitle>
            <Gamepad2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faol o'yinlar</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami o'yinchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPlayers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami yutuqlar</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRewards}</div>
          </CardContent>
        </Card>
      </div>

      {/* Games Grid */}
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
        <div className="rounded-md border bg-muted/30 p-6 text-center text-sm text-muted-foreground">O'yin topilmadi. Filtrlarni o'zgartiring.</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(game => (
            <Card key={game.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(game.type)}
                    <CardTitle className="text-lg">{game.title}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(game.difficulty)}>
                    {game.difficulty === 'EASY' && 'Oson'}
                    {game.difficulty === 'MEDIUM' && 'O\'rtacha'}
                    {game.difficulty === 'HARD' && 'Qiyin'}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">{game.description}</CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Game Stats */}
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3 text-yellow-500" />
                    <span>{game.pointsReward} ball</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3 text-blue-500" />
                    <span>{game.currentPlayers}/{game.maxPlayers}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>O'yinchilar</span>
                    <span>{Math.round((game.currentPlayers / game.maxPlayers) * 100)}%</span>
                  </div>
                  <Progress value={(game.currentPlayers / game.maxPlayers) * 100} className="h-2" />
                </div>

                {/* Time Info */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    {new Date(game.startsAt).toLocaleTimeString()} - {new Date(game.endsAt).toLocaleTimeString()}
                  </span>
                </div>

                {/* Play Button */}
                <Button 
                  className="w-full" 
                  onClick={() => handlePlayGame(game.id)}
                  disabled={!game.isActive}
                >
                  {game.isActive ? (
                    <>
                      <Gamepad2 className="mr-2 h-4 w-4" />
                      O'ynash
                    </>
                  ) : (
                    <>
                      <Clock className="mr-2 h-4 w-4" />
                      Kutilmoqda
                    </>
                  )}
                </Button>

                {game.subscriptionRequired && (
                  <div className="text-xs text-orange-600 flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    VIP obuna talab qilinadi
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Info Section */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Ball yig'ish tizimi</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h4 className="font-semibold mb-2">Standart foydalanuvchilar</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 1x ball koeffitsiyent</li>
                <li>• Cheklangan o'yinlar</li>
                <li>• Standart yutuqlar</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">VIP obunachilar</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 1.5x ball koeffitsiyent</li>
                <li>• Barcha o'yinlar bepul</li>
                <li>• Maxsus yutuqlar</li>
                <li>• Eksklyuziv kontent</li>
              </ul>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            <strong>Ballar</strong> chipta yoki chegirmaga almashtiriladi. 1 ball = 1 UZS ekvivalenti.
          </div>
        </CardContent>
      </Card>
    </main>
  )
}


