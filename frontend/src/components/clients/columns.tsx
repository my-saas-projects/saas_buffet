"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { UltraIsolatedDropdown } from "@/components/ui/ultra-isolated-dropdown"
import { ArrowUpDown } from "lucide-react"
import { Client } from "@/lib/types"

interface ColumnProps {
  onView: (client: Client) => void
  onEdit: (client: Client) => void
  onDelete: (client: Client) => void
}

export const createColumns = ({ onView, onEdit, onDelete }: ColumnProps): ColumnDef<Client>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-medium"
      >
        Nome
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const client = row.original
      const isJuridica = client.client_type === 'JURIDICA'
      const displayName = isJuridica
        ? (client.fantasy_name || client.corporate_name || client.name)
        : (client.full_name || client.name)

      return <div className="font-medium">{displayName}</div>
    },
  },
  {
    accessorKey: "client_type",
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
      const isJuridica = row.getValue("client_type") === 'JURIDICA'
      return (
        <Badge
          variant="secondary"
          className={`${
            isJuridica
              ? 'bg-blue-50 text-blue-700 border-blue-200'
              : 'bg-green-50 text-green-700 border-green-200'
          }`}
        >
          {isJuridica ? 'PJ' : 'PF'}
        </Badge>
      )
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-medium"
      >
        Telefone
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="min-w-[120px]">
        {row.getValue("phone")}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="hover:bg-transparent p-0 font-medium"
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.getValue("email")}
      </div>
    ),
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const client = row.original

      return (
        <UltraIsolatedDropdown
          onView={() => onView(client)}
          onEdit={() => onEdit(client)}
          onDelete={() => onDelete(client)}
        />
      )
    },
  },
]