'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'

interface SpecialCategory {
  name: string
  slug: string
  description: string
  type: 'promotion' | 'launch'
  color: string
  icon: string
  isActive: boolean
  created_at: string | null
  updated_at: string | null
}

interface SpecialCategoriesManagerProps {
  storeId: number
}

export default function SpecialCategoriesManager({ storeId }: SpecialCategoriesManagerProps) {
  const [categories, setCategories] = useState<SpecialCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchCategories()
  }, [storeId])

  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/special-categories?storeId=${storeId}`)
      const data = await res.json()
      if (data.success) {
        setCategories(data.categories)
      }
    } catch (error) {
      toast({
        title: 'Erro ao carregar categorias especiais',
        description: String(error),
        variant: 'destructive'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async (type: string, isActive: boolean) => {
    setUpdating(type)
    try {
      const res = await fetch('/api/special-categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          isActive,
          storeId
        })
      })

      const data = await res.json()
      if (data.success) {
        setCategories(prev => 
          prev.map(cat => 
            cat.type === type 
              ? { ...cat, isActive, updated_at: new Date().toISOString() }
              : cat
          )
        )
        toast({
          title: `Categoria ${isActive ? 'ativada' : 'desativada'}`,
          description: `A categoria foi ${isActive ? 'ativada' : 'desativada'} com sucesso.`
        })
      } else {
        throw new Error(data.error)
      }
    } catch (error) {
      toast({
        title: 'Erro ao atualizar categoria',
        description: String(error),
        variant: 'destructive'
      })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categorias Especiais</CardTitle>
          <CardDescription>Carregando...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Categorias Especiais</CardTitle>
        <CardDescription>
          Ative ou desative categorias especiais para sua loja. Produtos podem pertencer a múltiplas categorias.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((category) => (
          <div key={category.type} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{category.icon}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium">{category.name}</h4>
                  <Badge 
                    variant={category.isActive ? 'default' : 'secondary'}
                    style={{ backgroundColor: category.isActive ? category.color : undefined }}
                  >
                    {category.isActive ? 'Ativa' : 'Inativa'}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{category.description}</p>
                {category.updated_at && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Atualizada em: {new Date(category.updated_at).toLocaleString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
            <Switch
              checked={category.isActive}
              onCheckedChange={(checked) => handleToggle(category.type, checked)}
              disabled={updating === category.type}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  )
} 
 
 
 