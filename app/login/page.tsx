"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Store, Lock, User, Eye, EyeOff, Shield } from "lucide-react"

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"

export default function LoginPage() {
  const router = useRouter()
  const [loginType, setLoginType] = useState<"lojista" | "admin">("lojista")
  const [formData, setFormData] = useState({
    storeCode: "",
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      let payload: any = { password: formData.password }
      if (loginType === "lojista") {
        payload.codigo = formData.storeCode
      } else {
        payload.email = formData.email
      }

      const response = await fetch(`${apiUrl}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      const data = await response.json()
      if (data.success) {
        localStorage.setItem("token", data.data.token)
        localStorage.setItem("user", JSON.stringify(data.data.user))
        if (loginType === "lojista") {
          localStorage.setItem("storeCode", formData.storeCode)
        }
        localStorage.setItem("isLoggedIn", "true")
        if (data.data.user.email === "admin@bella.com") {
          router.push("/admin")
        } else {
          router.push("/dashboard")
        }
      } else {
        setError(data.message || "Credenciais incorretas")
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl mb-4">
            <Store className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            Dashboard E-commerce
          </h1>
          <p className="text-muted-foreground mt-2">Acesse o painel da sua loja</p>
        </div>

        {/* Toggle de tipo de login */}
        <div className="flex justify-center gap-2 mb-2">
          <Button
            type="button"
            variant={loginType === "lojista" ? "default" : "outline"}
            onClick={() => setLoginType("lojista")}
            className="flex-1"
          >
            <User className="mr-2 h-4 w-4" /> Lojista
          </Button>
          <Button
            type="button"
            variant={loginType === "admin" ? "default" : "outline"}
            onClick={() => setLoginType("admin")}
            className="flex-1"
          >
            <Shield className="mr-2 h-4 w-4" /> Admin Master
          </Button>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Fazer Login</CardTitle>
            <CardDescription>
              {loginType === "lojista"
                ? "Digite o código da sua loja e senha para acessar o dashboard"
                : "Digite o e-mail de admin master e senha para acessar o painel geral"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {loginType === "lojista" ? (
                <div className="space-y-2">
                  <Label htmlFor="storeCode">Código da Loja</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="storeCode"
                      type="text"
                      placeholder="Ex: BELLA001"
                      value={formData.storeCode}
                      onChange={(e) => setFormData({ ...formData, storeCode: e.target.value })}
                      className="pl-10"
                      required={loginType === "lojista"}
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail do Admin</Label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@bella.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-10"
                      required={loginType === "admin"}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Digite sua senha"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Entrando..." : "Entrar no Dashboard"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t">
              <div className="text-center text-sm text-muted-foreground">
                <p className="mb-2">Dados para teste:</p>
                <div className="bg-gray-50 p-3 rounded-md text-left">
                  <p>
                    <strong>Código:</strong> loja001
                  </p>
                  <p>
                    <strong>E-mail:</strong> admin@bella.com
                  </p>
                  <p>
                    <strong>Senha:</strong> 123
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Não tem uma loja?{" "}
            <a href="#" className="text-pink-500 hover:underline">
              Criar conta
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
