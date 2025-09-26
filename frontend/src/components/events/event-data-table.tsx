"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChevronDown, Search, Plus, Settings2, CalendarDays } from "lucide-react"
import { eventsAPI } from "@/services/api"
import { EventListItem } from "@/lib/types"
import { EVENT_STATUS_OPTIONS } from "@/lib/constants"
import { createEventColumns } from "./event-columns"
import { EventForm } from "./event-form"

interface EventDataTableProps {
  companyId: string
  onEventSelect?: (event: EventListItem) => void
  onCreateNew?: () => void
  editingEvent?: EventListItem | null
  onEditComplete?: () => void
  onEdit?: (event: EventListItem) => void
}

export function EventDataTable({
  companyId,
  onEventSelect,
  onCreateNew,
  editingEvent,
  onEditComplete,
  onEdit
}: EventDataTableProps) {
  const [data, setData] = useState<EventListItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  // Load data
  const loadEvents = async () => {
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
  }

  useEffect(() => {
    loadEvents()
  }, [companyId])

  // Action handlers with useCallback to prevent re-renders
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
  }, [])

  const handleGeneratePDF = useCallback(async (event: EventListItem) => {
    try {
      const response = await eventsAPI.generateProposalPDF(event.id.toString())

      // Create blob URL and download
      const blob = new Blob([response.data], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)

      // Create temporary link and trigger download
      const link = document.createElement('a')
      link.href = url
      link.download = `orcamento-evento-${event.id}.pdf`
      document.body.appendChild(link)
      link.click()

      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error: any) {
      console.error('Erro ao gerar PDF:', error)
      alert('Erro ao gerar PDF. Tente novamente.')
    }
  }, [])

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => createEventColumns({
    onView: handleView,
    onEdit: handleEdit,
    onDelete: handleDelete,
    onGeneratePDF: handleGeneratePDF,
  }), [handleView, handleEdit, handleDelete, handleGeneratePDF])

  // Filter data by status
  const filteredData = data.filter(event => {
    if (statusFilter === "all") return true
    return event.status === statusFilter
  })

  const table = useReactTable({
    data: filteredData,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
    globalFilterFn: (row, columnId, value) => {
      const event = row.original
      const searchString = value.toLowerCase()

      return (
        event.title.toLowerCase().includes(searchString) ||
        event.client_name.toLowerCase().includes(searchString) ||
        event.event_type_display?.toLowerCase().includes(searchString) ||
        event.status_display?.toLowerCase().includes(searchString)
      )
    },
  })

  // Handle form states
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
          clientId: '',
          guestCount: editingEvent.guest_count.toString(),
          venue: '',
          value: editingEvent.value?.toString() || '',
          notes: '',
          status: editingEvent.status,
          proposalValidityDate: editingEvent.proposal_validity_date || ''
        } : undefined}
        onSuccess={() => {
          setShowForm(false)
          onEditComplete?.()
          loadEvents()
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
          <h2 className="text-2xl font-bold text-gray-900">Eventos</h2>
          <p className="text-gray-600">Gerencie todos os seus eventos</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Evento
        </Button>
      </div>

      {/* Table Card */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Eventos</CardTitle>
          <CardDescription>
            {table.getFilteredRowModel().rows.length} evento(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Toolbar */}
          <div className="flex items-center justify-between space-x-2 pb-4">
            <div className="flex flex-1 items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar eventos, clientes..."
                  value={globalFilter ?? ""}
                  onChange={(event) => setGlobalFilter(String(event.target.value))}
                  className="pl-10 max-w-sm"
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
            <div className="flex items-center space-x-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    Colunas
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id === "event_type" ? "Tipo do Evento" :
                           column.id === "title" ? "Título do Evento" :
                           column.id === "client_name" ? "Cliente" :
                           column.id === "event_date" ? "Data e Horário" :
                           column.id === "guest_count" ? "Nº de Convidados" :
                           column.id === "venue_location" ? "Local" :
                           column.id === "status" ? "Status" :
                           column.id}
                        </DropdownMenuCheckboxItem>
                      )
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Table */}
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
              <Button variant="outline" onClick={loadEvents} className="mt-4">
                Tentar novamente
              </Button>
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      // Loading skeleton
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          {columns.map((_, colIndex) => (
                            <TableCell key={colIndex}>
                              <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                          className="hover:bg-gray-50"
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          {globalFilter || statusFilter !== "all" ? (
                            <div>
                              <p className="text-gray-600 mb-2">Nenhum evento encontrado</p>
                              <p className="text-sm text-gray-400">Tente ajustar sua busca ou filtros</p>
                            </div>
                          ) : (
                            <div>
                              <CalendarDays className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                              <p className="text-gray-600 mb-2">Nenhum evento cadastrado</p>
                              <Button onClick={() => setShowForm(true)} variant="outline">
                                <Plus className="h-4 w-4 mr-2" />
                                Criar primeiro evento
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between space-x-2 py-4">
                <div className="flex-1 text-sm text-gray-600">
                  {table.getFilteredSelectedRowModel().rows.length > 0 && (
                    <>
                      {table.getFilteredSelectedRowModel().rows.length} de{" "}
                      {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
                    </>
                  )}
                </div>
                <div className="flex items-center space-x-6 lg:space-x-8">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium">Linhas por página</p>
                    <select
                      value={table.getState().pagination.pageSize}
                      onChange={(e) => {
                        table.setPageSize(Number(e.target.value))
                      }}
                      className="h-8 w-[70px] rounded border border-gray-300 px-2 text-sm"
                    >
                      {[10, 20, 30, 40, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          {pageSize}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex w-[100px] items-center justify-center text-sm font-medium">
                    Página {table.getState().pagination.pageIndex + 1} de{" "}
                    {table.getPageCount()}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(0)}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Ir para primeira página</span>
                      {"<<"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.previousPage()}
                      disabled={!table.getCanPreviousPage()}
                    >
                      <span className="sr-only">Ir para página anterior</span>
                      {"<"}
                    </Button>
                    <Button
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={() => table.nextPage()}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Ir para próxima página</span>
                      {">"}
                    </Button>
                    <Button
                      variant="outline"
                      className="hidden h-8 w-8 p-0 lg:flex"
                      onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                      disabled={!table.getCanNextPage()}
                    >
                      <span className="sr-only">Ir para última página</span>
                      {">>"}
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}