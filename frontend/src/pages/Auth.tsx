import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/use-auth'
import Seo from '@/components/Seo'

export default function AuthPage() {
  const { login, register } = useAuth()
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [reg, setReg] = useState({ fullName: '', country: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onLogin = async () => {
    try {
      setLoading(true)
      setError(null)
      await login(loginEmail, loginPassword)
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
      await register(reg)
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
                <Input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
              <Button disabled={loading} onClick={onLogin}>Kirish</Button>
            </TabsContent>
            <TabsContent value="register" className="space-y-4">
              {error && <div className="text-sm text-red-600">{error}</div>}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>To‘liq ism</Label>
                  <Input value={reg.fullName} onChange={(e) => setReg({ ...reg, fullName: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Mamlakat</Label>
                  <Input value={reg.country} onChange={(e) => setReg({ ...reg, country: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input value={reg.email} onChange={(e) => setReg({ ...reg, email: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <Label>Parol</Label>
                  <Input type="password" value={reg.password} onChange={(e) => setReg({ ...reg, password: e.target.value })} />
                </div>
              </div>
              <Button disabled={loading} onClick={onRegister}>Ro‘yxatdan o‘tish</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </main>
  )
}


