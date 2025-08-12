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
  login: (email: string, password: string) => Promise<void>
  register: (data: { email: string; password: string; fullName: string; country: string }) => Promise<void>
  logout: () => void
}

const STORAGE_KEY = 'auth_token'

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) setToken(saved)
  }, [])

  const login = async (email: string, password: string) => {
    const res = await api<{ token: string; user: User }>(endpoints.login, { method: 'POST', body: { email, password } })
    localStorage.setItem(STORAGE_KEY, res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const register = async (data: { email: string; password: string; fullName: string; country: string }) => {
    const res = await api<{ token: string; user: User }>(endpoints.register, { method: 'POST', body: data })
    localStorage.setItem(STORAGE_KEY, res.token)
    setToken(res.token)
    setUser(res.user)
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    isAdmin: !!user && user.role === 'ADMIN',
    login,
    register,
    logout,
  }), [user, token])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}


