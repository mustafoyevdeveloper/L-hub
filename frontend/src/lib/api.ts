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
  register: '/api/auth/register',
  login: '/api/auth/login',
  wallets: '/api/wallets',
  rounds: '/api/rounds',
  buyTicket: (roundId: string) => `/api/rounds/${roundId}/tickets`,
  closeRound: (roundId: string) => `/api/rounds/${roundId}/close`,
  supportTickets: '/api/support/tickets',
}


