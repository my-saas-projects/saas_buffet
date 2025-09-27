"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { menuAPI } from "@/services/api"

interface MenuItemFormData {
  name: string
  category: string
  description: string
  cost_per_person: string
  price_per_person: string
  is_active: boolean
  seasonal: boolean
}

interface MenuItemFormProps {
  itemId?: string
  initialData?: Partial<MenuItemFormData>
  onSuccess?: () => void
  onCancel?: () => void
}

const CATEGORY_OPTIONS = [
  { value: "appetizer", label: "Entrada" },
  { value: "main", label: "Prato Principal" },
  { value: "side", label: "Acompanhamento" },
  { value: "dessert", label: "Sobremesa" },
  { value: "beverage", label: "Bebida" },
]

export function MenuItemForm({ itemId, initialData, onSuccess, onCancel }: MenuItemFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<MenuItemFormData>({
    name: initialData?.name || "",
    category: initialData?.category || "",
    description: initialData?.description || "",
    cost_per_person: initialData?.cost_per_person || "",
    price_per_person: initialData?.price_per_person || "",
    is_active: initialData?.is_active ?? true,
    seasonal: initialData?.seasonal ?? false,
  })

  const { toast } = useToast()

  const updateField = (field: keyof MenuItemFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const submitData = {
        ...formData,
        cost_per_person: parseFloat(formData.cost_per_person) || 0,
        price_per_person: parseFloat(formData.price_per_person) || 0,
      }

      if (itemId) {
        await menuAPI.update(itemId, submitData)
        toast({
          title: "Item atualizado!",
          description: "O item do cardápio foi atualizado com sucesso.",
        })
      } else {
        await menuAPI.create(submitData)
        toast({
          title: "Item criado!",
          description: "O item do cardápio foi criado com sucesso.",
        })
      }

      onSuccess?.()
    } catch (error) {
      console.error('Erro ao salvar item:', error)
      toast({
        title: "Erro ao salvar",
        description: "Não foi possível salvar o item do cardápio.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{itemId ? "Editar Item do Cardápio" : "Novo Item do Cardápio"}</CardTitle>
        <CardDescription>
          {itemId ? "Edite as informações do item do cardápio" : "Adicione um novo item ao seu cardápio"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Item *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="Ex: Lasanha de Carne"
              required
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => updateField("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField("description", e.target.value)}
              placeholder="Descreva o item do cardápio..."
              rows={3}
            />
          </div>

          {/* Preços */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost_per_person">Custo por Pessoa (R$) *</Label>
              <Input
                id="cost_per_person"
                type="number"
                step="0.01"
                min="0"
                value={formData.cost_per_person}
                onChange={(e) => updateField("cost_per_person", e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_per_person">Preço por Pessoa (R$) *</Label>
              <Input
                id="price_per_person"
                type="number"
                step="0.01"
                min="0"
                value={formData.price_per_person}
                onChange={(e) => updateField("price_per_person", e.target.value)}
                placeholder="0,00"
                required
              />
            </div>
          </div>

          {/* Configurações */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => updateField("is_active", checked)}
              />
              <Label htmlFor="is_active">Item Ativo</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="seasonal"
                checked={formData.seasonal}
                onCheckedChange={(checked) => updateField("seasonal", checked)}
              />
              <Label htmlFor="seasonal">Item Sazonal</Label>
            </div>
          </div>

          {/* Botões */}
          <div className="flex space-x-3 pt-6">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Salvando..." : itemId ? "Atualizar Item" : "Criar Item"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}