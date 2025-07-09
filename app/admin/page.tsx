"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function AdminOverview() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/overview`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        const json = await res.json()
        if (json.success) {
          setData(json.data)
        } else {
          setData(null)
        }
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
          <CardTitle>Lojas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalStores}</div>
          <p className="text-sm text-muted-foreground">Total de lojas cadastradas</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalUsers}</div>
          <p className="text-sm text-muted-foreground">Total de usuários</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProducts}</div>
          <p className="text-sm text-muted-foreground">Total de produtos</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pedidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalOrders}</div>
          <p className="text-sm text-muted-foreground">Total de pedidos</p>
        </CardContent>
      </Card>
    </div>
  )
} 