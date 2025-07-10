"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  CheckCircle, 
  XCircle, 
  Calendar,
  Percent,
  DollarSign,
  Users,
  Eye,
  EyeOff
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"

interface Coupon {
  id: string
  code: string
  discount: number
  discountType: 'percentage' | 'fixed'
  minValue: number
  maxDiscount?: number
  validFrom: string
  validUntil: string
  isActive: boolean
  usageLimit?: number
  usedCount: number
  description?: string
  showFloatingButton: boolean
}

export default function CuponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    code: "",
    discount: "",
    discountType: "percentage" as 'percentage' | 'fixed',
    minValue: "",
    maxDiscount: "",
    validFrom: "",
    validUntil: "",
    description: "",
    usageLimit: "",
    isActive: true,
    showFloatingButton: true
  })

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/coupons', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        const data = await response.json()
        setCoupons(data.coupons || [])
      }
    } catch (error) {
      console.error('Erro ao carregar cupons:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")

    try {
      const token = localStorage.getItem('token')
      const payload = {
        ...formData,
        discount: parseFloat(formData.discount),
        minValue: parseFloat(formData.minValue),
        maxDiscount: formData.maxDiscount ? parseFloat(formData.maxDiscount) : undefined,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : undefined
      }

      const url = editingCoupon ? `/api/coupons/${editingCoupon.id}` : '/api/coupons'
      const method = editingCoupon ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await response.json()

      if (data.success) {
        setFormData({
          code: "",
          discount: "",
          discountType: "percentage",
          minValue: "",
          maxDiscount: "",
          validFrom: "",
          validUntil: "",
          description: "",
          usageLimit: "",
          isActive: true,
          showFloatingButton: true
        })
        setShowForm(false)
        setEditingCoupon(null)
        fetchCoupons()
        toast({
          title: "Sucesso!",
          description: editingCoupon ? "Cupom atualizado com sucesso." : "Cupom criado com sucesso.",
        })
      } else {
        setError(data.message || 'Erro ao salvar cupom')
      }
    } catch (error) {
      setError('Erro de conexão. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon)
    setFormData({
      code: coupon.code,
      discount: coupon.discount.toString(),
      discountType: coupon.discountType,
      minValue: coupon.minValue.toString(),
      maxDiscount: coupon.maxDiscount?.toString() || "",
      validFrom: coupon.validFrom.split('T')[0],
      validUntil: coupon.validUntil.split('T')[0],
      description: coupon.description || "",
      usageLimit: coupon.usageLimit?.toString() || "",
      isActive: coupon.isActive,
      showFloatingButton: coupon.showFloatingButton
    })
    setShowForm(true)
  }

  const handleDelete = async (couponId: string) => {
    if (!confirm('Tem certeza que deseja excluir este cupom?')) return

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/coupons/${couponId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        fetchCoupons()
        toast({
          title: "Sucesso!",
          description: "Cupom excluído com sucesso.",
        })
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao excluir cupom",
        variant: "destructive"
      })
    }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "Copiado!",
        description: "Código do cupom copiado para a área de transferência.",
      })
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código",
        variant: "destructive"
      })
    }
  }

  const isCouponValid = (coupon: Coupon) => {
    const now = new Date()
    const validFrom = new Date(coupon.validFrom)
    const validUntil = new Date(coupon.validUntil)
    
    return now >= validFrom && now <= validUntil && coupon.isActive
  }

  const getDiscountText = (coupon: Coupon) => {
    if (coupon.discountType === 'percentage') {
      return `${coupon.discount}% OFF`
    } else {
      return `R$ ${coupon.discount.toFixed(2).replace('.', ',')} OFF`
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Carregando cupons...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cupons de Desconto</h1>
          <p className="text-muted-foreground">
            Gerencie os cupons de desconto da sua loja
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cupom
        </Button>
      </div>

      {/* Formulário */}
      {showForm && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>
              {editingCoupon ? "Editar Cupom" : "Novo Cupom"}
            </CardTitle>
            <CardDescription>
              Configure os detalhes do cupom de desconto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="code">Código do Cupom</Label>
                  <Input
                    id="code"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="Ex: PRIMAVERA20"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="discountType">Tipo de Desconto</Label>
                  <Select
                    value={formData.discountType}
                    onValueChange={(value: 'percentage' | 'fixed') => 
                      setFormData({ ...formData, discountType: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Porcentagem (%)</SelectItem>
                      <SelectItem value="fixed">Valor Fixo (R$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="discount">Valor do Desconto</Label>
                  <Input
                    id="discount"
                    type="number"
                    step="0.01"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder={formData.discountType === 'percentage' ? "20" : "10.00"}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="minValue">Valor Mínimo da Compra</Label>
                  <Input
                    id="minValue"
                    type="number"
                    step="0.01"
                    value={formData.minValue}
                    onChange={(e) => setFormData({ ...formData, minValue: e.target.value })}
                    placeholder="50.00"
                    required
                  />
                </div>

                {formData.discountType === 'percentage' && (
                  <div>
                    <Label htmlFor="maxDiscount">Desconto Máximo (R$)</Label>
                    <Input
                      id="maxDiscount"
                      type="number"
                      step="0.01"
                      value={formData.maxDiscount}
                      onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                      placeholder="100.00"
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="usageLimit">Limite de Usos</Label>
                  <Input
                    id="usageLimit"
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="100 (opcional)"
                  />
                </div>

                <div>
                  <Label htmlFor="validFrom">Data de Início</Label>
                  <Input
                    id="validFrom"
                    type="date"
                    value={formData.validFrom}
                    onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="validUntil">Data de Fim</Label>
                  <Input
                    id="validUntil"
                    type="date"
                    value={formData.validUntil}
                    onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descreva o cupom para os clientes"
                />
              </div>

              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Cupom Ativo</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="showFloatingButton"
                    checked={formData.showFloatingButton}
                    onCheckedChange={(checked) => setFormData({ ...formData, showFloatingButton: checked })}
                  />
                  <Label htmlFor="showFloatingButton">Mostrar Botão Flutuante</Label>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowForm(false)
                    setEditingCoupon(null)
                    setFormData({
                      code: "",
                      discount: "",
                      discountType: "percentage",
                      minValue: "",
                      maxDiscount: "",
                      validFrom: "",
                      validUntil: "",
                      description: "",
                      usageLimit: "",
                      isActive: true,
                      showFloatingButton: true
                    })
                  }}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button type="submit" disabled={saving} className="flex-1">
                  {saving ? "Salvando..." : (editingCoupon ? "Atualizar" : "Criar")}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de Cupons */}
      <div className="grid gap-6">
        {coupons.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Percent className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Nenhum cupom criado</h3>
              <p className="text-muted-foreground mb-4">
                Crie seu primeiro cupom de desconto para atrair mais clientes
              </p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Cupom
              </Button>
            </CardContent>
          </Card>
        ) : (
          coupons.map((coupon) => (
            <Card key={coupon.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-xl font-semibold">{coupon.code}</h3>
                      <Badge variant={isCouponValid(coupon) ? "default" : "secondary"}>
                        {isCouponValid(coupon) ? "Ativo" : "Inativo"}
                      </Badge>
                      {coupon.showFloatingButton && (
                        <Badge variant="outline" className="text-xs">
                          <Eye className="h-3 w-3 mr-1" />
                          Flutuante
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Desconto</p>
                        <p className="font-semibold text-lg text-green-600">
                          {getDiscountText(coupon)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Mínimo</p>
                        <p className="font-semibold">R$ {coupon.minValue.toFixed(2).replace('.', ',')}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Usos</p>
                        <p className="font-semibold">
                          {coupon.usedCount}
                          {coupon.usageLimit && ` / ${coupon.usageLimit}`}
                        </p>
                      </div>
                    </div>

                    {coupon.description && (
                      <p className="text-sm text-gray-600 mb-3">{coupon.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Válido até {new Date(coupon.validUntil).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(coupon.code)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(coupon)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(coupon.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
