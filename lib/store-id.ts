let cachedStoreId: number | null = null
let cachedHost: string | null = null

/**
 * Obtém o storeId a partir do domínio atual (window.location.host), consultando o backend.
 * Usa cache em memória para evitar múltiplas requisições.
 */
export async function resolveStoreId(): Promise<number> {
  if (typeof window === 'undefined') throw new Error('Só pode ser usado no client')
  const host = window.location.host
  if (cachedStoreId && cachedHost === host) return cachedStoreId

  const res = await fetch(`/api/store-resolve?host=${encodeURIComponent(host)}`)
  const data = await res.json()
  if (!data.success) throw new Error(data.error || 'Loja não encontrada para este domínio')
  cachedStoreId = data.storeId
  cachedHost = host
  return cachedStoreId
} 