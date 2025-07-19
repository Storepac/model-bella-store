"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Store, MapPin, Phone, Clock, FileText, Megaphone, Loader2 } from "lucide-react"
import { type StoreData } from "@/lib/store-data"
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

// Função utilitária para pegar storeId da URL ou do usuário logado
const getStoreId = () => {
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    const urlStoreId = url.searchParams.get('storeId')
    if (urlStoreId) return Number(urlStoreId)
    // fallback: pega do usuário logado
    const userStr = localStorage.getItem('user')
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        return user.storeId || 1
      } catch {}
    }
  }
  return 1
}

const safeStr = (v: any) => v === undefined || v === null ? '' : String(v)
const safeNum = (v: any) => v === undefined || v === null || isNaN(Number(v)) ? 0 : Number(v)

// Função para formatar CNPJ
const formatCNPJ = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 14) {
    return numbers.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }
  return value
}

// Função para formatar telefone/WhatsApp
const formatPhone = (value: string) => {
  const numbers = value.replace(/\D/g, '')
  if (numbers.length <= 11) {
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }
  return value
}

// Função para buscar endereço por CEP
const fetchAddressByCEP = async (cep: string) => {
  try {
    const cleanCEP = cep.replace(/\D/g, '')
    if (cleanCEP.length === 8) {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`)
      const data = await response.json()
      if (!data.erro) {
        return {
          address: data.logradouro || '',
          neighborhood: data.bairro || '',
          city: data.localidade || '',
          state: data.uf || ''
        }
      }
    }
  } catch (error) {
    console.error('Erro ao buscar CEP:', error)
  }
  return null
}

export default function LojaPage() {
  const [storeInfo, setStoreInfo] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const fetchStoreInfo = async () => {
      setLoading(true)
      try {
        const storeId = getStoreId()
        const res = await fetch(`/api/store-data?storeId=${storeId}`)
        const data = await res.json()
        if (data.success) {
          const d = data.data
          setStoreInfo({
            id: d.id,
            name: d.name || '',
            description: d.description || '',
            cnpj: d.cnpj || '',
            ie: d.ie || '',
            phone: d.phone || '',
            whatsapp: d.whatsapp || '',
            email: d.email || '',
            website: d.website || '',
            address: d.address || '',
            complement: d.complement || '',
            neighborhood: d.neighborhood || '',
            city: d.city || '',
            state: d.state || '',
            zipCode: d.zipCode || '',
            workingHours: d.workingHours || {},
            instagram: d.instagram || '',
            facebook: d.facebook || '',
            tiktok: d.tiktok || '',
            youtube: d.youtube || '',
            freeShippingMinValue: d.freeShippingMinValue || 0,
            shippingTime: d.shippingTime || '',
            returnPolicy: d.returnPolicy || '',
            privacyPolicy: d.privacyPolicy || '',
            termsOfService: d.termsOfService || '',
            exchangePolicy: d.exchangePolicy || '',
            announcement1: d.announcement1 || '',
            announcement2: d.announcement2 || '',
            announcementContact: d.announcementContact || ''
          })
        }
      } catch (err) {
        setStoreInfo(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStoreInfo()
  }, [])

  const handleSave = async () => {
    if (!storeInfo) return
    setSaving(true)
    try {
      const storeId = getStoreId()
      if (!storeId) {
        alert('ID da loja não encontrado!')
        setSaving(false)
        return
      }
      const payload = {
        name: storeInfo.name,
        description: storeInfo.description,
        email: storeInfo.email,
        whatsapp: storeInfo.whatsapp,
        endereco: storeInfo.address,
        cnpj: storeInfo.cnpj,
        inscricao_estadual: storeInfo.ie,
        instagram: storeInfo.instagram,
        facebook: storeInfo.facebook,
        youtube: storeInfo.youtube,
        horarios: JSON.stringify(storeInfo.workingHours),
        politicas_troca: storeInfo.exchangePolicy,
        politicas_gerais: storeInfo.privacyPolicy,
        // Campos específicos da loja
        phone: storeInfo.phone,
        website: storeInfo.website,
        complement: storeInfo.complement,
        neighborhood: storeInfo.neighborhood,
        city: storeInfo.city,
        state: storeInfo.state,
        zipCode: storeInfo.zipCode,
        tiktok: storeInfo.tiktok,
        freeShippingMinValue: storeInfo.freeShippingMinValue,
        shippingTime: storeInfo.shippingTime,
        returnPolicy: storeInfo.returnPolicy,
        termsOfService: storeInfo.termsOfService,
        announcement1: storeInfo.announcement1,
        announcement2: storeInfo.announcement2,
        announcementContact: storeInfo.announcementContact
      }
      console.log('Payload enviado:', payload);
      const res = await fetch(`/api/stores/${storeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const data = await res.json()
      if (data.success) {
        setShowSuccessModal(true)
      } else {
        alert('Erro ao salvar: ' + (data.message || data.error || ''))
      }
    } catch (err) {
      alert('Erro ao salvar informações da loja')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdate = (field: keyof StoreData, value: any) => {
    setStoreInfo(prev => {
      if (!prev) return null;
      return { ...prev, [field]: value };
    });
  };

  const handleWorkingHoursUpdate = (day: string, field: 'open' | 'close' | 'closed', value: any) => {
    setStoreInfo(prev => {
      if (!prev) return null;
      const newWorkingHours = { ...prev.workingHours } as any;
      if (!newWorkingHours[day]) {
        newWorkingHours[day] = { open: '', close: '', closed: true };
      }
      newWorkingHours[day][field] = value;
      return { ...prev, workingHours: newWorkingHours };
    });
  };

  const dayNames = {
    monday: "Segunda-feira",
    tuesday: "Terça-feira",
    wednesday: "Quarta-feira",
    thursday: "Quinta-feira",
    friday: "Sexta-feira",
    saturday: "Sábado",
    sunday: "Domingo",
  }

  return (
    <div className="p-4 md:p-6 space-y-6">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Carregando dados da loja...</span>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Informações da Loja</h1>
              <p className="text-muted-foreground">Configure os dados da sua loja e aparência</p>
            </div>
            <Button onClick={handleSave} className="w-full md:w-auto py-3 text-base md:py-2" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>

          <Tabs defaultValue="basicas" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              <TabsTrigger value="basicas">Básicas</TabsTrigger>
              <TabsTrigger value="contato">Contato</TabsTrigger>
              <TabsTrigger value="endereco">Endereço</TabsTrigger>
              <TabsTrigger value="horarios">Horários</TabsTrigger>
              <TabsTrigger value="politicas">Políticas</TabsTrigger>
            </TabsList>

            {/* Informações Básicas */}
            <TabsContent value="basicas">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Store className="h-5 w-5" />
                      Dados da Empresa
                    </CardTitle>
                    <CardDescription>Informações básicas da sua loja</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nome da Loja</Label>
                      <Input
                        id="name"
                        value={storeInfo?.name ?? ''}
                        onChange={(e) => handleUpdate('name', e.target.value)}
                        placeholder="Nome da sua loja"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea
                        id="description"
                        value={storeInfo?.description ?? ''}
                        onChange={(e) => handleUpdate('description', e.target.value)}
                        placeholder="Descrição da sua loja..."
                        rows={3}
                        className="w-full"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="cnpj">CNPJ</Label>
                        <Input
                          id="cnpj"
                          value={formatCNPJ(storeInfo?.cnpj ?? '')}
                          onChange={(e) => handleUpdate('cnpj', e.target.value)}
                          placeholder="00.000.000/0000-00"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label htmlFor="ie">Inscrição Estadual</Label>
                        <Input
                          id="ie"
                          value={storeInfo?.ie ?? ''}
                          onChange={(e) => handleUpdate('ie', e.target.value)}
                          placeholder="000.000.000.000"
                          className="w-full"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Megaphone className="h-5 w-5" />
                      Barra de Anúncios
                    </CardTitle>
                    <CardDescription>Textos exibidos no topo do site</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="announcement1">Anúncio 1 (esquerda)</Label>
                      <Input
                        id="announcement1"
                        value={storeInfo?.announcement1 ?? ''}
                        onChange={(e) => handleUpdate('announcement1', e.target.value)}
                        placeholder="Ex: Frete grátis..."
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="announcement2">Anúncio 2 (meio)</Label>
                      <Input
                        id="announcement2"
                        value={storeInfo?.announcement2 ?? ''}
                        onChange={(e) => handleUpdate('announcement2', e.target.value)}
                        placeholder="Ex: Parcelamos em 10x..."
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label htmlFor="announcementContact">Contato (direita)</Label>
                      <Input
                        id="announcementContact"
                        value={storeInfo?.announcementContact ?? ''}
                        onChange={(e) => handleUpdate('announcementContact', e.target.value)}
                        placeholder="Ex: Atendimento: (11)..."
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Contato */}
            <TabsContent value="contato">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Informações de Contato
                  </CardTitle>
                  <CardDescription>Configure os dados de contato da sua loja</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        value={formatPhone(storeInfo?.phone ?? '')}
                        onChange={(e) => handleUpdate('phone', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="whatsapp">WhatsApp</Label>
                      <Input
                        id="whatsapp"
                        value={formatPhone(storeInfo?.whatsapp ?? '')}
                        onChange={(e) => handleUpdate('whatsapp', e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input
                        id="email"
                        type="email"
                        value={storeInfo?.email ?? ''}
                        onChange={(e) => handleUpdate('email', e.target.value)}
                        placeholder="contato@sualore.com"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={storeInfo?.website ?? ''}
                        onChange={(e) => handleUpdate('website', e.target.value)}
                        placeholder="www.sualore.com"
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Endereço */}
            <TabsContent value="endereco">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Endereço da Loja
                  </CardTitle>
                  <CardDescription>Endereço da sua loja física (se houver)</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Endereço</Label>
                      <Input
                        id="address"
                        value={storeInfo?.address ?? ''}
                        onChange={(e) => handleUpdate('address', e.target.value)}
                        placeholder="Rua das Flores, 123"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="zipCode">CEP</Label>
                      <Input
                        id="zipCode"
                        value={storeInfo?.zipCode ?? ''}
                        onChange={(e) => handleUpdate('zipCode', e.target.value)}
                        placeholder="01234-567"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="complement">Complemento</Label>
                      <Input
                        id="complement"
                        value={storeInfo?.complement ?? ''}
                        onChange={(e) => handleUpdate('complement', e.target.value)}
                        placeholder="Loja 1, Andar 2..."
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="neighborhood">Bairro</Label>
                      <Input
                        id="neighborhood"
                        value={storeInfo?.neighborhood ?? ''}
                        onChange={(e) => handleUpdate('neighborhood', e.target.value)}
                        placeholder="Centro"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="city">Cidade</Label>
                      <Input
                        id="city"
                        value={storeInfo?.city ?? ''}
                        onChange={(e) => handleUpdate('city', e.target.value)}
                        placeholder="São Paulo"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        value={storeInfo?.state ?? ''}
                        onChange={(e) => handleUpdate('state', e.target.value)}
                        placeholder="SP"
                        className="w-full"
                      />
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t">
                    <h4 className="font-medium">Configurações de Entrega</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="freeShippingMinValue">Valor Mínimo Frete Grátis (R$)</Label>
                        <Input
                          id="freeShippingMinValue"
                          type="number"
                          value={storeInfo?.freeShippingMinValue ?? 0}
                          onChange={(e) => handleUpdate('freeShippingMinValue', Number.parseFloat(e.target.value))}
                          placeholder="199"
                          className="w-full"
                        />
                      </div>

                      <div>
                        <Label htmlFor="shippingTime">Prazo de Entrega</Label>
                        <Input
                          id="shippingTime"
                          value={storeInfo?.shippingTime ?? ''}
                          onChange={(e) => handleUpdate('shippingTime', e.target.value)}
                          placeholder="5 a 10 dias úteis"
                          className="w-full"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="returnPolicy">Política de Troca/Devolução</Label>
                      <Input
                        id="returnPolicy"
                        value={storeInfo?.returnPolicy ?? ''}
                        onChange={(e) => handleUpdate('returnPolicy', e.target.value)}
                        placeholder="30 dias para trocas e devoluções"
                        className="w-full"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Horários */}
            <TabsContent value="horarios">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    Horários de Funcionamento
                  </CardTitle>
                  <CardDescription>Configure os horários de atendimento da sua loja</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(storeInfo?.workingHours || {}).map(([day, hours]) => (
                      <div key={day} className="flex items-center gap-4 p-4 border rounded-lg flex-wrap">
                        <div className="w-32">
                          <Label className="font-medium">{dayNames[day as keyof typeof dayNames]}</Label>
                        </div>

                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            id={`closed-${day}`}
                            checked={!hours.closed}
                            onChange={(e) => handleWorkingHoursUpdate(day, 'closed', !e.target.checked)}
                            className="h-4 w-4 rounded border-gray-300 text-pink-600 focus:ring-pink-500"
                          />
                          <Label htmlFor={`closed-${day}`} className="text-sm">
                            Aberto
                          </Label>
                        </div>

                        {!hours.closed && (
                          <>
                            <div className="flex items-center gap-2">
                              <Label className="text-sm">Das</Label>
                              <Input
                                type="time"
                                value={hours.open}
                                onChange={(e) => handleWorkingHoursUpdate(day, 'open', e.target.value)}
                                className="w-32"
                              />
                            </div>

                            <div className="flex items-center gap-2">
                              <Label className="text-sm">às</Label>
                              <Input
                                type="time"
                                value={hours.close}
                                onChange={(e) => handleWorkingHoursUpdate(day, 'close', e.target.value)}
                                className="w-32"
                              />
                            </div>
                          </>
                        )}

                        {hours.closed && <Badge variant="secondary">Fechado</Badge>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Políticas */}
            <TabsContent value="politicas">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Políticas da Loja
                    </CardTitle>
                    <CardDescription>Configure as políticas e termos da sua loja</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <Label htmlFor="privacyPolicy">Política de Privacidade</Label>
                      <Textarea
                        id="privacyPolicy"
                        value={storeInfo?.privacyPolicy ?? ''}
                        onChange={(e) => handleUpdate('privacyPolicy', e.target.value)}
                        placeholder="Digite sua política de privacidade..."
                        rows={6}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="termsOfService">Termos de Uso</Label>
                      <Textarea
                        id="termsOfService"
                        value={storeInfo?.termsOfService ?? ''}
                        onChange={(e) => handleUpdate('termsOfService', e.target.value)}
                        placeholder="Digite seus termos de uso..."
                        rows={6}
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Label htmlFor="exchangePolicy">Política de Trocas</Label>
                      <Textarea
                        id="exchangePolicy"
                        value={storeInfo?.exchangePolicy ?? ''}
                        onChange={(e) => handleUpdate('exchangePolicy', e.target.value)}
                        placeholder="Digite sua política de trocas e devoluções..."
                        rows={6}
                        className="w-full"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}

      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-600">✅ Sucesso!</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados da loja foram salvos com sucesso.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessModal(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
