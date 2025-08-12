import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api, endpoints } from '@/lib/api'

type User = {
  id: string
  email: string
  fullName: string
  role: 'USER' | 'ADMIN'
}

type AuthContextValue = {
  user: User | null
  token: string | null
  isAdmin: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  // Two-step registration
  startRegister: (data: { email: string; password: string; fullName: string; country: string; phone: string }) => Promise<void>
  verifyRegister: (email: string, code: string) => Promise<void>
  // Password recovery
  forgotPassword: (email: string) => Promise<void>
  resetPassword: (email: string, code: string, newPassword: string) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'auth_token'
const USER_STORAGE_KEY = 'auth_user'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Sahifa yuklanganda token va user ma'lumotlarini yuklash
  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const savedToken = localStorage.getItem(STORAGE_KEY)
        const savedUser = localStorage.getItem(USER_STORAGE_KEY)
        
        if (savedToken && savedUser) {
          // Token va user ma'lumotlari mavjud
          const userData = JSON.parse(savedUser)
          setToken(savedToken)
          setUser(userData)
          
          // Token haqiqiy ekanligini tekshirish - health endpoint'ni ishlatamiz
          try {
            await api('/health', { token: savedToken })
            console.log('✅ Token haqiqiy, user ma\'lumotlari yuklandi')
          } catch (error) {
            // Token eskirgan, uni o'chirish
            console.log('❌ Token eskirgan, o\'chirilmoqda...')
            localStorage.removeItem(STORAGE_KEY)
            localStorage.removeItem(USER_STORAGE_KEY)
            setToken(null)
            setUser(null)
          }
        }
      } catch (error) {
        console.error('Auth ma\'lumotlari yuklashda xatolik:', error)
        // Xatolik bo'lsa, barcha ma'lumotlarni o'chirish
        localStorage.removeItem(STORAGE_KEY)
        localStorage.removeItem(USER_STORAGE_KEY)
        setToken(null)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    loadAuthData()
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api<{ token: string; user: User }>(endpoints.login, { method: 'POST', body: { email, password } })
    
    // Token va user ma'lumotlarini saqlash
    localStorage.setItem(STORAGE_KEY, res.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user))
    
    setToken(res.token)
    setUser(res.user)
  }

  const startRegister = async (data: { email: string; password: string; fullName: string; country: string; phone: string }) => {
    await api<void>(endpoints.registerRequest, { method: 'POST', body: data })
  }

  const verifyRegister = async (email: string, code: string) => {
    const res = await api<{ token: string; user: User }>(endpoints.registerVerify, { method: 'POST', body: { email, code } })
    
    // Token va user ma'lumotlarini saqlash
    localStorage.setItem(STORAGE_KEY, res.token)
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user))
    
    setToken(res.token)
    setUser(res.user)
  }

  const forgotPassword = async (email: string) => {
    await api<void>(endpoints.forgotPassword, { method: 'POST', body: { email } })
  }

  const resetPassword = async (email: string, code: string, newPassword: string) => {
    await api<void>(endpoints.resetPassword, { method: 'POST', body: { email, code, newPassword } })
  }

  const logout = () => {
    // Barcha ma'lumotlarni o'chirish
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAdmin: !!user && user.role === 'ADMIN',
    isLoading,
    login,
    startRegister,
    verifyRegister,
    forgotPassword,
    resetPassword,
    logout,
  }), [user, token, isLoading])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


