"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal, CheckCircle, X, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

export interface FinancialTransaction {
  id: number
  description: string
  amount: number
  transaction_type: 'INCOME' | 'EXPENSE'
  transaction_type_display: string
  transaction_date: string
  status: 'PENDING' | 'COMPLETED' | 'CANCELED'
  status_display: string
  related_event_title?: string
  created_at: string
  updated_at: string
}

interface ColumnsProps {
  onEdit?: (transaction: FinancialTransaction) => void
  onDelete?: (transaction: FinancialTransaction) => void
  onMarkCompleted?: (transaction: FinancialTransaction) => void
  onCancel?: (transaction: FinancialTransaction) => void
}

export function createColumns({
  onEdit,
  onDelete,
  onMarkCompleted,
  onCancel,
}: ColumnsProps): ColumnDef<FinancialTransaction>[] {
  return [
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Descrição
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        return (
          <div>
            <div className="font-medium">{row.getValue("description")}</div>
            {row.original.related_event_title && (
              <div className="text-sm text-gray-500">
                Evento: {row.original.related_event_title}
              </div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Valor
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL'
        }).format(amount)

        const transactionType = row.original.transaction_type
        return (
          <div className={`font-medium ${transactionType === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}>
            {transactionType === 'INCOME' ? '+' : '-'}{formatted}
          </div>
        )
      },
    },
    {
      accessorKey: "transaction_type",
      header: "Tipo",
      cell: ({ row }) => {
        const type = row.original.transaction_type
        return (
          <Badge variant={type === 'INCOME' ? 'default' : 'destructive'}>
            {row.original.transaction_type_display}
          </Badge>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status
        const variant = status === 'COMPLETED' ? 'default' :
                      status === 'PENDING' ? 'secondary' : 'destructive'

        return (
          <Badge variant={variant}>
            {row.original.status_display}
          </Badge>
        )
      },
    },
    {
      accessorKey: "transaction_date",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Data
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const date = new Date(row.getValue("transaction_date"))
        return date.toLocaleDateString('pt-BR')
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const transaction = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(transaction)}>
                <Edit className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>

              {transaction.status === 'PENDING' && (
                <>
                  <DropdownMenuItem onClick={() => onMarkCompleted?.(transaction)}>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar como Concluído
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onCancel?.(transaction)}>
                    <X className="mr-2 h-4 w-4" />
                    Cancelar
                  </DropdownMenuItem>
                </>
              )}

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => onDelete?.(transaction)}
                className="text-red-600"
              >
                Excluir
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
}