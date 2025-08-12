export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'

export async function api<T>(
  path: string,
  options: {
    method?: HttpMethod
    body?: unknown
    token?: string | null
    headers?: Record<string, string>
    signal?: AbortSignal
  } = {}
): Promise<T> {
  const { method = 'GET', body, token, headers = {}, signal } = options
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  })
  if (!res.ok) {
    let detail: any = undefined
    try {
      detail = await res.json()
    } catch {}
    throw new Error(detail?.error || `Request failed: ${res.status}`)
  }
  // No content
  if (res.status === 204) return undefined as unknown as T
  return (await res.json()) as T
}

export const endpoints = {
  // Auth
  register: '/api/auth/register',
  login: '/api/auth/login',
  
  // User
  me: '/api/me',
  profile: '/api/profile',
  wallets: '/api/wallets',
  transactions: '/api/transactions',
  
  // Lottery
  rounds: '/api/rounds',
  createRound: '/api/rounds',
  activateRound: (id: string) => `/api/rounds/${id}/activate`,
  closeRound: (id: string) => `/api/rounds/${id}/close`,
  buyTicket: '/api/rounds/buy-ticket',
  roundStats: (id: string) => `/api/admin/rounds/${id}/stats`,
  
  // Content
  news: '/api/news',
  createNews: '/api/news',
  videos: '/api/videos',
  createVideo: '/api/videos',
  
  // Support
  supportTickets: '/api/support/tickets',
  createSupportTicket: '/api/support/tickets',
  updateTicketStatus: (id: string) => `/api/admin/support/tickets/${id}`,
  
  // Mini Games
  miniGames: '/api/minigames',
  miniGameStats: '/api/minigames/stats',
  createGameSession: '/api/minigames/sessions',
  earnPoints: '/api/minigames/earn-points',
  
  // Deposits (Manual Payment System)
  deposits: '/api/deposits',
  createDeposit: '/api/deposits',
  adminDeposits: '/api/admin/deposits',
  approveDeposit: (id: string) => `/api/admin/deposits/${id}/approve`,
  rejectDeposit: (id: string) => `/api/admin/deposits/${id}/reject`,
  
  // Withdrawals
  withdrawals: '/api/withdrawals',
  createWithdrawal: '/api/withdrawals',
  approveWithdrawal: (id: string) => `/api/admin/withdrawals/${id}/approve`,
  rejectWithdrawal: (id: string) => `/api/admin/withdrawals/${id}/reject`,
  
  // KYC
  kycStatus: '/api/kyc/status',
  uploadKycDocument: '/api/kyc/documents',
  adminKYC: '/api/admin/kyc',
  verifyKYC: (userId: string) => `/api/admin/kyc/${userId}/verify`,
  
  // Admin
  adminStats: '/api/admin/dashboard/stats',
  adminUsers: '/api/admin/users',
  updateUser: (userId: string) => `/api/admin/users/${userId}`,
  
  // RNG
  verifyRNG: (roundId: string) => `/api/rng/${roundId}/verify`,
  rngLogs: (roundId: string) => `/api/rng/${roundId}/logs`,
  exportRNGData: (roundId: string) => `/api/rng/${roundId}/export`,
  commitSeed: (roundId: string) => `/api/admin/rng/${roundId}/commit`,
  revealSeed: (roundId: string) => `/api/admin/rng/${roundId}/reveal`,
}

// File upload helper for receipts and KYC documents
export async function uploadFile(
  path: string,
  file: File,
  token: string | null,
  additionalData?: Record<string, any>
): Promise<any> {
  const formData = new FormData()
  formData.append('receipt', file)
  
  if (additionalData) {
    Object.entries(additionalData).forEach(([key, value]) => {
      formData.append(key, value)
    })
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: formData,
  })

  if (!res.ok) {
    let detail: any = undefined
    try {
      detail = await res.json()
    } catch {}
    throw new Error(detail?.error || `Upload failed: ${res.status}`)
  }

  return res.json()
}


