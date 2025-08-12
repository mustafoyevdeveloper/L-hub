import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { api, endpoints, uploadFile } from '@/lib/api'
import { useAuth } from '@/hooks/use-auth'
import Seo from '@/components/Seo'
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Shield, 
  FileText, 
  Camera,
  User,
  MapPin
} from 'lucide-react'

interface KYCDocument {
  id: string
  type: 'PASSPORT' | 'ID_CARD' | 'DRIVERS_LICENSE'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  uploadedAt: string
  adminNote?: string
}

interface KYCStatus {
  isVerified: boolean
  documents: KYCDocument[]
  verificationLevel: 'NONE' | 'BASIC' | 'FULL'
  lastUpdated: string
}

export default function KYCPage() {
  const { token } = useAuth()
  const [status, setStatus] = useState<KYCStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [documentType, setDocumentType] = useState<'PASSPORT' | 'ID_CARD' | 'DRIVERS_LICENSE'>('PASSPORT')
  const [personalInfo, setPersonalInfo] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    address: '',
    phone: ''
  })

  useEffect(() => {
    if (token) {
      fetchKYCStatus()
    }
  }, [token])

  const fetchKYCStatus = async () => {
    try {
      setLoading(true)
      const data = await api<KYCStatus>(endpoints.kycStatus, { token })
      setStatus(data)
    } catch (error) {
      console.error('KYC status fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = async () => {
    if (!selectedFile || !token) return

    try {
      setUploading(true)
      await uploadFile(endpoints.uploadKycDocument, selectedFile, token, {
        type: documentType,
        ...personalInfo
      })
      
      // Refresh status
      await fetchKYCStatus()
      setSelectedFile(null)
      alert('Hujjat muvaffaqiyatli yuklandi!')
    } catch (error: any) {
      alert('Xatolik: ' + error.message)
    } finally {
      setUploading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-500'
      case 'REJECTED': return 'bg-red-500'
      case 'PENDING': return 'bg-yellow-500'
      default: return 'bg-gray-500'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Tasdiqlangan'
      case 'REJECTED': return 'Rad etilgan'
      case 'PENDING': return 'Kutilayotgan'
      default: return 'Noma\'lum'
    }
  }

  if (loading) {
    return (
      <main className="container mx-auto space-y-6 p-4 md:p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto space-y-6 p-4 md:p-6">
      <Seo title="KYC - Shaxsni tasdiqlash | FairRNG" description="Shaxsni tasdiqlash va KYC jarayoni" />
      
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">KYC - Shaxsni tasdiqlash</h1>
        <p className="text-muted-foreground">
          Xavfsizlik va qonuniylik uchun shaxsni tasdiqlash talab qilinadi
        </p>
      </div>

      {/* Status Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Holat</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.isVerified ? 'Tasdiqlangan' : 'Tasdiqlanmagan'}
            </div>
            <p className="text-xs text-muted-foreground">
              {status?.verificationLevel === 'FULL' ? 'To\'liq tasdiqlash' : 'Asosiy tasdiqlash'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hujjatlar</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{status?.documents.length || 0}</div>
            <p className="text-xs text-muted-foreground">Yuklangan hujjatlar</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Progress className="w-full" value={status?.verificationLevel === 'FULL' ? 100 : 50} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {status?.verificationLevel === 'FULL' ? '100%' : '50%'}
            </div>
            <p className="text-xs text-muted-foreground">Tasdiqlash darajasi</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="upload" className="space-y-4">
        <TabsList>
          <TabsTrigger value="upload">Hujjat yuklash</TabsTrigger>
          <TabsTrigger value="status">Holat</TabsTrigger>
          <TabsTrigger value="info">Shaxsiy ma'lumotlar</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hujjat yuklash</CardTitle>
              <CardDescription>
                Shaxsni tasdiqlash uchun kerakli hujjatlarni yuklang
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Hujjat turi</Label>
                  <select 
                    className="w-full p-2 border rounded-md"
                    value={documentType}
                    onChange={(e) => setDocumentType(e.target.value as any)}
                  >
                    <option value="PASSPORT">Passport</option>
                    <option value="ID_CARD">ID karta</option>
                    <option value="DRIVERS_LICENSE">Haydovchilik guvohnomasi</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label>Fayl tanlash</Label>
                  <Input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                </div>
              </div>

              <Button 
                onClick={handleFileUpload} 
                disabled={!selectedFile || uploading}
                className="w-full"
              >
                {uploading ? (
                  <>
                    <Clock className="mr-2 h-4 w-4 animate-spin" />
                    Yuklanmoqda...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Hujjatni yuklash
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Hujjatlar holati</CardTitle>
              <CardDescription>
                Yuklangan hujjatlarning tasdiqlash holati
              </CardDescription>
            </CardHeader>
            <CardContent>
              {status?.documents.length ? (
                <div className="space-y-4">
                  {status.documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{doc.type}</div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(doc.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(doc.status)}>
                          {getStatusText(doc.status)}
                        </Badge>
                        {doc.adminNote && (
                          <div className="text-sm text-muted-foreground">
                            {doc.adminNote}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Hali hech qanday hujjat yuklanmagan
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Shaxsiy ma'lumotlar</CardTitle>
              <CardDescription>
                KYC uchun kerakli shaxsiy ma'lumotlar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>To'liq ism</Label>
                  <Input
                    value={personalInfo.fullName}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, fullName: e.target.value })}
                    placeholder="To'liq ism"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Tug'ilgan sana</Label>
                  <Input
                    type="date"
                    value={personalInfo.dateOfBirth}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, dateOfBirth: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Millati</Label>
                  <Input
                    value={personalInfo.nationality}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, nationality: e.target.value })}
                    placeholder="Millati"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Telefon</Label>
                  <Input
                    value={personalInfo.phone}
                    onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                    placeholder="+998 XX XXX XX XX"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Manzil</Label>
                <Input
                  value={personalInfo.address}
                  onChange={(e) => setPersonalInfo({ ...personalInfo, address: e.target.value })}
                  placeholder="To'liq manzil"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5" />
              <span>Xavfsizlik</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Barcha ma'lumotlar shifrlangan holda saqlanadi va faqat tasdiqlash uchun ishlatiladi.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5" />
              <span>Vaqt</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              KYC jarayoni 24 soat ichida yakunlanadi. Tezlik uchun barcha hujjatlarni to'liq yuklang.
            </p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
