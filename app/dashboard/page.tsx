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
} from "lucide-react"
import { useState, useEffect } from 'react'

// Mock data para demonstração
const stats = {
  totalProducts: 156,
  totalOrders: 89,
  totalCustomers: 234,
  revenue: 12450.0,
  avgTicket: 139.89,
  conversionRate: 3.2,
  topProducts: [
    { name: "Vestido Midi Floral", views: 1234, sales: 45 },
    { name: "Blusa Cropped Manga Longa", views: 987, sales: 32 },
    { name: "Calça Jeans Skinny", views: 876, sales: 28 },
    { name: "Tênis Chunky Branco", views: 654, sales: 21 },
  ],
  recentOrders: [
    { id: "#001", customer: "Maria Silva", total: 159.9, status: "pending", time: "2 min" },
    { id: "#002", customer: "Ana Costa", total: 289.8, status: "confirmed", time: "15 min" },
    { id: "#003", customer: "Julia Santos", total: 89.9, status: "delivered", time: "1h" },
    { id: "#004", customer: "Carla Oliveira", total: 199.9, status: "pending", time: "2h" },
  ],
}

const abas = [
  { key: 'overview', label: 'Visão Geral' },
  { key: 'reports', label: 'Relatórios' },
  { key: 'notifications', label: 'Notificações' },
  { key: 'clients', label: 'Clientes' },
  { key: 'requests', label: 'Solicitações Pendentes' },
  { key: 'settings', label: 'Configurações' },
]

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua loja</p>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Loja Online
          </Badge>
          <Button>Ver Loja</Button>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Produtos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">+12 este mês</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +23% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +18% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faturamento</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.revenue.toLocaleString("pt-BR")}</div>
            <p className="text-xs text-green-600 flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +15% vs mês anterior
            </p>
          </CardContent>
        </Card>
      </div>
      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {stats.avgTicket.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Valor médio por pedido</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Taxa de Conversão</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.conversionRate}%</div>
            <p className="text-xs text-red-600 flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              -0.5% vs mês anterior
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Avaliação Média</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">4.8</div>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Baseado em 127 avaliações</p>
          </CardContent>
        </Card>
      </div>
      {/* Charts and Tables */}
      {/* ... manter o restante do dashboard antigo ... */}
    </div>
  )
}
