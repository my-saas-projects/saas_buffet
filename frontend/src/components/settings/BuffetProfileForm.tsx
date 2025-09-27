"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building, Mail, Phone, MapPin, FileText, Save, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { companiesAPI } from "@/services/api"

interface BuffetProfileData {
  name: string
  business_name: string
  cnpj: string
  email: string
  phone: string
  website: string
  address: string
  city: string
  state: string
  postal_code: string
}

export default function BuffetProfileForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const { toast } = useToast()

  const [formData, setFormData] = useState<BuffetProfileData>({
    name: "",
    business_name: "",
    cnpj: "",
    email: "",
    phone: "",
    website: "",
    address: "",
    city: "",
    state: "",
    postal_code: "",
  })

  // Fetch current company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        setIsFetching(true)
        const response = await companiesAPI.myCompany()

        // Ensure all fields are strings (not null)
        const cleanedData = {
          name: response.data.name || "",
          business_name: response.data.business_name || "",
          cnpj: response.data.cnpj || "",
          email: response.data.email || "",
          phone: response.data.phone || "",
          website: response.data.website || "",
          address: response.data.address || "",
          city: response.data.city || "",
          state: response.data.state || "",
          postal_code: response.data.postal_code || "",
        }

        setFormData(cleanedData)
      } catch (error: any) {
        console.error("Erro ao carregar dados da empresa:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os dados da empresa.",
          variant: "destructive",
        })
      } finally {
        setIsFetching(false)
      }
    }

    fetchCompanyData()
  }, [toast])

  const handleChange = (field: keyof BuffetProfileData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    if (!formData.name || !formData.email || !formData.phone) {
      toast({
        title: "Erro de validação",
        description: "Nome, email e telefone são campos obrigatórios.",
        variant: "destructive",
      })
      return
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Erro de validação",
        description: "Por favor, insira um email válido.",
        variant: "destructive",
      })
      return
    }

    // Validate state (if provided)
    if (formData.state && formData.state.length !== 2) {
      toast({
        title: "Erro de validação",
        description: "Estado deve conter exatamente 2 letras (ex: SP).",
        variant: "destructive",
      })
      return
    }

    try {
      setIsLoading(true)
      await companiesAPI.updateMyCompany(formData)

      toast({
        title: "Sucesso",
        description: "Dados do buffet atualizados com sucesso!",
      })
    } catch (error: any) {
      console.error("Erro ao atualizar empresa:", error)

      const errorMessage = error.response?.data?.error ||
                          error.response?.data?.detail ||
                          "Erro interno do servidor. Tente novamente."

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Carregando dados do buffet...</span>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="h-5 w-5" />
          Informações do Buffet
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                Nome do Buffet *
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Ex: Buffet Delícias"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="business_name" className="text-sm font-medium text-gray-700">
                Razão Social
              </Label>
              <Input
                id="business_name"
                type="text"
                value={formData.business_name}
                onChange={(e) => handleChange("business_name", e.target.value)}
                placeholder="Razão social da empresa"
                className="w-full"
              />
            </div>
          </div>

          {/* CNPJ and Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cnpj" className="text-sm font-medium text-gray-700">
                CNPJ
              </Label>
              <Input
                id="cnpj"
                type="text"
                value={formData.cnpj}
                onChange={(e) => handleChange("cnpj", e.target.value)}
                placeholder="00.000.000/0001-00"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-sm font-medium text-gray-700">
                Website
              </Label>
              <Input
                id="website"
                type="url"
                value={formData.website}
                onChange={(e) => handleChange("website", e.target.value)}
                placeholder="https://www.seubuffet.com.br"
                className="w-full"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Mail className="h-4 w-4" />
                Email de Contato *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="contato@seubuffet.com.br"
                className="w-full"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700 flex items-center gap-1">
                <Phone className="h-4 w-4" />
                Telefone de Contato *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="(11) 99999-9999"
                className="w-full"
                required
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Endereço
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Logradouro
                </Label>
                <Input
                  id="address"
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Rua das Flores, 123 - Centro"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="postal_code" className="text-sm font-medium text-gray-700">
                  CEP
                </Label>
                <Input
                  id="postal_code"
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => handleChange("postal_code", e.target.value)}
                  placeholder="00000-000"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                  Cidade
                </Label>
                <Input
                  id="city"
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleChange("city", e.target.value)}
                  placeholder="São Paulo"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                  Estado (UF)
                </Label>
                <Input
                  id="state"
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleChange("state", e.target.value.toUpperCase())}
                  placeholder="SP"
                  maxLength={2}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}