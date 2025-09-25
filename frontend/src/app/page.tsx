"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, Users, AlertTriangle, Plus, Settings, ArrowLeft, Clock, MapPin, User } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { EventsList } from "@/components/events/events-list"
import { EventForm } from "@/components/events/event-form"
import { ClientsList } from "@/components/clients/clients-list"
import { ClientDetails } from "@/components/clients/client-details"
import { ClientForm } from "@/components/clients/client-form"
import { EVENT_STATUS_COLORS, EVENT_STATUS_LABELS, EVENT_STATUS_OPTIONS } from "@/lib/constants"

export default function Dashboard() {
  const { user, company, isLoading: authLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [editingEvent, setEditingEvent] = useState(false)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [editingClient, setEditingClient] = useState<any>(null)

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
    return EVENT_STATUS_COLORS[status as keyof typeof EVENT_STATUS_COLORS] || "bg-gray-100 text-gray-800"
  }

  const getStatusText = (status: string) => {
    return EVENT_STATUS_LABELS[status as keyof typeof EVENT_STATUS_LABELS] || status
  }

  const getEventTypeText = (eventType: string) => {
    switch (eventType) {
      case "wedding": return "Casamento"
      case "graduation": return "Formatura"
      case "birthday": return "Aniversário"
      case "corporate": return "Corporativo"
      case "baptism": return "Batizado"
      case "other": return "Outro"
      default: return eventType
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':')
    return `${hours}:${minutes}`
  }

  const formatCurrency = (value: number | undefined) => {
    if (!value) return 'Não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatCreatedDate = (dateString: string | null | undefined) => {
    if (!dateString) return 'Evento cadastrado'

    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Evento cadastrado'

      return `Evento cadastrado em ${date.toLocaleDateString('pt-BR')}`
    } catch (error) {
      return 'Evento cadastrado'
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
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>   
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
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
            {company && (
              selectedEvent ? (
                editingEvent ? (
                  // Event Form (Edit Mode)
                  <EventForm
                    companyId={company.id}
                    eventId={selectedEvent.id}
                    initialData={{
                      eventType: selectedEvent.event_type,
                      title: selectedEvent.title,
                      date: selectedEvent.event_date,
                      startTime: selectedEvent.start_time,
                      endTime: selectedEvent.end_time,
                      clientName: selectedEvent.client_name,
                      clientPhone: selectedEvent.client_phone,
                      clientEmail: selectedEvent.client_email || '',
                      guestCount: selectedEvent.guest_count.toString(),
                      venue: selectedEvent.venue_location || '',
                      value: selectedEvent.value?.toString() || '',
                      notes: selectedEvent.notes || '',
                      status: selectedEvent.status,
                      proposalValidityDate: selectedEvent.proposal_validity_date || ''
                    }}
                    onSuccess={() => {
                      setEditingEvent(false)
                      setSelectedEvent(null)
                    }}
                    onCancel={() => {
                      setEditingEvent(false)
                    }}
                  />
                ) : (
                  // Event Details View
                  <div className="space-y-6">
                  <div className="flex items-center">
                    <Button variant="ghost" onClick={() => { setSelectedEvent(null); setEditingEvent(false); }} className="mr-4">
                      <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <h2 className="text-2xl font-bold text-gray-900">Detalhes do Evento</h2>
                  </div>

                  {/* Cabeçalho */}
                  <Card>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center space-x-3 mb-2">
                            <CardTitle className="text-2xl">{selectedEvent.title}</CardTitle>
                            <Badge className={getStatusColor(selectedEvent.status)}>
                              {getStatusText(selectedEvent.status)}
                            </Badge>
                            <Badge variant="outline">
                              {getEventTypeText(selectedEvent.event_type)}
                            </Badge>
                          </div>
                          <CardDescription>
                            {formatCreatedDate(selectedEvent.created_at)}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>

                  {/* Informações Principais */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <CalendarDays className="h-5 w-5" />
                          <span>Data e Horário</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <CalendarDays className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{formatDate(selectedEvent.event_date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>
                            {formatTime(selectedEvent.start_time)} - {formatTime(selectedEvent.end_time)}
                          </span>
                        </div>
                        {selectedEvent.proposal_validity_date && selectedEvent.status === 'proposta_enviada' && (
                          <div className="flex items-center space-x-2">
                            <CalendarDays className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-600">
                              Proposta válida até: {formatDate(selectedEvent.proposal_validity_date)}
                            </span>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>Informações do Evento</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{selectedEvent.guest_count} convidados</span>
                        </div>
                        {selectedEvent.venue_location && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-500" />
                            <span>{selectedEvent.venue_location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span>{formatCurrency(selectedEvent.value)}</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Informações do Cliente */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <User className="h-5 w-5" />
                        <span>Informações do Cliente</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Nome</p>
                          <p className="text-lg">{selectedEvent.client_name}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Telefone</p>
                          <p className="text-lg">{selectedEvent.client_phone}</p>
                        </div>
                        {selectedEvent.client_email && (
                          <div>
                            <p className="text-sm font-medium text-gray-500">Email</p>
                            <p className="text-lg">{selectedEvent.client_email}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Observações */}
                  {selectedEvent.notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Observações</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-wrap">{selectedEvent.notes}</p>
                      </CardContent>
                    </Card>
                  )}

                  {/* Ações */}
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        {/* Transições de Status */}
                        <div>
                          <h4 className="font-medium text-gray-900 mb-3">Alterar Status</h4>
                          <div className="flex flex-wrap gap-2">
                            {selectedEvent.status === 'proposta_pendente' && (
                              <Button size="sm" variant="outline" className="bg-blue-50 hover:bg-blue-100">
                                Enviar Proposta
                              </Button>
                            )}
                            {selectedEvent.status === 'proposta_enviada' && (
                              <>
                                <Button size="sm" variant="outline" className="bg-green-50 hover:bg-green-100">
                                  Aceitar Proposta
                                </Button>
                                <Button size="sm" variant="outline" className="bg-red-50 hover:bg-red-100">
                                  Recusar Proposta
                                </Button>
                              </>
                            )}
                            {selectedEvent.status === 'proposta_aceita' && (
                              <Button size="sm" variant="outline" className="bg-purple-50 hover:bg-purple-100">
                                Iniciar Evento
                              </Button>
                            )}
                            {selectedEvent.status === 'em_execucao' && (
                              <Button size="sm" variant="outline" className="bg-indigo-50 hover:bg-indigo-100">
                                Finalizar Evento
                              </Button>
                            )}
                            {selectedEvent.status === 'pos_evento' && (
                              <Button size="sm" variant="outline" className="bg-gray-50 hover:bg-gray-100">
                                Concluir Evento
                              </Button>
                            )}
                            {selectedEvent.status === 'proposta_recusada' && (
                              <>
                                <Button size="sm" variant="outline" className="bg-blue-50 hover:bg-blue-100">
                                  Nova Proposta
                                </Button>
                                <Button size="sm" variant="outline" className="bg-gray-50 hover:bg-gray-100">
                                  Concluir
                                </Button>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Ações Gerais */}
                        <div className="border-t pt-4">
                          <div className="flex space-x-3">
                            <Button variant="outline" onClick={() => setEditingEvent(true)}>Editar Evento</Button>
                            <Button variant="outline">Gerar Orçamento</Button>
                            <Button variant="destructive">Excluir Evento</Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                )
              ) : (
                // Events List View
                <EventsList
                  companyId={company.id}
                  onEventSelect={setSelectedEvent}
                />
              )
            )}
          </TabsContent>

          {/* Clientes */}
          <TabsContent value="clients" className="space-y-6">
            {selectedClient ? (
              editingClient ? (
                // Client Form (Edit Mode)
                <ClientForm
                  clientId={editingClient.id}
                  initialData={{
                    client_type: editingClient.client_type,
                    name: editingClient.name,
                    full_name: editingClient.full_name || '',
                    fantasy_name: editingClient.fantasy_name || '',
                    corporate_name: editingClient.corporate_name || '',
                    email: editingClient.email,
                    phone: editingClient.phone,
                    cpf: editingClient.cpf || '',
                    cnpj: editingClient.cnpj || '',
                    rg: editingClient.rg || '',
                    state_registration: editingClient.state_registration || '',
                    address: editingClient.address || '',
                    zip_code: editingClient.zip_code || ''
                  }}
                  onSuccess={() => {
                    setEditingClient(null)
                    setSelectedClient(null)
                  }}
                  onCancel={() => {
                    setEditingClient(null)
                  }}
                />
              ) : (
                // Client Details View
                <ClientDetails
                  clientId={selectedClient.id}
                  onBack={() => setSelectedClient(null)}
                  onEdit={(client) => {
                    setEditingClient(client)
                  }}
                />
              )
            ) : (
              // Clients List View
              <ClientsList
                onClientSelect={setSelectedClient}
                onEdit={(client) => {
                  setEditingClient(client)
                  setSelectedClient(client)
                }}
              />
            )}
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