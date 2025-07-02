"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, Palette, Type, ImageIcon, Save, Eye } from "lucide-react"

export default function AparenciaPage() {
  const [settings, setSettings] = useState({
    // Cores
    primaryColor: "#ec4899",
    secondaryColor: "#8b5cf6",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",

    // Logo e Nome
    storeName: "Bella Store",
    logoUrl: "",

    // Header
    headerText: "Nova Coleção",
    headerSubtext: "Descubra as últimas tendências",
    headerButtonText: "Ver Coleção",
    headerBackgroundColor: "#fef7ff",
    headerImage: "",

    // Textos do Topo
    freeShippingText: "Frete grátis acima de R$ 199",
    installmentText: "Parcelamos em até 10x sem juros",
    showTopBar: true,

    // Contato
    phone: "(11) 99999-9999",
    whatsapp: "(11) 99999-9999",
    email: "contato@bellastore.com",

    // Endereço
    address: "Rua das Flores, 123",
    neighborhood: "Centro",
    city: "São Paulo",
    state: "SP",
    zipCode: "01234-567",

    // Horário
    workingHours: "Segunda a Sexta: 9h às 18h\nSábado: 9h às 14h",

    // Redes Sociais
    instagram: "@bellastore",
    facebook: "bellastore",
    tiktok: "@bellastore",
    showSocialMedia: true,
  })

  const handleSave = () => {
    // Aqui salvaria no backend
    console.log("Configurações salvas:", settings)
    alert("Configurações salvas com sucesso!")
  }

  const handlePreview = () => {
    // Abrir preview da loja
    window.open("/", "_blank")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Aparência</h1>
          <p className="text-muted-foreground">Personalize o visual da sua loja</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="cores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
          <TabsTrigger value="cores">Cores</TabsTrigger>
          <TabsTrigger value="logo">Logo & Nome</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="textos">Textos</TabsTrigger>
          <TabsTrigger value="contato">Contato</TabsTrigger>
        </TabsList>

        {/* Cores */}
        <TabsContent value="cores">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="h-5 w-5" />
                  Cores Principais
                </CardTitle>
                <CardDescription>Defina as cores principais da sua loja</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="primaryColor">Cor Primária</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="primaryColor"
                        type="color"
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={settings.primaryColor}
                        onChange={(e) => setSettings({ ...settings, primaryColor: e.target.value })}
                        placeholder="#ec4899"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="secondaryColor">Cor Secundária</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="secondaryColor"
                        type="color"
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={settings.secondaryColor}
                        onChange={(e) => setSettings({ ...settings, secondaryColor: e.target.value })}
                        placeholder="#8b5cf6"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="backgroundColor"
                        type="color"
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={settings.backgroundColor}
                        onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                        placeholder="#ffffff"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="textColor">Cor do Texto</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        id="textColor"
                        type="color"
                        value={settings.textColor}
                        onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                        className="w-12 h-10 p-1 border rounded"
                      />
                      <Input
                        value={settings.textColor}
                        onChange={(e) => setSettings({ ...settings, textColor: e.target.value })}
                        placeholder="#1f2937"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview das Cores</CardTitle>
                <CardDescription>Veja como ficará com as cores escolhidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div
                  className="p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: settings.backgroundColor,
                    color: settings.textColor,
                    borderColor: settings.primaryColor,
                  }}
                >
                  <h3 className="text-lg font-bold mb-2" style={{ color: settings.primaryColor }}>
                    {settings.storeName}
                  </h3>
                  <p className="text-sm mb-3">Exemplo de texto na sua loja</p>
                  <div className="flex gap-2">
                    <div
                      className="px-3 py-1 rounded text-white text-sm"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      Botão Primário
                    </div>
                    <div
                      className="px-3 py-1 rounded text-white text-sm"
                      style={{ backgroundColor: settings.secondaryColor }}
                    >
                      Botão Secundário
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Logo & Nome */}
        <TabsContent value="logo">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="h-5 w-5" />
                  Nome da Loja
                </CardTitle>
                <CardDescription>Nome que aparecerá no header e título da página</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="storeName">Nome da Loja</Label>
                    <Input
                      id="storeName"
                      value={settings.storeName}
                      onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                      placeholder="Nome da sua loja"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Logo
                </CardTitle>
                <CardDescription>Upload do logo da sua loja</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Clique para fazer upload ou arraste aqui</p>
                    <p className="text-xs text-gray-500">PNG, JPG até 2MB</p>
                    <Button variant="outline" size="sm" className="mt-2 bg-transparent">
                      Escolher Arquivo
                    </Button>
                  </div>
                  {settings.logoUrl && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Logo atual</Badge>
                      <Button variant="ghost" size="sm">
                        Remover
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Header */}
        <TabsContent value="header">
          <Card>
            <CardHeader>
              <CardTitle>Personalização do Header</CardTitle>
              <CardDescription>Configure o banner principal da sua loja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="headerText">Título Principal</Label>
                  <Input
                    id="headerText"
                    value={settings.headerText}
                    onChange={(e) => setSettings({ ...settings, headerText: e.target.value })}
                    placeholder="Nova Coleção"
                  />
                </div>

                <div>
                  <Label htmlFor="headerButtonText">Texto do Botão</Label>
                  <Input
                    id="headerButtonText"
                    value={settings.headerButtonText}
                    onChange={(e) => setSettings({ ...settings, headerButtonText: e.target.value })}
                    placeholder="Ver Coleção"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="headerSubtext">Subtítulo</Label>
                <Textarea
                  id="headerSubtext"
                  value={settings.headerSubtext}
                  onChange={(e) => setSettings({ ...settings, headerSubtext: e.target.value })}
                  placeholder="Descubra as últimas tendências da moda feminina..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="headerBackgroundColor">Cor de Fundo do Header</Label>
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    type="color"
                    value={settings.headerBackgroundColor}
                    onChange={(e) => setSettings({ ...settings, headerBackgroundColor: e.target.value })}
                    className="w-12 h-10 p-1 border rounded"
                  />
                  <Input
                    value={settings.headerBackgroundColor}
                    onChange={(e) => setSettings({ ...settings, headerBackgroundColor: e.target.value })}
                    placeholder="#fef7ff"
                  />
                </div>
              </div>

              <div>
                <Label>Imagem do Header</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mt-2">
                  <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600 mb-2">Upload da imagem do header</p>
                  <Button variant="outline" size="sm">
                    Escolher Imagem
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Textos */}
        <TabsContent value="textos">
          <Card>
            <CardHeader>
              <CardTitle>Textos da Loja</CardTitle>
              <CardDescription>Configure os textos que aparecem na sua loja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mostrar Barra Superior</Label>
                  <p className="text-sm text-muted-foreground">Exibir informações de frete e parcelamento</p>
                </div>
                <Switch
                  checked={settings.showTopBar}
                  onCheckedChange={(checked) => setSettings({ ...settings, showTopBar: checked })}
                />
              </div>

              {settings.showTopBar && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="freeShippingText">Texto Frete Grátis</Label>
                    <Input
                      id="freeShippingText"
                      value={settings.freeShippingText}
                      onChange={(e) => setSettings({ ...settings, freeShippingText: e.target.value })}
                      placeholder="Frete grátis acima de R$ 199"
                    />
                  </div>

                  <div>
                    <Label htmlFor="installmentText">Texto Parcelamento</Label>
                    <Input
                      id="installmentText"
                      value={settings.installmentText}
                      onChange={(e) => setSettings({ ...settings, installmentText: e.target.value })}
                      placeholder="Parcelamos em até 10x sem juros"
                    />
                  </div>
                </div>
              )}

              <div>
                <Label htmlFor="workingHours">Horário de Atendimento</Label>
                <Textarea
                  id="workingHours"
                  value={settings.workingHours}
                  onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                  placeholder="Segunda a Sexta: 9h às 18h..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contato */}
        <TabsContent value="contato">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações de Contato</CardTitle>
                <CardDescription>Configure os dados de contato da sua loja</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div>
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={settings.whatsapp}
                      onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                      placeholder="(11) 99999-9999"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      placeholder="contato@sualore.com"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Endereço</CardTitle>
                <CardDescription>Endereço da sua loja física (se houver)</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                      placeholder="Rua das Flores, 123"
                    />
                  </div>

                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      value={settings.neighborhood}
                      onChange={(e) => setSettings({ ...settings, neighborhood: e.target.value })}
                      placeholder="Centro"
                    />
                  </div>

                  <div>
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={settings.zipCode}
                      onChange={(e) => setSettings({ ...settings, zipCode: e.target.value })}
                      placeholder="01234-567"
                    />
                  </div>

                  <div>
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={settings.city}
                      onChange={(e) => setSettings({ ...settings, city: e.target.value })}
                      placeholder="São Paulo"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">Estado</Label>
                    <Input
                      id="state"
                      value={settings.state}
                      onChange={(e) => setSettings({ ...settings, state: e.target.value })}
                      placeholder="SP"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Redes Sociais</CardTitle>
                <CardDescription>Links para suas redes sociais</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar Redes Sociais</Label>
                    <p className="text-sm text-muted-foreground">Exibir links das redes sociais no footer</p>
                  </div>
                  <Switch
                    checked={settings.showSocialMedia}
                    onCheckedChange={(checked) => setSettings({ ...settings, showSocialMedia: checked })}
                  />
                </div>

                {settings.showSocialMedia && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={settings.instagram}
                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                        placeholder="@sualore"
                      />
                    </div>

                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={settings.facebook}
                        onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                        placeholder="sualore"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tiktok">TikTok</Label>
                      <Input
                        id="tiktok"
                        value={settings.tiktok}
                        onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
                        placeholder="@sualore"
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
