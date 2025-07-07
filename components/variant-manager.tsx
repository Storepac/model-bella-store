"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Package, Sparkles, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface VariantManagerProps {
  storeId: number
  onVariantCreated?: () => void
}

interface Variant {
  id: number
  name: string
  description?: string
  type: string
  isActive: boolean
  options: string[]
}

interface VariantTemplate {
  id: string
  name: string
  description: string
  category: string
  type: string
  options: string[]
}

export function VariantManager({ storeId, onVariantCreated }: VariantManagerProps) {
  const { toast } = useToast()
  const [variants, setVariants] = useState<Variant[]>([])
  const [templates, setTemplates] = useState<VariantTemplate[]>([])
  const [groupedTemplates, setGroupedTemplates] = useState<Record<string, VariantTemplate[]>>({})
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)
  const [selectedTemplate, setSelectedTemplate] = useState<VariantTemplate | null>(null)
  const [activeTab, setActiveTab] = useState("custom")
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "select",
    options: [] as string[],
    newOption: ""
  })

  // Carregar variantes da loja
  const loadVariants = async () => {
    try {
      const res = await fetch(`/api/variants?storeId=${storeId}`)
      const data = await res.json()
      if (data.success) {
        setVariants(data.variants)
      }
    } catch (error) {
      console.error('Erro ao carregar variantes:', error)
    }
  }

  // Carregar templates
  const loadTemplates = async () => {
    try {
      const res = await fetch('/api/variant-templates')
      const data = await res.json()
      if (data.success) {
        setTemplates(data.templates)
        setGroupedTemplates(data.grouped)
      }
    } catch (error) {
      console.error('Erro ao carregar templates:', error)
    }
  }

  useEffect(() => {
    loadVariants()
    loadTemplates()
  }, [storeId])

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      type: "select",
      options: [],
      newOption: ""
    })
    setEditingVariant(null)
    setSelectedTemplate(null)
  }

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast({ title: 'Nome da variante é obrigatório', variant: 'destructive' })
      return
    }

    if (formData.options.length === 0) {
      toast({ title: 'Adicione pelo menos uma opção', variant: 'destructive' })
      return
    }

    try {
      const method = editingVariant ? 'PUT' : 'POST'
      const body = {
        ...(editingVariant && { id: editingVariant.id }),
        name: formData.name,
        description: formData.description,
        type: formData.type,
        options: formData.options,
        storeId
      }

      const res = await fetch('/api/variants', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const data = await res.json()
      if (data.success) {
        toast({ 
          title: editingVariant ? 'Variante atualizada!' : 'Variante criada!',
          description: `${formData.name} foi ${editingVariant ? 'atualizada' : 'criada'} com sucesso.`
        })
        loadVariants()
        setIsDialogOpen(false)
        resetForm()
        if (!editingVariant && typeof onVariantCreated === 'function') {
          onVariantCreated()
        }
      } else {
        toast({ title: 'Erro ao salvar variante', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Erro ao salvar variante', variant: 'destructive' })
    }
  }

  const handleEdit = (variant: Variant) => {
    setEditingVariant(variant)
    setFormData({
      name: variant.name,
      description: variant.description || "",
      type: variant.type,
      options: [...variant.options],
      newOption: ""
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (variant: Variant) => {
    if (!confirm(`Tem certeza que deseja excluir a variante "${variant.name}"?`)) return

    try {
      const res = await fetch('/api/variants', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variant.id, storeId })
      })

      const data = await res.json()
      if (data.success) {
        toast({ title: 'Variante excluída!', description: `${variant.name} foi removida.` })
        loadVariants()
      } else {
        toast({ title: 'Erro ao excluir variante', description: data.error, variant: 'destructive' })
      }
    } catch (error) {
      toast({ title: 'Erro ao excluir variante', variant: 'destructive' })
    }
  }

  const useTemplate = (template: VariantTemplate) => {
    setSelectedTemplate(template)
    setFormData({
      name: template.name,
      description: template.description,
      type: template.type,
      options: [...template.options],
      newOption: ""
    })
    setActiveTab("custom")
    setIsDialogOpen(true)
    setEditingVariant(null)
  }

  const addOption = () => {
    if (formData.newOption.trim() && !formData.options.includes(formData.newOption.trim())) {
      setFormData({
        ...formData,
        options: [...formData.options, formData.newOption.trim()],
        newOption: ""
      })
    }
  }

  const removeOption = (option: string) => {
    setFormData({
      ...formData,
      options: formData.options.filter(o => o !== option)
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Gerenciar Variantes
            </CardTitle>
            <CardDescription>
              Crie e gerencie variantes personalizadas para sua loja (ex: tamanhos, cores, sabores, etc.)
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="h-4 w-4 mr-2" />
                Nova Variante
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingVariant ? 'Editar Variante' : 'Criar Nova Variante'}
                </DialogTitle>
                <DialogDescription>
                  {selectedTemplate ? `Baseado no template: ${selectedTemplate.name}` : 'Crie uma variante personalizada para sua loja'}
                </DialogDescription>
              </DialogHeader>

              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="custom">Personalizada</TabsTrigger>
                  <TabsTrigger value="templates">
                    <Sparkles className="h-4 w-4 mr-2" />
                    Templates
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="custom" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nome da Variante *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="ex: Tamanho, Cor, Sabor..."
                      />
                    </div>
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="select">Seleção</SelectItem>
                          <SelectItem value="color">Cor</SelectItem>
                          <SelectItem value="text">Texto</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Descrição (opcional)</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição da variante..."
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label>Opções da Variante *</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={formData.newOption}
                        onChange={(e) => setFormData({ ...formData, newOption: e.target.value })}
                        placeholder="Nova opção..."
                        onKeyPress={(e) => e.key === 'Enter' && addOption()}
                      />
                      <Button type="button" onClick={addOption} variant="outline">
                        Adicionar
                      </Button>
                    </div>
                    
                    {formData.options.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.options.map((option, index) => (
                          <Badge key={index} variant="secondary" className="flex items-center gap-1">
                            {option}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 w-4 h-4"
                              onClick={() => removeOption(option)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button onClick={handleSave} className="flex-1">
                      {editingVariant ? 'Atualizar' : 'Criar'} Variante
                    </Button>
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="templates" className="space-y-4">
                  <div className="text-sm text-muted-foreground mb-4">
                    Escolha um template pré-definido para começar rapidamente:
                  </div>
                  
                  {Object.entries(groupedTemplates).map(([category, categoryTemplates]) => (
                    <div key={category}>
                      <h4 className="font-medium text-sm mb-3 text-primary">{category}</h4>
                      <div className="grid grid-cols-1 gap-2 mb-4">
                        {categoryTemplates.map((template) => (
                          <div
                            key={template.id}
                            className="p-3 border rounded-lg hover:bg-accent cursor-pointer transition-colors"
                          >
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-sm">{template.name}</h5>
                                <p className="text-xs text-muted-foreground mt-1">{template.description}</p>
                                <div className="flex flex-wrap gap-1 mt-2">
                                  {template.options.slice(0, 4).map((option, idx) => (
                                    <Badge key={idx} variant="outline" className="text-xs">
                                      {option}
                                    </Badge>
                                  ))}
                                  {template.options.length > 4 && (
                                    <Badge variant="outline" className="text-xs">
                                      +{template.options.length - 4}
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              <Button size="sm" variant="ghost" onClick={() => useTemplate(template)}>
                                Usar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {variants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma variante criada ainda.</p>
            <p className="text-sm">Crie variantes personalizadas para seus produtos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {variants.map((variant) => (
              <div key={variant.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium">{variant.name}</h4>
                    {variant.description && (
                      <p className="text-sm text-muted-foreground">{variant.description}</p>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => handleEdit(variant)}>
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => handleDelete(variant)}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {variant.options.slice(0, 6).map((option, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {option}
                    </Badge>
                  ))}
                  {variant.options.length > 6 && (
                    <Badge variant="secondary" className="text-xs">
                      +{variant.options.length - 6}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
} 
 
 
 