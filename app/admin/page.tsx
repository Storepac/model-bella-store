"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

export default function AdminOverview() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    console.log('🔍 Admin page carregada')
    
    const fetchData = async () => {
      try {
        console.log('🔍 Fazendo requisição para admin/overview')
        const token = localStorage.getItem('token')
        console.log('🔍 Token:', token ? 'Encontrado' : 'Não encontrado')
        
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/overview`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        console.log('🔍 Status da resposta:', res.status)
        const json = await res.json()
        console.log('🔍 Resposta:', json)
        
        if (json.success) {
          setData(json.data)
        } else {
          setError(json.message || 'Erro desconhecido')
        }
      } catch (err) {
        console.error('❌ Erro na requisição:', err)
        setError('Erro ao carregar dados')
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [])

  if (loading) return <div className="p-6"><p>Carregando...</p></div>
  if (error) return <div className="p-6"><p>Erro: {error}</p></div>
  if (!data) return <div className="p-6"><p>Nenhum dado encontrado.</p></div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Painel Administrativo</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Lojas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalStores || 0}</div>
            <p className="text-sm text-muted-foreground">Total de lojas cadastradas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalUsers || 0}</div>
            <p className="text-sm text-muted-foreground">Total de usuários</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Produtos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalProducts || 0}</div>
            <p className="text-sm text-muted-foreground">Total de produtos</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pedidos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.totalOrders || 0}</div>
            <p className="text-sm text-muted-foreground">Total de pedidos</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 