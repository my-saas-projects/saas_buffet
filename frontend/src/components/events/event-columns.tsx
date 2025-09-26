"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UltraIsolatedDropdown } from "@/components/ui/ultra-isolated-dropdown"
import { ArrowUpDown, CalendarDays, Clock, Users, User, DollarSign } from "lucide-react"
import { EventListItem } from "@/lib/types"
import { EventStatus } from "@/lib/constants"

interface ColumnProps {
  onView: (event: EventListItem) => void
  onEdit: (event: EventListItem) => void
  onDelete: (event: EventListItem) => void
}

export const createEventColumns = ({ onView, onEdit, onDelete }: ColumnProps): ColumnDef<EventListItem>[] => [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-medium"
      >
        Evento
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const event = row.original
      return (
        <div className="space-y-1">
          <div className="font-medium">{event.title}</div>
          <div className="text-sm text-gray-500 flex items-center">
            <CalendarDays className="h-3 w-3 mr-1" />
            {new Date(event.event_date).toLocaleDateString('pt-BR')}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "event_type",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-medium"
      >
        Tipo
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const eventType = row.getValue("event_type") as string
      const getEventTypeText = (type: string) => {
        switch (type) {
          case "wedding": return "Casamento"
          case "graduation": return "Formatura"
          case "birthday": return "Aniversário"
          case "corporate": return "Corporativo"
          case "baptism": return "Batizado"
          case "other": return "Outro"
          default: return type
        }
      }

      return (
        <Badge variant="outline" className="whitespace-nowrap">
          {getEventTypeText(eventType)}
        </Badge>
      )
    },
  },
  {
    accessorKey: "client_name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-medium"
      >
        Cliente
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="flex items-center min-w-[150px]">
        <User className="h-4 w-4 mr-2 text-gray-400" />
        <span className="truncate">{row.getValue("client_name")}</span>
      </div>
    ),
  },
  {
    accessorKey: "event_date",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-medium"
      >
        Data & Hora
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const event = row.original
      const date = new Date(event.event_date)
      const formatTime = (timeString: string | undefined) => {
        if (!timeString) return '--:--'
        const [hours, minutes] = timeString.split(':')
        return `${hours}:${minutes}`
      }

      return (
        <div className="space-y-1 min-w-[120px]">
          <div className="text-sm font-medium">
            {date.toLocaleDateString('pt-BR')}
          </div>
          <div className="text-xs text-gray-500 flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            {formatTime(event.start_time)} - {formatTime(event.end_time)}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "guest_count",
    header: "Convidados",
    cell: ({ row }) => (
      <div className="flex items-center min-w-[100px]">
        <Users className="h-4 w-4 mr-2 text-gray-400" />
        <span>{row.getValue("guest_count")}</span>
      </div>
    ),
  },
  {
    accessorKey: "value",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-medium"
      >
        Valor
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const value = row.original.value || row.original.final_price || row.original.estimated_cost
      const formatCurrency = (val: number | undefined) => {
        if (!val) return 'Não informado'
        return new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(val)
      }

      return (
        <div className="flex items-center min-w-[120px]">
          <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
          <span className="text-sm font-medium">{formatCurrency(value)}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-medium"
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const status = row.getValue("status") as EventStatus
      const getStatusColor = (status: EventStatus) => {
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

      const getStatusText = (status: EventStatus) => {
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

      return (
        <Badge
          variant="secondary"
          className={`whitespace-nowrap ${getStatusColor(status)}`}
        >
          {getStatusText(status)}
        </Badge>
      )
    },
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const event = row.original

      return (
        <UltraIsolatedDropdown
          onView={() => onView(event)}
          onEdit={() => onEdit(event)}
          onDelete={() => onDelete(event)}
        />
      )
    },
  },
]