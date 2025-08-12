import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { MessageSquare, Phone, Mail, Clock, CheckCircle, AlertCircle, HelpCircle, Send } from 'lucide-react'
import Seo from '@/components/Seo'

interface FAQ {
  id: string
  question: string
  answer: string
  category: 'PAYMENT' | 'GAME' | 'TECHNICAL' | 'GENERAL'
}

export default function SupportPage() {
  const [category, setCategory] = useState<string>('')
  const [contact, setContact] = useState<string>('')
  const [subject, setSubject] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const faqs: FAQ[] = [
    {
      id: '1',
      question: 'To\'lovlarni qayta tekshirish muddati qancha?',
      answer: 'To\'lovlarni qayta tekshirish muddati 24 soatgacha. Agar 24 soatdan keyin ham to\'lov ko\'rinmasa, support bilan bog\'laning.',
      category: 'PAYMENT'
    },
    {
      id: '2',
      question: 'Raund yopilgach g\'oliblar qachon e\'lon qilinadi?',
      answer: 'Raund yopilgach g\'oliblar 1 soat ichida e\'lon qilinadi. YouTube livestream va saytda ham ko\'rinadi.',
      category: 'GAME'
    },
    {
      id: '3',
      question: 'VIP obunani qanday yoqish mumkin?',
      answer: 'VIP obunani "Tariflar" bo\'limidan yoqishingiz mumkin. Standart: 200,000 UZS, VIP: 350,000 UZS oyiga.',
      category: 'GAME'
    },
    {
      id: '4',
      question: 'KYC jarayoni qancha vaqt oladi?',
      answer: 'KYC jarayoni 24 soat ichida yakunlanadi. Passport/ID skanerlash va yuz tanib olish talab qilinadi.',
      category: 'TECHNICAL'
    },
    {
      id: '5',
      question: 'Pul yechish qancha vaqt oladi?',
      answer: 'Pul yechish 1-3 ish kuni ichida amalga oshiriladi. Bank kartasiga yoki xalqaro o\'tkazma orqali.',
      category: 'PAYMENT'
    },
    {
      id: '6',
      question: 'Raund qachon yakunlanadi?',
      answer: 'Raund 5000 ishtirokchi to\'lganda yoki belgilangan vaqt tugaganda yakunlanadi.',
      category: 'GAME'
    },
    {
      id: '7',
      question: 'Ballar qanday ishlatiladi?',
      answer: 'Ballar chipta yoki chegirmaga almashtiriladi. 1 ball = 1 UZS ekvivalenti. VIP obunachilar 1.5x koeffitsiyent oladi.',
      category: 'GAME'
    },
    {
      id: '8',
      question: 'Telegram bot qanday ishlatiladi?',
      answer: '@fairrng_bot ga yozing. Yangi raundlar, yutuqlar va to\'lov holati haqida avtomatik xabarlar olasiz.',
      category: 'GENERAL'
    }
  ]

  const contactMethods = [
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: 'Telegram bot',
      value: '@fairrng_bot',
      description: '24/7 qo\'llab-quvvatlash',
      color: 'text-blue-500'
    },
    {
      icon: <Mail className="h-6 w-6" />,
      title: 'Email',
      value: 'support@fairrng.example',
      description: 'Batafsil savollar uchun',
      color: 'text-green-500'
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: 'Telefon',
      value: '+998 71 123 45 67',
      description: 'Ish vaqti: 9:00-18:00',
      color: 'text-purple-500'
    }
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!category || !contact || !subject || !message) {
      setSubmitStatus('error')
      return
    }

    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      // TODO: Implement actual API call
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call
      
      // Reset form
      setCategory('')
      setContact('')
      setSubject('')
      setMessage('')
      setSubmitStatus('success')
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="container mx-auto space-y-8 p-4 md:p-6">
      <Seo title="Qo'llab-quvvatlash | FairRNG" description="Support ariza yaratish va kuzatish" />
      
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold tracking-tight">Qo'llab-quvvatlash</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Savollaringiz bormi? Biz sizga yordam berishga tayyormiz. Support ariza yarating yoki to'g'ridan-to'g'ri bog'laning.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid gap-4 md:grid-cols-3">
        {contactMethods.map((method, index) => (
          <Card key={index} className="text-center hover:shadow-md transition-shadow">
            <CardHeader>
              <div className={`mx-auto mb-2 ${method.color}`}>
                {method.icon}
              </div>
              <CardTitle className="text-lg">{method.title}</CardTitle>
              <CardDescription>{method.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="font-mono text-sm bg-muted p-2 rounded">
                {method.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Support Ticket Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Support ariza yaratish
            </CardTitle>
            <CardDescription>
              Savolingizni yozing, biz 24 soat ichida javob beramiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategoriya</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="Kategoriyani tanlang" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAYMENT">To'lov muammolari</SelectItem>
                    <SelectItem value="GAME">O'yin savollari</SelectItem>
                    <SelectItem value="TECHNICAL">Texnik muammolar</SelectItem>
                    <SelectItem value="ACCOUNT">Hisob muammolari</SelectItem>
                    <SelectItem value="OTHER">Boshqa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contact">Aloqa ma'lumoti</Label>
                <Input
                  id="contact"
                  placeholder="Email yoki telefon raqam"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Mavzu</Label>
                <Input
                  id="subject"
                  placeholder="Savol mavzusi"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Xabar</Label>
                <Textarea
                  id="message"
                  placeholder="Savolingizni batafsil yozing..."
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>

              {submitStatus === 'success' && (
                <div className="flex items-center gap-2 text-green-600 text-sm">
                  <CheckCircle className="h-4 w-4" />
                  Ariza muvaffaqiyatli yuborildi!
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  Xatolik yuz berdi. Iltimos, barcha maydonlarni to'ldiring.
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Yuborilmoqda...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Ariza yuborish
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HelpCircle className="h-5 w-5" />
              Tez-tez so'raladigan savollar
            </CardTitle>
            <CardDescription>
              Eng ko'p so'raladigan savollarga javoblar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        {faq.category === 'PAYMENT' && 'To\'lov'}
                        {faq.category === 'GAME' && 'O\'yin'}
                        {faq.category === 'TECHNICAL' && 'Texnik'}
                        {faq.category === 'GENERAL' && 'Umumiy'}
                      </Badge>
                      <span className="font-medium">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Additional Info */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="text-center">
            <Clock className="h-8 w-8 mx-auto text-blue-500 mb-2" />
            <CardTitle className="text-lg">24/7 Qo'llab-quvvatlash</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            Telegram bot orqali doimiy qo'llab-quvvatlash
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-8 w-8 mx-auto text-green-500 mb-2" />
            <CardTitle className="text-lg">Tezkor javob</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            O'rtacha javob vaqti: 2 soat
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <MessageSquare className="h-8 w-8 mx-auto text-purple-500 mb-2" />
            <CardTitle className="text-lg">Ko'p tilli support</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            O'zbekcha, Ruscha, Inglizcha
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="text-center">
            <HelpCircle className="h-8 w-8 mx-auto text-orange-500 mb-2" />
            <CardTitle className="text-lg">Batafsil yordam</CardTitle>
          </CardHeader>
          <CardContent className="text-center text-sm text-muted-foreground">
            FAQ va video ko'rsatmalar
          </CardContent>
        </Card>
      </div>

      {/* Response Times */}
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Javob vaqtlari</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">2 soat</div>
              <div className="text-sm text-muted-foreground">O'rtacha javob vaqti</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24 soat</div>
              <div className="text-sm text-muted-foreground">Maksimal javob vaqti</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">98%</div>
              <div className="text-sm text-muted-foreground">Mijozlar mamnuniyati</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}


