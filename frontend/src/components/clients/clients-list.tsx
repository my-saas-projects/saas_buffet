"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Building2,
  Search,
  Plus,
  Edit,
  Eye,
  Trash2,
  Phone,
  Mail,
  FileText,
  MapPin,
  Calendar
} from "lucide-react"
import { ClientForm } from "./client-form"
import { clientsAPI } from "@/services/api"
import { Client } from "@/lib/types"


interface ClientsListProps {
  onClientSelect?: (client: Client) => void
  onCreateNew?: () => void
  editingClient?: Client | null
  onEditComplete?: () => void
  onEdit?: (client: Client) => void
}

export function ClientsList({ onClientSelect, onCreateNew, editingClient, onEditComplete, onEdit }: ClientsListProps) {
  const [clients, setClients] = useState<Client[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      setIsLoading(true)
      const response = await clientsAPI.list()
      setClients(response.data.results || response.data || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      setClients([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await clientsAPI.delete(id)
        loadClients()
      } catch (error) {
        console.error('Erro ao excluir cliente:', error)
      }
    }
  }

  const filteredClients = clients.filter(client => {
    const searchLower = searchTerm.toLowerCase()
    return (
      client.name.toLowerCase().includes(searchLower) ||
      client.email.toLowerCase().includes(searchLower) ||
      client.phone.toLowerCase().includes(searchLower) ||
      (client.full_name && client.full_name.toLowerCase().includes(searchLower)) ||
      (client.fantasy_name && client.fantasy_name.toLowerCase().includes(searchLower)) ||
      (client.corporate_name && client.corporate_name.toLowerCase().includes(searchLower)) ||
      (client.cpf && client.cpf.includes(searchTerm)) ||
      (client.cnpj && client.cnpj.includes(searchTerm))
    )
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  if (showForm || editingClient) {
    return (
      <ClientForm
        clientId={editingClient?.id}
        initialData={editingClient ? {
          name: editingClient.name,
          email: editingClient.email,
          phone: editingClient.phone
        } : undefined}
        onSuccess={() => {
          setShowForm(false)
          onEditComplete?.()
          loadClients()
        }}
        onCancel={() => {
          setShowForm(false)
          onEditComplete?.()
        }}
      />
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Clientes</h2>
          <p className="text-gray-600">Gerencie seus clientes</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
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
      ) : filteredClients.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm
                ? "Tente ajustar sua busca"
                : "Comece cadastrando seu primeiro cliente"
              }
            </p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Cliente
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredClients.map((client) => {
            const isJuridica = client.client_type === 'JURIDICA'
            const displayName = isJuridica
              ? (client.fantasy_name || client.corporate_name || client.name)
              : (client.full_name || client.name)
            const secondaryName = isJuridica && client.fantasy_name && client.corporate_name
              ? client.corporate_name
              : null

            return (
              <Card key={client.id} className={`hover:shadow-md transition-all duration-200 border-l-4 ${
                isJuridica ? 'border-l-blue-500 hover:border-l-blue-600' : 'border-l-green-500 hover:border-l-green-600'
              }`}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-full ${
                          isJuridica ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                        }`}>
                          {isJuridica ? (
                            <Building2 className="h-5 w-5" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {displayName}
                          </h3>
                          {secondaryName && (
                            <p className="text-sm text-gray-600 font-medium">
                              {secondaryName}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="secondary"
                          className={`ml-2 ${
                            isJuridica
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-green-50 text-green-700 border-green-200'
                          }`}
                        >
                          {isJuridica ? 'Pessoa Jurídica' : 'Pessoa Física'}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Mail className="h-4 w-4 text-gray-400" />
                          <span className="truncate">{client.email}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 text-gray-400" />
                          <span>{client.phone}</span>
                        </div>
                        {(client.cpf || client.cnpj) && (
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span>{isJuridica ? client.cnpj : client.cpf}</span>
                          </div>
                        )}
                        {client.address && (
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span className="truncate">{client.address}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2 md:col-span-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span>Desde {formatDate(client.created_at)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onClientSelect?.(client)}
                        className="hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit?.(client)}
                        className="hover:bg-green-50 hover:text-green-600 hover:border-green-300"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(client.id.toString())}
                        className="hover:bg-red-50 hover:text-red-600 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}