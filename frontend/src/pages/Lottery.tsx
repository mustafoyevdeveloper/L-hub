import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import Seo from "@/components/Seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Clock, 
  DollarSign, 
  Ticket, 
  Zap, 
  Star,
  Trophy,
  Shuffle,
  Plus,
  Minus
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { api, endpoints } from "@/lib/api";

type Prize = {
  id: string
  type: "CAR" | "CASH" | "RUB_CASH" | "FREE_TICKET" | "POINTS"
  amount?: number
  currency?: "UZS" | "USD" | "RUB"
  quantity: number
}

type Round = {
  id: string
  status: "PLANNED" | "ACTIVE" | "COMPLETED"
  maxPlayers: number
  entryFee: number
  currency: "UZS" | "USD" | "RUB"
  startsAt: string
  endsAt?: string | null
  tickets?: any[]
  prizes: Prize[]
}

const Lottery = () => {
  const { t } = useI18n();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [ticketCount, setTicketCount] = useState(1);
  const [quickPick, setQuickPick] = useState(false);
  const { token } = useAuth();

  const [rounds, setRounds] = useState<Round[]>([])
  const [currentRound, setCurrentRound] = useState<Round | null>(null)
  const [ticketsSold, setTicketsSold] = useState<number>(0)

  useEffect(() => {
    (async () => {
      try {
        const data = await api<Round[]>(endpoints.rounds)
        setRounds(data)
        const active = data.find((r) => r.status === "ACTIVE") || data.at(-1) || null
        setCurrentRound(active)
        // Without separate count endpoint, approximate by prizes or leave 0
        setTicketsSold(active?.tickets?.length ?? 0)
      } catch (e) {
        // ignore
      }
    })()
  }, [])

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers([...selectedNumbers, num]);
    }
  };

  const generateQuickPick = () => {
    const numbers = [];
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 49) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b));
    setQuickPick(true);
  };

  const clearSelection = () => {
    setSelectedNumbers([]);
    setQuickPick(false);
  };

  const ticketPrice = currentRound?.entryFee ?? 0
  const totalCost = ticketCount * ticketPrice;

  const topPrize = (() => {
    if (!currentRound) return null
    let best: { amount: number; currency?: string } | null = null
    for (const p of currentRound.prizes) {
      if ((p.type === "CASH" || p.type === "RUB_CASH") && typeof p.amount === 'number') {
        if (!best || p.amount > best.amount) best = { amount: p.amount, currency: p.currency }
      }
    }
    return best
  })()

  async function buyTicket() {
    if (!token) {
      alert("Iltimos, avval tizimga kiring");
      return;
    }
    if (selectedNumbers.length !== 6) return;
    try {
      if (!currentRound) throw new Error("Round topilmadi")
      for (let i = 0; i < ticketCount; i++) {
        await api(endpoints.buyTicket, {
          method: "POST",
          token,
          body: { 
            roundId: currentRound.id,
            numbers: selectedNumbers.join(',') 
          },
        });
      }
      alert("Bilet(lar) muvaffaqiyatli sotib olindi");
      clearSelection();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title={`${t("lottery.title")} | ${t("brand")}`} description={t("lottery.description")} />
      
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight">Lottery o'yini</h1>
        <p className="text-lg text-muted-foreground">6 ta raqam tanlang va katta yutuqni qo'lga kiriting!</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Game Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Current Draw Info */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                   <CardTitle className="text-2xl">{currentRound ? `Draw #${currentRound.id.slice(0,6)}` : "Draw"}</CardTitle>
                   <CardDescription>Holat: {currentRound?.status ?? '—'}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {ticketPrice} {currentRound?.currency}
                  </div>
                  <div className="text-sm text-muted-foreground">Bilet narxi</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Sotilgan biletlar</span>
                    <span>{ticketsSold} / {currentRound?.maxPlayers ?? 0}</span>
                  </div>
                  <Progress value={currentRound ? (ticketsSold / (currentRound.maxPlayers || 1)) * 100 : 0} className="h-2" />
                </div>
                <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>2 soat 45 daqiqa qoldi</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>Bilet narxi: {ticketPrice} {currentRound?.currency}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Number Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Raqamlarni tanlang</CardTitle>
              <CardDescription>
                6 ta raqam tanlang (1-49 oralig'ida) yoki Tez tanlov tugmasini bosing
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    Tanlangan: {selectedNumbers.length}/6
                  </div>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={generateQuickPick}
                    >
                      <Zap className="mr-1 h-4 w-4" />
                      Tez tanlov
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={clearSelection}
                      disabled={selectedNumbers.length === 0}
                    >
                      Tozalash
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 49 }, (_, i) => i + 1).map((num) => (
                    <Button
                      key={num}
                      variant={selectedNumbers.includes(num) ? "default" : "outline"}
                      size="sm"
                      className="aspect-square p-0"
                      onClick={() => toggleNumber(num)}
                      disabled={selectedNumbers.length >= 6 && !selectedNumbers.includes(num)}
                    >
                      {num}
                    </Button>
                  ))}
                </div>

                {selectedNumbers.length > 0 && (
                  <div className="rounded-lg bg-muted p-3">
                    <div className="text-sm font-medium mb-2">Sizning raqamlaringiz:</div>
                    <div className="flex gap-2">
                      {selectedNumbers.map((num) => (
                        <div key={num} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                          {num}
                        </div>
                      ))}
                      {quickPick && (
                        <Badge variant="secondary" className="ml-2">
                          <Shuffle className="mr-1 h-3 w-3" />
                          Tez tanlov
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Previous Results */}
          <Card>
            <CardHeader>
              <CardTitle>So'nggi natijalar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { draw: 1245, date: "2024-01-15", numbers: [7, 14, 23, 31, 42, 49], jackpot: 98000, winners: 3 },
                  { draw: 1244, date: "2024-01-14", numbers: [3, 18, 27, 35, 41, 48], jackpot: 87500, winners: 1 },
                  { draw: 1243, date: "2024-01-13", numbers: [12, 19, 28, 33, 44, 47], jackpot: 76200, winners: 2 },
                ].map((result) => (
                  <div key={result.draw} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="text-sm font-medium">Draw #{result.draw}</div>
                        <div className="text-xs text-muted-foreground">{result.date}</div>
                      </div>
                      <div className="flex gap-1">
                        {result.numbers.map((num, i) => (
                          <div key={i} className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">${result.jackpot.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {result.winners} yutuvchi
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Purchase Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Bilet sotib olish</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Biletlar soni:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTicketCount(Math.max(1, ticketCount - 1))}
                      disabled={ticketCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center">{ticketCount}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setTicketCount(Math.min(10, ticketCount + 1))}
                      disabled={ticketCount >= 10}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Bilet narxi:</span>
                    <span>{ticketPrice} {currentRound?.currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Biletlar soni:</span>
                    <span>{ticketCount}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span>Jami:</span>
                    <span>{totalCost} {currentRound?.currency}</span>
                  </div>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={selectedNumbers.length !== 6}
                  onClick={buyTicket}
                >
                  <Ticket className="mr-2 h-4 w-4" />
                  Bilet sotib olish
                </Button>

                <div className="text-xs text-muted-foreground text-center">
                  Minimum balans talab qilinadi: {totalCost} {currentRound?.currency}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prize Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Yutuq taqsimoti</CardTitle>
              <CardDescription>Har bir darajadagi yutuqlar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm">6 ta raqam</span>
                  </div>
                  <span className="text-sm font-medium">{topPrize ? `${topPrize.amount.toLocaleString()} ${topPrize.currency ?? ''}` : '—'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">5 ta raqam</span>
                  </div>
                  <span className="text-sm font-medium">$5,000</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">4 ta raqam</span>
                  </div>
                  <span className="text-sm font-medium">$100</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-gray-300" />
                    <span className="text-sm">3 ta raqam</span>
                  </div>
                  <span className="text-sm font-medium">$10</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Game Rules */}
          <Card>
            <CardHeader>
              <CardTitle>O'yin qoidalari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• 1-49 oralig'ida 6 ta raqam tanlang</p>
                <p>• Minimum 3 ta raqam mos kelishi kerak</p>
                <p>• Undiruvlar har kuni 20:00 da o'tkaziladi</p>
                <p>• Yutuqlar avtomatik hisobga o'tkaziladi</p>
                <p>• Maksimal 10 ta bilet sotib olish mumkin</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
};

export default Lottery;