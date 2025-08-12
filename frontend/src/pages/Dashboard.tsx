import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import Seo from "@/components/Seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Trophy, 
  Clock, 
  TrendingUp, 
  Ticket, 
  CreditCard,
  History,
  Settings
} from "lucide-react";

const Dashboard = () => {
  const { t } = useI18n();
  const [balance] = useState(1250.75);
  const [tickets] = useState(12);

  return (
    <main className="container mx-auto space-y-6 p-6">
      <Seo title={`${t("dashboard.title")} | ${t("brand")}`} description={t("dashboard.description")} />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("dashboard.welcome")}</h1>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            {t("dashboard.settings")}
          </Button>
          <Button size="sm">
            <CreditCard className="mr-2 h-4 w-4" />
            {t("dashboard.deposit")}
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.balance")}</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${balance.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">+2.5% {t("dashboard.fromLast")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.activeTickets")}</CardTitle>
            <Ticket className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tickets}</div>
            <p className="text-xs text-muted-foreground">{t("dashboard.inCurrentDraw")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.totalWins")}</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$3,240</div>
            <p className="text-xs text-muted-foreground">+12% {t("dashboard.fromLast")}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("dashboard.winRate")}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23.4%</div>
            <p className="text-xs text-muted-foreground">+1.2% {t("dashboard.fromLast")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">{t("dashboard.overview")}</TabsTrigger>
          <TabsTrigger value="tickets">{t("dashboard.myTickets")}</TabsTrigger>
          <TabsTrigger value="history">{t("dashboard.history")}</TabsTrigger>
          <TabsTrigger value="payments">{t("dashboard.payments")}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>{t("dashboard.currentDraw")}</CardTitle>
                <CardDescription>{t("dashboard.drawEnds")} 2 soat 45 daqiqada</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("dashboard.jackpot")}</span>
                    <span className="font-semibold">$125,000</span>
                  </div>
                  <Progress value={75} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    2,450 ta bilet sotildi / 3,200 maksimal
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Ticket className="mr-2 h-4 w-4" />
                    {t("dashboard.buyTicket")}
                  </Button>
                  <Button variant="outline">
                    <Clock className="mr-2 h-4 w-4" />
                    {t("dashboard.quickPick")}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>{t("dashboard.recentWins")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">Draw #1245</span>
                  </div>
                  <Badge variant="secondary">+$50</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">Draw #1242</span>
                  </div>
                  <Badge variant="secondary">+$25</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">Draw #1240</span>
                  </div>
                  <Badge variant="secondary">+$100</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="tickets" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.myTickets")}</CardTitle>
              <CardDescription>Joriy undiruvdagi biletlaringiz</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((ticket) => (
                  <div key={ticket} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{ticket.toString().padStart(6, '0')}</Badge>
                      <div className="flex gap-1">
                        {[7, 14, 23, 31, 42, 49].map((num, i) => (
                          <div key={i} className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">$5.00</div>
                      <div className="text-xs text-muted-foreground">Draw #1246</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.history")}</CardTitle>
              <CardDescription>O'tgan o'yinlar tarixi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { draw: 1245, date: "2024-01-15", numbers: [7, 14, 23, 31, 42, 49], win: 50, status: "win" },
                  { draw: 1244, date: "2024-01-14", numbers: [3, 18, 27, 35, 41, 48], win: 0, status: "lose" },
                  { draw: 1243, date: "2024-01-13", numbers: [12, 19, 28, 33, 44, 47], win: 0, status: "lose" },
                  { draw: 1242, date: "2024-01-12", numbers: [5, 16, 25, 34, 43, 50], win: 25, status: "win" },
                ].map((item) => (
                  <div key={item.draw} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <Badge variant="outline">#{item.draw}</Badge>
                      <div className="text-sm text-muted-foreground">{item.date}</div>
                      <div className="flex gap-1">
                        {item.numbers.map((num, i) => (
                          <div key={i} className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs">
                            {num}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.status === "win" ? (
                        <Badge className="bg-green-500 hover:bg-green-600">+${item.win}</Badge>
                      ) : (
                        <Badge variant="destructive">Yutuq yo'q</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.payments")}</CardTitle>
              <CardDescription>To'lov tarixi va balans</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { type: "deposit", amount: 100, date: "2024-01-15", method: "Credit Card", status: "completed" },
                  { type: "win", amount: 50, date: "2024-01-15", method: "Lottery Win", status: "completed" },
                  { type: "purchase", amount: -25, date: "2024-01-14", method: "Ticket Purchase", status: "completed" },
                  { type: "deposit", amount: 200, date: "2024-01-13", method: "PayPal", status: "completed" },
                ].map((payment, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <div className={`h-3 w-3 rounded-full ${
                        payment.type === "deposit" ? "bg-blue-500" :
                        payment.type === "win" ? "bg-green-500" : "bg-orange-500"
                      }`} />
                      <div>
                        <div className="text-sm font-medium">{payment.method}</div>
                        <div className="text-xs text-muted-foreground">{payment.date}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        payment.amount > 0 ? "text-green-600" : "text-red-600"
                      }`}>
                        {payment.amount > 0 ? "+" : ""}${Math.abs(payment.amount)}
                      </div>
                      <Badge variant="secondary" className="text-xs">{payment.status}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Dashboard;