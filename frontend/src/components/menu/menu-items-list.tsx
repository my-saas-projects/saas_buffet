"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Edit, Trash2, Eye, EyeOff } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { menuAPI } from "@/services/api"

interface MenuItem {
  id: number
  name: string
  category: string
  description?: string
  cost_per_person: number
  price_per_person: number
  is_active: boolean
  seasonal: boolean
  created_at: string
  updated_at: string
}

interface MenuItemsListProps {
  onAddNew?: () => void
  onEdit?: (item: MenuItem) => void
}

const CATEGORY_LABELS = {
  appetizer: 'Entrada',
  main: 'Prato Principal',
  side: 'Acompanhamento',
  dessert: 'Sobremesa',
  beverage: 'Bebida',
}

const getCategoryBadgeColor = (category: string) => {
  const colors = {
    appetizer: 'bg-blue-100 text-blue-800',
    main: 'bg-green-100 text-green-800',
    side: 'bg-yellow-100 text-yellow-800',
    dessert: 'bg-pink-100 text-pink-800',
    beverage: 'bg-purple-100 text-purple-800',
  }
  return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800'
}

export function MenuItemsList({ onAddNew, onEdit }: MenuItemsListProps) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const { toast } = useToast()

  useEffect(() => {
    loadMenuItems()
  }, [refreshTrigger])

  const loadMenuItems = async () => {
    try {
      setIsLoading(true)
      const response = await menuAPI.list()
      setMenuItems(response.data || [])
    } catch (error) {
      console.error('Erro ao carregar itens do cardápio:', error)
      toast({
        title: "Erro ao carregar cardápio",
        description: "Não foi possível carregar os itens do cardápio.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (item: MenuItem) => {
    if (!confirm(`Tem certeza que deseja excluir "${item.name}"?`)) {
      return
    }

    try {
      await menuAPI.delete(item.id.toString())
      toast({
        title: "Item excluído!",
        description: `${item.name} foi excluído do cardápio.`,
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Erro ao excluir item:', error)
      toast({
        title: "Erro ao excluir",
        description: "Não foi possível excluir o item do cardápio.",
        variant: "destructive",
      })
    }
  }

  const toggleActive = async (item: MenuItem) => {
    try {
      await menuAPI.update(item.id.toString(), {
        ...item,
        is_active: !item.is_active
      })
      toast({
        title: item.is_active ? "Item desativado!" : "Item ativado!",
        description: `${item.name} foi ${item.is_active ? 'desativado' : 'ativado'}.`,
      })
      setRefreshTrigger(prev => prev + 1)
    } catch (error) {
      console.error('Erro ao alterar status:', error)
      toast({
        title: "Erro ao alterar status",
        description: "Não foi possível alterar o status do item.",
        variant: "destructive",
      })
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
        <p className="ml-4 text-gray-600">Carregando cardápio...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Cardápio</h2>
          <p className="text-gray-600">Gerencie os itens do seu cardápio</p>
        </div>
        <Button onClick={onAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Item
        </Button>
      </div>

      {/* Lista de Itens */}
      {menuItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <div className="text-gray-500">
              <Plus className="mx-auto h-12 w-12 mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum item no cardápio</h3>
              <p className="mb-4">Adicione o primeiro item ao seu cardápio para começar a calcular custos de eventos.</p>
              <Button onClick={onAddNew}>
                Adicionar Primeiro Item
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Itens do Cardápio ({menuItems.length})</CardTitle>
            <CardDescription>
              Lista completa dos itens do seu cardápio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Custo/Pessoa</TableHead>
                  <TableHead>Preço/Pessoa</TableHead>
                  <TableHead>Margem</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {menuItems.map((item) => {
                  const margin = item.price_per_person > 0
                    ? ((item.price_per_person - item.cost_per_person) / item.price_per_person * 100)
                    : 0

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{item.name}</div>
                          {item.description && (
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadgeColor(item.category)}>
                          {CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS]}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(item.cost_per_person)}</TableCell>
                      <TableCell>{formatCurrency(item.price_per_person)}</TableCell>
                      <TableCell>
                        <span className={margin > 0 ? 'text-green-600' : 'text-red-600'}>
                          {margin.toFixed(1)}%
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={item.is_active ? "default" : "secondary"}>
                            {item.is_active ? "Ativo" : "Inativo"}
                          </Badge>
                          {item.seasonal && (
                            <Badge variant="outline">Sazonal</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => toggleActive(item)}
                            title={item.is_active ? "Desativar item" : "Ativar item"}
                          >
                            {item.is_active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEdit?.(item)}
                            title="Editar item"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item)}
                            className="text-red-500 hover:text-red-700"
                            title="Excluir item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}