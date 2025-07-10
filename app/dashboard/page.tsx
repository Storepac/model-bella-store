"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Eye,
  DollarSign,
  Clock,
  Star,
  Tag,
  Mail,
} from "lucide-react"
import { useState, useEffect } from 'react'
import { apiFetch } from '@/lib/api-client'

export default function DashboardPage() {
  const [storeData, setStoreData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || '{}') : {}
    const storeId = user?.storeId
    if (!storeId) {
      setError('Loja não encontrada para este usuário.')
      setLoading(false)
      return
    }
    apiFetch(`/stores/${storeId}`)
      .then(res => {
        if (res.success) setStoreData(res.data)
        else setError('Loja não encontrada.')
      })
      .catch(() => setError('Erro ao buscar dados da loja.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-8">Carregando...</div>
  if (error) return <div className="p-8 text-red-500">{error}</div>

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da loja: <b>{storeData?.store_name || storeData?.name}</b></p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Loja Online
          </Badge>
          <Button asChild>
            <a href="/catalogo" target="_blank">Ver Loja</a>
          </Button>
        </div>
      </div>
      {/* Exemplo de exibição de dados reais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Código</CardTitle>
            <Tag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeData?.store_code}</div>
            <p className="text-xs text-muted-foreground">Identificação da loja</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Plano</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeData?.settings?.plano || 'Start'}</div>
            <p className="text-xs text-muted-foreground">Limite de produtos: {storeData?.settings?.limite_produtos}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contato</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeData?.whatsapp_number || '-'}</div>
            <p className="text-xs text-muted-foreground">WhatsApp</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">E-mail</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{storeData?.email || '-'}</div>
            <p className="text-xs text-muted-foreground">E-mail cadastrado</p>
          </CardContent>
        </Card>
      </div>
      {/* Charts and Tables */}
      {/* ... manter o restante do dashboard antigo ... */}
    </div>
  )
}
