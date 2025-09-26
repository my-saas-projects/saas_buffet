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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ChevronDown, Search, Plus, Settings2 } from "lucide-react"
import { createColumns, FinancialTransaction } from "./columns"
import { financialsAPI } from "@/services/api"
import { toast } from "@/hooks/use-toast"

export function TransactionsDataTable() {
  const [data, setData] = useState<FinancialTransaction[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Table state
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [globalFilter, setGlobalFilter] = useState("")

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")

  // Load transactions
  const loadTransactions = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await financialsAPI.transactions.list()
      setData(response.data.results || response.data || [])
    } catch (error) {
      console.error('Erro ao carregar transações:', error)
      setError('Erro ao carregar transações')
      setData([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadTransactions()
  }, [])

  // Action handlers
  const handleEdit = useCallback((transaction: FinancialTransaction) => {
    // TODO: Implementar modal de edição
    console.log('Editar transação:', transaction)
    toast({
      title: "Funcionalidade em desenvolvimento",
      description: "A edição de transações será implementada em breve.",
    })
  }, [])

  const handleDelete = useCallback(async (transaction: FinancialTransaction) => {
    if (!confirm('Tem certeza que deseja excluir esta transação?')) {
      return
    }

    try {
      await financialsAPI.transactions.delete(transaction.id.toString())

      toast({
        title: "Transação excluída",
        description: "A transação foi excluída com sucesso.",
      })

      loadTransactions()
    } catch (error) {
      console.error('Erro ao excluir transação:', error)
      toast({
        title: "Erro",
        description: "Erro ao excluir transação. Tente novamente.",
        variant: "destructive",
      })
    }
  }, [])

  const handleMarkCompleted = useCallback(async (transaction: FinancialTransaction) => {
    try {
      await financialsAPI.transactions.patch(transaction.id.toString(), {
        status: 'COMPLETED'
      })

      toast({
        title: "Status atualizado",
        description: "A transação foi marcada como concluída.",
      })

      loadTransactions()
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      toast({
        title: "Erro",
        description: "Erro ao atualizar status. Tente novamente.",
        variant: "destructive",
      })
    }
  }, [])

  const handleCancel = useCallback(async (transaction: FinancialTransaction) => {
    try {
      await financialsAPI.transactions.patch(transaction.id.toString(), {
        status: 'CANCELED'
      })

      toast({
        title: "Transação cancelada",
        description: "A transação foi cancelada com sucesso.",
      })

      loadTransactions()
    } catch (error) {
      console.error('Erro ao cancelar transação:', error)
      toast({
        title: "Erro",
        description: "Erro ao cancelar transação. Tente novamente.",
        variant: "destructive",
      })
    }
  }, [])

  // Filtered data
  const filteredData = useMemo(() => {
    let filtered = data

    if (statusFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.status === statusFilter)
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter(transaction => transaction.transaction_type === typeFilter)
    }

    return filtered
  }, [data, statusFilter, typeFilter])

  // Memoize columns to prevent recreation on every render
  const columns = useMemo(() => createColumns({
    onEdit: handleEdit,
    onDelete: handleDelete,
    onMarkCompleted: handleMarkCompleted,
    onCancel: handleCancel,
  }), [handleEdit, handleDelete, handleMarkCompleted, handleCancel])

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
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Financeiras</CardTitle>
        <CardDescription>
          {table.getFilteredRowModel().rows.length} transação(ões) encontrada(s)
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Toolbar */}
        <div className="flex flex-col space-y-4 pb-4">
          <div className="flex flex-1 items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar transações..."
                value={globalFilter ?? ""}
                onChange={(event) => setGlobalFilter(String(event.target.value))}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="PENDING">Pendente</SelectItem>
                <SelectItem value="COMPLETED">Concluído</SelectItem>
                <SelectItem value="CANCELED">Cancelado</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Tipos</SelectItem>
                <SelectItem value="INCOME">Entrada</SelectItem>
                <SelectItem value="EXPENSE">Saída</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={() => {
              toast({
                title: "Funcionalidade em desenvolvimento",
                description: "A criação de transações será implementada em breve.",
              })
            }}>
              <Plus className="h-4 w-4 mr-2" />
              Nova Transação
            </Button>
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
                        {column.id === "description" ? "Descrição" :
                         column.id === "amount" ? "Valor" :
                         column.id === "transaction_type" ? "Tipo" :
                         column.id === "status" ? "Status" :
                         column.id === "transaction_date" ? "Data" :
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
            <p className="text-red-600 mb-4">{error}</p>
            <Button variant="outline" onClick={loadTransactions}>
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
                        {globalFilter ? (
                          <div>
                            <p className="text-gray-600 mb-2">Nenhuma transação encontrada</p>
                            <p className="text-sm text-gray-400">Tente ajustar sua busca</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-600 mb-2">Nenhuma transação cadastrada</p>
                            <Button
                              onClick={() => {
                                toast({
                                  title: "Funcionalidade em desenvolvimento",
                                  description: "A criação de transações será implementada em breve.",
                                })
                              }}
                              variant="outline"
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Criar primeira transação
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
  )
}