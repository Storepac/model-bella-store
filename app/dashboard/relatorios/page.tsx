"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { TrendingUp, TrendingDown, DollarSign, ShoppingBag, Users, Eye, Download } from "lucide-react"

// Mock data para relatórios
const salesData = [
  { month: "Jan", vendas: 12500, pedidos: 45, clientes: 38 },
  { month: "Fev", vendas: 15800, pedidos: 52, clientes: 44 },
  { month: "Mar", vendas: 18200, pedidos: 61, clientes: 51 },
  { month: "Abr", vendas: 16900, pedidos: 58, clientes: 49 },
  { month: "Mai", vendas: 21300, pedidos: 72, clientes: 63 },
  { month: "Jun", vendas: 19800, pedidos: 68, clientes: 58 },
]

const productData = [
  { name: "Vestidos", vendas: 45, valor: 7200, views: 1250 },
  { name: "Blusas", vendas: 38, valor: 3420, views: 980 },
  { name: "Calças", vendas: 32, valor: 4160, views: 850 },
  { name: "Sapatos", vendas: 28, valor: 5600, views: 720 },
  { name: "Acessórios", vendas: 22, valor: 2860, views: 650 },
]

const categoryData = [
  { name: "Vestidos", value: 35, color: "#8884d8" },
  { name: "Blusas", value: 25, color: "#82ca9d" },
  { name: "Calças", value: 20, color: "#ffc658" },
  { name: "Sapatos", value: 15, color: "#ff7300" },
  { name: "Acessórios", value: 5, color: "#00ff00" },
]

const topProducts = [
  { name: "Vestido Midi Floral", vendas: 15, valor: 2385, views: 320 },
  { name: "Blusa Cropped Básica", vendas: 12, valor: 1078, views: 280 },
  { name: "Calça Jeans Skinny", vendas: 10, valor: 1299, views: 250 },
  { name: "Tênis Chunky Branco", vendas: 8, valor: 1599, views: 200 },
  { name: "Bolsa Transversal", vendas: 7, valor: 909, views: 180 },
]

