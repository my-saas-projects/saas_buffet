"use client"

import { useState, useEffect } from "react"
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
  DollarSign
} from "lucide-react"
import { EventForm } from "./event-form"
import { eventsAPI } from "@/services/api"
import { EVENT_STATUS_COLORS, EVENT_STATUS_LABELS, EVENT_STATUS_OPTIONS, EventStatus } from "@/lib/constants"
import { EventListItem } from "@/lib/types"

interface EventsListProps {
  companyId: string
  onEventSelect?: (event: EventListItem) => void
  onCreateNew?: () => void
}

export function EventsList({ companyId, onEventSelect, onCreateNew }: EventsListProps) {
  const [events, setEvents] = useState<EventListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<EventListItem | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  useEffect(() => {
    loadEvents()
  }, [companyId])

  const loadEvents = async () => {
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
  }

  const getStatusColor = (status: EventStatus) => {
    return EVENT_STATUS_COLORS[status] || "bg-gray-100 text-gray-800"
  }

  const getStatusText = (status: EventStatus) => {
    return EVENT_STATUS_LABELS[status] || status
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

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.client_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || event.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string | undefined) => {
    if (!timeString) return '--:--'
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

  if (showForm || editingEvent) {
    return (
      <EventForm
        companyId={companyId}
        eventId={editingEvent?.id}
        initialData={editingEvent ? {
          eventType: editingEvent.event_type,
          title: editingEvent.title,
          date: editingEvent.event_date,
          startTime: editingEvent.start_time,
          endTime: editingEvent.end_time,
          clientName: editingEvent.client_name,
          clientPhone: editingEvent.client_phone,
          clientEmail: editingEvent.client_email || '',
          guestCount: editingEvent.guest_count.toString(),
          venue: editingEvent.venue_location || '',
          value: editingEvent.value?.toString() || '',
          notes: '',
          status: editingEvent.status,
          proposalValidityDate: editingEvent.proposal_validity_date || ''
        } : undefined}
        onSuccess={() => {
          setShowForm(false)
          setEditingEvent(null)
          loadEvents()
        }}
        onCancel={() => {
          setShowForm(false)
          setEditingEvent(null)
        }}
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
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar eventos ou clientes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
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
      ) : filteredEvents.length === 0 ? (
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
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Evento
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-medium text-gray-900">{event.title}</h3>
                      <Badge variant="outline" className={getStatusColor(event.status)}>
                        {getStatusText(event.status)}
                      </Badge>
                      <Badge variant="outline">
                        {getEventTypeText(event.event_type)}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <CalendarDays className="h-4 w-4" />
                        <span>{formatDate(event.event_date)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span>{formatTime(event.start_time)} - {formatTime(event.end_time)}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4" />
                        <span>{event.guest_count} convidados</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4" />
                        <span>{event.client_name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-4 w-4" />
                        <span>{formatCurrency(event.value)}</span>
                      </div>
                    </div>

                    {event.venue_location && (
                      <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue_location}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEventSelect?.(event)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="h-4 w-4" />
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