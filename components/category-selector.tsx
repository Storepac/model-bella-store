'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

interface Category {
  id: number
  name: string
  parentId: number | null
  level: number
}

interface SpecialCategory {
  name: string
  type: 'promotion' | 'launch'
  color: string
  icon: string
  isActive: boolean
}

interface CategorySelectorProps {
  storeId: number
  selectedCategories: number[]
  onCategoriesChange: (categories: number[]) => void
  isPromotion: boolean
  isLaunch: boolean
  onSpecialChange: (type: 'promotion' | 'launch', value: boolean) => void
}

export default function CategorySelector({
  storeId,
  selectedCategories = [],
  onCategoriesChange,
  isPromotion = false,
  isLaunch = false,
  onSpecialChange
}: CategorySelectorProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [specialCategories, setSpecialCategories] = useState<SpecialCategory[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [storeId])

  const fetchData = async () => {
    try {
      // Buscar categorias normais
      const categoriesRes = await fetch(`/api/categories?storeId=${storeId}`)
      const categoriesData = await categoriesRes.json()
      
      // Buscar categorias especiais
      const specialRes = await fetch(`/api/special-categories?storeId=${storeId}`)
      const specialData = await specialRes.json()
      
      // Validar dados antes de setar
      if (categoriesData && Array.isArray(categoriesData)) {
        setCategories(categoriesData)
      } else {
        setCategories([])
      }
      
      if (specialData && specialData.success && Array.isArray(specialData.categories)) {
        setSpecialCategories(specialData.categories.filter((cat: any) => cat.isActive))
      } else {
        setSpecialCategories([])
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setCategories([])
      setSpecialCategories([])
    } finally {
      setLoading(false)
    }
  }

  const handleCategoryToggle = (categoryId: number) => {
    if (!Array.isArray(selectedCategories)) {
      onCategoriesChange([categoryId])
      return
    }
    
    const newSelected = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId]
    
    onCategoriesChange(newSelected)
  }

  const getCategoryLevel = (category: Category) => {
    const level = category.level || 0
    return '  '.repeat(level) + category.name
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Categorias</CardTitle>
          <CardDescription>Carregando categorias...</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Categorias Especiais */}
      {Array.isArray(specialCategories) && specialCategories.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span>🎯</span>
              Categorias Especiais
            </CardTitle>
            <CardDescription>
              Adicione seu produto a categorias especiais para maior visibilidade
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {specialCategories.map((category) => (
              <div key={category.type} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-xl">{category.icon}</div>
                  <div>
                    <Label className="font-medium">{category.name}</Label>
                    <Badge 
                      variant="outline" 
                      className="ml-2"
                      style={{ borderColor: category.color, color: category.color }}
                    >
                      Especial
                    </Badge>
                  </div>
                </div>
                <Switch
                  checked={category.type === 'promotion' ? isPromotion : isLaunch}
                  onCheckedChange={(checked) => onSpecialChange(category.type, checked)}
                />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Categorias Normais */}
      <Card>
        <CardHeader>
          <CardTitle>Categorias Principais</CardTitle>
          <CardDescription>
            Selecione uma ou mais categorias para seu produto (obrigatório pelo menos uma)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={Array.isArray(selectedCategories) && selectedCategories.includes(category.id)}
                  onCheckedChange={() => handleCategoryToggle(category.id)}
                />
                <Label 
                  htmlFor={`category-${category.id}`}
                  className={`cursor-pointer ${(category.level || 0) > 0 ? 'text-muted-foreground' : 'font-medium'}`}
                >
                  {getCategoryLevel(category)}
                </Label>
                {(category.level || 0) === 0 && (
                  <Badge variant="outline" className="text-xs">
                    Principal
                  </Badge>
                )}
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Nenhuma categoria encontrada. Cadastre categorias primeiro.
            </p>
          )}
          
          {Array.isArray(selectedCategories) && selectedCategories.length === 0 && categories.length > 0 && (
            <p className="text-sm text-destructive mt-2">
              ⚠️ Selecione pelo menos uma categoria principal
            </p>
          )}
          
          {Array.isArray(selectedCategories) && selectedCategories.length > 0 && (
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Categorias selecionadas:</p>
              <div className="flex flex-wrap gap-2">
                {selectedCategories.map(id => {
                  const category = categories.find(c => c.id === id)
                  return category ? (
                    <Badge key={id} variant="secondary">
                      {category.name}
                    </Badge>
                  ) : null
                })}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 
 
 
 