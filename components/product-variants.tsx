"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Package } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ProductVariantsProps {
  storeId: number
  selectedVariants: any[]
  onVariantsChange: (variants: any[]) => void
  variantUpdate?: number
}

interface Variant {
  id: number
  name: string
  description?: string
  type: string
  isActive: boolean
  options: string[]
}

interface ProductVariant {
  variantId: number
  variantName: string
  selectedOptions: string[]
}

interface VariantCombination {
  id: string
  combination: Record<string, string>
  price?: number
  stock?: number
  sku?: string
  isActive: boolean
}

export function ProductVariants({ storeId, selectedVariants, onVariantsChange, variantUpdate }: ProductVariantsProps) {
  const { toast } = useToast()
  const [availableVariants, setAvailableVariants] = useState<Variant[]>([])
  const [productVariants, setProductVariants] = useState<ProductVariant[]>(selectedVariants || [])
  const [combinations, setCombinations] = useState<VariantCombination[]>([])
  const [showCombinations, setShowCombinations] = useState(false)

  // Carregar variantes disponíveis da loja
  const loadVariants = async () => {
    try {
      const res = await fetch(`/api/variants?storeId=${storeId}`)
      const data = await res.json()
      if (data.success) {
        setAvailableVariants(data.variants.filter((v: Variant) => v.isActive))
      }
    } catch (error) {
      console.error('Erro ao carregar variantes:', error)
    }
  }

  useEffect(() => {
    loadVariants()
  }, [storeId, variantUpdate])

  useEffect(() => {
    onVariantsChange(productVariants)
    generateCombinations()
  }, [productVariants])

  const addVariant = (variantId: string) => {
    const variant = availableVariants.find(v => v.id === Number(variantId))
    if (!variant) return

    const exists = productVariants.find(pv => pv.variantId === variant.id)
    if (exists) {
      toast({ title: 'Variante já adicionada', variant: 'destructive' })
      return
    }

    const newProductVariant: ProductVariant = {
      variantId: variant.id,
      variantName: variant.name,
      selectedOptions: []
    }

    setProductVariants([...productVariants, newProductVariant])
  }

  const removeVariant = (variantId: number) => {
    setProductVariants(productVariants.filter(pv => pv.variantId !== variantId))
  }

  const toggleOption = (variantId: number, option: string) => {
    setProductVariants(productVariants.map(pv => {
      if (pv.variantId === variantId) {
        const newOptions = pv.selectedOptions.includes(option)
          ? pv.selectedOptions.filter(o => o !== option)
          : [...pv.selectedOptions, option]
        return { ...pv, selectedOptions: newOptions }
      }
      return pv
    }))
  }

  const generateCombinations = () => {
    if (productVariants.length === 0) {
      setCombinations([])
      return
    }

    const variantsWithOptions = productVariants.filter(pv => pv.selectedOptions.length > 0)
    if (variantsWithOptions.length === 0) {
      setCombinations([])
      return
    }

    // Gerar todas as combinações possíveis
    const generateCombos = (variants: ProductVariant[]): Record<string, string>[] => {
      if (variants.length === 0) return [{}]
      
      const [first, ...rest] = variants
      const restCombos = generateCombos(rest)
      
      const result: Record<string, string>[] = []
      first.selectedOptions.forEach(option => {
        restCombos.forEach(combo => {
          result.push({ [first.variantName]: option, ...combo })
        })
      })
      
      return result
    }

    const allCombinations = generateCombos(variantsWithOptions)
    const newCombinations = allCombinations.map((combo, index) => ({
      id: `combo-${index}`,
      combination: combo,
      price: undefined,
      stock: undefined,
      sku: undefined,
      isActive: true
    }))

    setCombinations(newCombinations)
    setShowCombinations(newCombinations.length > 0)
  }

  const updateCombination = (id: string, field: string, value: any) => {
    setCombinations(combinations.map(combo => 
      combo.id === id ? { ...combo, [field]: value } : combo
    ))
  }

  const getVariantByName = (name: string) => {
    const productVariant = productVariants.find(pv => pv.variantName === name)
    if (!productVariant) return null
    return availableVariants.find(v => v.id === productVariant.variantId)
  }

  const availableToAdd = availableVariants.filter(v => 
    !productVariants.find(pv => pv.variantId === v.id)
  )

  return (
    <div className="space-y-6">
      {/* Adicionar Variantes */}
      <div>
        <Label className="text-base font-medium">Variantes do Produto</Label>
        <p className="text-sm text-muted-foreground mb-4">
          Selecione quais variantes este produto possui e suas opções disponíveis.
        </p>
        
        {availableToAdd.length > 0 && (
          <div className="flex gap-2 mb-4">
            <Select onValueChange={addVariant}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Adicionar variante..." />
              </SelectTrigger>
              <SelectContent>
                {availableToAdd.map(variant => (
                  <SelectItem key={variant.id} value={variant.id.toString()}>
                    {variant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {productVariants.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>Nenhuma variante selecionada</p>
            <p className="text-sm">Adicione variantes para este produto</p>
          </div>
        ) : (
          <div className="space-y-4">
            {productVariants.map(productVariant => {
              const variant = availableVariants.find(v => v.id === productVariant.variantId)
              if (!variant) return null

              return (
                <Card key={productVariant.variantId}>
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-lg">{variant.name}</CardTitle>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeVariant(productVariant.variantId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {variant.description && (
                      <p className="text-sm text-muted-foreground">{variant.description}</p>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Opções disponíveis:</Label>
                      <div className="flex flex-wrap gap-2">
                        {variant.options.map(option => (
                          <div key={option} className="flex items-center space-x-2">
                            <Checkbox
                              id={`${productVariant.variantId}-${option}`}
                              checked={productVariant.selectedOptions.includes(option)}
                              onCheckedChange={() => toggleOption(productVariant.variantId, option)}
                            />
                            <Label
                              htmlFor={`${productVariant.variantId}-${option}`}
                              className="text-sm font-normal cursor-pointer"
                            >
                              {option}
                            </Label>
                          </div>
                        ))}
                      </div>
                      
                      {productVariant.selectedOptions.length > 0 && (
                        <div className="mt-3">
                          <Label className="text-sm font-medium">Selecionadas:</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {productVariant.selectedOptions.map(option => (
                              <Badge key={option} variant="secondary">
                                {option}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Combinações de Variantes */}
      {showCombinations && combinations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Combinações de Variantes</CardTitle>
            <p className="text-sm text-muted-foreground">
              Configure preços e estoques específicos para cada combinação de variantes.
            </p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Combinação</TableHead>
                    <TableHead>Preço (R$)</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Ativo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combinations.map(combo => (
                    <TableRow key={combo.id}>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {Object.entries(combo.combination).map(([variantName, option]) => (
                            <Badge key={`${variantName}-${option}`} variant="outline" className="text-xs">
                              {variantName}: {option}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={combo.price || ''}
                          onChange={(e) => updateCombination(combo.id, 'price', Number(e.target.value))}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          placeholder="0"
                          value={combo.stock || ''}
                          onChange={(e) => updateCombination(combo.id, 'stock', Number(e.target.value))}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder="SKU"
                          value={combo.sku || ''}
                          onChange={(e) => updateCombination(combo.id, 'sku', e.target.value)}
                          className="w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          checked={combo.isActive}
                          onCheckedChange={(checked) => updateCombination(combo.id, 'isActive', checked)}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 
 
 
 