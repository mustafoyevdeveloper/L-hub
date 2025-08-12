import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Check, Star, Zap, Crown, Gift, Users, Shield, Clock } from 'lucide-react'
import Seo from '@/components/Seo'

interface Plan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  period: 'month' | 'year'
  features: string[]
  popular?: boolean
  icon: React.ReactNode
  color: string
}

export default function PlansPage() {
  const [currency, setCurrency] = useState<'UZS' | 'USD' | 'RUB'>('UZS')
  const [period, setPeriod] = useState<'month' | 'year'>('month')

  const exchangeRates = {
    UZS: { USD: 0.000081, RUB: 0.0075 },
    USD: { UZS: 12345, RUB: 92.5 },
    RUB: { UZS: 133.5, USD: 0.0108 }
  }

  const plans: Plan[] = useMemo(() => [
    {
      id: 'standard',
      name: 'Standart',
      description: 'Asosiy lotereyada qatnashish uchun',
      price: currency === 'UZS' ? 200000 : currency === 'USD' ? 16.2 : 1500,
      currency,
      period,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-blue-500',
      features: [
        'Asosiy lotereyada qatnashish',
        '1x ball koeffitsiyent',
        'Standart support',
        'Telegram bildirishnomalar',
        'Shaxsiy kabinet',
        'Tranzaksiya tarixi'
      ]
    },
    {
      id: 'vip',
      name: 'VIP',
      description: 'Maksimal imkoniyatlar va ball yig\'ish',
      price: currency === 'UZS' ? 350000 : currency === 'USD' ? 28.4 : 2625,
      currency,
      period,
      popular: true,
      icon: <Crown className="h-6 w-6" />,
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      features: [
        'Lotereya + mini-o\'yinlarga bepul kirish',
        '1.5x ball koeffitsiyent',
        'Maxsus VIP support',
        'Avvalgi bildirishnomalar',
        'Eksklyuziv kontent',
        'Shaxsiy menedjer',
        'Bepul chiptalar har oy',
        'Maxsus yutuqlar'
      ]
    }
  ], [currency, period])

  const calculatePrice = (basePrice: number) => {
    let price = basePrice
    if (period === 'year') {
      price = price * 10 // 2 oy bepul
    }
    return price
  }

  const getCurrencySymbol = (curr: string) => {
    switch (curr) {
      case 'UZS': return 'UZS'
      case 'USD': return '$'
      case 'RUB': return '₽'
      default: return curr
    }
  }

  const handleSubscribe = (planId: string) => {
    // TODO: Implement subscription logic
    console.log('Subscribe to:', planId, currency, period)
  }

  return (
    <main className="container mx-auto space-y-8 p-4 md:p-6">
      <Seo title="Tariflar | FairRNG" description="Standart va VIP tariflari" />
      
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Tariflar</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          O'zingizga mos tarifni tanlang. VIP obunachilar uchun maxsus imkoniyatlar va ball yig'ishda 1.5x koeffitsiyent.
        </p>
      </div>

      {/* Currency and Period Selection */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Valyuta:</Label>
          <Select value={currency} onValueChange={(value) => setCurrency(value as any)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="UZS">UZS</SelectItem>
              <SelectItem value="USD">USD</SelectItem>
              <SelectItem value="RUB">RUB</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Davr:</Label>
          <RadioGroup value={period} onValueChange={(value) => setPeriod(value as any)} className="flex">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="month" id="month" />
              <Label htmlFor="month">Oy</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="year" id="year" />
              <Label htmlFor="year">Yil (2 oy bepul)</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.popular ? 'border-2 border-primary shadow-lg' : ''}`}>
            {plan.popular && (
              <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                <Star className="h-3 w-3 mr-1" />
                Eng mashhur
              </Badge>
            )}
            
            <CardHeader className="text-center pb-4">
              <div className={`inline-flex p-3 rounded-full ${plan.color} text-white mb-4`}>
                {plan.icon}
              </div>
              <CardTitle className="text-2xl">{plan.name}</CardTitle>
              <CardDescription className="text-base">{plan.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Price */}
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {getCurrencySymbol(plan.currency)}{calculatePrice(plan.price).toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {period === 'month' ? 'oyiga' : 'yiliga (2 oy bepul)'}
                </div>
                {period === 'year' && (
                  <div className="text-xs text-green-600 mt-1">
                    <Check className="h-3 w-3 inline mr-1" />
                    2 oy bepul
                  </div>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                {plan.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Subscribe Button */}
              <Button 
                className={`w-full ${plan.popular ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600' : ''}`}
                onClick={() => handleSubscribe(plan.id)}
              >
                {plan.popular ? (
                  <>
                    <Crown className="mr-2 h-4 w-4" />
                    VIP obuna
                  </>
                ) : (
                  <>
                    <Zap className="mr-2 h-4 w-4" />
                    Obuna bo'lish
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Additional Info */}
      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <Shield className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <CardTitle className="text-lg">Xavfsizlik</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            PCI-DSS sertifikati, KYC, 2FA va auditlanadigan RNG bilan to'liq himoya
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Gift className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <CardTitle className="text-lg">Yutuqlar</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Har raundda 90 ta yutuq: avtomobillar, naqd pullar va bepul chiptalar
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <Clock className="h-8 w-8 mx-auto text-purple-500 mb-2" />
            <CardTitle className="text-lg">24/7 Support</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Telegram bot, email va telefon orqali doimiy qo'llab-quvvatlash
          </CardContent>
        </Card>
      </div>

      {/* FAQ Section */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Tez-tez so'raladigan savollar</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Q: VIP obunani qanday bekor qilaman?</h4>
            <p className="text-sm text-muted-foreground">Profil sozlamalaridan obunani bekor qilishingiz mumkin. Keyingi to'lov oyida amalga oshirilmaydi.</p>
          </div>
          <div>
            <h4 className="font-semibold">Q: Ballar qanday ishlatiladi?</h4>
            <p className="text-sm text-muted-foreground">Ballar chipta yoki chegirmaga almashtiriladi. 1 ball = 1 UZS ekvivalenti.</p>
          </div>
          <div>
            <h4 className="font-semibold">Q: Yillik obunada qancha tejayman?</h4>
            <p className="text-sm text-muted-foreground">Yillik obunada 2 oy bepul, ya'ni 20 oy uchun 10 oylik to'lov.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}


