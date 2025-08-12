import { useState, useEffect } from "react";
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
  Upload,
  Save,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface UserProfile {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  username: string;
  country: string;
  avatar?: string;
  verified: boolean;
  twoFactor: boolean;
  createdAt: string;
}

const Profile = () => {
  const { t } = useI18n();
  const { token, user, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  
  const [profile, setProfile] = useState<UserProfile>({
    _id: "",
    fullName: "",
    email: "",
    phone: "",
    username: "",
    country: "",
    avatar: "",
    verified: false,
    twoFactor: false,
    createdAt: ""
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    wins: true,
    draws: false,
    promotions: true
  });

  const [depositAmount, setDepositAmount] = useState(0);
  const [depositCurrency, setDepositCurrency] = useState<'UZS'|'USD'|'RUB'>('UZS');
  const [withdrawAmount, setWithdrawAmount] = useState(0);
  const [withdrawCurrency, setWithdrawCurrency] = useState<'UZS'|'USD'|'RUB'>('UZS');
  const [status, setStatus] = useState<string | null>(null);

  // User ma'lumotlarini yuklash
  useEffect(() => {
    if (token) {
      loadUserProfile();
    } else {
      // Agar user ro'yxatdan o'tmagan bo'lsa, loading'ni o'chir
      setIsLoading(false);
    }
  }, [token]);

  // User ma'lumotlarini API'dan olish
  const loadUserProfile = async () => {
    try {
      setIsLoading(true);
      const userData = await api('/api/user/me', { token });
      
      if (userData) {
        setProfile({
          _id: userData._id || "",
          fullName: userData.fullName || "",
          email: userData.email || "",
          phone: userData.phone || "",
          username: userData.username || userData.email?.split('@')[0] || "",
          country: userData.country || "",
          avatar: userData.avatar || "",
          verified: userData.verified || false,
          twoFactor: userData.twoFactor || false,
          createdAt: userData.createdAt || ""
        });
        setHasChanges(false);
      }
    } catch (error) {
      console.error('Profile yuklashda xatolik:', error);
      toast({
        title: "Xatolik",
        description: "Profil ma'lumotlari yuklanmadi",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Input o'zgarishlarini kuzatish
  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Profil ma'lumotlarini saqlash
  const handleSaveProfile = async () => {
    try {
      setIsSaving(true);
      
      const response = await api('/api/user/profile', {
        method: 'PUT',
        body: {
          fullName: profile.fullName,
          phone: profile.phone,
          country: profile.country
        },
        token
      });

      if (response) {
        toast({
          title: "Muvaffaqiyatli",
          description: "Profil ma'lumotlari saqlandi"
        });
        setHasChanges(false);
        await loadUserProfile(); // Yangilangan ma'lumotlarni yuklash
      }
    } catch (error) {
      console.error('Profil saqlashda xatolik:', error);
      toast({
        title: "Xatolik",
        description: "Profil ma'lumotlari saqlanmadi",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Avatar yuklash
  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api('/api/user/avatar', {
        method: 'POST',
        body: formData,
        token,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response?.avatar) {
        setProfile(prev => ({ ...prev, avatar: response.avatar }));
        toast({
          title: "Muvaffaqiyatli",
          description: "Avatar yangilandi"
        });
      }
    } catch (error) {
      console.error('Avatar yuklashda xatolik:', error);
      toast({
        title: "Xatolik",
        description: "Avatar yuklanmadi",
        variant: "destructive"
      });
    }
  };

  // Auth loading tugaguncha loading ko'rsatish
  if (authLoading) {
    return (
      <main className="container mx-auto space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Auth yuklanmoqda...</span>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="container mx-auto space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center gap-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span>Profil yuklanmoqda...</span>
          </div>
        </div>
      </main>
    );
  }

  // Agar user ro'yxatdan o'tmagan bo'lsa
  if (!token) {
    return (
      <main className="container mx-auto space-y-6 p-4 md:p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold">Profil paneliga kirish uchun ro'yxatdan o'ting</h2>
            <p className="text-muted-foreground">Profil ma'lumotlarini ko'rish uchun avval tizimga kiring</p>
            <Button asChild>
              <a href="/auth">Ro'yxatdan o'tish</a>
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title={`Profil | ${t("brand")}`} description="Foydalanuvchi profili sozlamalari" />
      
      {/* Header */}
      <div className="flex items-center gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={profile.avatar} />
          <AvatarFallback className="text-lg">
            {profile.fullName.split(' ').map(n => n[0]).join('')}
          </AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{profile.fullName}</h1>
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
          <TabsTrigger value="deposit">Deposit</TabsTrigger>
          <TabsTrigger value="withdrawal">Withdrawal</TabsTrigger>
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
                  <Label htmlFor="fullName">To'liq ism</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    placeholder="To'liq ismingizni kiriting"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email manzil</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Email manzil o'zgartirilmaydi</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefon raqam</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="+998 90 123 45 67"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">Foydalanuvchi nomi</Label>
                  <Input
                    id="username"
                    value={profile.username}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">Foydalanuvchi nomi avtomatik yaratilgan</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Mamlakat</Label>
                  <Input
                    id="country"
                    value={profile.country}
                    onChange={(e) => handleInputChange('country', e.target.value)}
                    placeholder="Mamlakat"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Ro'yxatdan o'tish sanasi</Label>
                  <Input
                    value={new Date(profile.createdAt).toLocaleDateString('uz-UZ')}
                    disabled
                    className="bg-muted"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleSaveProfile}
                  disabled={!hasChanges || isSaving}
                >
                  {isSaving ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  {isSaving ? 'Saqlanmoqda...' : 'O\'zgarishlarni saqlash'}
                </Button>
                <Button variant="outline" asChild>
                  <label htmlFor="avatar-upload">
                    <Upload className="mr-2 h-4 w-4" />
                    Avatar yuklash
                  </label>
                </Button>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
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
              <CardTitle>Balansni to‘ldirish</CardTitle>
              <CardDescription>UZS, USD yoki RUB</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Miqdor</Label>
                  <Input type="number" value={depositAmount} onChange={(e) => setDepositAmount(parseFloat(e.target.value || '0'))} />
                </div>
                <div className="space-y-2">
                  <Label>Valyuta</Label>
                  <select className="h-10 w-full rounded-md border px-3" value={depositCurrency} onChange={(e) => setDepositCurrency(e.target.value as any)}>
                    <option value="UZS">UZS</option>
                    <option value="USD">USD</option>
                    <option value="RUB">RUB</option>
                  </select>
                </div>
              </div>
              <Button onClick={async () => {
                if (!token) return setStatus('Iltimos, tizimga kiring')
                try {
                  await api('/api/transactions/deposit', { method: 'POST', token, body: { amount: depositAmount, currency: depositCurrency, method: 'CARD' } })
                  setStatus('Balans to‘ldirildi')
                } catch (e: any) { setStatus(e.message) }
              }}>
                <CreditCard className="mr-2 h-4 w-4" /> To‘ldirish
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pul yechib olish</CardTitle>
              <CardDescription>Hisobingizdan so‘rov yuboring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Miqdor</Label>
                  <Input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(parseFloat(e.target.value || '0'))} />
                </div>
                <div className="space-y-2">
                  <Label>Valyuta</Label>
                  <select className="h-10 w-full rounded-md border px-3" value={withdrawCurrency} onChange={(e) => setWithdrawCurrency(e.target.value as any)}>
                    <option value="UZS">UZS</option>
                    <option value="USD">USD</option>
                    <option value="RUB">RUB</option>
                  </select>
                </div>
              </div>
              <Button onClick={async () => {
                if (!token) return setStatus('Iltimos, tizimga kiring')
                try {
                  await api('/api/withdrawals', { method: 'POST', token, body: { amount: withdrawAmount, currency: withdrawCurrency } })
                  setStatus('So‘rov yaratildi')
                } catch (e: any) { setStatus(e.message) }
              }}>
                So‘rov yuborish
              </Button>
              {status && <div className="text-sm text-muted-foreground">{status}</div>}
            </CardContent>
          </Card>
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

        <TabsContent value="deposit" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Manual Deposit</CardTitle>
              <CardDescription>Admin karta raqamiga to'lov qiling va chekni yuklang</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Miqdor</Label>
                  <Input type="number" value={depositAmount} onChange={(e) => setDepositAmount(parseFloat(e.target.value || '0'))} />
                </div>
                <div className="space-y-2">
                  <Label>Valyuta</Label>
                  <select className="h-10 w-full rounded-md border px-3" value={depositCurrency} onChange={(e) => setDepositCurrency(e.target.value as any)}>
                    <option value="UZS">UZS</option>
                    <option value="USD">USD</option>
                    <option value="RUB">RUB</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>To'lov usuli</Label>
                <Input placeholder="Karta raqami yoki bank nomi" />
              </div>
              <div className="space-y-2">
                <Label>Chek rasmi</Label>
                <Input type="file" accept="image/*,.pdf" />
              </div>
              <Button onClick={async () => {
                if (!token) return setStatus('Iltimos, tizimga kiring')
                try {
                  // This would use the uploadFile function for receipt upload
                  setStatus('Deposit so\'rovi yuborildi. Admin tasdiqlashini kuting.')
                } catch (e: any) { setStatus(e.message) }
              }}>
                <CreditCard className="mr-2 h-4 w-4" /> Deposit so'rovini yuborish
              </Button>
              {status && <div className="text-sm text-muted-foreground">{status}</div>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawal" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pul yechib olish</CardTitle>
              <CardDescription>Hisobingizdan so'rov yuboring</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Miqdor</Label>
                  <Input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount(parseFloat(e.target.value || '0'))} />
                </div>
                <div className="space-y-2">
                  <Label>Valyuta</Label>
                  <select className="h-10 w-full rounded-md border px-3" value={withdrawCurrency} onChange={(e) => setWithdrawCurrency(e.target.value as any)}>
                    <option value="UZS">UZS</option>
                    <option value="USD">USD</option>
                    <option value="RUB">RUB</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Bank ma'lumotlari</Label>
                <Input placeholder="Bank hisob raqami va boshqa ma'lumotlar" />
              </div>
              <Button onClick={async () => {
                if (!token) return setStatus('Iltimos, tizimga kiring')
                try {
                  await api(endpoints.createWithdrawal, { method: 'POST', token, body: { amount: withdrawAmount, currency: withdrawCurrency, bankDetails: 'Bank details' } })
                  setStatus('So\'rov yaratildi')
                } catch (e: any) { setStatus(e.message) }
              }}>
                So'rov yuborish
              </Button>
              {status && <div className="text-sm text-muted-foreground">{status}</div>}
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