export default function RelatoriosPage() {
  const [relatorios, setRelatorios] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")

  const currentMonth = salesData[salesData.length - 1]
  const previousMonth = salesData[salesData.length - 2]

  const salesGrowth = ((currentMonth.vendas - previousMonth.vendas) / previousMonth.vendas) * 100
  const ordersGrowth = ((currentMonth.pedidos - previousMonth.pedidos) / previousMonth.pedidos) * 100
  const customersGrowth = ((currentMonth.clientes - previousMonth.clientes) / previousMonth.clientes) * 100

  const totalViews = productData.reduce((sum, product) => sum + product.views, 0)
  const totalSales = productData.reduce((sum, product) => sum + product.vendas, 0)
  const conversionRate = (totalSales / totalViews) * 100

  useEffect(() => {
    const fetchRelatorios = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/reports')
        const data = await res.json()
        setRelatorios(data.reports || [])
      } catch (err) {
        setRelatorios([])
      } finally {
        setLoading(false)
      }
    }
    fetchRelatorios()
  }, [])

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Relatórios</h1>
          <p className="text-muted-foreground">Análise detalhada do desempenho da sua loja</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full px-3 py-2 border rounded-md text-sm bg-white sm:w-auto"
          >
            <option value="7d">Últimos 7 dias</option>
            <option value="30d">Últimos 30 dias</option>
            <option value="90d">Últimos 90 dias</option>
            <option value="1y">Último ano</option>
          </select>
          <Button variant="outline" size="sm" className="w-full sm:w-auto py-3 text-base sm:py-2">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Vendas</p>
                <p className="text-2xl font-bold">R$ {currentMonth.vendas.toLocaleString()}</p>
                <div className="flex items-center gap-1 mt-1">
                  {salesGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${salesGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(salesGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pedidos</p>
                <p className="text-2xl font-bold">{currentMonth.pedidos}</p>
                <div className="flex items-center gap-1 mt-1">
                  {ordersGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(ordersGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <ShoppingBag className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold">{currentMonth.clientes}</p>
                <div className="flex items-center gap-1 mt-1">
                  {customersGrowth >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-600" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-600" />
                  )}
                  <span className={`text-xs ${customersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {Math.abs(customersGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="h-8 w-8 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-4 w-4 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Conversão</p>
                <p className="text-2xl font-bold">{conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {totalSales} vendas / {totalViews} visualizações
                </p>
              </div>
              <div className="h-8 w-8 bg-orange-100 rounded-full flex items-center justify-center">
                <Eye className="h-4 w-4 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="vendas" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="categorias">Categorias</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Vendas */}
        <TabsContent value="vendas" className="space-y-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Evolução das Vendas</CardTitle>
                <CardDescription>Vendas mensais em reais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[320px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-0">
                <ChartContainer
                  config={{
                    vendas: {
                      label: "Vendas",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                      className="h-[220px] sm:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={salesData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" fontSize={12} />
                          <YAxis fontSize={12} />
                          <ChartTooltip content={<ChartTooltipContent />} wrapperStyle={{ fontSize: 12 }} />
                      <Line
                        type="monotone"
                        dataKey="vendas"
                        stroke="var(--color-vendas)"
                        strokeWidth={2}
                        dot={{ fill: "var(--color-vendas)" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Pedidos por Mês</CardTitle>
                <CardDescription>Quantidade de pedidos mensais</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full overflow-x-auto">
                  <div className="min-w-[320px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-0">
                <ChartContainer
                  config={{
                    pedidos: {
                      label: "Pedidos",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                      className="h-[220px] sm:h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={salesData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="month" fontSize={12} />
                          <YAxis fontSize={12} />
                          <ChartTooltip content={<ChartTooltipContent />} wrapperStyle={{ fontSize: 12 }} />
                      <Bar dataKey="pedidos" fill="var(--color-pedidos)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Produtos */}
        <TabsContent value="produtos" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top 5 Produtos</CardTitle>
                <CardDescription>Produtos mais vendidos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topProducts.map((product, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-blue-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.views} visualizações</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{product.vendas} vendas</p>
                        <p className="text-sm text-muted-foreground">R$ {product.valor.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Performance por Categoria</CardTitle>
                <CardDescription>Vendas e visualizações por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    vendas: {
                      label: "Vendas",
                      color: "hsl(var(--chart-1))",
                    },
                    views: {
                      label: "Visualizações",
                      color: "hsl(var(--chart-2))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="vendas" fill="var(--color-vendas)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Categorias */}
        <TabsContent value="categorias" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Categoria</CardTitle>
                <CardDescription>Percentual de vendas por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Vendas",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => percent !== undefined ? `${name} ${(percent * 100).toFixed(0)}%` : name}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ranking de Categorias</CardTitle>
                <CardDescription>Desempenho detalhado por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {productData.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">{category.views} visualizações</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{category.vendas} vendas</p>
                        <p className="text-sm text-muted-foreground">R$ {category.valor.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Performance */}
        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Taxa de Conversão</CardTitle>
                <CardDescription>Conversão de visualizações em vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-600 mb-2">{conversionRate.toFixed(1)}%</div>
                  <p className="text-sm text-muted-foreground">
                    {totalSales} vendas de {totalViews} visualizações
                  </p>
                  <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: `${Math.min(conversionRate, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ticket Médio</CardTitle>
                <CardDescription>Valor médio por pedido</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">
                    R$ {(currentMonth.vendas / currentMonth.pedidos).toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">Baseado em {currentMonth.pedidos} pedidos</p>
                  <div className="mt-4">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      +{salesGrowth.toFixed(1)}% vs mês anterior
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Crescimento</CardTitle>
                <CardDescription>Crescimento mensal</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Vendas</span>
                    <div className="flex items-center gap-1">
                      {salesGrowth >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-medium ${salesGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {salesGrowth >= 0 ? "+" : ""}
                        {salesGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Pedidos</span>
                    <div className="flex items-center gap-1">
                      {ordersGrowth >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-medium ${ordersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {ordersGrowth >= 0 ? "+" : ""}
                        {ordersGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Clientes</span>
                    <div className="flex items-center gap-1">
                      {customersGrowth >= 0 ? (
                        <TrendingUp className="h-4 w-4 text-green-600" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-600" />
                      )}
                      <span className={`font-medium ${customersGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
                        {customersGrowth >= 0 ? "+" : ""}
                        {customersGrowth.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
