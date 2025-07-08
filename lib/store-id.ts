let cachedStoreId: number | null = null
let cachedHost: string | null = null

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';

/**
 * Obtém o storeId a partir do domínio atual (window.location.host), consultando o backend.
 * Usa cache em memória para evitar múltiplas requisições.
 */
export async function resolveStoreId(): Promise<number> {
  if (typeof window === 'undefined') throw new Error('Só pode ser usado no client')
  
  const url = new URL(window.location.href);
  const storeIdParam = url.searchParams.get('store');
  if (storeIdParam) {
    console.log(`[STORE-ID] Usando storeId da URL: ${storeIdParam}`);
    return Number(storeIdParam);
  }

  const host = window.location.host
  if (cachedStoreId && cachedHost === host) return cachedStoreId

  const res = await fetch(`${BACKEND_URL}/api/stores/resolve-store?host=${encodeURIComponent(host)}`)
  const data = await res.json()
  
  if (!data.success) throw new Error(data.message || 'Loja não encontrada para este domínio')
  
  cachedStoreId = data.storeId
  cachedHost = host
  
  console.log(`[STORE-ID] Resolvido para o host ${host}: storeId ${cachedStoreId}`);
  return cachedStoreId
} 