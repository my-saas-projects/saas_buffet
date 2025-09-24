"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"

export default function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: ""
  })
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    phone: "",
    companyName: "",
    role: "owner"
  })
  
  const { login, register } = useAuth()
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    console.log('Tentando login com:', loginForm.email, loginForm.password)
    
    const result = await login(loginForm.email, loginForm.password)
    
    console.log('Resultado do login:', result)
    
    if (result.success) {
      toast({
        title: "Login realizado com sucesso!",
        description: "Bem-vindo ao BuffetFlow",
      })
      // Redirecionamento será feito pelo hook
    } else {
      console.error('Erro no login:', result.error)
      toast({
        title: "Erro no login",
        description: result.error || "Verifique suas credenciais",
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    console.log('Tentando registrar:', registerForm)
    
    const result = await register(registerForm)
    
    console.log('Resultado do registro:', result)
    
    if (result.success) {
      toast({
        title: "Conta criada com sucesso!",
        description: "Vamos configurar seu buffet",
      })
      // Redirecionamento será feito pelo hook
    } else {
      console.error('Erro no registro:', result.error)
      toast({
        title: "Erro no cadastro",
        description: result.error || "Não foi possível criar sua conta",
        variant: "destructive",
      })
    }
    
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">BuffetFlow</h1>
          <p className="text-gray-600">Sistema de Gestão para Buffets de Festas</p>
          <p className="text-sm text-gray-500 mt-2">MVP - Versão Demonstração</p>
        </div>

        <Card className="shadow-xl">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Entrar</TabsTrigger>
              <TabsTrigger value="register">Cadastrar</TabsTrigger>
            </TabsList>

            {/* Login */}
            <TabsContent value="login">
              <CardHeader>
                <CardTitle>Entrar na sua conta</CardTitle>
                <CardDescription>
                  Acesse o BuffetFlow para gerenciar seus eventos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
                
                <div className="mt-4 text-center">
                  <Button variant="link" className="text-sm">
                    Esqueceu sua senha?
                  </Button>
                </div>

                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2 font-medium">Acesso de demonstração:</p>
                  <div className="text-xs text-gray-500 space-y-1">
                    <p><strong>Email:</strong> demo@buffetflow.com</p>
                    <p><strong>Senha:</strong> demo123</p>
                  </div>
                </div>
              </CardContent>
            </TabsContent>

            {/* Registro */}
            <TabsContent value="register">
              <CardHeader>
                <CardTitle>Criar nova conta</CardTitle>
                <CardDescription>
                  Comece a gerenciar seu buffet com o BuffetFlow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">E-mail</Label>
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="seu@email.com"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="(11) 99999-9999"
                      value={registerForm.phone}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Nome do Buffet</Label>
                    <Input
                      id="company-name"
                      type="text"
                      placeholder="Buffet Delícia"
                      value={registerForm.companyName}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, companyName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Função</Label>
                    <Select 
                      value={registerForm.role} 
                      onValueChange={(value) => setRegisterForm(prev => ({ ...prev, role: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua função" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Proprietário</SelectItem>
                        <SelectItem value="manager">Gerente</SelectItem>
                        <SelectItem value="coordinator">Coordenador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Cadastrando..." : "Cadastrar"}
                  </Button>
                </form>

                <div className="mt-4 text-center">
                  <p className="text-sm text-gray-600">
                    Ao cadastrar, você concorda com nossos{" "}
                    <Button variant="link" className="p-0 h-auto text-sm">
                      Termos de Serviço
                    </Button>
                  </p>
                </div>
              </CardContent>
            </TabsContent>
          </Tabs>
        </Card>

        {/* Benefícios */}
        <div className="mt-8 space-y-4">
          <div className="text-center">
            <h3 className="font-medium text-gray-900 mb-2">Benefícios do BuffetFlow</h3>
          </div>
          
          <div className="grid grid-cols-1 gap-3">
            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium">Controle financeiro simplificado</p>
                <p className="text-xs text-gray-500">Calcule custos e margens em segundos</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium">Agenda inteligente</p>
                <p className="text-xs text-gray-500">Evite conflitos com alertas automáticos</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-sm font-medium">Orçamentos profissionais</p>
                <p className="text-xs text-gray-500">Gere PDFs personalizados em minutos</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}