// Cache para storeId por host
const storeIdCache = new Map<string, number>()

// Função para resolver storeId baseado no host/domínio
export function resolveStoreId(host: string, searchParams?: URLSearchParams): number {
  // Se há storeId na URL, usar ele
  const storeIdParam = searchParams?.get('store')
  if (storeIdParam) {
    const storeId = parseInt(storeIdParam)
    if (!isNaN(storeId)) {
      return storeId
    }
  }

  // Verificar cache
  if (storeIdCache.has(host)) {
    return storeIdCache.get(host)!
  }

  // Lógica para resolver storeId baseado no host
  // Por enquanto, usar storeId padrão 1
  const defaultStoreId = 1
  
  // Cachear resultado
  storeIdCache.set(host, defaultStoreId)
  
  return defaultStoreId
}

// Função para limpar cache (útil para testes)
export function clearStoreIdCache() {
  storeIdCache.clear()
} 