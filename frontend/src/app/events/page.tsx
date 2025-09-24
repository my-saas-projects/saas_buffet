"use client"

import { useState } from "react"
import { EventsList } from "@/components/events/events-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, CalendarDays, Clock, Users, MapPin, User } from "lucide-react"
import { useAuth } from "@/hooks/use-auth"

interface Event {
  id: string
  title: string
  event_type: string
  event_date: string
  start_time: string
  end_time: string
  client_name: string
  client_phone: string
  client_email?: string
  guest_count: number
  venue_location?: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
  company: {
    id: string
    name: string
  }
}

export default function EventsPage() {
  const { company, user } = useAuth()
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)

  if (!company || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "preparing": return "bg-blue-100 text-blue-800"
      case "ongoing": return "bg-purple-100 text-purple-800"
      case "completed": return "bg-gray-100 text-gray-800"
      case "cancelled": return "bg-red-100 text-red-800"
      case "quote": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmado"
      case "preparing": return "Em Preparação"
      case "ongoing": return "Em Andamento"
      case "completed": return "Concluído"
      case "cancelled": return "Cancelado"
      case "quote": return "Orçamento"
      default: return status
    }
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

  if (selectedEvent) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center py-4">
              <Button variant="ghost" onClick={() => setSelectedEvent(null)} className="mr-4">
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Detalhes do Evento</h1>
            </div>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
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
                      Evento cadastrado em {new Date(selectedEvent.createdAt).toLocaleDateString('pt-BR')}
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
                    <p className="text-lg">{selectedEvent.clientPhone}</p>
                  </div>
                  {selectedEvent.clientEmail && (
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg">{selectedEvent.clientEmail}</p>
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
                <div className="flex space-x-3">
                  <Button variant="outline">Editar Evento</Button>
                  <Button variant="outline">Gerar Orçamento</Button>
                  <Button variant="destructive">Excluir Evento</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Eventos - {company.name}</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EventsList 
          companyId={company.id} 
          onEventSelect={setSelectedEvent}
        />
      </main>
    </div>
  )
}