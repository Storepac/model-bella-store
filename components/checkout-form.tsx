"use client"

import type React from "react"

import { useState } from "react"
import { MapPin, CreditCard, Smartphone, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"

interface CheckoutFormProps {
  onSubmit: (data: CheckoutData) => void
  onBack: () => void
}

export interface CheckoutData {
  customer: {
    name: string
    phone: string
    email?: string
    cpf?: string
  }
  address: {
    zipCode: string
    street: string
    number: string
    complement?: string
    neighborhood: string
    city: string
    state: string
  }
  paymentMethod: "pix" | "card" | "boleto" | "conditional"
  saveData: boolean
}

export function CheckoutForm({ onSubmit, onBack }: CheckoutFormProps) {
  const [formData, setFormData] = useState<CheckoutData>({
    customer: {
      name: "",
      phone: "",
      email: "",
      cpf: "",
    },
    address: {
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
    },
    paymentMethod: "pix",
    saveData: false,
  })

  const [isLoadingCep, setIsLoadingCep] = useState(false)
  const [cepError, setCepError] = useState("")

  const fetchAddressByCep = async (cep: string) => {
    if (cep.length !== 8) return

    setIsLoadingCep(true)
    setCepError("")

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()

      if (data.erro) {
        setCepError("CEP não encontrado")
        return
      }

      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          street: data.logradouro || "",
          neighborhood: data.bairro || "",
          city: data.localidade || "",
          state: data.uf || "",
        },
      }))
    } catch (error) {
      setCepError("Erro ao buscar CEP")
    } finally {
      setIsLoadingCep(false)
    }
  }

  const handleCepChange = (cep: string) => {
    const cleanCep = cep.replace(/\D/g, "").slice(0, 8)
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, zipCode: cleanCep },
    }))

    if (cleanCep.length === 8) {
      fetchAddressByCep(cleanCep)
    }
  }

  const handlePhoneChange = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, "").slice(0, 11)
    let formattedPhone = cleanPhone

    if (cleanPhone.length >= 11) {
      formattedPhone = `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 7)}-${cleanPhone.slice(7, 11)}`
    } else if (cleanPhone.length >= 7) {
      formattedPhone = `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2, 6)}-${cleanPhone.slice(6)}`
    } else if (cleanPhone.length >= 3) {
      formattedPhone = `(${cleanPhone.slice(0, 2)}) ${cleanPhone.slice(2)}`
    }

    setFormData((prev) => ({
      ...prev,
      customer: { ...prev.customer, phone: formattedPhone },
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validações básicas
    if (!formData.customer.name.trim()) {
      alert("Nome é obrigatório")
      return
    }

    if (!formData.customer.phone.trim()) {
      alert("Telefone é obrigatório")
      return
    }

    if (formData.paymentMethod !== "conditional") {
      if (!formData.address.zipCode || formData.address.zipCode.length !== 8) {
        alert("CEP é obrigatório")
        return
      }

      if (!formData.address.street.trim()) {
        alert("Endereço é obrigatório")
        return
      }

      if (!formData.address.number.trim()) {
        alert("Número é obrigatório")
        return
      }
    }

    onSubmit(formData)
  }

  const isConditional = formData.paymentMethod === "conditional"

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Button variant="ghost" size="sm" onClick={onBack}>
          ← Voltar
        </Button>
        <h2 className="text-xl font-semibold">Finalizar Pedido</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados do Cliente */}
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Dados do Cliente
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.customer.name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customer: { ...prev.customer, name: e.target.value },
                  }))
                }
                placeholder="Seu nome completo"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Telefone/WhatsApp *</Label>
              <Input
                id="phone"
                value={formData.customer.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="(11) 99999-9999"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">E-mail (opcional)</Label>
              <Input
                id="email"
                type="email"
                value={formData.customer.email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customer: { ...prev.customer, email: e.target.value },
                  }))
                }
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <Label htmlFor="cpf">CPF (opcional)</Label>
              <Input
                id="cpf"
                value={formData.customer.cpf}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    customer: { ...prev.customer, cpf: e.target.value },
                  }))
                }
                placeholder="000.000.000-00"
              />
            </div>
          </div>
        </div>

        {/* Forma de Pagamento */}
        <div className="bg-white rounded-lg border p-4 space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Forma de Pagamento
          </h3>

          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value: any) => setFormData((prev) => ({ ...prev, paymentMethod: value }))}
          >
            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="pix" id="pix" />
              <Label htmlFor="pix" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="font-medium">PIX</span>
                  <span className="text-sm text-green-600">Desconto de 5%</span>
                </div>
                <p className="text-sm text-muted-foreground">Pagamento instantâneo</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="card" id="card" />
              <Label htmlFor="card" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Cartão de Crédito</span>
                </div>
                <p className="text-sm text-muted-foreground">Parcelamos em até 10x sem juros</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
              <RadioGroupItem value="boleto" id="boleto" />
              <Label htmlFor="boleto" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <span className="font-medium">Boleto Bancário</span>
                </div>
                <p className="text-sm text-muted-foreground">Vencimento em 3 dias úteis</p>
              </Label>
            </div>

            <div className="flex items-center space-x-2 p-3 border-2 border-orange-200 bg-orange-50 rounded-lg hover:bg-orange-100">
              <RadioGroupItem value="conditional" id="conditional" />
              <Label htmlFor="conditional" className="flex-1 cursor-pointer">
                <div className="flex items-center gap-2">
                  <Store className="h-4 w-4 text-orange-600" />
                  <span className="font-medium text-orange-800">Compra Condicional</span>
                </div>
                <p className="text-sm text-orange-700">Reserve para provar na loja e finalizar a compra</p>
              </Label>
            </div>
          </RadioGroup>
        </div>

        {/* Endereço de Entrega - Só aparece se não for condicional */}
        {!isConditional && (
          <div className="bg-white rounded-lg border p-4 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Endereço de Entrega
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="zipCode">CEP *</Label>
                <Input
                  id="zipCode"
                  value={formData.address.zipCode}
                  onChange={(e) => handleCepChange(e.target.value)}
                  placeholder="00000-000"
                  maxLength={8}
                  required={!isConditional}
                />
                {isLoadingCep && <p className="text-xs text-blue-600 mt-1">Buscando CEP...</p>}
                {cepError && <p className="text-xs text-red-600 mt-1">{cepError}</p>}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="street">Endereço *</Label>
                <Input
                  id="street"
                  value={formData.address.street}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, street: e.target.value },
                    }))
                  }
                  placeholder="Rua, Avenida..."
                  required={!isConditional}
                />
              </div>

              <div>
                <Label htmlFor="number">Número *</Label>
                <Input
                  id="number"
                  value={formData.address.number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, number: e.target.value },
                    }))
                  }
                  placeholder="123"
                  required={!isConditional}
                />
              </div>

              <div>
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  value={formData.address.complement}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, complement: e.target.value },
                    }))
                  }
                  placeholder="Apto, Bloco..."
                />
              </div>

              <div>
                <Label htmlFor="neighborhood">Bairro</Label>
                <Input
                  id="neighborhood"
                  value={formData.address.neighborhood}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, neighborhood: e.target.value },
                    }))
                  }
                  placeholder="Bairro"
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  value={formData.address.city}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, city: e.target.value },
                    }))
                  }
                  placeholder="Cidade"
                  readOnly
                />
              </div>

              <div>
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  value={formData.address.state}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      address: { ...prev.address, state: e.target.value },
                    }))
                  }
                  placeholder="UF"
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {/* Opção de Salvar Dados */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="saveData"
              checked={formData.saveData}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, saveData: checked as boolean }))}
            />
            <Label htmlFor="saveData" className="text-sm cursor-pointer">
              Salvar meus dados para próximas compras (opcional)
            </Label>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Seus dados serão salvos com segurança para facilitar futuras compras
          </p>
        </div>

        {/* Botão de Finalizar */}
        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white h-12 text-lg">
          {isConditional ? "Reservar Produtos" : "Finalizar no WhatsApp"}
        </Button>
      </form>
    </div>
  )
}
