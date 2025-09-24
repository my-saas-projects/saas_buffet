"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function SimpleAuthPage() {
  const [email, setEmail] = useState("demo@buffetflow.com")
  const [password, setPassword] = useState("demo123")
  const [isLoading, setIsLoading] = useState(false)
  
  const { login } = useAuth()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    console.log('=== SIMPLE LOGIN ===')
    console.log('Email:', email)
    console.log('Password:', password)
    
    try {
      const result = await login(email, password)
      
      console.log('Login result:', result)
      
      if (result.success) {
        toast({
          title: "Login realizado!",
          description: "Redirecionando...",
        })
      } else {
        toast({
          title: "Erro no login",
          description: result.error || "Erro desconhecido",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      toast({
        title: "Erro",
        description: "Erro ao fazer login",
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Teste de Login</CardTitle>
          <CardDescription>Use as credenciais demo para testar</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@buffetflow.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="demo123"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Processando..." : "Fazer Login"}
            </Button>
          </form>
          
          <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
            <p className="font-medium">Instruções:</p>
            <p>1. Use demo@buffetflow.com / demo123</p>
            <p>2. Verifique o console do navegador</p>
            <p>3. Verifique o console do servidor</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}