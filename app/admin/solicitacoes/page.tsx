"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Clock, CheckCircle, XCircle, MoreHorizontal, Store, Mail, Phone, Calendar, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminSolicitacoesPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const { toast } = useToast()

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/requests', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('Erro ao carregar solicitações')
      }
      
      const data = await response.json()
      if (data.success) {
        setRequests(data.requests || [])
      }
    } catch (error) {
      console.error('Erro ao carregar solicitações:', error)
      // Dados mock para demonstração
      const mockRequests = [
        {
          id: 1,
          type: "store_registration",
          title: "Nova Loja: Fashion Boutique",
          description: "Solicitação de cadastro de nova loja",
          requesterName: "Maria Santos",
          requesterEmail: "maria@email.com",
          requesterPhone: "(11) 99999-9999",
          status: "pending",
          priority: "medium",
          data: {
            storeName: "Fashion Boutique",
            storeDescription: "Loja de roupas femininas modernas",
            plan: "Pro",
            expectedProducts: 300
          },
          createdAt: "2024-01-20T10:30:00Z",
          updatedAt: "2024-01-20T10:30:00Z"
        },
        {
          id: 2,
          type: "plan_upgrade",
          title: "Upgrade de Plano: Start → Pro",
          description: "Solicitação de upgrade de plano da Bella Store",
          requesterName: "Ana Silva",
          requesterEmail: "ana@bellastore.com",
          requesterPhone: "(11) 88888-8888",
          status: "approved",
          priority: "high",
          data: {
            storeId: 1,
            currentPlan: "Start",
            requestedPlan: "Pro",
            reason: "Necessito cadastrar mais produtos"
          },
          createdAt: "2024-01-19T14:20:00Z",
          updatedAt: "2024-01-19T16:45:00Z"
        },
        {
          id: 3,
          type: "technical_support",
          title: "Problema no upload de imagens",
          description: "Cliente relatando erro ao fazer upload de imagens dos produtos",
          requesterName: "Carlos Oliveira",
          requesterEmail: "carlos@modaexpress.com",
          requesterPhone: "(11) 77777-7777",
          status: "in_progress",
          priority: "high",
          data: {
            storeId: 3,
            errorDetails: "Erro 500 ao fazer upload de imagens maiores que 2MB",
            browserInfo: "Chrome 120.0.0.0"
          },
          createdAt: "2024-01-18T09:15:00Z",
          updatedAt: "2024-01-18T11:30:00Z"
        },
        {
          id: 4,
          type: "refund_request",
          title: "Solicitação de Reembolso - Plano Pro",
          description: "Cliente solicitando reembolso por cancelamento antecipado",
          requesterName: "Beatriz Lima",
          requesterEmail: "beatriz@boutique.com",
          requesterPhone: "(11) 66666-6666",
          status: "rejected",
          priority: "low",
          data: {
            storeId: 5,
            plan: "Pro",
            paymentDate: "2024-01-01T00:00:00Z",
            reason: "Não consegui usar todas as funcionalidades"
          },
          createdAt: "2024-01-17T16:45:00Z",
          updatedAt: "2024-01-17T18:20:00Z"
        }
      ]
      setRequests(mockRequests)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (requestId: number, newStatus: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/admin/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast({
          title: 'Status atualizado',
          description: 'Status da solicitação foi atualizado com sucesso.'
        })
        fetchRequests() // Recarregar lista
      } else {
        throw new Error('Erro ao atualizar status')
      }
    } catch (error) {
      toast({
        title: 'Erro',
        description: 'Erro ao atualizar status da solicitação.',
        variant: 'destructive'
      })
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800"
      case "in_progress": return "bg-blue-100 text-blue-800"
      case "approved": return "bg-green-100 text-green-800"
      case "rejected": return "bg-red-100 text-red-800"
      case "completed": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending": return "Pendente"
      case "in_progress": return "Em Andamento"
      case "approved": return "Aprovada"
      case "rejected": return "Rejeitada"
      case "completed": return "Concluída"
      default: return status
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return Clock
      case "in_progress": return AlertCircle
      case "approved": return CheckCircle
      case "rejected": return XCircle
      case "completed": return CheckCircle
      default: return Clock
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "store_registration": return "Cadastro de Loja"
      case "plan_upgrade": return "Upgrade de Plano"
      case "technical_support": return "Suporte Técnico"
      case "refund_request": return "Reembolso"
      default: return type
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800"
      case "medium": return "bg-yellow-100 text-yellow-800"
      case "low": return "bg-green-100 text-green-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.requesterEmail.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === "all" || request.status === statusFilter
    const matchesType = typeFilter === "all" || request.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

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
        <h1 className="text-3xl font-bold">Solicitações Pendentes</h1>
        <p className="text-muted-foreground">Gerencie todas as solicitações do sistema</p>
      </div>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Buscar por título, solicitante ou email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:w-80"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="pending">Pendentes</SelectItem>
            <SelectItem value="in_progress">Em Andamento</SelectItem>
            <SelectItem value="approved">Aprovadas</SelectItem>
            <SelectItem value="rejected">Rejeitadas</SelectItem>
            <SelectItem value="completed">Concluídas</SelectItem>
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="md:w-48">
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="store_registration">Cadastro de Loja</SelectItem>
            <SelectItem value="plan_upgrade">Upgrade de Plano</SelectItem>
            <SelectItem value="technical_support">Suporte Técnico</SelectItem>
            <SelectItem value="refund_request">Reembolso</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{requests.length}</p>
              </div>
              <Clock className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Pendentes</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'pending').length}</p>
              </div>
              <Clock className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Em Andamento</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'in_progress').length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Aprovadas</p>
                <p className="text-2xl font-bold">{requests.filter(r => r.status === 'approved').length}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Solicitações */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Solicitações</CardTitle>
          <CardDescription>
            {filteredRequests.length} solicitação(ões) encontrada(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Solicitação</TableHead>
                <TableHead>Solicitante</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Prioridade</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((request) => {
                const StatusIcon = getStatusIcon(request.status)
                
                return (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.title}</div>
                        <div className="text-sm text-muted-foreground">{request.description}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{request.requesterName}</div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-1">
                          <Mail className="h-3 w-3" />
                          <span>{request.requesterEmail}</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center space-x-1">
                          <Phone className="h-3 w-3" />
                          <span>{request.requesterPhone}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getTypeLabel(request.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <StatusIcon className="h-4 w-4" />
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusLabel(request.status)}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(request.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedRequest(request)
                              setIsDialogOpen(true)
                            }}
                          >
                            Ver Detalhes
                          </DropdownMenuItem>
                          {request.status === 'pending' && (
                            <>
                              <DropdownMenuItem
                                onClick={() => updateRequestStatus(request.id, 'approved')}
                              >
                                Aprovar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => updateRequestStatus(request.id, 'rejected')}
                                className="text-red-600"
                              >
                                Rejeitar
                              </DropdownMenuItem>
                            </>
                          )}
                          {request.status === 'approved' && (
                            <DropdownMenuItem
                              onClick={() => updateRequestStatus(request.id, 'completed')}
                            >
                              Marcar como Concluída
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Dialog de Detalhes */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes da Solicitação</DialogTitle>
            <DialogDescription>
              Informações completas da solicitação
            </DialogDescription>
          </DialogHeader>
          
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">{selectedRequest.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedRequest.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-1">Tipo</h4>
                  <Badge variant="outline">
                    {getTypeLabel(selectedRequest.type)}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-1">Prioridade</h4>
                  <Badge className={getPriorityColor(selectedRequest.priority)}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Dados Adicionais</h4>
                <div className="bg-gray-50 p-3 rounded text-sm">
                  <pre>{JSON.stringify(selectedRequest.data, null, 2)}</pre>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Criada em:</span>
                  <div className="font-medium">
                    {new Date(selectedRequest.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Atualizada em:</span>
                  <div className="font-medium">
                    {new Date(selectedRequest.updatedAt).toLocaleString('pt-BR')}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 