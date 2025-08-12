import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import { countries as allCountries, countryDialCodes } from '@/data/countries'
import { Eye, EyeOff } from 'lucide-react'
import Seo from '@/components/Seo'

export default function AuthPage() {
  const navigate = useNavigate()
  const { login, startRegister, verifyRegister, forgotPassword, resetPassword } = useAuth()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [reg, setReg] = useState({ fullName: '', country: '', email: '', phone: '', password: '' })
  const [dialCode, setDialCode] = useState('+998')
  const [countries, setCountries] = useState<string[]>([])
  const [step, setStep] = useState<'form' | 'verify' | 'forgot' | 'reset'>('form')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegPassword, setShowRegPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)

  const formatLocalPhone = (input: string) => {
    const digits = input.replace(/\D/g, '').slice(0, 9)
    const p1 = digits.slice(0, 2)
    const p2 = digits.slice(2, 5)
    const p3 = digits.slice(5, 7)
    const p4 = digits.slice(7, 9)
    let out = ''
    if (p1) out += p1
    if (p2) out += (out ? ' ' : '') + p2
    if (p3) out += '-' + p3
    if (p4) out += '-' + p4
    return out
  }

  // Load countries list once
  useEffect(() => {
    setCountries(allCountries)
  }, [])

  useEffect(() => {
    if (reg.country) {
      const code = countryDialCodes[reg.country] || '+998'
      setDialCode(code)
      // If phone is empty or not starting with selected code, prefill
      if (!reg.phone || !reg.phone.startsWith(code)) {
        setReg({ ...reg, phone: code + ' ' })
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reg.country])

  const onLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      await login(loginEmail, loginPassword)
      // Login muvaffaqiyatli bo'lgandan keyin home sahifasiga yo'naltirish
      navigate('/')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const onRegister = async () => {
    try {
      setLoading(true)
      setError(null)
      await startRegister(reg)
      setStep('verify')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const onVerifyRegister = async () => {
    try {
      setLoading(true)
      setError(null)
      await verifyRegister(reg.email, code)
      // Register muvaffaqiyatli bo'lgandan keyin home sahifasiga yo'naltirish
      navigate('/')
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="container mx-auto p-6 max-w-2xl">
      <Seo title="Kirish / Ro‘yxatdan o‘tish | FairRNG" description="Profil yaratish va tizimga kirish" />
      <Card>
        <CardHeader>
          <CardTitle>Hisob</CardTitle>
          <CardDescription>Tizimga kiring yoki yangi hisob yarating</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList>
              <TabsTrigger value="login">Kirish</TabsTrigger>
              <TabsTrigger value="register">Ro‘yxatdan o‘tish</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4">
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Parol</Label>
                <div className="relative">
                  <Input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    aria-label={showLoginPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                    onClick={() => setShowLoginPassword((v) => !v)}
                  >
                    {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button disabled={loading} onClick={onLogin}>Kirish</Button>
                <Button variant="link" className="px-0" onClick={() => setStep('forgot')}>Parolni unutdingizmi?</Button>
              </div>
              {step === 'forgot' && (
                <div className="mt-2 space-y-2">
                  <Label>Email</Label>
                  <Input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} />
                  <Button disabled={loading} onClick={async () => { setLoading(true); setError(null); try { await forgotPassword(loginEmail); setStep('reset') } catch (e:any) { setError(e.message) } finally { setLoading(false) } }}>Emailga kod yuborish</Button>
                </div>
              )}
              {step === 'reset' && (
                <div className="mt-2 grid gap-3 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Tasdiqlash kodi</Label>
                    <Input value={code} onChange={(e) => setCode(e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Yangi parol</Label>
                    <div className="relative">
                      <Input
                        type={showNewPassword ? 'text' : 'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <button
                        type="button"
                        aria-label={showNewPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                        onClick={() => setShowNewPassword((v) => !v)}
                      >
                        {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <Button disabled={loading} onClick={async () => { setLoading(true); setError(null); try { await resetPassword(loginEmail, code, newPassword); setStep('form'); navigate('/') } catch (e:any) { setError(e.message) } finally { setLoading(false) } }}>Parolni tiklash</Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              {error && <div className="text-sm text-red-600">{error}</div>}
              {step === 'form' && (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>To‘liq ism</Label>
                  <Input value={reg.fullName} onChange={(e) => setReg({ ...reg, fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Mamlakat</Label>
                  <select className="w-full border rounded h-10 px-3 bg-background" value={reg.country} onChange={(e) => setReg({ ...reg, country: e.target.value })}>
                    <option value="">Mamlakatni tanlang</option>
                    {countries.map((c) => (<option key={c} value={c}>{c}</option>))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Telefon raqam</Label>
                  <div className="flex gap-2">
                    <Input className="w-32" value={dialCode} disabled />
                    <Input
                      className="flex-1"
                      inputMode="numeric"
                      value={formatLocalPhone(reg.phone.replace(dialCode, ''))}
                      onChange={(e) => {
                        const formatted = formatLocalPhone(e.target.value)
                        setReg({ ...reg, phone: `${dialCode} ${formatted}` })
                      }}
                      onKeyDown={(e) => {
                        const allowed = ['Backspace','Delete','ArrowLeft','ArrowRight','Tab']
                        if (allowed.includes(e.key)) return
                        if (!/\d/.test(e.key)) e.preventDefault()
                      }}
                      placeholder="90 220-63-37"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Parol</Label>
                  <div className="relative">
                    <Input
                      type={showRegPassword ? 'text' : 'password'}
                      value={reg.password}
                      onChange={(e) => setReg({ ...reg, password: e.target.value })}
                    />
                    <button
                      type="button"
                      aria-label={showRegPassword ? 'Parolni yashirish' : 'Parolni ko‘rsatish'}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowRegPassword((v) => !v)}
                    >
                      {showRegPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              )}
              {step === 'verify' && (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input value={reg.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label>Tasdiqlash kodi</Label>
                    <Input value={code} onChange={(e) => setCode(e.target.value)} />
                  </div>
                  <Button disabled={loading} onClick={onVerifyRegister}>Tasdiqlash</Button>
                </div>
              )}
              {step === 'form' && <Button disabled={loading} onClick={onRegister}>Ro‘yxatdan o‘tish</Button>}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}


