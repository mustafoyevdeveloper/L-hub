import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import Seo from "@/components/Seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  DollarSign, 
  TrendingUp, 
  Activity, 
  Shield,
  Settings,
  Eye,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";
import { api, endpoints } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";

const Admin = () => {
  const { t } = useI18n();
  const { token } = useAuth();
  const [rounds, setRounds] = useState<any[]>([]);
  const currentDraw = rounds.find((r) => r.status === 'ACTIVE') || rounds[0] || { id: '—', status: 'PLANNED', ticketsSold: 0, maxPlayers: 0, endTime: null, jackpots: 0 };

  useEffect(() => {
    (async () => {
      try {
        const data = await api<any[]>(endpoints.rounds);
        setRounds(data);
      } catch {}
    })();
  }, []);

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title={`Admin Panel | ${t("brand")}`} description="Lottery admin dashboard" />
      
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">Lottery tizimini boshqarish paneli</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <Settings className="mr-2 h-4 w-4" />
            Sozlamalar
          </Button>
          <Button variant="destructive" size="sm">
            <Shield className="mr-2 h-4 w-4" />
            Xavfsizlik
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Jami foydalanuvchilar</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12,486</div>
            <p className="text-xs text-muted-foreground">+8.2% o'tgan oydan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kunlik daromad</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$24,580</div>
            <p className="text-xs text-muted-foreground">+12.5% kechadan</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faol biletlar</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,450</div>
            <p className="text-xs text-muted-foreground">Joriy undiruvda</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konversiya</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">76.4%</div>
            <p className="text-xs text-muted-foreground">+3.1% o'tgan haftadan</p>
          </CardContent>
        </Card>
      </div>

      {/* Current Draw Control */}
      <Card>
        <CardHeader>
          <CardTitle>Joriy undiruv boshqaruvi</CardTitle>
          <CardDescription>Draw #{currentDraw.id} - {currentDraw.status}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="text-lg font-semibold">Jackpot: ${currentDraw.jackpot.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">
                {currentDraw.ticketsSold} / {currentDraw.maxTickets} bilet sotildi
              </div>
              <div className="text-sm text-muted-foreground">
                Tugash vaqti: {new Date(currentDraw.endTime).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Eye className="mr-2 h-4 w-4" />
                Ko'rish
              </Button>
              <Button variant="outline" size="sm">
                <Pause className="mr-2 h-4 w-4" />
                To'xtatish
              </Button>
              <Button size="sm">
                <Play className="mr-2 h-4 w-4" />
                Boshlash
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Umumiy</TabsTrigger>
          <TabsTrigger value="users">Foydalanuvchilar</TabsTrigger>
          <TabsTrigger value="draws">Undiruvlar</TabsTrigger>
          <TabsTrigger value="payments">To'lovlar</TabsTrigger>
          <TabsTrigger value="reports">Hisobotlar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>So'nggi faollik</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { user: "user@example.com", action: "Bilet sotib oldi", time: "2 daqiqa oldin", amount: "$15" },
                    { user: "admin@example.com", action: "Yangi undiruv boshladi", time: "5 daqiqa oldin", amount: "" },
                    { user: "user2@example.com", action: "Balansni to'ldirdi", time: "8 daqiqa oldin", amount: "$100" },
                    { user: "user3@example.com", action: "Yutuqni oldi", time: "12 daqiqa oldin", amount: "$50" },
                  ].map((activity, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">{activity.action}</div>
                        <div className="text-xs text-muted-foreground">{activity.user} • {activity.time}</div>
                      </div>
                      {activity.amount && (
                        <Badge variant="secondary">{activity.amount}</Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tizim holati</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Database</span>
                    <Badge className="bg-green-500 hover:bg-green-600">Faol</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Payment Gateway</span>
                    <Badge className="bg-green-500 hover:bg-green-600">Faol</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">RNG Service</span>
                    <Badge className="bg-green-500 hover:bg-green-600">Faol</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Email Service</span>
                    <Badge variant="destructive">Xatolik</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Foydalanuvchilar ro'yxati</CardTitle>
              <CardDescription>Tizimda ro'yxatdan o'tgan barcha foydalanuvchilar</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Balans</TableHead>
                    <TableHead>Biletlar</TableHead>
                    <TableHead>Ro'yxat sanasi</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { email: "user1@example.com", balance: 245.50, tickets: 8, joinDate: "2024-01-10", status: "active" },
                    { email: "user2@example.com", balance: 892.25, tickets: 15, joinDate: "2024-01-08", status: "active" },
                    { email: "user3@example.com", balance: 0.00, tickets: 0, joinDate: "2024-01-12", status: "suspended" },
                    { email: "user4@example.com", balance: 156.75, tickets: 5, joinDate: "2024-01-09", status: "active" },
                  ].map((user, i) => (
                    <TableRow key={i}>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>${user.balance.toFixed(2)}</TableCell>
                      <TableCell>{user.tickets}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <Badge variant={user.status === "active" ? "secondary" : "destructive"}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="draws" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Undiruvlar tarixi</CardTitle>
              <CardDescription>Barcha o'tkazilgan va rejalashtirilan undiruvlar</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Draw ID</TableHead>
                    <TableHead>Jackpot</TableHead>
                    <TableHead>Biletlar</TableHead>
                    <TableHead>Yutuvchi raqamlar</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Sana</TableHead>
                    <TableHead>Amallar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: 1245, jackpot: 98000, tickets: 3200, numbers: [7, 14, 23, 31, 42, 49], status: "completed", date: "2024-01-15" },
                    { id: 1244, jackpot: 87500, tickets: 2950, numbers: [3, 18, 27, 35, 41, 48], status: "completed", date: "2024-01-14" },
                    { id: 1243, jackpot: 76200, tickets: 2680, numbers: [12, 19, 28, 33, 44, 47], status: "completed", date: "2024-01-13" },
                    { id: 1246, jackpot: 125000, tickets: 2450, numbers: [], status: "active", date: "2024-01-16" },
                  ].map((draw, i) => (
                    <TableRow key={i}>
                      <TableCell>#{draw.id}</TableCell>
                      <TableCell>${draw.jackpot.toLocaleString()}</TableCell>
                      <TableCell>{draw.tickets}</TableCell>
                      <TableCell>
                        {draw.numbers.length > 0 ? (
                          <div className="flex gap-1">
                            {draw.numbers.map((num, j) => (
                              <div key={j} className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                                {num}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">Kutilmoqda</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={draw.status === "completed" ? "secondary" : "default"}>
                          {draw.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{draw.date}</TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          {draw.status === "active" && (
                            <Button variant="outline" size="sm">
                              <RotateCcw className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>To'lovlar tarixi</CardTitle>
              <CardDescription>Barcha to'lovlar va tranzaksiyalar</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Foydalanuvchi</TableHead>
                    <TableHead>Turi</TableHead>
                    <TableHead>Miqdor</TableHead>
                    <TableHead>Usul</TableHead>
                    <TableHead>Holat</TableHead>
                    <TableHead>Sana</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { id: "TXN001", user: "user1@example.com", type: "deposit", amount: 100, method: "Credit Card", status: "completed", date: "2024-01-15 14:30" },
                    { id: "TXN002", user: "user2@example.com", type: "purchase", amount: -25, method: "Balance", status: "completed", date: "2024-01-15 14:25" },
                    { id: "TXN003", user: "user3@example.com", type: "win", amount: 50, method: "Auto Credit", status: "completed", date: "2024-01-15 14:20" },
                    { id: "TXN004", user: "user4@example.com", type: "withdrawal", amount: -200, method: "Bank Transfer", status: "pending", date: "2024-01-15 14:15" },
                  ].map((payment, i) => (
                    <TableRow key={i}>
                      <TableCell>{payment.id}</TableCell>
                      <TableCell>{payment.user}</TableCell>
                      <TableCell>{payment.type}</TableCell>
                      <TableCell className={payment.amount > 0 ? "text-green-600" : "text-red-600"}>
                        {payment.amount > 0 ? "+" : ""}${Math.abs(payment.amount)}
                      </TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>
                        <Badge variant={payment.status === "completed" ? "secondary" : "default"}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{payment.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Oylik hisobot</CardTitle>
                <CardDescription>Yanvar 2024</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Jami daromad:</span>
                    <span className="font-semibold">$485,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yutuqlar to'landi:</span>
                    <span className="font-semibold">$312,150</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sof foyda:</span>
                    <span className="font-semibold text-green-600">$173,090</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Yangi foydalanuvchilar:</span>
                    <span className="font-semibold">1,248</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Haftalik ko'rsatkichlar</CardTitle>
                <CardDescription>O'tgan hafta</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Undiruvlar soni:</span>
                    <span className="font-semibold">7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>O'rtacha bilet narxi:</span>
                    <span className="font-semibold">$8.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Konversiya darajasi:</span>
                    <span className="font-semibold">76.4%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Qaytgan foydalanuvchilar:</span>
                    <span className="font-semibold">68.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Admin;