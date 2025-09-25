"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { clientsAPI, eventsAPI } from "@/services/api"
import {
  User,
  Mail,
  Phone,
  Calendar,
  Edit,
  ArrowLeft,
  CalendarDays
} from "lucide-react"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
  updated_at: string
}

interface ClientEvent {
  id: string
  title: string
  event_date: string
  status: string
  guest_count: number
}

interface ClientDetailPageProps {
  params: {
    id: string
  }
}

export default function ClientDetailPage({ params }: ClientDetailPageProps) {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [events, setEvents] = useState<ClientEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadClientData()
  }, [params.id])

  const loadClientData = async () => {
    try {
      setIsLoading(true)
      const [clientResponse, eventsResponse] = await Promise.all([
        clientsAPI.get(params.id),
        eventsAPI.list()
      ])

      setClient(clientResponse.data)

      // Filter events for this client
      const clientEvents = (eventsResponse.data.results || eventsResponse.data || [])
        .filter((event: any) => event.client === parseInt(params.id))

      setEvents(clientEvents)
    } catch (error) {
      console.error('Erro ao carregar dados do cliente:', error)
      setError('Erro ao carregar dados do cliente')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'proposta_pendente': 'Proposta Pendente',
      'proposta_enviada': 'Proposta Enviada',
      'proposta_recusada': 'Proposta Recusada',
      'proposta_aceita': 'Proposta Aceita',
      'em_execucao': 'Em Execução',
      'pos_evento': 'Pós Evento',
      'concluido': 'Concluído',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      'proposta_pendente': 'bg-yellow-100 text-yellow-800',
      'proposta_enviada': 'bg-blue-100 text-blue-800',
      'proposta_recusada': 'bg-red-100 text-red-800',
      'proposta_aceita': 'bg-green-100 text-green-800',
      'em_execucao': 'bg-purple-100 text-purple-800',
      'pos_evento': 'bg-indigo-100 text-indigo-800',
      'concluido': 'bg-gray-100 text-gray-800',
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">{error || 'Cliente não encontrado'}</p>
            <Button
              variant="outline"
              onClick={() => router.push('/clients')}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Clientes
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/clients')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
            <p className="text-gray-600">Detalhes do cliente</p>
          </div>
        </div>
        <Button
          onClick={() => router.push(`/clients/${client.id}/edit`)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Informações do Cliente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{client.email}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Telefone</p>
                  <p className="text-gray-900">{client.phone}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar className="h-4 w-4 text-gray-400" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Cliente desde</p>
                  <p className="text-gray-900">{formatDate(client.created_at)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CalendarDays className="h-5 w-5 mr-2" />
                Eventos ({events.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Nenhum evento encontrado
                  </h3>
                  <p className="text-gray-600">
                    Este cliente ainda não possui eventos cadastrados.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map((event) => (
                    <div
                      key={event.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                      onClick={() => router.push(`/events/${event.id}`)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900 mb-1">
                            {event.title}
                          </h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span>{formatDate(event.event_date)}</span>
                            <span>{event.guest_count} convidados</span>
                          </div>
                        </div>
                        <Badge
                          variant="secondary"
                          className={getStatusColor(event.status)}
                        >
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}