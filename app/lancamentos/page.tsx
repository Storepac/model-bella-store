"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ProductCard from '@/components/product-card'
import { getUserStoreId } from '@/lib/store-data'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { resolveStoreId } from '@/lib/store-id'

export default function LancamentosPage() {
  const [produtos, setProdutos] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [storeId, setStoreId] = useState<number | null>(null)

  useEffect(() => {
    const fetchLancamentos = async () => {
      setLoading(true)
      try {
        const resolvedStoreId = await resolveStoreId()
        setStoreId(resolvedStoreId)
        const res = await fetch(`/api/products?storeId=${resolvedStoreId}&isLaunch=1`)
        const data = await res.json()
        if (data.success && Array.isArray(data.products)) {
          setProdutos(data.products)
        } else {
          setProdutos([])
        }
      } catch {
        setProdutos([])
      } finally {
        setLoading(false)
      }
    }
    fetchLancamentos()
  }, [])

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">🚀 Lançamentos</CardTitle>
          <CardDescription>Confira os produtos mais novos e exclusivos da loja!</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Carregando lançamentos...</p>
          ) : produtos.length === 0 ? (
            <p>Nenhum produto de lançamento encontrado.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {produtos.map(produto => (
                <ProductCard key={produto.id} produto={produto} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 