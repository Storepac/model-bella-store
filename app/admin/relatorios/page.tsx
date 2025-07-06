"use client"
import { useEffect, useState } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { BarChart3 } from 'lucide-react'

export default function AdminReports() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/reports')
        const json = await res.json()
        setData(json.reports)
      } catch {
        setData(null)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <p>Carregando...</p>
  if (!data) return <p>Erro ao carregar relatórios.</p>

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Total de Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">R$ {data.totalVendas?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total de Clientes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalClientes}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Total de Produtos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalProdutos}</div>
        </CardContent>
      </Card>
    </div>
  )
} 