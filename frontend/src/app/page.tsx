"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, DollarSign, Users, AlertTriangle, Plus, Settings, ArrowLeft, Clock, MapPin, User, BarChart2, PieChart, FileText, Edit, Trash2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { EventsView } from "@/components/events/events-view"
import { EventForm } from "@/components/events/event-form"
import { ClientDataTable } from "@/components/clients/client-data-table"
import { ClientDetails } from "@/components/clients/client-details"
import { ClientForm } from "@/components/clients/client-form"
import { EventCalendar } from "@/components/calendar/event-calendar"
import { EVENT_STATUS_COLORS, EVENT_STATUS_LABELS } from "@/lib/constants"
import { dashboardAPI, financialsAPI, eventsAPI } from "@/services/api"
import { EventStatusPieChart } from "@/components/charts/EventStatusPieChart"
import { MonthlyRevenueBarChart } from "@/components/charts/MonthlyRevenueBarChart"
import { KpiCard } from "@/components/financials/kpi-card"
import { CashFlowChart } from "@/components/financials/cash-flow-chart"
import { TransactionsDataTable } from "@/components/financials/transactions-data-table"
import { NewTransactionDialog } from "@/components/financials/new-transaction-dialog"
import { TrendingUp, TrendingDown } from "lucide-react"

// Helper function to format currency
const formatCurrency = (value: number | undefined) => {
  if (value === undefined || value === null) return 'Não informado'
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Financial tab interfaces
interface KpiData {
  total_income: number
  total_expense: number
  net_profit: number
  accounts_receivable: number
}

interface CashFlowData {
  month: string
  income: number
  expense: number
}

// Financial Tab Component
function FinancialTab() {
  const [kpiData, setKpiData] = useState<KpiData>({
    total_income: 0,
    total_expense: 0,
    net_profit: 0,
    accounts_receivable: 0,
  })
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeFinancialTab, setActiveFinancialTab] = useState("overview")
  const [isNewTransactionDialogOpen, setIsNewTransactionDialogOpen] = useState(false)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const loadFinancialData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await financialsAPI.financialDashboard()
      setKpiData(response.data.kpis)
      setCashFlowData(response.data.cash_flow_chart)
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error)
      setError('Erro ao carregar dados financeiros')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTransactionCreate = async (transactionData: any) => {
    try {
      await financialsAPI.transactions.create(transactionData)
      setIsNewTransactionDialogOpen(false)
      // Trigger refresh of both dashboard and transactions table
      setRefreshTrigger(prev => prev + 1)
      await loadFinancialData()
    } catch (error) {
      console.error('Erro ao criar transação:', error)
      throw error
    }
  }

  useEffect(() => {
    loadFinancialData()
  }, [])

  if (error) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={loadFinancialData}>
              Tentar novamente
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Financeiro</h2>
        <p className="text-gray-600">Visão geral da situação financeira da empresa</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Receita Total"
          value={kpiData.total_income}
          icon={TrendingUp}
          trend="up"
          isLoading={isLoading}
        />
        <KpiCard
          title="Despesas Total"
          value={kpiData.total_expense}
          icon={TrendingDown}
          trend="down"
          isLoading={isLoading}
        />
        <KpiCard
          title="Lucro Líquido"
          value={kpiData.net_profit}
          icon={DollarSign}
          trend={kpiData.net_profit >= 0 ? "up" : "down"}
          isLoading={isLoading}
        />
        <KpiCard
          title="Contas a Receber"
          value={kpiData.accounts_receivable}
          icon={Clock}
          trend="neutral"
          isLoading={isLoading}
        />
      </div>

      {/* Tabs for different views */}
      <Tabs value={activeFinancialTab} onValueChange={setActiveFinancialTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Cash Flow Chart */}
          <CashFlowChart data={cashFlowData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Header with Add Transaction Button */}
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">Transações Financeiras</h3>
              <p className="text-gray-600">Gerencie entradas e saídas financeiras</p>
            </div>
            <Button
              onClick={() => setIsNewTransactionDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Nova Transação
            </Button>
          </div>

          {/* Transactions Table */}
          <TransactionsDataTable refreshTrigger={refreshTrigger} />

          {/* New Transaction Dialog */}
          <NewTransactionDialog
            open={isNewTransactionDialogOpen}
            onOpenChange={setIsNewTransactionDialogOpen}
            onSubmit={handleTransactionCreate}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}

