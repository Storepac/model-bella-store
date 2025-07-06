"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function AdminOverview() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/admin/overview?storeId=1')
        const json = await res.json()
        setData(json)
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p>Carregando...</p>
  if (!data) return <p>Erro ao carregar dados.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProducts}</div>
          <p className="text-sm text-muted-foreground">Limite: {data.plan.limits.products}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Fotos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalPhotos}</div>
          <p className="text-sm text-muted-foreground">Limite: {data.plan.limits.photosPerProduct} por produto</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Vídeos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalVideos}</div>
          <p className="text-sm text-muted-foreground">{data.plan.limits.video ? 'Permitido' : 'Não permitido'}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Plano</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.plan.name}</div>
          <p className="text-sm text-muted-foreground">Loja: loja001</p>
        </CardContent>
      </Card>
    </div>
  )
} 