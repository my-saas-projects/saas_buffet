"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  CalendarDays,
  Clock,
  Users,
  MapPin,
  User,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  DollarSign,
  FileText,
  Grid3X3,
  Table
} from "lucide-react"
import { EventForm } from "./event-form"
import { eventsAPI } from "@/services/api"
import { EVENT_STATUS_COLORS, EVENT_STATUS_LABELS, EVENT_STATUS_OPTIONS, EventStatus } from "@/lib/constants"
import { EventListItem } from "@/lib/types"

interface EventsListProps {
  companyId: string
  onEventSelect?: (event: EventListItem) => void
  onCreateNew?: () => void
  viewMode?: "cards" | "table"
  onViewModeChange?: (mode: "cards" | "table") => void
}

export function EventsList({ companyId, onEventSelect, onCreateNew, viewMode, onViewModeChange }: EventsListProps) {
  const [events, setEvents] = useState<EventListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventListItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await eventsAPI.list()
      setEvents(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [companyId, loadEvents])

  const getStatusColor = useCallback((status: EventStatus) => {
    // Mapeamento direto para cores com estilos mais específicos
    const colorMap: Record<string, string> = {
      'proposta_pendente': 'bg-yellow-500 text-white border-yellow-500',
      'proposta_enviada': 'bg-blue-500 text-white border-blue-500',
      'proposta_recusada': 'bg-red-500 text-white border-red-500',
      'proposta_aceita': 'bg-green-500 text-white border-green-500',
      'em_execucao': 'bg-purple-500 text-white border-purple-500',
      'pos_evento': 'bg-indigo-500 text-white border-indigo-500',
      'concluido': 'bg-gray-500 text-white border-gray-500',
    }
    
    return colorMap[status] || "bg-gray-100 text-gray-800"
  }, [])

  const getStatusText = useCallback((status: EventStatus) => {
    return EVENT_STATUS_LABELS[status] || status
  }, [])

  const getEventTypeText = useCallback((eventType: string) => {
    switch (eventType) {
      case "wedding": return "Casamento"
      case "graduation": return "Formatura"
      case "birthday": return "Aniversário"
      case "corporate": return "Corporativo"
      case "baptism": return "Batizado"
      case "other": return "Outro"
      default: return eventType
    }
  }, [])

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.client_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           event.venue_location?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || event.status === statusFilter
      const matchesEventType = eventTypeFilter === "all" || event.event_type === eventTypeFilter
      
      return matchesSearch && matchesStatus && matchesEventType
    })

    // Sort events
    filtered.sort((a, b) => {
      let comparison = 0
      
      switch (sortBy) {
        case "date":
          comparison = new Date(a.event_date).getTime() - new Date(b.event_date).getTime()
          break
        case "title":
          comparison = a.title.localeCompare(b.title)
          break
        case "client":
          comparison = a.client_name.localeCompare(b.client_name)
          break
        case "value":
          comparison = (a.value || 0) - (b.value || 0)
          break
        case "guests":
          comparison = a.guest_count - b.guest_count
          break
        default:
          comparison = 0
      }
      
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [events, searchTerm, statusFilter, eventTypeFilter, sortBy, sortOrder])

  const formatDate = useCallback((dateString: string) => {
    // Parse the date string and create a date object in local timezone
    const [year, month, day] = dateString.split('-').map(Number)
    const date = new Date(year, month - 1, day) // month is 0-indexed
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }, [])

  const formatTime = useCallback((timeString: string | undefined) => {
    if (!timeString) return '--:--'
    const [hours, minutes] = timeString.split(':')
    return `${hours}:${minutes}`
  }, [])

  const formatCurrency = useCallback((value: number | undefined) => {
    if (!value) return 'Não informado'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }, [])

  // Event handlers
  const handleCreateNew = useCallback(() => {
    setShowForm(true)
  }, [])

  const handleEditEvent = useCallback((event: EventListItem) => {
    setEditingEvent(event)
  }, [])

  const handleViewEvent = useCallback((event: EventListItem) => {
    onEventSelect?.(event)
  }, [onEventSelect])

  const handleFormSuccess = useCallback(() => {
    setShowForm(false)
    setEditingEvent(null)
    loadEvents()
  }, [loadEvents])

  const handleFormCancel = useCallback(() => {
    setShowForm(false)
    setEditingEvent(null)
  }, [])

  const handleGeneratePDF = useCallback(async (event: EventListItem) => {
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

  if (showForm || editingEvent) {
    return (
      <EventForm
        companyId={companyId}
        eventId={editingEvent?.id?.toString()}
        initialData={editingEvent ? {
          eventType: editingEvent.event_type,
          title: editingEvent.title,
          date: editingEvent.event_date,
          startTime: editingEvent.start_time,
          endTime: editingEvent.end_time,
          clientId: editingEvent.client?.toString() || '',
          guestCount: editingEvent.guest_count.toString(),
          venue: editingEvent.venue_location || '',
          value: editingEvent.value?.toString() || '',
          notes: editingEvent.notes || '',
          status: editingEvent.status,
          proposalValidityDate: editingEvent.proposal_validity_date || ''
        } : undefined}
        onSuccess={handleFormSuccess}
        onCancel={handleFormCancel}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Eventos</h2>
          <p className="text-gray-600">Gerencie todos os seus eventos</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* View Toggle Buttons */}
          {onViewModeChange && (
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === "cards" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("cards")}
              >
                <Grid3X3 className="h-4 w-4 mr-2" />
                Cards
              </Button>
              <Button
                variant={viewMode === "table" ? "default" : "outline"}
                size="sm"
                onClick={() => onViewModeChange("table")}
              >
                <Table className="h-4 w-4 mr-2" />
                Tabela
              </Button>
            </div>
          )}
          <Button
            onClick={handleCreateNew}
            className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            <Plus className="h-4 w-4 mr-2" />
            Novo Evento
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar eventos, clientes ou locais..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Status</SelectItem>
                    {EVENT_STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Tipo</label>
                <Select value={eventTypeFilter} onValueChange={setEventTypeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos Tipos</SelectItem>
                    <SelectItem value="wedding">Casamento</SelectItem>
                    <SelectItem value="graduation">Formatura</SelectItem>
                    <SelectItem value="birthday">Aniversário</SelectItem>
                    <SelectItem value="corporate">Corporativo</SelectItem>
                    <SelectItem value="baptism">Batizado</SelectItem>
                    <SelectItem value="other">Outro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ordenar por</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordenar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="date">Data</SelectItem>
                    <SelectItem value="title">Título</SelectItem>
                    <SelectItem value="client">Cliente</SelectItem>
                    <SelectItem value="value">Valor</SelectItem>
                    <SelectItem value="guests">Convidados</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Ordem</label>
                <Select value={sortOrder} onValueChange={(value: "asc" | "desc") => setSortOrder(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Ordem" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Crescente</SelectItem>
                    <SelectItem value="desc">Decrescente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Results Count */}
            <div className="text-sm text-gray-600">
              {filteredAndSortedEvents.length} evento(s) encontrado(s)
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Eventos */}
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredAndSortedEvents.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm || statusFilter !== "all" ? "Nenhum evento encontrado" : "Nenhum evento cadastrado"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== "all" 
                ? "Tente ajustar seus filtros de busca"
                : "Comece cadastrando seu primeiro evento"
              }
            </p>
            <Button onClick={handleCreateNew}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredAndSortedEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold text-gray-900 truncate flex-1 min-w-0">{event.title}</h3>
                      <span className={`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium ${getStatusColor(event.status)}`}>
                        {getStatusText(event.status)}
                      </span>
                    </div>
                    <Badge variant="outline" className="w-fit">
                      {getEventTypeText(event.event_type)}
                    </Badge>
                  </div>

                  {/* Event Details */}
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <CalendarDays className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{formatDate(event.event_date)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{event.guest_count} convidados</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{event.client_name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400 flex-shrink-0" />
                      <span className="truncate">{formatCurrency(event.value)}</span>
                    </div>
                    {event.venue_location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-gray-400 flex-shrink-0" />
                        <span className="truncate">{event.venue_location}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2 pt-2 border-t border-gray-100">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewEvent(event)}
                      className="flex-1"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditEvent(event)}
                      className="flex-1"
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleGeneratePDF(event)}
                      className="flex-1"
                      title="Gerar Orçamento PDF"
                    >
                      <FileText className="h-4 w-4 mr-1" />
                      PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}