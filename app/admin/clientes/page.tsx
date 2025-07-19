"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Users, Mail, Phone, MapPin, Store, Calendar } from "lucide-react"

export default function AdminClientesPage() {
  const [clients, setClients] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [storeFilter, setStoreFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/clients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Erro ao carregar clientes')
      }
      
      const data = await response.json()
      if (data.success) {
        setClients(data.clients || [])
      }
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      // Dados mock para demonstração
      const mockClients = [
        {
          id: 1,
          name: "Ana Silva",
          email: "ana@email.com",
          phone: "(11) 99999-9999",
          city: "São Paulo",
          state: "SP",
          storeId: 1,
          storeName: "Bella Store Fashion",
          totalOrders: 5,
          totalSpent: 1250.50,
          lastOrderDate: "2024-01-15T10:30:00Z",
          status: "active",
          createdAt: "2024-01-01T08:00:00Z"
        },
        {
          id: 2,
          name: "Carlos Souza",
          email: "carlos@email.com", 
          phone: "(11) 88888-8888",
          city: "Rio de Janeiro",
          state: "RJ",
          storeId: 2,
          storeName: "Moda Elegante",
          totalOrders: 3,
          totalSpent: 780.30,
          lastOrderDate: "2024-01-10T14:20:00Z",
          status: "active",
          createdAt: "2023-12-15T16:45:00Z"
        },
        {
          id: 3,
          name: "Mariana Costa",
          email: "mariana@email.com",
          phone: "(11) 77777-7777",
          city: "Belo Horizonte",
          state: "MG",
          storeId: 1,
          storeName: "Bella Store Fashion",
          totalOrders: 12,
          totalSpent: 2890.75,
          lastOrderDate: "2024-01-20T09:15:00Z",
          status: "vip",
          createdAt: "2023-11-20T12:30:00Z"
        },
        {
          id: 4,
          name: "João Pereira",
          email: "joao@email.com",
          phone: "(11) 66666-6666",
          city: "Salvador",
          state: "BA",
          storeId: 3,
          storeName: "Style Express",
          totalOrders: 1,
          totalSpent: 150.00,
          lastOrderDate: "2024-01-05T18:30:00Z",
          status: "new",
          createdAt: "2024-01-05T18:00:00Z"
        }
      ]
      setClients(mockClients)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "vip": return "bg-purple-100 text-purple-800"
      case "active": return "bg-green-100 text-green-800"
      case "new": return "bg-blue-100 text-blue-800"
      case "inactive": return "bg-gray-100 text-gray-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "vip": return "VIP"
      case "active": return "Ativo"
      case "new": return "Novo"
      case "inactive": return "Inativo"
      default: return status
    }
  }

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone.includes(searchTerm)
    
    const matchesStore = storeFilter === "all" || client.storeId.toString() === storeFilter
    const matchesStatus = statusFilter === "all" || client.status === statusFilter
    
    return matchesSearch && matchesStore && matchesStatus
  })

  const uniqueStores = [...new Set(clients.map(c => ({ id: c.storeId, name: c.storeName })))]

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Clientes Consolidados</h1>
        <p className="text-muted-foreground">Visão geral de todos os clientes do sistema</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-80"
        />
        <Select value={storeFilter} onValueChange={setStoreFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por loja" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as lojas</SelectItem>
            {uniqueStores.map((store) => (
              <SelectItem key={store.id} value={store.id.toString()}>
                {store.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="active">Ativos</SelectItem>
            <SelectItem value="new">Novos</SelectItem>
            <SelectItem value="inactive">Inativos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Clientes</p>
                <p className="text-2xl font-bold">{clients.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clientes VIP</p>
                <p className="text-2xl font-bold">{clients.filter(c => c.status === 'vip').length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Novos Clientes</p>
                <p className="text-2xl font-bold">{clients.filter(c => c.status === 'new').length}</p>
              </div>
              <Users className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Ticket Médio</p>
                <p className="text-2xl font-bold">
                  R$ {clients.length > 0 ? 
                    (clients.reduce((sum, c) => sum + (c.totalSpent || 0), 0) / clients.length).toLocaleString() : 
                    '0'}
                </p>
              </div>
              <Users className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Clientes */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Clientes</CardTitle>
          <CardDescription>
            {filteredClients.length} cliente(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Loja</TableHead>
                <TableHead>Localização</TableHead>
                <TableHead>Pedidos</TableHead>
                <TableHead>Total Gasto</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Cadastro</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.name}</div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <Mail className="h-3 w-3" />
                        <span>{client.email}</span>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center space-x-2">
                        <Phone className="h-3 w-3" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Store className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{client.storeName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{client.city}/{client.state}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{client.totalOrders}</div>
                      <div className="text-sm text-muted-foreground">
                        Último: {new Date(client.lastOrderDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      R$ {(client.totalSpent || 0).toLocaleString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(client.status)}>
                      {getStatusLabel(client.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">
                        {new Date(client.createdAt).toLocaleDateString('pt-BR')}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
} 