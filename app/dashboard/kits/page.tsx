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
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Kits e Combos</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Kit</CardTitle>
          <CardDescription>Agrupe produtos para criar ofertas especiais para seus clientes.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="kit-name">Nome do Kit</Label>
            <Input id="kit-name" placeholder="Ex: Kit Look de Verão" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="kit-price">Preço do Kit</Label>
            <Input id="kit-price" type="number" placeholder="R$ 299,90" />
          </div>

          <div>
            <Label>Produtos do Kit</Label>
            <div className="mt-2 space-y-4">
              {kitProducts.map((product, index) => (
                <div key={index} className="flex items-end gap-4">
                  <div className="grid flex-1 gap-2">
                    <Label htmlFor={`product-${index}`} className="sr-only">
                      Produto
                    </Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um produto" />
                      </SelectTrigger>
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
                    <Input id={`quantity-${index}`} type="number" defaultValue={1} className="w-20" />
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleRemoveProduct(index)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                    <span className="sr-only">Remover produto</span>
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" className="mt-4 gap-1 bg-transparent" onClick={handleAddProduct}>
              <PlusCircle className="h-3.5 w-3.5" />
              Adicionar Produto ao Kit
            </Button>
          </div>
          <Button className="w-full sm:w-auto">Salvar Kit</Button>
        </CardContent>
      </Card>
    </div>
  )
}
