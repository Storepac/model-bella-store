"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Upload, Palette, Type, ImageIcon, Save, Eye, Monitor, Smartphone, Tablet } from "lucide-react"

import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog'

const getStoreId = () => {
  if (typeof window !== 'undefined') {
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

export default function AparenciaPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [storeId, setStoreId] = useState<number>(1)
  const [settings, setSettings] = useState({
    // Cores
    primaryColor: "#ec4899",
    secondaryColor: "#8b5cf6", 
    accentColor: "#f59e0b",
    backgroundColor: "#ffffff",
    textColor: "#1f2937",
    headerColor: "#ffffff",
    footerColor: "#111827",
    buttonColor: "#ec4899",
    linkColor: "#3b82f6",

    // Logo e Branding
    storeName: "Bella Store",
    logoUrl: "",
    favicon: "",
    
    // Header/Banner Principal
    headerText: "Nova Coleção",
    headerSubtext: "Descubra as últimas tendências",
    headerButtonText: "Ver Coleção",
    headerBackgroundColor: "#fef7ff",
    headerImage: "",
    showHeaderBanner: true,

    // Personalização do Header
    headerStyle: "modern", // modern, classic, minimal
    headerLayout: "center", // center, left, right
    showSearchBar: true,
    showCartIcon: true,
    showUserIcon: true,

    // Textos Promocionais
    freeShippingText: "Frete grátis acima de R$ 199",
    installmentText: "Parcelamos em até 10x sem juros",
    showTopBar: true,
    topBarColor: "#000000",
    topBarTextColor: "#ffffff",

    // Redes Sociais
    instagram: "",
    facebook: "",
    tiktok: "",
    youtube: "",
    showSocialMedia: true,
    socialMediaStyle: "icons", // icons, text, both

    // Tipografia
    fontFamily: "Inter", // Inter, Roboto, Montserrat, Poppins
    fontSize: "medium", // small, medium, large
    fontWeight: "normal", // light, normal, medium, bold

    // Layout
    containerWidth: "1200px",
    borderRadius: "8px",
    spacing: "normal", // tight, normal, loose
    
    // Efeitos Visuais
    showShadows: true,
    showAnimations: true,
    showGradients: false,
    cardStyle: "modern", // modern, classic, minimal
  })

  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true)
      try {
        const currentStoreId = getStoreId()
        setStoreId(currentStoreId)
        
        const response = await fetch(`/api/appearance/${currentStoreId}`)
        const data = await response.json()
        
        if (data.success && data.data) {
          const config = data.data
          
          // Mesclar configurações carregadas com padrões
          setSettings(prev => ({
            ...prev,
            primaryColor: config.primaryColor || prev.primaryColor,
            secondaryColor: config.secondaryColor || prev.secondaryColor,
            buttonColor: config.buttonColor || prev.buttonColor,
            fontFamily: config.font || prev.fontFamily,
            ...config.settings // Todas as configurações avançadas
          }))
        }
      } catch (error) {
        console.error('Erro ao carregar configurações:', error)
      } finally {
        setLoading(false)
      }
    }
    
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const token = localStorage.getItem('token')
      
      const response = await fetch(`/api/appearance/${storeId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: JSON.stringify(settings)
      })

      const data = await response.json()

      if (data.success) {
        setShowSuccessModal(true)
      } else {
        throw new Error(data.message || 'Erro ao salvar configurações')
      }
    } catch (error) {
      console.error('Erro ao salvar:', error)
      alert('Erro ao salvar configurações. Tente novamente.')
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = () => {
    window.open(`/?store=${storeId}`, "_blank")
  }

  const colorPresets = [
    { name: "Rosa Elegante", primary: "#ec4899", secondary: "#8b5cf6", accent: "#f59e0b" },
    { name: "Azul Moderno", primary: "#3b82f6", secondary: "#06b6d4", accent: "#10b981" },
    { name: "Verde Natureza", primary: "#10b981", secondary: "#059669", accent: "#f59e0b" },
    { name: "Roxo Luxo", primary: "#8b5cf6", secondary: "#7c3aed", accent: "#ec4899" },
    { name: "Laranja Vibrante", primary: "#f97316", secondary: "#ea580c", accent: "#dc2626" },
    { name: "Preto Clássico", primary: "#000000", secondary: "#374151", accent: "#f59e0b" }
  ]

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-x-visible">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center md:gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Aparência</h1>
          <p className="text-muted-foreground">Personalize o visual e design da sua loja</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Button variant="outline" onClick={handlePreview} className="w-full sm:w-auto py-3 text-base sm:py-2">
            <Eye className="h-4 w-4 mr-2" />
            Visualizar
          </Button>
          <Button onClick={handleSave} disabled={saving} className="w-full sm:w-auto py-3 text-base sm:py-2">
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="cores" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6">
          <TabsTrigger value="cores">Cores</TabsTrigger>
          <TabsTrigger value="logo">Logo & Marca</TabsTrigger>
          <TabsTrigger value="header">Header</TabsTrigger>
          <TabsTrigger value="tipografia">Tipografia</TabsTrigger>
          <TabsTrigger value="layout">Layout</TabsTrigger>
          <TabsTrigger value="redes">Redes Sociais</TabsTrigger>
        </TabsList>

        {/* Cores */}
        <TabsContent value="cores">
          <div className="space-y-6">
            {/* Paletas Pré-definidas */}
            <Card>
              <CardHeader>
                <CardTitle>Paletas de Cores</CardTitle>
                <CardDescription>Escolha uma paleta pré-definida ou personalize as cores</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {colorPresets.map((preset, index) => (
                    <div
                      key={index}
                      className="p-3 border rounded-lg cursor-pointer hover:border-gray-400 transition-colors"
                      onClick={() => setSettings({
                        ...settings,
                        primaryColor: preset.primary,
                        secondaryColor: preset.secondary,
                        accentColor: preset.accent
                      })}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.secondary }}></div>
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }}></div>
                      </div>
                      <p className="text-sm font-medium">{preset.name}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Cores Personalizadas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Cores Principais
                  </CardTitle>
                  <CardDescription>Personalize as cores da sua loja</CardDescription>
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
                      <Label htmlFor="accentColor">Cor de Destaque</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="accentColor"
                          type="color"
                          value={settings.accentColor}
                          onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={settings.accentColor}
                          onChange={(e) => setSettings({ ...settings, accentColor: e.target.value })}
                          placeholder="#f59e0b"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="buttonColor">Cor dos Botões</Label>
                      <div className="flex items-center gap-2 mt-1">
                        <Input
                          id="buttonColor"
                          type="color"
                          value={settings.buttonColor}
                          onChange={(e) => setSettings({ ...settings, buttonColor: e.target.value })}
                          className="w-12 h-10 p-1 border rounded"
                        />
                        <Input
                          value={settings.buttonColor}
                          onChange={(e) => setSettings({ ...settings, buttonColor: e.target.value })}
                          placeholder="#ec4899"
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
                    <div className="flex gap-2 flex-wrap">
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
                      <div
                        className="px-3 py-1 rounded text-white text-sm"
                        style={{ backgroundColor: settings.accentColor }}
                      >
                        Destaque
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Logo & Marca */}
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
                      <Button variant="ghost" size="sm" onClick={() => setSettings({ ...settings, logoUrl: "" })}>
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
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Banner Principal</CardTitle>
                <CardDescription>Configure o banner de destaque da sua loja</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar Banner Principal</Label>
                    <p className="text-sm text-muted-foreground">Exibir banner de destaque na página inicial</p>
                  </div>
                  <Switch
                    checked={settings.showHeaderBanner}
                    onCheckedChange={(checked) => setSettings({ ...settings, showHeaderBanner: checked })}
                  />
                </div>

                {settings.showHeaderBanner && (
                  <>
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
                      <Label htmlFor="headerBackgroundColor">Cor de Fundo do Banner</Label>
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
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Barra Superior</CardTitle>
                <CardDescription>Configure a barra promocional do topo</CardDescription>
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
                  <>
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="topBarColor">Cor de Fundo</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="color"
                            value={settings.topBarColor}
                            onChange={(e) => setSettings({ ...settings, topBarColor: e.target.value })}
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={settings.topBarColor}
                            onChange={(e) => setSettings({ ...settings, topBarColor: e.target.value })}
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="topBarTextColor">Cor do Texto</Label>
                        <div className="flex items-center gap-2 mt-1">
                          <Input
                            type="color"
                            value={settings.topBarTextColor}
                            onChange={(e) => setSettings({ ...settings, topBarTextColor: e.target.value })}
                            className="w-12 h-10 p-1 border rounded"
                          />
                          <Input
                            value={settings.topBarTextColor}
                            onChange={(e) => setSettings({ ...settings, topBarTextColor: e.target.value })}
                            placeholder="#ffffff"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Redes Sociais */}
        <TabsContent value="redes">
          <Card>
            <CardHeader>
              <CardTitle>Redes Sociais</CardTitle>
              <CardDescription>Configure os links das suas redes sociais</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mostrar Redes Sociais</Label>
                  <p className="text-sm text-muted-foreground">Exibir links para redes sociais no site</p>
                </div>
                <Switch
                  checked={settings.showSocialMedia}
                  onCheckedChange={(checked) => setSettings({ ...settings, showSocialMedia: checked })}
                />
              </div>

              {settings.showSocialMedia && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="instagram">Instagram</Label>
                      <Input
                        id="instagram"
                        value={settings.instagram}
                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                        placeholder="@sualore ou https://instagram.com/sualore"
                      />
                    </div>

                    <div>
                      <Label htmlFor="facebook">Facebook</Label>
                      <Input
                        id="facebook"
                        value={settings.facebook}
                        onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                        placeholder="sualore ou https://facebook.com/sualore"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tiktok">TikTok</Label>
                      <Input
                        id="tiktok"
                        value={settings.tiktok}
                        onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })}
                        placeholder="@sualore ou https://tiktok.com/@sualore"
                      />
                    </div>

                    <div>
                      <Label htmlFor="youtube">YouTube</Label>
                      <Input
                        id="youtube"
                        value={settings.youtube}
                        onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                        placeholder="Canal ou https://youtube.com/@sualore"
                      />
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tipografia */}
        <TabsContent value="tipografia">
          <Card>
            <CardHeader>
              <CardTitle>Tipografia</CardTitle>
              <CardDescription>Configure as fontes e estilos de texto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="fontFamily">Família da Fonte</Label>
                  <select
                    id="fontFamily"
                    value={settings.fontFamily}
                    onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Inter">Inter</option>
                    <option value="Roboto">Roboto</option>
                    <option value="Montserrat">Montserrat</option>
                    <option value="Poppins">Poppins</option>
                    <option value="Open Sans">Open Sans</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="fontSize">Tamanho da Fonte</Label>
                  <select
                    id="fontSize"
                    value={settings.fontSize}
                    onChange={(e) => setSettings({ ...settings, fontSize: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="small">Pequeno</option>
                    <option value="medium">Médio</option>
                    <option value="large">Grande</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="fontWeight">Peso da Fonte</Label>
                  <select
                    id="fontWeight"
                    value={settings.fontWeight}
                    onChange={(e) => setSettings({ ...settings, fontWeight: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="light">Leve</option>
                    <option value="normal">Normal</option>
                    <option value="medium">Médio</option>
                    <option value="bold">Negrito</option>
                  </select>
                </div>
              </div>

              <div className="p-4 border rounded-lg">
                <h3 className="text-lg font-bold mb-2">Preview da Tipografia</h3>
                <div style={{ fontFamily: settings.fontFamily, fontWeight: settings.fontWeight }}>
                  <h1 className="text-2xl mb-2">Título Principal</h1>
                  <h2 className="text-xl mb-2">Subtítulo</h2>
                  <p className="text-base mb-2">Este é um exemplo de parágrafo com a tipografia escolhida.</p>
                  <p className="text-sm">Texto menor para descrições e detalhes.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Layout */}
        <TabsContent value="layout">
          <Card>
            <CardHeader>
              <CardTitle>Layout e Espaçamento</CardTitle>
              <CardDescription>Configure o layout geral da loja</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="containerWidth">Largura do Container</Label>
                  <select
                    id="containerWidth"
                    value={settings.containerWidth}
                    onChange={(e) => setSettings({ ...settings, containerWidth: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="1024px">Pequeno (1024px)</option>
                    <option value="1200px">Médio (1200px)</option>
                    <option value="1400px">Grande (1400px)</option>
                    <option value="100%">Tela Cheia</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="spacing">Espaçamento</Label>
                  <select
                    id="spacing"
                    value={settings.spacing}
                    onChange={(e) => setSettings({ ...settings, spacing: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="tight">Compacto</option>
                    <option value="normal">Normal</option>
                    <option value="loose">Espaçoso</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="borderRadius">Arredondamento</Label>
                  <select
                    id="borderRadius"
                    value={settings.borderRadius}
                    onChange={(e) => setSettings({ ...settings, borderRadius: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="0px">Sem arredondamento</option>
                    <option value="4px">Leve</option>
                    <option value="8px">Médio</option>
                    <option value="12px">Forte</option>
                  </select>
                </div>

                <div>
                  <Label htmlFor="cardStyle">Estilo dos Cards</Label>
                  <select
                    id="cardStyle"
                    value={settings.cardStyle}
                    onChange={(e) => setSettings({ ...settings, cardStyle: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="modern">Moderno</option>
                    <option value="classic">Clássico</option>
                    <option value="minimal">Minimalista</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sombras</Label>
                    <p className="text-sm text-muted-foreground">Adicionar sombras aos elementos</p>
                  </div>
                  <Switch
                    checked={settings.showShadows}
                    onCheckedChange={(checked) => setSettings({ ...settings, showShadows: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Animações</Label>
                    <p className="text-sm text-muted-foreground">Ativar animações e transições</p>
                  </div>
                  <Switch
                    checked={settings.showAnimations}
                    onCheckedChange={(checked) => setSettings({ ...settings, showAnimations: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Gradientes</Label>
                    <p className="text-sm text-muted-foreground">Usar gradientes nos elementos</p>
                  </div>
                  <Switch
                    checked={settings.showGradients}
                    onCheckedChange={(checked) => setSettings({ ...settings, showGradients: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Modal de Sucesso */}
      <AlertDialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-green-600">✅ Sucesso!</AlertDialogTitle>
            <AlertDialogDescription>
              As configurações de aparência foram salvas com sucesso.
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
