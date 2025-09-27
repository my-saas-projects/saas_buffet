"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, CalendarDays, ArrowUpDown } from "lucide-react"
import { eventsAPI } from "@/services/api"
import { EventListItem } from "@/lib/types"
import { EVENT_STATUS_OPTIONS } from "@/lib/constants"
import { UltraIsolatedDropdown } from "@/components/ui/ultra-isolated-dropdown"

interface CustomEventsTableProps {
  companyId: string
  onEventSelect?: (event: EventListItem) => void
  onCreateNew?: () => void
  editingEvent?: EventListItem | null
  onEditComplete?: () => void
  onEdit?: (event: EventListItem) => void
}

export function CustomEventsTable({
  companyId,
  onEventSelect,
  onCreateNew,
  editingEvent,
  onEditComplete,
  onEdit
}: CustomEventsTableProps) {
  const [data, setData] = useState<EventListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("title")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")

  // Load data
  const loadEvents = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await eventsAPI.list()
      setData(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
      setError('Erro ao carregar eventos')
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [companyId, loadEvents])

  // Action handlers
  const handleView = useCallback((event: EventListItem) => {
    onEventSelect?.(event)
  }, [onEventSelect])

  const handleEdit = useCallback((event: EventListItem) => {
    onEdit?.(event)
  }, [onEdit])

  const handleDelete = useCallback(async (event: EventListItem) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await eventsAPI.delete(event.id.toString())
        loadEvents()
      } catch (error: any) {
        console.error('Erro ao excluir evento:', error)
        alert('Erro ao excluir evento. Tente novamente.')
      }
    }
  }, [loadEvents])

  // Sort handler
  const handleSort = useCallback((field: string) => {
    if (sortField === field) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }, [sortField])

  // Filter and sort data
  const filteredAndSortedData = data
    .filter(event => {
      const matchesSearch = !searchTerm || 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.client_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || event.status === statusFilter
      
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any = a[sortField as keyof EventListItem]
      let bValue: any = b[sortField as keyof EventListItem]
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase()
        bValue = bValue.toLowerCase()
      }
      
      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

  const getStatusText = (status: string) => {
    const statusMap: Record<string, string> = {
      'proposta_pendente': 'Proposta Pendente',
      'proposta_enviada': 'Proposta Enviada',
      'proposta_recusada': 'Proposta Recusada',
      'proposta_aceita': 'Proposta Aceita',
      'em_execucao': 'Em Execução',
      'pos_evento': 'Pós-Evento',
      'concluido': 'Concluído',
    }
    return statusMap[status] || status
  }

  const getStatusColor = (status: string) => {
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
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Eventos</h2>
            <p className="text-gray-600">Carregando...</p>
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Carregando eventos...</div>
          </CardContent>
        </Card>
      </div>
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
        <Button
          onClick={() => console.log('Create new clicked')}
          className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar eventos, clientes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="w-48">
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

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>
            {filteredAndSortedData.length} evento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" onClick={loadEvents} className="mt-4">
                Tentar novamente
              </Button>
            </div>
          ) : filteredAndSortedData.length === 0 ? (
            <div className="text-center py-12">
              <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Nenhum evento encontrado</p>
              <p className="text-sm text-gray-400">Tente ajustar sua busca ou filtros</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">
                      <button
                        className="flex items-center font-medium hover:text-gray-600"
                        onClick={() => handleSort('title')}
                      >
                        Evento
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </th>
                    <th className="text-left p-3">
                      <button
                        className="flex items-center font-medium hover:text-gray-600"
                        onClick={() => handleSort('client_name')}
                      >
                        Cliente
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </th>
                    <th className="text-left p-3">
                      <button
                        className="flex items-center font-medium hover:text-gray-600"
                        onClick={() => handleSort('event_date')}
                      >
                        Data
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </th>
                    <th className="text-left p-3">
                      <button
                        className="flex items-center font-medium hover:text-gray-600"
                        onClick={() => handleSort('status')}
                      >
                        Status
                        <ArrowUpDown className="ml-2 h-4 w-4" />
                      </button>
                    </th>
                    <th className="text-left p-3 font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedData.map((event) => (
                    <tr key={event.id} className="border-b hover:bg-gray-50">
                      <td className="p-3">
                        <div>
                          <div className="font-medium">{event.title}</div>
                          <div className="text-sm text-gray-500">
                            {(() => {
                              const [year, month, day] = event.event_date.split('-').map(Number)
                              const date = new Date(year, month - 1, day)
                              return date.toLocaleDateString('pt-BR')
                            })()}
                          </div>
                        </div>
                      </td>
                      <td className="p-3">{event.client_name}</td>
                      <td className="p-3">
                        {(() => {
                          const [year, month, day] = event.event_date.split('-').map(Number)
                          const date = new Date(year, month - 1, day)
                          return date.toLocaleDateString('pt-BR')
                        })()}
                      </td>
                      <td className="p-3">
                        <Badge className={getStatusColor(event.status)}>
                          {getStatusText(event.status)}
                        </Badge>
                      </td>
                      <td className="p-3">
                        <UltraIsolatedDropdown
                          onView={() => handleView(event)}
                          onEdit={() => handleEdit(event)}
                          onDelete={() => handleDelete(event)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
