"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, Users, AlertTriangle, Plus, Settings } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"

export default function Dashboard() {
  const { user, company, isLoading: authLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    // Se usuário autenticado ainda não possui empresa, redireciona para onboarding
    if (user && !company && !authLoading) {
      window.location.href = "/onboarding"
    }
  }, [user, company, authLoading])

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando BuffetFlow...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BuffetFlow</h1>
            <p className="text-gray-600">Sistema de Gestão para Buffets de Festas</p>
            <Badge className="bg-green-100 text-green-800">MVP</Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-8">
              <CalendarDays className="h-16 w-16 text-orange-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Bem-vindo ao BuffetFlow
              </h3>
              <p className="text-gray-600 mb-6">
                O sistema completo para gestão de buffets de festas
              </p>
              <Button 
                className="w-full" 
                onClick={() => window.location.href = "/auth"}
              >
                Acessar Sistema
              </Button>
            </div>
            
            <div className="border-t pt-4">
              <h4 className="font-medium text-gray-900 mb-3">Funcionalidades do MVP:</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Dashboard com visão geral</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Cadastro de eventos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Calculadora de custos</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span>Geração de orçamentos</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Dados mockados para demonstração
  const upcomingEvents = [
    {
      id: "1",
      title: "Casamento - João & Maria",
      date: "2024-01-15",
      time: "18:00",
      guestCount: 120,
      status: "confirmed",
      clientName: "João Silva"
    },
    {
      id: "2", 
      title: "Formatura - Turma 2024",
      date: "2024-01-20",
      time: "20:00",
      guestCount: 200,
      status: "preparing",
      clientName: "Universidade XYZ"
    },
    {
      id: "3",
      title: "Aniversário 50 anos",
      date: "2024-01-25", 
      time: "19:00",
      guestCount: 80,
      status: "quote",
      clientName: "Ana Santos"
    }
  ]

  const stats = {
    totalEvents: 12,
    confirmedEvents: 8,
    monthlyRevenue: 125000,
    avgGuestCount: 95
  }

  const alerts = [
    {
      id: "1",
      type: "deadline",
      title: "Pagamento pendente",
      message: "Casamento João & Maria - pagamento vence em 2 dias",
      severity: "high"
    },
    {
      id: "2", 
      type: "conflict",
      title: "Possível conflito de agenda",
      message: "Verificar disponibilidade para 25/01/2024",
      severity: "medium"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "preparing": return "bg-blue-100 text-blue-800"
      case "quote": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmado"
      case "preparing": return "Em Preparação"
      case "quote": return "Orçamento"
      default: return status
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">BuffetFlow</h1>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                MVP
              </span>
              {company && (
                <span className="ml-3 text-sm text-gray-600">
                  {company.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
          </TabsList>

          {/* Visão Geral */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
                  <CalendarDays className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalEvents}</div>
                  <p className="text-xs text-muted-foreground">
                    {stats.confirmedEvents} confirmados
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Faturamento Mensal</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    R$ {stats.monthlyRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +20% em relação ao mês anterior
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Média Convidados</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgGuestCount}</div>
                  <p className="text-xs text-muted-foreground">
                    por evento
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Alertas</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{alerts.length}</div>
                  <p className="text-xs text-muted-foreground">
                    precisam atenção
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Próximos Eventos */}
              <Card>
                <CardHeader>
                  <CardTitle>Próximos Eventos</CardTitle>
                  <CardDescription>Eventos confirmados e em preparação</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {upcomingEvents.map((event) => (
                      <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-gray-600">{event.clientName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-sm text-gray-500">
                              {event.date} às {event.time}
                            </span>
                            <span className="text-sm text-gray-500">
                              • {event.guestCount} convidados
                            </span>
                          </div>
                        </div>
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Alertas */}
              <Card>
                <CardHeader>
                  <CardTitle>Alertas e Notificações</CardTitle>
                  <CardDescription>Itens que precisam da sua atenção</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {alerts.map((alert) => (
                      <div key={alert.id} className="p-3 border rounded-lg">
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                            alert.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                          <div className="flex-1">
                            <h4 className="font-medium">{alert.title}</h4>
                            <p className="text-sm text-gray-600">{alert.message}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Eventos */}
          <TabsContent value="events" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Gerenciamento de Eventos</CardTitle>
                    <CardDescription>Cadastre e gerencie todos os seus eventos</CardDescription>
                  </div>
                  <Button onClick={() => window.location.href = "/events"}>
                    <Plus className="h-4 w-4 mr-2" />
                    Gerenciar Eventos
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Sistema de Eventos Disponível
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Acesse a página completa de gerenciamento de eventos.
                  </p>
                  <Button onClick={() => window.location.href = "/events"}>
                    Acessar Gerenciamento de Eventos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Financeiro */}
          <TabsContent value="financial" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Controle Financeiro</CardTitle>
                <CardDescription>Calcule custos, gere orçamentos e acompanhe o fluxo de caixa</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Módulo Financeiro em Desenvolvimento
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Calculadora de custos e geração de orçamentos em breve.
                  </p>
                  <Button variant="outline">
                    Ver Protótipo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Agenda */}
          <TabsContent value="calendar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Agenda Visual</CardTitle>
                <CardDescription>Visualize eventos em formato de calendário</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Calendário Interativo em Desenvolvimento
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Agenda visual com alertas de conflitos em breve.
                  </p>
                  <Button variant="outline">
                    Ver Mockup
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}