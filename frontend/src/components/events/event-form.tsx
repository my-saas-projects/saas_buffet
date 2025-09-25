"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Clock, Users, MapPin, User, X, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { eventsAPI, clientsAPI } from "@/services/api"
import { EVENT_STATUS, EVENT_STATUS_OPTIONS, EventStatus } from "@/lib/constants"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ClientForm } from "@/components/clients/client-form"

interface EventFormData {
  eventType: string
  title: string
  date: string
  startTime: string
  endTime: string
  clientId: string
  guestCount: string
  venue: string
  value: string
  notes: string
  status: EventStatus
  proposalValidityDate: string
}

interface Client {
  id: string
  name: string
  email: string
  phone: string
}

interface EventFormProps {
  companyId: string
  eventId?: string
  onSuccess?: () => void
  onCancel?: () => void
  initialData?: Partial<EventFormData>
}

export function EventForm({ companyId, eventId, onSuccess, onCancel, initialData }: EventFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [loadingClients, setLoadingClients] = useState(true)
  const [showClientModal, setShowClientModal] = useState(false)
  const [formData, setFormData] = useState<EventFormData>({
    eventType: initialData?.eventType || "",
    title: initialData?.title || "",
    date: initialData?.date || "",
    startTime: initialData?.startTime || "",
    endTime: initialData?.endTime || "",
    clientId: initialData?.clientId || "",
    guestCount: initialData?.guestCount || "",
    venue: initialData?.venue || "",
    value: initialData?.value || "",
    notes: initialData?.notes || "",
    status: EVENT_STATUS.PROPOSTA_PENDENTE,
    proposalValidityDate: ""
  })

  const { toast } = useToast()

  useEffect(() => {
    loadClients()
  }, [])

  const loadClients = async () => {
    try {
      const response = await clientsAPI.list()
      setClients(response.data.results || response.data || [])
    } catch (error) {
      console.error('Erro ao carregar clientes:', error)
      toast({
        title: "Erro ao carregar clientes",
        description: "Não foi possível carregar a lista de clientes.",
        variant: "destructive",
      })
    } finally {
      setLoadingClients(false)
    }
  }

  const handleNewClientSuccess = async (newClient: Client) => {
    setShowClientModal(false)
    await loadClients()
    updateField("clientId", newClient.id)
    toast({
      title: "Cliente criado com sucesso!",
      description: `${newClient.name} foi adicionado e selecionado.`,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const selectedClient = clients.find(c => String(c.id) === formData.clientId)

      if (!selectedClient) {
        toast({
          title: "Erro",
          description: "Por favor, selecione um cliente válido.",
          variant: "destructive",
        })
        return
      }

      const eventData = {
        event_type: formData.eventType,
        title: formData.title,
        event_date: formData.date,
        start_time: formData.startTime,
        end_time: formData.endTime,
        client: parseInt(formData.clientId),
        client_name: selectedClient.name,
        client_email: selectedClient.email,
        client_phone: selectedClient.phone,
        guest_count: parseInt(formData.guestCount),
        venue_location: formData.venue,
        value: formData.value ? parseFloat(formData.value) : null,
        notes: formData.notes,
        status: formData.status,
        proposal_validity_date: formData.proposalValidityDate || null
      }

      const response = eventId
        ? await eventsAPI.update(eventId, eventData)
        : await eventsAPI.create(eventData)

      toast({
        title: eventId ? "Evento atualizado com sucesso!" : "Evento criado com sucesso!",
        description: eventId
          ? `${formData.title} foi atualizado.`
          : `${formData.title} foi adicionado à sua agenda.`,
      })
      onSuccess?.()
    } catch (error: any) {
      console.error('Erro ao criar evento:', error)
      const errorMessage = error.response?.data?.detail || error.response?.data?.error || (eventId ? "Não foi possível atualizar o evento" : "Não foi possível criar o evento")
      toast({
        title: eventId ? "Erro ao atualizar evento" : "Erro ao criar evento",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const updateField = (field: keyof EventFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const eventTypeOptions = [
    { value: "wedding", label: "Casamento" },
    { value: "graduation", label: "Formatura" },
    { value: "birthday", label: "Aniversário" },
    { value: "corporate", label: "Corporativo" },
    { value: "other", label: "Outro" }
  ]

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center space-x-2">
              <CalendarDays className="h-5 w-5" />
              <span>{eventId ? 'Editar Evento' : 'Novo Evento'}</span>
            </CardTitle>
            <CardDescription>
              {eventId ? 'Atualize as informações do evento' : 'Preencha as informações para cadastrar um novo evento'}
            </CardDescription>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="eventType">Tipo de Evento *</Label>
                <Select 
                  value={formData.eventType} 
                  onValueChange={(value) => updateField("eventType", value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {eventTypeOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título do Evento *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  placeholder="Ex: Casamento - João & Maria"
                  required
                />
              </div>
            </div>
          </div>

          {/* Data e Horário */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Data e Horário</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Data *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => updateField("date", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="startTime">Hora de Início *</Label>
                <Input
                  id="startTime"
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => updateField("startTime", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endTime">Hora de Término *</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => updateField("endTime", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2 flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Informações do Cliente</span>
            </h3>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="clientId">Cliente *</Label>
                <div className="flex space-x-2">
                  <Select
                    value={formData.clientId}
                    onValueChange={(value) => updateField("clientId", value)}
                    required
                    disabled={loadingClients}
                  >
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder={loadingClients ? "Carregando clientes..." : "Selecione um cliente"} />
                    </SelectTrigger>
                    <SelectContent>
                      {clients.map(client => (
                        <SelectItem key={client.id} value={String(client.id)}>
                          <div className="flex flex-col">
                            <span>{client.name}</span>
                            <span className="text-xs text-gray-500">{client.email} • {client.phone}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Dialog open={showClientModal} onOpenChange={setShowClientModal}>
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className="px-3"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Adicionar Novo Cliente</DialogTitle>
                      </DialogHeader>
                      <ClientForm
                        onSuccess={handleNewClientSuccess}
                        onCancel={() => setShowClientModal(false)}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
                {clients.length === 0 && !loadingClients && (
                  <p className="text-sm text-amber-600">
                    Nenhum cliente cadastrado.
                    <Button
                      type="button"
                      variant="link"
                      className="p-0 h-auto text-sm"
                      onClick={() => setShowClientModal(true)}
                    >
                      Cadastre o primeiro cliente
                    </Button>
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="guestCount">Número de Convidados *</Label>
                <Input
                  id="guestCount"
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => updateField("guestCount", e.target.value)}
                  placeholder="100"
                  min="1"
                  required
                />
              </div>
            </div>
          </div>

          {/* Local do Evento */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2 flex items-center space-x-2">
              <MapPin className="h-4 w-4" />
              <span>Local do Evento</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="venue">Local (Endereço ou Nome do Espaço)</Label>
                <Input
                  id="venue"
                  value={formData.venue}
                  onChange={(e) => updateField("venue", e.target.value)}
                  placeholder="Salão de Festas Bela Vista - Rua das Flores, 123"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="value">Valor do Evento</Label>
                <Input
                  id="value"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.value}
                  onChange={(e) => updateField("value", e.target.value)}
                  placeholder="1500.00"
                />
              </div>
            </div>
          </div>

          {/* Status e Proposta */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Status e Proposta</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status do Evento *</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => updateField("status", value as EventStatus)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {formData.status === EVENT_STATUS.PROPOSTA_ENVIADA && (
                <div className="space-y-2">
                  <Label htmlFor="proposalValidityDate">Data de Validade da Proposta *</Label>
                  <Input
                    id="proposalValidityDate"
                    type="date"
                    value={formData.proposalValidityDate}
                    onChange={(e) => updateField("proposalValidityDate", e.target.value)}
                    required
                  />
                </div>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 border-b pb-2">Observações</h3>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Observações Adicionais</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Informações importantes sobre o evento, restrições alimentares, preferências, etc."
                rows={3}
              />
            </div>
          </div>

          {/* Ações */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Salvando..." : (eventId ? "Atualizar Evento" : "Criar Evento")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}