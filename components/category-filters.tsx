"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Separator } from "@/components/ui/separator"
import { 
  ChevronDown, 
  ChevronUp, 
  Filter, 
  X,
  Star,
  Sparkles,
  TrendingUp,
  Tag
} from "lucide-react"

interface CategoryFiltersProps {
  filters: {
    brands: string[]
    sizes: string[]
    genders: string[]
    priceRanges: Array<{ min: number; max: number | null; label: string }>
    departments: string[]
    features: string[]
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
  hideHeader?: boolean
}

export function CategoryFilters({ filters, onFiltersChange, onClearFilters, hideHeader = false }: CategoryFiltersProps) {
  const [openSections, setOpenSections] = useState({
    brands: true,
    sizes: true,
    genders: true,
    price: true,
    departments: true,
    features: true
  })

  const [selectedFilters, setSelectedFilters] = useState<any>({
    brands: [],
    sizes: [],
    genders: [],
    priceRange: null,
    departments: [],
    features: []
  })

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleFilterChange = (type: string, value: any, checked?: boolean) => {
    let newFilters = { ...selectedFilters }

    if (type === 'brands' || type === 'sizes' || type === 'genders' || type === 'departments' || type === 'features') {
      const currentArray = newFilters[type as keyof typeof newFilters] as string[]
      
      if (checked) {
        newFilters[type as keyof typeof newFilters] = [...currentArray, value as string]
      } else {
        newFilters[type as keyof typeof newFilters] = currentArray.filter(item => item !== value)
      }
    } else if (type === 'priceRange') {
      newFilters.priceRange = value as { min: number; max: number | null }
    }

    setSelectedFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setSelectedFilters({
      brands: [],
      sizes: [],
      genders: [],
      priceRange: null,
      departments: [],
      features: []
    })
    onClearFilters()
  }

  const getActiveFiltersCount = () => {
    return (
      selectedFilters.brands.length +
      selectedFilters.sizes.length +
      selectedFilters.genders.length +
      (selectedFilters.priceRange ? 1 : 0) +
      selectedFilters.departments.length +
      selectedFilters.features.length
    )
  }

  return (
    <div className="w-full lg:w-64 bg-white border-r border-gray-200 p-4 space-y-4 lg:space-y-6 h-full overflow-y-auto">
      {/* Header dos Filtros */}
      {!hideHeader && (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <h3 className="font-semibold">Filtros</h3>
            </div>
            {getActiveFiltersCount() > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-xs text-gray-500 hover:text-gray-700"
              >
                <X className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>

          {/* Contador de filtros ativos */}
          {getActiveFiltersCount() > 0 && (
            <div className="text-xs text-gray-500">
              {getActiveFiltersCount()} filtro{getActiveFiltersCount() !== 1 ? 's' : ''} ativo{getActiveFiltersCount() !== 1 ? 's' : ''}
            </div>
          )}

          <Separator />
        </>
      )}

      {/* Marcas */}
      <Collapsible open={openSections.brands} onOpenChange={() => toggleSection('brands')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
            <span className="text-sm font-medium">Marca</span>
            {openSections.brands ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          {filters.brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={selectedFilters.brands.includes(brand)}
                onCheckedChange={(checked) => 
                  handleFilterChange('brands', brand, checked as boolean)
                }
              />
              <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                {brand}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Tamanhos */}
      <Collapsible open={openSections.sizes} onOpenChange={() => toggleSection('sizes')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
            <span className="text-sm font-medium">Tamanho</span>
            {openSections.sizes ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
            {filters.sizes.map((size) => (
              <div key={size} className="flex items-center space-x-2">
                <Checkbox
                  id={`size-${size}`}
                  checked={selectedFilters.sizes.includes(size)}
                  onCheckedChange={(checked) => 
                    handleFilterChange('sizes', size, checked as boolean)
                  }
                />
                <Label htmlFor={`size-${size}`} className="text-sm cursor-pointer">
                  {size}
                </Label>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Gênero */}
      <Collapsible open={openSections.genders} onOpenChange={() => toggleSection('genders')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
            <span className="text-sm font-medium">Gênero</span>
            {openSections.genders ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          {filters.genders.map((gender) => (
            <div key={gender} className="flex items-center space-x-2">
              <Checkbox
                id={`gender-${gender}`}
                checked={selectedFilters.genders.includes(gender)}
                onCheckedChange={(checked) => 
                  handleFilterChange('genders', gender, checked as boolean)
                }
              />
              <Label htmlFor={`gender-${gender}`} className="text-sm cursor-pointer">
                {gender}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Preço */}
      <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
            <span className="text-sm font-medium">Preço</span>
            {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-3">
          <div className="space-y-2">
            {filters.priceRanges.map((range, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${index}`}
                  checked={
                    selectedFilters.priceRange?.min === range.min && 
                    selectedFilters.priceRange?.max === range.max
                  }
                  onCheckedChange={(checked) => {
                    if (checked) {
                      handleFilterChange('priceRange', range)
                    } else {
                      handleFilterChange('priceRange', null)
                    }
                  }}
                />
                <Label htmlFor={`price-${index}`} className="text-sm cursor-pointer">
                  {range.label}
                </Label>
              </div>
            ))}
          </div>
          
          {/* Slider de preço personalizado */}
          <div className="pt-4">
            <Label className="text-sm font-medium">Faixa de Preço</Label>
            <div className="mt-2">
              <Slider
                defaultValue={[0, 1000]}
                max={1000}
                step={10}
                className="w-full"
                onValueChange={(value) => {
                  handleFilterChange('priceRange', { min: value[0], max: value[1] })
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>R$ 0</span>
                <span>R$ 1000</span>
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Departamento */}
      <Collapsible open={openSections.departments} onOpenChange={() => toggleSection('departments')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
            <span className="text-sm font-medium">Departamento</span>
            {openSections.departments ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          {filters.departments.map((dept) => (
            <div key={dept} className="flex items-center space-x-2">
              <Checkbox
                id={`dept-${dept}`}
                checked={selectedFilters.departments.includes(dept)}
                onCheckedChange={(checked) => 
                  handleFilterChange('departments', dept, checked as boolean)
                }
              />
              <Label htmlFor={`dept-${dept}`} className="text-sm cursor-pointer">
                {dept}
              </Label>
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>

      <Separator />

      {/* Características Especiais */}
      <Collapsible open={openSections.features} onOpenChange={() => toggleSection('features')}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto font-normal">
            <span className="text-sm font-medium">Características</span>
            {openSections.features ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 space-y-2">
          {filters.features.map((feature) => {
            const getIcon = () => {
              switch (feature) {
                case 'Novidades':
                  return <Sparkles className="h-3 w-3" />
                case 'Promoções':
                  return <Tag className="h-3 w-3" />
                case 'Mais Vendidos':
                  return <TrendingUp className="h-3 w-3" />
                case 'Lançamentos':
                  return <Star className="h-3 w-3" />
                default:
                  return null
              }
            }

            return (
              <div key={feature} className="flex items-center space-x-2">
                <Checkbox
                  id={`feature-${feature}`}
                  checked={selectedFilters.features.includes(feature)}
                  onCheckedChange={(checked) => 
                    handleFilterChange('features', feature, checked as boolean)
                  }
                />
                <Label htmlFor={`feature-${feature}`} className="text-sm cursor-pointer flex items-center gap-1">
                  {getIcon()}
                  {feature}
                </Label>
              </div>
            )
          })}
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
} 