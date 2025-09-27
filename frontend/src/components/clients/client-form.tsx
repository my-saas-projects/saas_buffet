"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { X, User, Mail, Phone, Building, MapPin } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { clientsAPI } from "@/services/api"
import { Client, ClientFormData, ClientType } from "@/lib/types"

interface ClientFormProps {
  clientId?: string
  onSuccess?: (client?: Client) => void
  onCancel?: () => void
  initialData?: Partial<ClientFormData>
}

export function ClientForm({ clientId, onSuccess, onCancel, initialData }: ClientFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<ClientFormData>({
    client_type: (initialData?.client_type as ClientType) || 'FISICA',
    full_name: initialData?.full_name || '',
    rg: initialData?.rg || '',
    cpf: initialData?.cpf || '',
    fantasy_name: initialData?.fantasy_name || '',
    corporate_name: initialData?.corporate_name || '',
    cnpj: initialData?.cnpj || '',
    state_registration: initialData?.state_registration || '',
    address: initialData?.address || '',
    zip_code: initialData?.zip_code || '',
    name: initialData?.name || "",
    email: initialData?.email || "",
    phone: initialData?.phone || ""
  })
  const [errors, setErrors] = useState<Partial<ClientFormData>>({})
  const { toast } = useToast()

  const validateForm = () => {
    const newErrors: Partial<ClientFormData> = {}

    // Validate based on client type
    if (formData.client_type === 'FISICA') {
      if (!formData.full_name?.trim()) {
        newErrors.full_name = "Nome completo é obrigatório para pessoa física"
      }
    } else if (formData.client_type === 'JURIDICA') {
      if (!formData.fantasy_name?.trim()) {
        newErrors.fantasy_name = "Nome fantasia é obrigatório para pessoa jurídica"
      }
    }

    // Name field is only required for JURIDICA (contact person)
    if (formData.client_type === 'JURIDICA' && !formData.name.trim()) {
      newErrors.name = "Nome de contato é obrigatório para pessoa jurídica"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Telefone é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsLoading(true)

      const payload: any = {
        client_type: formData.client_type,
        name: formData.client_type === 'FISICA' ? formData.full_name?.trim() || '' : formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      }

      // Add Pessoa Física fields
      if (formData.client_type === 'FISICA') {
        payload.full_name = formData.full_name?.trim() || ''
        payload.rg = formData.rg?.trim() || ''
        payload.cpf = formData.cpf?.trim() || ''
      }

      // Add Pessoa Jurídica fields
      if (formData.client_type === 'JURIDICA') {
        payload.fantasy_name = formData.fantasy_name?.trim() || ''
        payload.corporate_name = formData.corporate_name?.trim() || ''
        payload.cnpj = formData.cnpj?.trim() || ''
        payload.state_registration = formData.state_registration?.trim() || ''
      }

      // Add common fields
      payload.address = formData.address?.trim() || ''
      payload.zip_code = formData.zip_code?.trim() || ''

      let clientData: Client | undefined

      if (clientId) {
        const response = await clientsAPI.update(clientId, payload)
        clientData = response.data
        toast({
          title: "Cliente atualizado",
          description: "As informações do cliente foram atualizadas com sucesso.",
        })
      } else {
        const response = await clientsAPI.create(payload)
        clientData = response.data
        toast({
          title: "Cliente criado",
          description: "Novo cliente foi cadastrado com sucesso.",
        })
      }

      onSuccess?.(clientData)
    } catch (error: any) {
      console.error('Erro ao salvar cliente:', error)

      if (error.response?.data) {
        const backendErrors = error.response.data
        const fieldErrors: Partial<ClientFormData> = {}

        // Map backend errors to form fields
        Object.keys(backendErrors).forEach(field => {
          if (field in formData) {
            fieldErrors[field as keyof ClientFormData] = Array.isArray(backendErrors[field])
              ? backendErrors[field][0]
              : backendErrors[field]
          }
        })

        if (Object.keys(fieldErrors).length > 0) {
          setErrors(fieldErrors)
          return
        }
      }

      toast({
        title: "Erro ao salvar cliente",
        description: "Ocorreu um erro ao salvar o cliente. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: keyof ClientFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-xl">
              {clientId ? "Editar Cliente" : "Novo Cliente"}
            </CardTitle>
          </div>
          {onCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Cliente */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <User className="h-5 w-5 mr-2" />
                Tipo de Cliente
              </h3>

              <RadioGroup
                value={formData.client_type}
                onValueChange={(value) => handleInputChange("client_type", value)}
                className="flex flex-row space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="FISICA" id="fisica" />
                  <Label htmlFor="fisica">Pessoa Física</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="JURIDICA" id="juridica" />
                  <Label htmlFor="juridica">Pessoa Jurídica</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Campos específicos por tipo */}
            {formData.client_type === 'FISICA' ? (
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Dados Pessoais
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="full_name">Nome Completo *</Label>
                    <Input
                      id="full_name"
                      type="text"
                      value={formData.full_name || ''}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      placeholder="Nome completo do cliente"
                      className={errors.full_name ? "border-red-500" : ""}
                    />
                    {errors.full_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.full_name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="rg">RG</Label>
                      <Input
                        id="rg"
                        type="text"
                        value={formData.rg || ''}
                        onChange={(e) => handleInputChange("rg", e.target.value)}
                        placeholder="RG do cliente"
                        className={errors.rg ? "border-red-500" : ""}
                      />
                      {errors.rg && (
                        <p className="text-red-500 text-sm mt-1">{errors.rg}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="cpf">CPF</Label>
                      <Input
                        id="cpf"
                        type="text"
                        value={formData.cpf || ''}
                        onChange={(e) => handleInputChange("cpf", e.target.value)}
                        placeholder="000.000.000-00"
                        className={errors.cpf ? "border-red-500" : ""}
                      />
                      {errors.cpf && (
                        <p className="text-red-500 text-sm mt-1">{errors.cpf}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="email@exemplo.com"
                          className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(11) 99999-9999"
                          className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Building className="h-5 w-5 mr-2" />
                  Dados da Empresa
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="fantasy_name">Nome Fantasia *</Label>
                    <Input
                      id="fantasy_name"
                      type="text"
                      value={formData.fantasy_name || ''}
                      onChange={(e) => handleInputChange("fantasy_name", e.target.value)}
                      placeholder="Nome fantasia da empresa"
                      className={errors.fantasy_name ? "border-red-500" : ""}
                    />
                    {errors.fantasy_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.fantasy_name}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="corporate_name">Razão Social</Label>
                    <Input
                      id="corporate_name"
                      type="text"
                      value={formData.corporate_name || ''}
                      onChange={(e) => handleInputChange("corporate_name", e.target.value)}
                      placeholder="Razão social da empresa"
                      className={errors.corporate_name ? "border-red-500" : ""}
                    />
                    {errors.corporate_name && (
                      <p className="text-red-500 text-sm mt-1">{errors.corporate_name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cnpj">CNPJ</Label>
                      <Input
                        id="cnpj"
                        type="text"
                        value={formData.cnpj || ''}
                        onChange={(e) => handleInputChange("cnpj", e.target.value)}
                        placeholder="00.000.000/0000-00"
                        className={errors.cnpj ? "border-red-500" : ""}
                      />
                      {errors.cnpj && (
                        <p className="text-red-500 text-sm mt-1">{errors.cnpj}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="state_registration">Inscrição Estadual</Label>
                      <Input
                        id="state_registration"
                        type="text"
                        value={formData.state_registration || ''}
                        onChange={(e) => handleInputChange("state_registration", e.target.value)}
                        placeholder="Inscrição estadual"
                        className={errors.state_registration ? "border-red-500" : ""}
                      />
                      {errors.state_registration && (
                        <p className="text-red-500 text-sm mt-1">{errors.state_registration}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Informações de Contato - apenas para Pessoa Jurídica */}
            {formData.client_type === 'JURIDICA' && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium flex items-center">
                  <Mail className="h-5 w-5 mr-2" />
                  Informações de Contato
                </h3>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="name">Nome de Contato *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Nome da pessoa responsável"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          placeholder="email@exemplo.com"
                          className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="phone">Telefone *</Label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          placeholder="(11) 99999-9999"
                          className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Endereço */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Endereço
              </h3>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    type="text"
                    value={formData.address || ''}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    placeholder="Endereço completo"
                    className={errors.address ? "border-red-500" : ""}
                  />
                  {errors.address && (
                    <p className="text-red-500 text-sm mt-1">{errors.address}</p>
                  )}
                </div>

                <div className="w-1/3">
                  <Label htmlFor="zip_code">CEP</Label>
                  <Input
                    id="zip_code"
                    type="text"
                    value={formData.zip_code || ''}
                    onChange={(e) => handleInputChange("zip_code", e.target.value)}
                    placeholder="00000-000"
                    className={errors.zip_code ? "border-red-500" : ""}
                  />
                  {errors.zip_code && (
                    <p className="text-red-500 text-sm mt-1">{errors.zip_code}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              {onCancel && (
                <Button
                  type="button"
                  className="border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2 rounded-lg font-medium text-gray-700 dark:text-gray-300"
                  onClick={onCancel}
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              )}
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
              >
                {isLoading
                  ? "Salvando..."
                  : clientId
                    ? "Atualizar Cliente"
                    : "Criar Cliente"
                }
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}