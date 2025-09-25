"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { clientsAPI, eventsAPI } from "@/services/api"
import { Client } from "@/lib/types"
import {
  User,
  Building2,
  Mail,
  Phone,
  Calendar,
  ArrowLeft,
  CalendarDays,
  FileText,
  MapPin,
  CreditCard,
  Hash,
  Building,
  UserCheck,
  Edit
} from "lucide-react"

interface ClientEvent {
  id: string
  title: string
  event_date: string
  status: string
  guest_count: number
}

interface ClientDetailsProps {
  clientId: string
  onBack: () => void
  onEdit: (client: Client) => void
}

export function ClientDetails({ clientId, onBack, onEdit }: ClientDetailsProps) {
  const [client, setClient] = useState<Client | null>(null)
  const [events, setEvents] = useState<ClientEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadClientData()
  }, [clientId])

  const loadClientData = async () => {
    try {
      setIsLoading(true)
      const [clientResponse, eventsResponse] = await Promise.all([
        clientsAPI.get(clientId),
        eventsAPI.list()
      ])

      setClient(clientResponse.data)

      // Filter events for this client
      const clientEvents = (eventsResponse.data.results || eventsResponse.data || [])
        .filter((event: any) => event.client === parseInt(clientId))

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
      <div className="space-y-6">
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
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">{error || 'Cliente não encontrado'}</p>
            <Button
              variant="outline"
              onClick={onBack}
              className="mt-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Lista
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onBack}
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
          onClick={() => onEdit(client)}
        >
          <Edit className="h-4 w-4 mr-2" />
          Editar Cliente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Client Information */}
        <div className="lg:col-span-2">
          {/* Client Type and Basic Info */}
          <Card className={`mb-6 border-l-4 ${
            client.client_type === 'JURIDICA' ? 'border-l-blue-500' : 'border-l-green-500'
          }`}>
            <CardHeader>
              <CardTitle className="flex items-center">
                <div className={`p-2 rounded-full mr-3 ${
                  client.client_type === 'JURIDICA' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {client.client_type === 'JURIDICA' ? (
                    <Building2 className="h-5 w-5" />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {client.client_type === 'JURIDICA'
                      ? (client.fantasy_name || client.corporate_name || client.name)
                      : (client.full_name || client.name)
                    }
                  </h3>
                  <Badge
                    variant="secondary"
                    className={`mt-1 ${
                      client.client_type === 'JURIDICA'
                        ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-green-50 text-green-700 border-green-200'
                    }`}
                  >
                    {client.client_type === 'JURIDICA' ? 'Pessoa Jurídica' : 'Pessoa Física'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Informações Gerais */}
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900 border-b pb-2">Informações de Contato</h4>

                  <div className="flex items-start space-x-3">
                    <Mail className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-gray-900">{client.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Phone className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Telefone</p>
                      <p className="text-gray-900">{client.phone}</p>
                    </div>
                  </div>

                  {client.address && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium text-gray-500">Endereço</p>
                        <p className="text-gray-900">{client.address}</p>
                        {client.zip_code && (
                          <p className="text-gray-600 text-sm">CEP: {client.zip_code}</p>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-start space-x-3">
                    <Calendar className="h-4 w-4 text-gray-400 mt-1" />
                    <div>
                      <p className="text-sm font-medium text-gray-500">Cliente desde</p>
                      <p className="text-gray-900">{formatDate(client.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Informações Específicas */}
                <div className="space-y-4">
                  {client.client_type === 'JURIDICA' ? (
                    <>
                      <h4 className="font-medium text-gray-900 border-b pb-2">Informações Empresariais</h4>

                      {client.corporate_name && client.fantasy_name && (
                        <div className="flex items-start space-x-3">
                          <Building className="h-4 w-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Razão Social</p>
                            <p className="text-gray-900">{client.corporate_name}</p>
                          </div>
                        </div>
                      )}

                      {client.cnpj && (
                        <div className="flex items-start space-x-3">
                          <Hash className="h-4 w-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">CNPJ</p>
                            <p className="text-gray-900 font-mono">{client.cnpj}</p>
                          </div>
                        </div>
                      )}

                      {client.state_registration && (
                        <div className="flex items-start space-x-3">
                          <FileText className="h-4 w-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Inscrição Estadual</p>
                            <p className="text-gray-900">{client.state_registration}</p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h4 className="font-medium text-gray-900 border-b pb-2">Informações Pessoais</h4>

                      {client.full_name && client.name !== client.full_name && (
                        <div className="flex items-start space-x-3">
                          <UserCheck className="h-4 w-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">Nome Completo</p>
                            <p className="text-gray-900">{client.full_name}</p>
                          </div>
                        </div>
                      )}

                      {client.cpf && (
                        <div className="flex items-start space-x-3">
                          <CreditCard className="h-4 w-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">CPF</p>
                            <p className="text-gray-900 font-mono">{client.cpf}</p>
                          </div>
                        </div>
                      )}

                      {client.rg && (
                        <div className="flex items-start space-x-3">
                          <FileText className="h-4 w-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm font-medium text-gray-500">RG</p>
                            <p className="text-gray-900">{client.rg}</p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events */}
        <div className="lg:col-span-1">
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
                      className="border rounded-lg p-4 hover:bg-gray-50"
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