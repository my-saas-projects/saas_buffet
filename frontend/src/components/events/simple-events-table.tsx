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
  Plus,
  Edit,
  Eye,
  Trash2,
  DollarSign,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { EventForm } from "./event-form"
import { eventsAPI } from "@/services/api"
import { EVENT_STATUS_COLORS, EVENT_STATUS_LABELS, EVENT_STATUS_OPTIONS, EventStatus } from "@/lib/constants"
import { EventListItem } from "@/lib/types"

interface SimpleEventsTableProps {
  companyId: string
  onEventSelect?: (event: EventListItem) => void
  onCreateNew?: () => void
}

type SortField = "date" | "title" | "client" | "value" | "guests" | "status"
type SortOrder = "asc" | "desc"

export function SimpleEventsTable({ companyId, onEventSelect, onCreateNew }: SimpleEventsTableProps) {
  const [events, setEvents] = useState<EventListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventListItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [eventTypeFilter, setEventTypeFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<SortField>("date")
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

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
    const colorMap: Record<string, string> = {
      'proposta_pendente': 'bg-yellow-50 text-yellow-700 border-yellow-200',
      'proposta_enviada': 'bg-blue-50 text-blue-700 border-blue-200',
      'proposta_recusada': 'bg-red-50 text-red-700 border-red-200',
      'proposta_aceita': 'bg-green-50 text-green-700 border-green-200',
      'em_execucao': 'bg-purple-50 text-purple-700 border-purple-200',
      'pos_evento': 'bg-indigo-50 text-indigo-700 border-indigo-200',
      'concluido': 'bg-gray-50 text-gray-700 border-gray-200',
    }
    return colorMap[status] || "bg-gray-50 text-gray-700 border-gray-200"
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

  // Filter and sort events
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
      
      switch (sortField) {
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
        case "status":
          comparison = a.status.localeCompare(b.status)
          break
        default:
          comparison = 0
      }
      
      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [events, searchTerm, statusFilter, eventTypeFilter, sortField, sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedEvents.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedEvents = filteredAndSortedEvents.slice(startIndex, endIndex)

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

  const handleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortOrder("asc")
    }
    setCurrentPage(1) // Reset to first page when sorting
  }, [sortField])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  const handleItemsPerPageChange = useCallback((value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1) // Reset to first page when changing items per page
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
        <Button onClick={handleCreateNew}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Filters */}
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
                <label className="text-sm font-medium text-gray-700 mb-1 block">Itens por página</label>
                <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Itens" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5</SelectItem>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="50">50</SelectItem>
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>
            {filteredAndSortedEvents.length} evento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Carregando eventos...</p>
            </div>
          ) : filteredAndSortedEvents.length === 0 ? (
            <div className="text-center py-12">
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
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("title")}
                        className="hover:bg-transparent p-0 font-medium"
                      >
                        Título
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("date")}
                        className="hover:bg-transparent p-0 font-medium"
                      >
                        Data
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("client")}
                        className="hover:bg-transparent p-0 font-medium"
                      >
                        Cliente
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("status")}
                        className="hover:bg-transparent p-0 font-medium"
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("guests")}
                        className="hover:bg-transparent p-0 font-medium"
                      >
                        Convidados
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">
                      <Button
                        variant="ghost"
                        onClick={() => handleSort("value")}
                        className="hover:bg-transparent p-0 font-medium"
                      >
                        Valor
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </Button>
                    </th>
                    <th className="text-left p-3">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEvents.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500">
                            {getEventTypeText(event.event_type)}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{formatDate(event.event_date)}</div>
                          <div className="text-sm text-gray-500">
                            {formatTime(event.start_time)} - {formatTime(event.end_time)}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{event.client_name}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusText(event.status)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{event.guest_count}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 mr-2 text-gray-400" />
                          <span>{formatCurrency(event.value)}</span>
                        </div>
                      </td>
                      <td className="p-3">
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewEvent(event)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditEvent(event)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-4">
                  <div className="text-sm text-gray-600">
                    Mostrando {startIndex + 1} a {Math.min(endIndex, filteredAndSortedEvents.length)} de {filteredAndSortedEvents.length} eventos
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Button>
                        )
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
