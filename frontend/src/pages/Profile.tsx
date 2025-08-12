import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import Seo from "@/components/Seo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  CreditCard, 
  Bell,
  Key,
  Download,
  Upload
} from "lucide-react";

const Profile = () => {
  const { t } = useI18n();
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 8900",
    avatar: "",
    verified: true,
    twoFactor: false
  });

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    wins: true,
    draws: false,
    promotions: true
  });

  return (
    <main className="container mx-auto space-y-6 p-6">
      <Seo title={`Profil | ${t("brand")}`} description="Foydalanuvchi profili sozlamalari" />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar} />
          <AvatarFallback className="text-lg">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{profile.name}</h1>
          <p className="text-muted-foreground">{profile.email}</p>
          <div className="flex gap-2">
            {profile.verified && (
              <Badge className="bg-green-500 hover:bg-green-600">
                <Shield className="mr-1 h-3 w-3" />
                Tasdiqlangan
              </Badge>
            )}
            {profile.twoFactor && (
              <Badge variant="secondary">
                <Key className="mr-1 h-3 w-3" />
                2FA faol
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="security">Xavfsizlik</TabsTrigger>
          <TabsTrigger value="notifications">Bildirishnomalar</TabsTrigger>
          <TabsTrigger value="payment">To'lov</TabsTrigger>
          <TabsTrigger value="privacy">Maxfiylik</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
              <CardDescription>Profilingiz haqidagi asosiy ma'lumotlar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">To'liq ism</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email manzil</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon raqam</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Foydalanuvchi nomi</Label>
                  <Input
                    id="username"
                    value="johndoe123"
                    disabled
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button>
                  <User className="mr-2 h-4 w-4" />
                  O'zgarishlarni saqlash
                </Button>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Avatar yuklash
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hisobni tasdiqlash</CardTitle>
              <CardDescription>Hisobingizni tasdiqlash uchun hujjatlar yuklang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Shaxsni tasdiqlovchi hujjat</Label>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-500 hover:bg-green-600">Tasdiqlangan</Badge>
                    <span className="text-sm text-muted-foreground">Passport</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Yashash manzili</Label>
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Talab qilinadi</Badge>
                    <Button variant="outline" size="sm">
                      <Upload className="mr-1 h-3 w-3" />
                      Yuklash
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Parol va xavfsizlik</CardTitle>
              <CardDescription>Hisobingizni himoya qilish sozlamalari</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Joriy parol</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">Yangi parol</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Yangi parolni tasdiqlang</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button>
                <Key className="mr-2 h-4 w-4" />
                Parolni o'zgartirish
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ikki faktorli autentifikatsiya</CardTitle>
              <CardDescription>Hisobingizga qo'shimcha himoya qatlamini qo'shing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="font-medium">2FA yoqish</div>
                  <div className="text-sm text-muted-foreground">
                    SMS yoki authenticator ilovasi orqali
                  </div>
                </div>
                <Switch
                  checked={profile.twoFactor}
                  onCheckedChange={(checked) => setProfile({ ...profile, twoFactor: checked })}
                />
              </div>
              {profile.twoFactor && (
                <div className="rounded-lg bg-muted p-3">
                  <div className="text-sm font-medium mb-2">2FA sozlash:</div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      <Phone className="mr-1 h-3 w-3" />
                      SMS orqali
                    </Button>
                    <Button variant="outline" size="sm">
                      <Shield className="mr-1 h-3 w-3" />
                      Authenticator ilova
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Faol sessiyalar</CardTitle>
              <CardDescription>Hisobingizga ulangan qurilmalar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { device: "Chrome - Windows", location: "Toshkent, O'zbekiston", time: "Hozir", current: true },
                  { device: "Safari - iPhone", location: "Toshkent, O'zbekiston", time: "2 soat oldin", current: false },
                  { device: "Firefox - Linux", location: "Samarqand, O'zbekiston", time: "1 kun oldin", current: false },
                ].map((session, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <div className="text-sm font-medium">{session.device}</div>
                      <div className="text-xs text-muted-foreground">
                        {session.location} • {session.time}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {session.current && (
                        <Badge variant="secondary">Joriy</Badge>
                      )}
                      {!session.current && (
                        <Button variant="outline" size="sm">Tugatish</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Bildirishnoma sozlamalari</CardTitle>
              <CardDescription>Qanday bildirishnomalar olishni tanlang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Email bildirishnomalar</div>
                    <div className="text-sm text-muted-foreground">Muhim ma'lumotlar email orqali</div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, email: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">SMS bildirishnomalar</div>
                    <div className="text-sm text-muted-foreground">Tezkor xabarlar SMS orqali</div>
                  </div>
                  <Switch
                    checked={notifications.sms}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, sms: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Push bildirishnomalar</div>
                    <div className="text-sm text-muted-foreground">Brauzer bildirishnomalari</div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) => setNotifications({ ...notifications, push: checked })}
                  />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Bildirishnoma turlari</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Yutuqlar haqida</span>
                    <Switch
                      checked={notifications.wins}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, wins: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Yangi undiruvlar</span>
                    <Switch
                      checked={notifications.draws}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, draws: checked })}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aksiyalar va chegirmalar</span>
                    <Switch
                      checked={notifications.promotions}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, promotions: checked })}
                    />
                  </div>
                </div>
              </div>
              
              <Button>
                <Bell className="mr-2 h-4 w-4" />
                Sozlamalarni saqlash
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="payment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>To'lov usullari</CardTitle>
              <CardDescription>Saqlangan to'lov kartalari va hisoblar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {[
                  { type: "Visa", last4: "4242", expires: "12/26", default: true },
                  { type: "Mastercard", last4: "8888", expires: "08/25", default: false },
                ].map((card, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5" />
                      <div>
                        <div className="text-sm font-medium">{card.type} •••• {card.last4}</div>
                        <div className="text-xs text-muted-foreground">Amal qilish: {card.expires}</div>
                      </div>
                      {card.default && (
                        <Badge variant="secondary">Asosiy</Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Tahrirlash</Button>
                      <Button variant="outline" size="sm">O'chirish</Button>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Yangi karta qo'shish
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pul yechish</CardTitle>
              <CardDescription>Yutuqlaringizni yechish uchun bank rekvizitlari</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="bank-name">Bank nomi</Label>
                <Input id="bank-name" placeholder="Bank nomini kiriting" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-number">Hisob raqami</Label>
                <Input id="account-number" placeholder="Hisob raqamingizni kiriting" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="account-holder">Hisob egasi</Label>
                <Input id="account-holder" placeholder="To'liq ismingizni kiriting" />
              </div>
              <Button>
                <CreditCard className="mr-2 h-4 w-4" />
                Bank hisobini saqlash
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Maxfiylik sozlamalari</CardTitle>
              <CardDescription>Ma'lumotlaringizning maxfiyligi va foydalanish huquqlari</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Profil ma'lumotlarini ko'rsatish</div>
                    <div className="text-sm text-muted-foreground">Boshqa foydalanuvchilarga profilingizni ko'rsatish</div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Yutuqlar tarixi</div>
                    <div className="text-sm text-muted-foreground">Yutuqlaringizni boshqalarga ko'rsatish</div>
                  </div>
                  <Switch defaultChecked={false} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">Onlayn holat</div>
                    <div className="text-sm text-muted-foreground">Onlayn ekanligingizni ko'rsatish</div>
                  </div>
                  <Switch defaultChecked={true} />
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Ma'lumotlarni boshqarish</h4>
                <div className="flex gap-2">
                  <Button variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Ma'lumotlarni eksport qilish
                  </Button>
                  <Button variant="destructive">
                    Hisobni o'chirish
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Profile;