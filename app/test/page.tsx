"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function TestPage() {
  const [results, setResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const testCredentials = [
    { email: 'admin@admin', password: '123', type: 'Admin Master' },
    { email: 'lojista@test.com', password: '123', type: 'Lojista' },
    { email: 'test@test.com', password: 'wrong', type: 'Credenciais Inválidas' }
  ]

  const runTests = async () => {
    setLoading(true)
    setResults([])

    for (const cred of testCredentials) {
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(cred)
        })

        const data = await response.json()
        
        setResults(prev => [...prev, {
          credentials: cred,
          success: data.success,
          message: data.message || 'Teste concluído',
          timestamp: new Date().toLocaleTimeString()
        }])
      } catch (error) {
        setResults(prev => [...prev, {
          credentials: cred,
          success: false,
          message: 'Erro de conexão',
          timestamp: new Date().toLocaleTimeString()
        }])
      }
    }

    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Teste de Autenticação</CardTitle>
          <CardDescription>
            Teste as credenciais de login do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={runTests} disabled={loading} className="mb-6">
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Executando testes...
              </>
            ) : (
              'Executar Testes'
            )}
          </Button>

          <div className="space-y-4">
            {results.map((result, index) => (
              <Alert key={index} variant={result.success ? "default" : "destructive"}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-600" />
                      )}
                      <span className="font-medium">
                        {result.credentials.type}
                      </span>
                    </div>
                    <AlertDescription className="mt-1">
                      {result.credentials.email} / {result.credentials.password}
                    </AlertDescription>
                    <p className="text-sm text-gray-600 mt-1">
                      {result.message}
                    </p>
                  </div>
                  <span className="text-xs text-gray-500">
                    {result.timestamp}
                  </span>
                </div>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 