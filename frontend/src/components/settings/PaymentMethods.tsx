"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  CreditCard,
  Plus,
  Trash2,
  Star,
  StarOff,
  Loader2,
  AlertCircle,
  CheckCircle2
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { companiesAPI } from "@/services/api"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PaymentMethod {
  id: number
  card_brand: string
  card_last_four: string
  card_exp_month: number
  card_exp_year: number
  is_default: boolean
  is_active: boolean
  created_at: string
}

const CARD_BRAND_LABELS: Record<string, string> = {
  visa: "Visa",
  mastercard: "Mastercard",
  amex: "American Express",
  elo: "Elo",
  hipercard: "Hipercard",
  discover: "Discover",
  diners: "Diners Club",
  other: "Outro",
}

const CARD_BRAND_COLORS: Record<string, string> = {
  visa: "bg-blue-100 text-blue-800",
  mastercard: "bg-red-100 text-red-800",
  amex: "bg-green-100 text-green-800",
  elo: "bg-yellow-100 text-yellow-800",
  hipercard: "bg-orange-100 text-orange-800",
  discover: "bg-purple-100 text-purple-800",
  diners: "bg-indigo-100 text-indigo-800",
  other: "bg-gray-100 text-gray-800",
}

export default function PaymentMethods() {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCreating, setIsCreating] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [cardHolderName, setCardHolderName] = useState("")
  const { toast } = useToast()

  // Fetch payment methods
  const fetchPaymentMethods = async () => {
    try {
      setIsLoading(true)
      const response = await companiesAPI.paymentMethods()
      setPaymentMethods(response.data)
    } catch (error: any) {
      console.error("Erro ao carregar métodos de pagamento:", error)
      toast({
        title: "Erro",
        description: "Não foi possível carregar os métodos de pagamento.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentMethods()
  }, [])

  // Create new payment method
  const handleCreatePaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!cardHolderName.trim()) {
      toast({
        title: "Erro de validação",
        description: "Nome do portador do cartão é obrigatório.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsCreating(true)
      const response = await companiesAPI.createPaymentMethod({
        card_holder_name: cardHolderName.trim()
      })

      toast({
        title: "Setup Intent Criado",
        description: response.data.message || "Setup intent criado com sucesso. Integração com provedor de pagamento necessária.",
      })

      setIsDialogOpen(false)
      setCardHolderName("")

      // In a real implementation, you would redirect to the payment provider's form
      // For now, we just refresh the list (though no new items will appear without full integration)
      await fetchPaymentMethods()

    } catch (error: any) {
      console.error("Erro ao criar método de pagamento:", error)

      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.detail ||
                          "Erro interno do servidor. Tente novamente."

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Set payment method as default
  const handleSetDefault = async (id: number) => {
    try {
      await companiesAPI.updatePaymentMethod(id, { is_default: true })

      toast({
        title: "Sucesso",
        description: "Método de pagamento definido como padrão.",
      })

      await fetchPaymentMethods()
    } catch (error: any) {
      console.error("Erro ao definir método como padrão:", error)
      toast({
        title: "Erro",
        description: "Não foi possível definir o método como padrão.",
        variant: "destructive",
      })
    }
  }

  // Delete payment method
  const handleDelete = async (id: number) => {
    try {
      await companiesAPI.deletePaymentMethod(id)

      toast({
        title: "Sucesso",
        description: "Método de pagamento removido com sucesso.",
      })

      await fetchPaymentMethods()
    } catch (error: any) {
      console.error("Erro ao remover método de pagamento:", error)

      const errorMessage = error.response?.data?.detail ||
                          "Não foi possível remover o método de pagamento."

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    }
  }

  const formatExpiryDate = (month: number, year: number) => {
    return `${month.toString().padStart(2, '0')}/${year.toString().slice(-2)}`
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando métodos de pagamento...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center">
        <div>
          <h4 className="text-lg font-medium text-gray-900">Cartões Salvos</h4>
          <p className="text-sm text-gray-600">
            Gerencie os cartões de crédito para sua assinatura
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Cartão
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Novo Cartão</DialogTitle>
              <DialogDescription>
                Inicie o processo de adicionar um novo método de pagamento.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreatePaymentMethod} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cardHolderName">Nome do Portador do Cartão</Label>
                <Input
                  id="cardHolderName"
                  type="text"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  placeholder="Nome como aparece no cartão"
                  required
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium">Nota de Desenvolvimento</p>
                    <p>
                      Esta funcionalidade requer integração com um provedor de pagamento
                      (como Stripe ou Pagar.me) para coletar dados do cartão de forma segura.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isCreating}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Criando...
                    </>
                  ) : (
                    "Criar Setup Intent"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Payment Methods List */}
      {paymentMethods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum cartão cadastrado
            </h3>
            <p className="text-gray-600 mb-4">
              Adicione um método de pagamento para continuar usando o BuffetFlow.
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Primeiro Cartão
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="relative">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-12 h-8 bg-gray-100 rounded border">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge
                          variant="secondary"
                          className={CARD_BRAND_COLORS[method.card_brand] || CARD_BRAND_COLORS.other}
                        >
                          {CARD_BRAND_LABELS[method.card_brand] || method.card_brand}
                        </Badge>
                        {method.is_default && (
                          <Badge className="bg-green-100 text-green-800">
                            <Star className="h-3 w-3 mr-1" />
                            Padrão
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">
                        •••• •••• •••• {method.card_last_four}
                      </p>
                      <p className="text-xs text-gray-500">
                        Expira em {formatExpiryDate(method.card_exp_month, method.card_exp_year)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.is_default && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetDefault(method.id)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <StarOff className="h-4 w-4 mr-1" />
                        Tornar Padrão
                      </Button>
                    )}

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:text-red-900 hover:border-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Remover Cartão</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tem certeza que deseja remover este método de pagamento?
                            Esta ação não pode ser desfeita.
                            {method.is_default && (
                              <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-yellow-800 text-sm">
                                <strong>Atenção:</strong> Este é seu método de pagamento padrão.
                              </div>
                            )}
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(method.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Remover
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Integration Notice */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">
                Integração com Provedor de Pagamento
              </h4>
              <p className="text-sm text-blue-800">
                Para funcionalidade completa, esta feature requer integração com provedores como
                Stripe, Pagar.me ou PagSeguro para processar pagamentos de forma segura.
                Os dados sensíveis do cartão nunca são armazenados diretamente no sistema.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}