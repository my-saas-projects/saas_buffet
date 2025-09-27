"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calculator, Plus, Trash2, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { eventsAPI, menuAPI } from "@/services/api"

interface MenuItem {
  id: number
  name: string
  category: string
  description?: string
  cost_per_person: number
  price_per_person: number
  is_active: boolean
}

interface EventMenuItem {
  menu_item_id: number
  quantity: number
  menu_item: MenuItem
}

interface EventCostCalculatorProps {
  eventId: string
  initialGuests?: number
  onCostCalculated?: (cost: number) => void
}

const CATEGORY_LABELS = {
  appetizer: 'Entrada',
  main: 'Prato Principal',
  side: 'Acompanhamento',
  dessert: 'Sobremesa',
  beverage: 'Bebida',
}

export function EventCostCalculator({ eventId, initialGuests = 1, onCostCalculated }: EventCostCalculatorProps) {
  const [guests, setGuests] = useState(initialGuests)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [selectedItems, setSelectedItems] = useState<EventMenuItem[]>([])
  const [estimatedCost, setEstimatedCost] = useState<number>(0)
  const [profitMargin, setProfitMargin] = useState<number>(30)
  const [finalPrice, setFinalPrice] = useState<number>(0)
  const [isCalculating, setIsCalculating] = useState(false)
  const [isLoadingMenuItems, setIsLoadingMenuItems] = useState(true)

  const { toast } = useToast()

  useEffect(() => {
    loadMenuItems()
  }, [])

  useEffect(() => {
    if (selectedItems.length > 0 && guests > 0) {
      calculateCost()
    }
  }, [selectedItems, guests])

  useEffect(() => {
    const finalPriceCalculated = estimatedCost * (1 + profitMargin / 100)
    setFinalPrice(finalPriceCalculated)
  }, [estimatedCost, profitMargin])

  const loadMenuItems = async () => {
    try {
      const response = await menuAPI.list()
      setMenuItems(response.data.filter((item: MenuItem) => item.is_active))
    } catch (error) {
      console.error('Erro ao carregar itens do cardápio:', error)
      toast({
        title: "Erro ao carregar cardápio",
        description: "Não foi possível carregar os itens do cardápio.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingMenuItems(false)
    }
  }

  const calculateCost = async () => {
    if (selectedItems.length === 0 || guests <= 0) {
      setEstimatedCost(0)
      return
    }

    setIsCalculating(true)
    try {
      const items = selectedItems.map(item => ({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity
      }))

      const response = await eventsAPI.calculateCost(eventId, {
        guests,
        items
      })

      const cost = response.data.estimated_cost
      setEstimatedCost(cost)
      onCostCalculated?.(cost)
    } catch (error) {
      console.error('Erro ao calcular custo:', error)
      toast({
        title: "Erro no cálculo",
        description: "Não foi possível calcular o custo do evento.",
        variant: "destructive",
      })
    } finally {
      setIsCalculating(false)
    }
  }

  const addMenuItem = (menuItemId: string) => {
    const menuItem = menuItems.find(item => item.id === parseInt(menuItemId))
    if (!menuItem) return

    const existingItem = selectedItems.find(item => item.menu_item_id === parseInt(menuItemId))

    if (existingItem) {
      setSelectedItems(prev =>
        prev.map(item =>
          item.menu_item_id === parseInt(menuItemId)
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      )
    } else {
      setSelectedItems(prev => [...prev, {
        menu_item_id: parseInt(menuItemId),
        quantity: 1,
        menu_item: menuItem
      }])
    }
  }

  const updateItemQuantity = (menuItemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeMenuItem(menuItemId)
      return
    }

    setSelectedItems(prev =>
      prev.map(item =>
        item.menu_item_id === menuItemId
          ? { ...item, quantity }
          : item
      )
    )
  }

  const removeMenuItem = (menuItemId: number) => {
    setSelectedItems(prev => prev.filter(item => item.menu_item_id !== menuItemId))
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Calculadora de Custos do Evento
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Guest Count Input */}
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="guests" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Número de Convidados
            </Label>
            <Input
              id="guests"
              type="number"
              min="1"
              value={guests}
              onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
              placeholder="Número de convidados"
            />
          </div>

          {/* Menu Item Selection */}
          <div className="space-y-4">
            <Label>Adicionar Item do Cardápio</Label>
            <div className="flex gap-2">
              <Select onValueChange={addMenuItem}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione um item do cardápio" />
                </SelectTrigger>
                <SelectContent>
                  {isLoadingMenuItems ? (
                    <SelectItem value="loading" disabled>Carregando...</SelectItem>
                  ) : (
                    menuItems.map((item) => (
                      <SelectItem key={item.id} value={item.id.toString()}>
                        <div className="flex items-center justify-between w-full">
                          <span>{item.name}</span>
                          <Badge className={`ml-2 ${getCategoryBadgeColor(item.category)}`}>
                            {CATEGORY_LABELS[item.category as keyof typeof CATEGORY_LABELS]}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Selected Items Table */}
          {selectedItems.length > 0 && (
            <div className="space-y-2">
              <Label>Itens Selecionados</Label>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Custo/Pessoa</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Custo Total</TableHead>
                    <TableHead></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedItems.map((item) => (
                    <TableRow key={item.menu_item_id}>
                      <TableCell className="font-medium">{item.menu_item.name}</TableCell>
                      <TableCell>
                        <Badge className={getCategoryBadgeColor(item.menu_item.category)}>
                          {CATEGORY_LABELS[item.menu_item.category as keyof typeof CATEGORY_LABELS]}
                        </Badge>
                      </TableCell>
                      <TableCell>R$ {item.menu_item.cost_per_person.toFixed(2)}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => updateItemQuantity(item.menu_item_id, parseInt(e.target.value) || 1)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        R$ {(item.menu_item.cost_per_person * guests * item.quantity).toFixed(2)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeMenuItem(item.menu_item_id)}
                          className="h-8 w-8 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Cost Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {isCalculating ? "..." : `R$ ${estimatedCost.toFixed(2)}`}
                  </div>
                  <div className="text-sm text-muted-foreground">Custo Estimado</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <Label htmlFor="margin">Margem de Lucro (%)</Label>
                  <Input
                    id="margin"
                    type="number"
                    min="0"
                    max="100"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    R$ {finalPrice.toFixed(2)}
                  </div>
                  <div className="text-sm text-muted-foreground">Preço Final Sugerido</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}