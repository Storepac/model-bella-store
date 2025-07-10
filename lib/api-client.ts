export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS';

export const getAuthHeader = (): HeadersInit => {
  if (typeof window === 'undefined') return {}
  const token = window.localStorage?.getItem('token')
  return token ? { 'Authorization': `Bearer ${token}` } : {}
}

interface ApiFetchOptions extends RequestInit {
  auth?: boolean // se precisa incluir Authorization
}

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:3001'
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? `${BACKEND_URL}/api`

export async function apiFetch<T = any>(endpoint: string, options: ApiFetchOptions = {}): Promise<T> {
  const { auth = false, ...rest } = options

  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`
  const url = normalized.startsWith('/api/')
    ? `${BACKEND_URL}${normalized}`
    : `${API_BASE_URL}${normalized}`

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...rest.headers,
    ...(auth ? getAuthHeader() : {}),
  }

  const response = await fetch(url, { ...rest, headers })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`${response.status} ${response.statusText}: ${errorText}`)
  }

  if (response.status === 204) {
    // No Content
    return null as T
  }

  return (await response.json()) as T
} 