function OverviewTab() {
  const [stats, setStats] = useState<any>(null)
  const [upcomingEvents, setUpcomingEvents] = useState<any[]>([])
  const [statusDistribution, setStatusDistribution] = useState<any[]>([])
  const [monthlyRevenue, setMonthlyRevenue] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [
          statsRes,
          upcomingEventsRes,
          statusDistributionRes,
          monthlyRevenueRes
        ] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getUpcomingEvents(),
          dashboardAPI.getEventStatusDistribution(),
          dashboardAPI.getMonthlyRevenueChart(),
        ])

        setStats(statsRes.data)
        setUpcomingEvents(upcomingEventsRes.data)
        setStatusDistribution(statusDistributionRes.data)
        setMonthlyRevenue(monthlyRevenueRes.data)

      } catch (err) {
        setError("Falha ao carregar os dados do dashboard. Tente novamente mais tarde.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <p className="ml-4 text-gray-600">Carregando dados...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
        <p>{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Eventos</CardTitle>
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_events || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.confirmed_events || 0} confirmados
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
              {formatCurrency(stats?.monthly_revenue)}
            </div>
            <p className="text-xs text-muted-foreground">
              No mês atual
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Propostas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.pending_proposals || 0}</div>
            <p className="text-xs text-muted-foreground">
              Aguardando resposta
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{stats?.new_clients_this_month || 0}</div>
            <p className="text-xs text-muted-foreground">
              Neste mês
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          {monthlyRevenue.length > 0 ? (
            <MonthlyRevenueBarChart data={monthlyRevenue} />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart2 className="mx-auto h-8 w-8 mb-2" />
                <p>Sem dados de faturamento para exibir.</p>
              </div>
            </Card>
          )}
        </div>
        <div className="lg:col-span-2">
          {statusDistribution.length > 0 ? (
            <EventStatusPieChart data={statusDistribution} />
          ) : (
            <Card className="h-full flex items-center justify-center">
              <div className="text-center text-gray-500">
                <PieChart className="mx-auto h-8 w-8 mb-2" />
                <p>Sem dados de status para exibir.</p>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Upcoming Events & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Próximos Eventos</CardTitle>
            <CardDescription>Seus próximos 5 eventos confirmados.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-gray-600">{event.clientName}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-500">
                          {new Date(event.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}{event.time ? ` às ${event.time}` : ''}
                        </span>
                        <span className="text-sm text-gray-500">
                          • {event.guestCount} convidados
                        </span>
                      </div>
                    </div>
                    <Badge className={EVENT_STATUS_COLORS[event.status as keyof typeof EVENT_STATUS_COLORS] || "bg-gray-200"}>
                      {EVENT_STATUS_LABELS[event.status as keyof typeof EVENT_STATUS_LABELS] || event.status}
                    </Badge>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <CalendarDays className="mx-auto h-8 w-8 mb-2" />
                  <p>Nenhum evento confirmado para os próximos dias.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Alertas e Notificações</CardTitle>
            <CardDescription>Itens que precisam da sua atenção.</CardDescription>
          </CardHeader>
          <CardContent>
             <div className="text-center text-gray-500 py-8">
                <AlertTriangle className="mx-auto h-8 w-8 mb-2" />
                <p>Nenhum alerta no momento.</p>
                <span className="text-xs">(Funcionalidade em desenvolvimento)</span>
              </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default function Dashboard() {
  const { user, company, isLoading: authLoading, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [editingEvent, setEditingEvent] = useState<any>(null)
  const [selectedClient, setSelectedClient] = useState<any>(null)
  const [editingClient, setEditingClient] = useState<any>(null)

  useEffect(() => {
    if (user && !company && !authLoading) {
      window.location.href = "/onboarding"
    }
  }, [user, company, authLoading])

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

  // Event handlers with useCallback to prevent infinite re-renders
  const handleEventSelect = useCallback((event: any) => {
    setSelectedEvent(event)
  }, [])

  const handleEventEdit = useCallback((event: any) => {
    setEditingEvent(event)
    setSelectedEvent(event)
  }, [])

  const handleEventEditComplete = useCallback(() => {
    setEditingEvent(null)
  }, [])

  const handleGeneratePDF = useCallback(async (event: any) => {
    try {
      const response = await eventsAPI.generateProposalPDF(event.id.toString())

      // Create blob URL and download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      // Create temporary link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = `orcamento-evento-${event.id}.pdf`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    }
  }, [])

  const formatDate = (dateString: string) => {
    // Parse the date string and create a date object in local timezone
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day) // month is 0-indexed
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString: string | undefined | null) => {
    if (!timeString) return '--:--'
    const [hours, minutes] = timeString.split(':')
    return `${hours}:${minutes}`
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
    // Non-authenticated user landing page
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
          </CardContent>
        </Card>
      </div>
    )
  }
  
  // Main application view for authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">BuffetFlow</h1>
              {company && (
                <span className="ml-3 text-sm text-gray-600">
                  {company.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
               <Button size="sm" onClick={() => {
                 setActiveTab("events");
                 setSelectedEvent(null);
                 setEditingEvent({} as any);
               }}>
                <Plus className="h-4 w-4 mr-2" />
                Novo Evento
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurações
              </Button>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="events">Eventos</TabsTrigger>   
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="financial">Financeiro</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <OverviewTab />
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
                      clientId: selectedEvent.client?.toString() || '',
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
                            <Button variant="outline" onClick={() => setEditingEvent(true)}>
                              <Edit className="h-4 w-4 mr-2" />
                              Editar Evento
                            </Button>
                            <Button variant="outline" onClick={() => handleGeneratePDF(selectedEvent)}>
                              <FileText className="h-4 w-4 mr-2" />
                              Gerar Orçamento PDF
                            </Button>
                            <Button variant="destructive">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Excluir Evento
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                )
              ) : (
                // Events View (Cards or Table)
                <EventsView
                  companyId={company.id}
                  onEventSelect={handleEventSelect}
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
              <ClientDataTable
                onClientSelect={setSelectedClient}
                onEdit={(client) => {
                  setEditingClient(client)
                  setSelectedClient(client)
                }}
              />
            )}
          </TabsContent>

          <TabsContent value="financial" className="space-y-6">
            <FinancialTab />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Agenda de Eventos
                </h2>
                <p className="text-gray-600">
                  Visualize seus eventos em um calendário interativo
                </p>
              </div>

              <EventCalendar
                onEventClick={(clickInfo) => {
                  // Navigate to event details
                  setActiveTab("events");
                  // Find the event by ID and set it as selected
                  const eventId = clickInfo.event.id;
                  // This is a simplified approach - in a real app you'd fetch the full event data
                  setSelectedEvent({ id: eventId });
                }}
                onDateSelect={(selectInfo) => {
                  // Future enhancement: Allow creating new events from date selection
                  console.log('Date selected for new event:', selectInfo);
                }}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}