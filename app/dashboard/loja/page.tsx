"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Save, Store, MapPin, Phone, Clock, FileText, Megaphone } from "lucide-react"
import { storeData, type StoreData } from "@/lib/store-data"

export default function LojaPage() {
  const [storeInfo, setStoreInfo] = useState<StoreData>(storeData)

  const handleSave = () => {
    // Aqui salvaria no backend
    // Por enquanto, apenas atualiza o objeto no protótipo
    Object.assign(storeData, storeInfo)
    console.log("Informações da loja salvas:", storeInfo)
    alert("Informações salvas com sucesso!")
  }

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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Informações da Loja</h1>
          <p className="text-muted-foreground">Configure os dados da sua loja e aparência</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Salvar Alterações
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
                    value={storeInfo.name}
                    onChange={(e) => setStoreInfo({ ...storeInfo, name: e.target.value })}
                    placeholder="Nome da sua loja"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={storeInfo.description}
                    onChange={(e) => setStoreInfo({ ...storeInfo, description: e.target.value })}
                    placeholder="Descrição da sua loja..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={storeInfo.cnpj}
                      onChange={(e) => setStoreInfo({ ...storeInfo, cnpj: e.target.value })}
                      placeholder="00.000.000/0000-00"
                    />
                  </div>

                  <div>
                    <Label htmlFor="ie">Inscrição Estadual</Label>
                    <Input
                      id="ie"
                      value={storeInfo.ie}
                      onChange={(e) => setStoreInfo({ ...storeInfo, ie: e.target.value })}
                      placeholder="000.000.000.000"
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
                    value={storeInfo.announcement1}
                    onChange={(e) => setStoreInfo({ ...storeInfo, announcement1: e.target.value })}
                    placeholder="Ex: Frete grátis..."
                  />
                </div>
                <div>
                  <Label htmlFor="announcement2">Anúncio 2 (meio)</Label>
                  <Input
                    id="announcement2"
                    value={storeInfo.announcement2}
                    onChange={(e) => setStoreInfo({ ...storeInfo, announcement2: e.target.value })}
                    placeholder="Ex: Parcelamos em 10x..."
                  />
                </div>
                <div>
                  <Label htmlFor="announcementContact">Contato (direita)</Label>
                  <Input
                    id="announcementContact"
                    value={storeInfo.announcementContact}
                    onChange={(e) => setStoreInfo({ ...storeInfo, announcementContact: e.target.value })}
                    placeholder="Ex: Atendimento: (11)..."
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
                    value={storeInfo.phone}
                    onChange={(e) => setStoreInfo({ ...storeInfo, phone: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={storeInfo.whatsapp}
                    onChange={(e) => setStoreInfo({ ...storeInfo, whatsapp: e.target.value })}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    value={storeInfo.email}
                    onChange={(e) => setStoreInfo({ ...storeInfo, email: e.target.value })}
                    placeholder="contato@sualore.com"
                  />
                </div>

                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={storeInfo.website}
                    onChange={(e) => setStoreInfo({ ...storeInfo, website: e.target.value })}
                    placeholder="www.sualore.com"
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
                    value={storeInfo.address}
                    onChange={(e) => setStoreInfo({ ...storeInfo, address: e.target.value })}
                    placeholder="Rua das Flores, 123"
                  />
                </div>

                <div>
                  <Label htmlFor="zipCode">CEP</Label>
                  <Input
                    id="zipCode"
                    value={storeInfo.zipCode}
                    onChange={(e) => setStoreInfo({ ...storeInfo, zipCode: e.target.value })}
                    placeholder="01234-567"
                  />
                </div>

                <div>
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={storeInfo.complement}
                    onChange={(e) => setStoreInfo({ ...storeInfo, complement: e.target.value })}
                    placeholder="Loja 1, Andar 2..."
                  />
                </div>

                <div>
                  <Label htmlFor="neighborhood">Bairro</Label>
                  <Input
                    id="neighborhood"
                    value={storeInfo.neighborhood}
                    onChange={(e) => setStoreInfo({ ...storeInfo, neighborhood: e.target.value })}
                    placeholder="Centro"
                  />
                </div>

                <div>
                  <Label htmlFor="city">Cidade</Label>
                  <Input
                    id="city"
                    value={storeInfo.city}
                    onChange={(e) => setStoreInfo({ ...storeInfo, city: e.target.value })}
                    placeholder="São Paulo"
                  />
                </div>

                <div>
                  <Label htmlFor="state">Estado</Label>
                  <Input
                    id="state"
                    value={storeInfo.state}
                    onChange={(e) => setStoreInfo({ ...storeInfo, state: e.target.value })}
                    placeholder="SP"
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
                      value={storeInfo.freeShippingMinValue}
                      onChange={(e) =>
                        setStoreInfo({ ...storeInfo, freeShippingMinValue: Number.parseFloat(e.target.value) })
                      }
                      placeholder="199"
                    />
                  </div>

                  <div>
                    <Label htmlFor="shippingTime">Prazo de Entrega</Label>
                    <Input
                      id="shippingTime"
                      value={storeInfo.shippingTime}
                      onChange={(e) => setStoreInfo({ ...storeInfo, shippingTime: e.target.value })}
                      placeholder="5 a 10 dias úteis"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="returnPolicy">Política de Troca/Devolução</Label>
                  <Input
                    id="returnPolicy"
                    value={storeInfo.returnPolicy}
                    onChange={(e) => setStoreInfo({ ...storeInfo, returnPolicy: e.target.value })}
                    placeholder="30 dias para trocas e devoluções"
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
                {Object.entries(storeInfo.workingHours).map(([day, hours]) => (
                  <div key={day} className="flex items-center gap-4 p-4 border rounded-lg flex-wrap">
                    <div className="w-32">
                      <Label className="font-medium">{dayNames[day as keyof typeof dayNames]}</Label>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`closed-${day}`}
                        checked={!hours.closed}
                        onChange={(e) =>
                          setStoreInfo({
                            ...storeInfo,
                            workingHours: {
                              ...storeInfo.workingHours,
                              [day]: { ...hours, closed: !e.target.checked },
                            },
                          })
                        }
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
                            onChange={(e) =>
                              setStoreInfo({
                                ...storeInfo,
                                workingHours: {
                                  ...storeInfo.workingHours,
                                  [day]: { ...hours, open: e.target.value },
                                },
                              })
                            }
                            className="w-32"
                          />
                        </div>

                        <div className="flex items-center gap-2">
                          <Label className="text-sm">às</Label>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) =>
                              setStoreInfo({
                                ...storeInfo,
                                workingHours: {
                                  ...storeInfo.workingHours,
                                  [day]: { ...hours, close: e.target.value },
                                },
                              })
                            }
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
                    value={storeInfo.privacyPolicy}
                    onChange={(e) => setStoreInfo({ ...storeInfo, privacyPolicy: e.target.value })}
                    placeholder="Digite sua política de privacidade..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="termsOfService">Termos de Uso</Label>
                  <Textarea
                    id="termsOfService"
                    value={storeInfo.termsOfService}
                    onChange={(e) => setStoreInfo({ ...storeInfo, termsOfService: e.target.value })}
                    placeholder="Digite seus termos de uso..."
                    rows={6}
                  />
                </div>

                <div>
                  <Label htmlFor="exchangePolicy">Política de Trocas</Label>
                  <Textarea
                    id="exchangePolicy"
                    value={storeInfo.exchangePolicy}
                    onChange={(e) => setStoreInfo({ ...storeInfo, exchangePolicy: e.target.value })}
                    placeholder="Digite sua política de trocas e devoluções..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
