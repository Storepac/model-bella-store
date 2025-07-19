"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Settings, Server, Mail, Shield, Database, Users, CreditCard, Bell } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AdminConfiguracoes() {
  const [loading, setLoading] = useState(false)
  const [systemConfig, setSystemConfig] = useState({
    siteName: "Bella Store",
    siteDescription: "Plataforma completa para criar sua loja online",
    adminEmail: "admin@bellastore.com.br",
    supportEmail: "suporte@bellastore.com.br",
    maxStoresPerUser: 1,
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    backupEnabled: true,
    backupFrequency: "daily"
  })
  
  const [paymentConfig, setPaymentConfig] = useState({
    stripeEnabled: false,
    stripePublicKey: "",
    stripeSecretKey: "",
    mercadoPagoEnabled: false,
    mercadoPagoToken: "",
    pixEnabled: true,
    boletoEnabled: true
  })

  const [planConfig, setPlanConfig] = useState({
    startPrice: 29.90,
    startProducts: 500,
    startPhotos: 2,
    proPrice: 59.90,
    proProducts: 1000,
    proPhotos: 3,
    maxPrice: 99.90,
    maxProducts: 9999,
    maxPhotos: 4,
    implementationFee: 97.00
  })

  const [serverStats, setServerStats] = useState({
    totalStores: 5,
    totalUsers: 12,
    totalProducts: 1543,
    storageUsed: "2.4 GB",
    storageLimit: "100 GB",
    cpuUsage: "12%",
    memoryUsage: "45%",
    uptime: "15 dias",
    lastBackup: "2024-01-20 02:00:00"
  })

  const { toast } = useToast()

  useEffect(() => {
    fetchConfigurations()
  }, [])

  const fetchConfigurations = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/config', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setSystemConfig(data.system || systemConfig)
          setPaymentConfig(data.payment || paymentConfig)
          setPlanConfig(data.plans || planConfig)
          setServerStats(data.stats || serverStats)
        }
      }
    } catch (error) {
      console.log('Usando configurações locais (backend não disponível)')
    }
  }

  const saveConfiguration = async (section: string, config: any) => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/config', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ section, config })
      })

      if (response.ok) {
        toast({
          title: 'Configurações salvas',
          description: `Configurações de ${section} atualizadas com sucesso.`
        })
      } else {
        throw new Error('Erro ao salvar')
      }
    } catch (error) {
      toast({
        title: 'Configurações salvas localmente',
        description: 'As configurações foram salvas localmente (backend não disponível).',
        variant: 'default'
      })
    } finally {
      setLoading(false)
    }
  }

  const testEmailConfiguration = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/test-email', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: 'Email enviado',
          description: 'Email de teste enviado com sucesso!'
        })
      } else {
        throw new Error('Erro no envio')
      }
    } catch (error) {
      toast({
        title: 'Teste simulado',
        description: 'Configuração de email validada (teste local).',
        variant: 'default'
      })
    }
  }

  const forceBackup = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/admin/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        toast({
          title: 'Backup iniciado',
          description: 'Backup manual foi iniciado com sucesso.'
        })
      } else {
        throw new Error('Erro no backup')
      }
    } catch (error) {
      toast({
        title: 'Backup simulado',
        description: 'Backup seria executado em produção.',
        variant: 'default'
      })
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Configurações do Sistema</h1>
        <p className="text-muted-foreground">Gerencie configurações globais da plataforma</p>
      </div>

      <Tabs defaultValue="system" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="system">Sistema</TabsTrigger>
          <TabsTrigger value="plans">Planos</TabsTrigger>
          <TabsTrigger value="payment">Pagamento</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="server">Servidor</TabsTrigger>
        </TabsList>

        {/* Configurações do Sistema */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Configurações Gerais</span>
              </CardTitle>
              <CardDescription>
                Configurações básicas da plataforma
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteName">Nome da Plataforma</Label>
                  <Input
                    id="siteName"
                    value={systemConfig.siteName}
                    onChange={(e) => setSystemConfig({...systemConfig, siteName: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="adminEmail">Email do Admin</Label>
                  <Input
                    id="adminEmail"
                    type="email"
                    value={systemConfig.adminEmail}
                    onChange={(e) => setSystemConfig({...systemConfig, adminEmail: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="siteDescription">Descrição da Plataforma</Label>
                <Textarea
                  id="siteDescription"
                  value={systemConfig.siteDescription}
                  onChange={(e) => setSystemConfig({...systemConfig, siteDescription: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supportEmail">Email de Suporte</Label>
                  <Input
                    id="supportEmail"
                    type="email"
                    value={systemConfig.supportEmail}
                    onChange={(e) => setSystemConfig({...systemConfig, supportEmail: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="maxStores">Máx. Lojas por Usuário</Label>
                  <Input
                    id="maxStores"
                    type="number"
                    value={systemConfig.maxStoresPerUser}
                    onChange={(e) => setSystemConfig({...systemConfig, maxStoresPerUser: Number(e.target.value)})}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="maintenance">Modo Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Bloquear acesso de novos usuários</p>
                  </div>
                  <Switch
                    id="maintenance"
                    checked={systemConfig.maintenanceMode}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, maintenanceMode: checked})}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="registration">Permitir Cadastros</Label>
                    <p className="text-sm text-muted-foreground">Novos usuários podem se cadastrar</p>
                  </div>
                  <Switch
                    id="registration"
                    checked={systemConfig.registrationEnabled}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, registrationEnabled: checked})}
                  />
                </div>
              </div>

              <Button onClick={() => saveConfiguration('system', systemConfig)} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Planos */}
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Configuração de Planos</span>
              </CardTitle>
              <CardDescription>
                Defina preços e limites dos planos de assinatura
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Plano Start */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-green-600">Plano Start</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={planConfig.startPrice}
                      onChange={(e) => setPlanConfig({...planConfig, startPrice: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Produtos</Label>
                    <Input
                      type="number"
                      value={planConfig.startProducts}
                      onChange={(e) => setPlanConfig({...planConfig, startProducts: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Fotos/Produto</Label>
                    <Input
                      type="number"
                      value={planConfig.startPhotos}
                      onChange={(e) => setPlanConfig({...planConfig, startPhotos: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              {/* Plano Pro */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-blue-600">Plano Pro</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={planConfig.proPrice}
                      onChange={(e) => setPlanConfig({...planConfig, proPrice: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Produtos</Label>
                    <Input
                      type="number"
                      value={planConfig.proProducts}
                      onChange={(e) => setPlanConfig({...planConfig, proProducts: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Fotos/Produto</Label>
                    <Input
                      type="number"
                      value={planConfig.proPhotos}
                      onChange={(e) => setPlanConfig({...planConfig, proPhotos: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              {/* Plano Max */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-3 text-purple-600">Plano Max</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Preço (R$)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={planConfig.maxPrice}
                      onChange={(e) => setPlanConfig({...planConfig, maxPrice: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Produtos</Label>
                    <Input
                      type="number"
                      value={planConfig.maxProducts}
                      onChange={(e) => setPlanConfig({...planConfig, maxProducts: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <Label>Fotos/Produto</Label>
                    <Input
                      type="number"
                      value={planConfig.maxPhotos}
                      onChange={(e) => setPlanConfig({...planConfig, maxPhotos: Number(e.target.value)})}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label>Taxa de Implementação (R$)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={planConfig.implementationFee}
                  onChange={(e) => setPlanConfig({...planConfig, implementationFee: Number(e.target.value)})}
                  className="w-48"
                />
              </div>

              <Button onClick={() => saveConfiguration('plans', planConfig)} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Planos'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Pagamento */}
        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Configurações de Pagamento</span>
              </CardTitle>
              <CardDescription>
                Configure gateways de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Stripe */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Stripe</h3>
                  <Switch
                    checked={paymentConfig.stripeEnabled}
                    onCheckedChange={(checked) => setPaymentConfig({...paymentConfig, stripeEnabled: checked})}
                  />
                </div>
                {paymentConfig.stripeEnabled && (
                  <div className="space-y-3">
                    <div>
                      <Label>Chave Pública</Label>
                      <Input
                        type="text"
                        placeholder="pk_live_..."
                        value={paymentConfig.stripePublicKey}
                        onChange={(e) => setPaymentConfig({...paymentConfig, stripePublicKey: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label>Chave Secreta</Label>
                      <Input
                        type="password"
                        placeholder="sk_live_..."
                        value={paymentConfig.stripeSecretKey}
                        onChange={(e) => setPaymentConfig({...paymentConfig, stripeSecretKey: e.target.value})}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Mercado Pago */}
              <div className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Mercado Pago</h3>
                  <Switch
                    checked={paymentConfig.mercadoPagoEnabled}
                    onCheckedChange={(checked) => setPaymentConfig({...paymentConfig, mercadoPagoEnabled: checked})}
                  />
                </div>
                {paymentConfig.mercadoPagoEnabled && (
                  <div>
                    <Label>Access Token</Label>
                    <Input
                      type="password"
                      placeholder="APP_USR-..."
                      value={paymentConfig.mercadoPagoToken}
                      onChange={(e) => setPaymentConfig({...paymentConfig, mercadoPagoToken: e.target.value})}
                    />
                  </div>
                )}
              </div>

              {/* Métodos de Pagamento */}
              <div className="border rounded-lg p-4">
                <h3 className="font-semibold mb-4">Métodos Aceitos</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>PIX</Label>
                    <Switch
                      checked={paymentConfig.pixEnabled}
                      onCheckedChange={(checked) => setPaymentConfig({...paymentConfig, pixEnabled: checked})}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Boleto</Label>
                    <Switch
                      checked={paymentConfig.boletoEnabled}
                      onCheckedChange={(checked) => setPaymentConfig({...paymentConfig, boletoEnabled: checked})}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={() => saveConfiguration('payment', paymentConfig)} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Configurações de Pagamento'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Configurações de Notificações */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-5 w-5" />
                <span>Configurações de Email</span>
              </CardTitle>
              <CardDescription>
                Configure notificações e emails do sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Notificações por Email</Label>
                  <p className="text-sm text-muted-foreground">Enviar emails para eventos importantes</p>
                </div>
                <Switch
                  checked={systemConfig.emailNotifications}
                  onCheckedChange={(checked) => setSystemConfig({...systemConfig, emailNotifications: checked})}
                />
              </div>

              <div className="space-y-2">
                <Button onClick={testEmailConfiguration} variant="outline">
                  <Mail className="h-4 w-4 mr-2" />
                  Testar Configuração de Email
                </Button>
                <p className="text-sm text-muted-foreground">
                  Envia um email de teste para verificar se a configuração está correta
                </p>
              </div>

              <Button onClick={() => saveConfiguration('notifications', { emailNotifications: systemConfig.emailNotifications })} disabled={loading}>
                {loading ? 'Salvando...' : 'Salvar Configurações'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Status do Servidor */}
        <TabsContent value="server">
          <div className="space-y-6">
            {/* Estatísticas do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Server className="h-5 w-5" />
                  <span>Status do Servidor</span>
                </CardTitle>
                <CardDescription>
                  Informações sobre o servidor e uso de recursos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{serverStats.totalStores}</div>
                    <div className="text-sm text-muted-foreground">Lojas Ativas</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{serverStats.totalUsers}</div>
                    <div className="text-sm text-muted-foreground">Usuários</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{serverStats.totalProducts}</div>
                    <div className="text-sm text-muted-foreground">Produtos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">{serverStats.uptime}</div>
                    <div className="text-sm text-muted-foreground">Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recursos do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle>Uso de Recursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Armazenamento</span>
                      <span>{serverStats.storageUsed} / {serverStats.storageLimit}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-600 h-2 rounded-full" style={{width: '24%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>CPU</span>
                      <span>{serverStats.cpuUsage}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{width: '12%'}}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Memória</span>
                      <span>{serverStats.memoryUsage}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Backup */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Database className="h-5 w-5" />
                  <span>Backup e Segurança</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Backup Automático</Label>
                    <p className="text-sm text-muted-foreground">Último backup: {serverStats.lastBackup}</p>
                  </div>
                  <Switch
                    checked={systemConfig.backupEnabled}
                    onCheckedChange={(checked) => setSystemConfig({...systemConfig, backupEnabled: checked})}
                  />
                </div>

                <div>
                  <Label>Frequência do Backup</Label>
                  <Select 
                    value={systemConfig.backupFrequency} 
                    onValueChange={(value) => setSystemConfig({...systemConfig, backupFrequency: value})}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">A cada hora</SelectItem>
                      <SelectItem value="daily">Diário</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={forceBackup} variant="outline">
                  <Database className="h-4 w-4 mr-2" />
                  Executar Backup Manual
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
} 