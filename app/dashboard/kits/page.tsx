"use client"

import { useState } from "react"
import { PlusCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const availableProducts = [
  { id: "prod_1", name: "Vestido Floral de Verão" },
  { id: "prod_2", name: "Calça Jeans Skinny" },
  { id: "prod_3", name: "Blusa de Seda com Renda" },
  { id: "prod_4", name: "Sapato Scarpin Preto" },
  { id: "prod_5", name: "Bolsa de Couro Caramelo" },
]

// Lista simulada de kits já criados
const kits = [
  {
    id: 'kit_1',
    name: 'Kit Look de Verão',
    code: 'K001',
    price: 299.9,
    stock: 12,
    isActive: true,
    image: '/imgs/img_22.jpg',
  },
  {
    id: 'kit_2',
    name: 'Combo Jeans + Blusa',
    code: 'K002',
    price: 199.9,
    stock: 5,
    isActive: false,
    image: '/imgs/img_23.jpg',
  },
]

export default function KitsPage() {
  const [kitProducts, setKitProducts] = useState<{ id: string; quantity: number }[]>([])

  const handleAddProduct = () => {
    setKitProducts([...kitProducts, { id: "", quantity: 1 }])
  }

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...kitProducts]
    newProducts.splice(index, 1)
    setKitProducts(newProducts)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <h1 className="text-lg font-semibold sm:text-2xl">Kits e Combos</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Kit</CardTitle>
          <CardDescription>Agrupe produtos para criar ofertas especiais para seus clientes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="kit-name">Nome do Kit</Label>
            <Input id="kit-name" className="w-full" placeholder="Ex: Kit Look de Verão" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kit-price">Preço do Kit</Label>
            <Input id="kit-price" type="number" className="w-full" placeholder="R$ 299,90" />
          </div>
          <div>
            <Label>Produtos do Kit</Label>
            <div className="mt-2 space-y-4">
              {kitProducts.map((product, index) => (
                <div key={index} className="flex flex-col gap-2 sm:flex-row sm:items-end sm:gap-4">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor={`product-${index}`} className="sr-only">
                      Produto
                    </Label>
                    <Select>
                      <SelectTrigger className="w-full" />
                      <SelectContent>
                        {availableProducts.map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`quantity-${index}`} className="sr-only">
                      Quantidade
                    </Label>
                    <Input id={`quantity-${index}`} type="number" defaultValue={1} className="w-full sm:w-20" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Remover produto</span>
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 gap-1 bg-transparent w-full sm:w-auto" onClick={handleAddProduct}>
              <PlusCircle className="h-3.5 w-3.5" />
              Adicionar Produto ao Kit
            </Button>
          </div>
          <Button className="w-full sm:w-auto py-3 text-base sm:py-2">Salvar Kit</Button>
        </CardContent>
      </Card>
      {/* Listagem de kits já criados */}
      <div className="flex flex-col gap-4 mt-4">
        {kits.map(kit => (
          <div key={kit.id} className="flex items-center gap-3 p-3 rounded-xl border bg-white shadow-sm">
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <img src={kit.image} alt={kit.name} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${kit.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{kit.isActive ? 'ativo' : 'inativo'}</span>
                <span className="text-xs text-muted-foreground">{kit.code}</span>
              </div>
              <div className="font-semibold truncate text-base">{kit.name}</div>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-sm font-bold text-gray-800">R$ {kit.price.toFixed(2)}</span>
                <span className="text-xs bg-green-50 text-green-700 rounded px-2 py-0.5">{kit.stock} unidades</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 ml-2">
              <Button size="icon" variant="outline" className="w-8 h-8"><span className="sr-only">Editar</span>✏️</Button>
              <Button size="icon" variant="ghost" className="w-8 h-8"><span className="sr-only">Remover</span>🗑️</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
