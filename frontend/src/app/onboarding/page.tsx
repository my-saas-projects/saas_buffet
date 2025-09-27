"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, ArrowRight, ArrowLeft, Building, Users, Calculator } from "lucide-react"
import { companiesAPI, usersAPI } from "@/services/api"

export default function OnboardingPage() {
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const totalSteps = 3

  const [formData, setFormData] = useState({
    // Dados da Empresa
    companyName: "",
    cnpj: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    
    // Configurações
    defaultProfitMargin: "30",
    maxEventsPerDay: "2",
    
    // Itens do Cardápio
    menuItems: [
      { name: "", category: "main", costPerPerson: "", description: "" }
    ]
  })

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      handleComplete()
    }
  }

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      console.log('=== COMPLETANDO ONBOARDING ===')
      console.log('Dados finais:', formData)

      // Get token from localStorage
      const token = localStorage.getItem('token')
      const savedUser = localStorage.getItem('user')

      if (!token || !savedUser) {
        console.error('Usuário não encontrado no localStorage')
        setIsLoading(false)
        return
      }

      const userData = JSON.parse(savedUser)

      // Create company data (backend expects these snake_case fields)
      const companyData = {
        name: formData.companyName,
        cnpj: formData.cnpj,
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        postal_code: formData.zipCode,
        default_profit_margin: parseFloat(formData.defaultProfitMargin),
        max_events_per_month: parseInt(formData.maxEventsPerDay),
      }

      // Create company
      const companyResponse = await companiesAPI.create(companyData)
      console.log('Empresa criada:', companyResponse.data)

      // Atualizar estado local: associar empresa criada ao usuário em localStorage
      userData.company = companyResponse.data
      userData.is_onboarded = true
      localStorage.setItem('user', JSON.stringify(userData))

      // Forçar recarga da página para atualizar o hook useAuth
      console.log('Redirecionando para dashboard...')
      window.location.href = "/"

    } catch (error: any) {
      console.error('Erro ao completar onboarding:', error)
      setIsLoading(false)
      
      // Mostrar erro específico para o usuário
      let errorMessage = 'Erro ao criar empresa. Verifique os dados e tente novamente.'
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error
      } else if (error.response?.data?.detail) {
        errorMessage = error.response.data.detail
      } else if (error.response?.data) {
        // Se houver erros de campo específicos
        const errors = Object.values(error.response.data).flat()
        if (errors.length > 0) {
          errorMessage = errors.join(', ')
        }
      }
      
      alert(errorMessage)
    }
  }

  const addMenuItem = () => {
    setFormData(prev => ({
      ...prev,
      menuItems: [...prev.menuItems, { name: "", category: "main", costPerPerson: "", description: "" }]
    }))
  }

  const updateMenuItem = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  const removeMenuItem = (index: number) => {
    setFormData(prev => ({
      ...prev,
      menuItems: prev.menuItems.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Configurar BuffetFlow</h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Passo {step} de {totalSteps}</span>
              <Progress value={(step / totalSteps) * 100} className="w-32" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Card className="shadow-xl">
          <CardHeader>
            <div className="flex items-center space-x-3">
              {step === 1 && <Building className="h-6 w-6 text-blue-600" />}
              {step === 2 && <Users className="h-6 w-6 text-green-600" />}
              {step === 3 && <Calculator className="h-6 w-6 text-purple-600" />}
              <div>
                <CardTitle>
                  {step === 1 && "Dados da Empresa"}
                  {step === 2 && "Configurações Operacionais"}
                  {step === 3 && "Cardápio Básico"}
                </CardTitle>
                <CardDescription>
                  {step === 1 && "Configure as informações básicas do seu buffet"}
                  {step === 2 && "Defina as configurações de operação e financeiras"}
                  {step === 3 && "Adicione os itens principais do seu cardápio"}
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Passo 1: Dados da Empresa */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nome do Buffet *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName}
                      onChange={(e) => updateFormData("companyName", e.target.value)}
                      placeholder="Buffet Delícia"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cnpj">CNPJ</Label>
                    <Input
                      id="cnpj"
                      value={formData.cnpj}
                      onChange={(e) => updateFormData("cnpj", e.target.value)}
                      placeholder="00.000.000/0001-00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefone *</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => updateFormData("phone", e.target.value)}
                      placeholder="(11) 99999-9999"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-mail *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData("email", e.target.value)}
                      placeholder="contato@buffet.com"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => updateFormData("address", e.target.value)}
                    placeholder="Rua das Flores, 123"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Cidade</Label>
                    <Input
                      id="city"
                      value={formData.city}
                      onChange={(e) => updateFormData("city", e.target.value)}
                      placeholder="São Paulo"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">Estado</Label>
                    <Select onValueChange={(value) => updateFormData("state", value)}>
                      <SelectTrigger id="state">
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AC">Acre</SelectItem>
                        <SelectItem value="AL">Alagoas</SelectItem>
                        <SelectItem value="AP">Amapá</SelectItem>
                        <SelectItem value="AM">Amazonas</SelectItem>
                        <SelectItem value="BA">Bahia</SelectItem>
                        <SelectItem value="CE">Ceará</SelectItem>
                        <SelectItem value="DF">Distrito Federal</SelectItem>
                        <SelectItem value="ES">Espírito Santo</SelectItem>
                        <SelectItem value="GO">Goiás</SelectItem>
                        <SelectItem value="MA">Maranhão</SelectItem>
                        <SelectItem value="MT">Mato Grosso</SelectItem>
                        <SelectItem value="MS">Mato Grosso do Sul</SelectItem>
                        <SelectItem value="MG">Minas Gerais</SelectItem>
                        <SelectItem value="PA">Pará</SelectItem>
                        <SelectItem value="PB">Paraíba</SelectItem>
                        <SelectItem value="PR">Paraná</SelectItem>
                        <SelectItem value="PE">Pernambuco</SelectItem>
                        <SelectItem value="PI">Piauí</SelectItem>
                        <SelectItem value="RJ">Rio de Janeiro</SelectItem>
                        <SelectItem value="RN">Rio Grande do Norte</SelectItem>
                        <SelectItem value="RS">Rio Grande do Sul</SelectItem>
                        <SelectItem value="RO">Rondônia</SelectItem>
                        <SelectItem value="RR">Roraima</SelectItem>
                        <SelectItem value="SC">Santa Catarina</SelectItem>
                        <SelectItem value="SP">São Paulo</SelectItem>
                        <SelectItem value="SE">Sergipe</SelectItem>
                        <SelectItem value="TO">Tocantins</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">CEP</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => updateFormData("zipCode", e.target.value)}
                      placeholder="00000-000"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Passo 2: Configurações Operacionais */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-medium">Configurações Financeiras</h3>
                    <div className="space-y-2">
                      <Label htmlFor="defaultProfitMargin">Margem de Lucro Padrão (%)</Label>
                      <Input
                        id="defaultProfitMargin"
                        type="number"
                        value={formData.defaultProfitMargin}
                        onChange={(e) => updateFormData("defaultProfitMargin", e.target.value)}
                        placeholder="30"
                        min="0"
                        max="100"
                      />
                      <p className="text-sm text-gray-500">
                        Esta margem será usada como sugestão nos cálculos de precificação
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-medium">Configurações Operacionais</h3>
                    <div className="space-y-2">
                    <Label htmlFor="maxEventsPerDay">Máximo de Eventos por Dia</Label>
                      <Select 
                        value={formData.maxEventsPerDay} 
                        onValueChange={(value) => updateFormData("maxEventsPerDay", value)}
                      >
                      <SelectTrigger id="maxEventsPerDay">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 evento</SelectItem>
                          <SelectItem value="2">2 eventos</SelectItem>
                          <SelectItem value="3">3 eventos</SelectItem>
                          <SelectItem value="4">4 eventos</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-gray-500">
                        Limite para evitar sobrecarga da equipe
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Dica do BuffetFlow</h4>
                  <p className="text-sm text-blue-700">
                    Você pode alterar essas configurações a qualquer momento na aba de configurações 
                    do sistema. Estes valores são apenas pontos de partida para o seu planejamento.
                  </p>
                </div>
              </div>
            )}

            {/* Passo 3: Cardápio Básico */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">Itens do Cardápio</h3>
                    <Button
                      type="button"
                      size="sm"
                      onClick={addMenuItem}
                      className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-medium"
                    >
                      + Adicionar Item
                    </Button>
                  </div>

                  {formData.menuItems.map((item, index) => (
                    <div key={index} className="border rounded-lg p-4 space-y-4">
                      <div className="flex justify-between items-start">
                        <h4 className="font-medium">Item {index + 1}</h4>
                        {formData.menuItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeMenuItem(index)}
                            className="text-red-600 hover:text-red-700"
                          >
                            Remover
                          </Button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Nome do Item</Label>
                          <Input
                            value={item.name}
                            onChange={(e) => updateMenuItem(index, "name", e.target.value)}
                            placeholder="Ex: Filé ao Molho"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Categoria</Label>
                          <Select 
                            value={item.category} 
                            onValueChange={(value) => updateMenuItem(index, "category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="appetizer">Entrada</SelectItem>
                              <SelectItem value="main">Prato Principal</SelectItem>
                              <SelectItem value="side">Acompanhamento</SelectItem>
                              <SelectItem value="dessert">Sobremesa</SelectItem>
                              <SelectItem value="beverage">Bebida</SelectItem>
                              <SelectItem value="other">Outro</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Custo por Pessoa (R$)</Label>
                          <Input
                            type="number"
                            value={item.costPerPerson}
                            onChange={(e) => updateMenuItem(index, "costPerPerson", e.target.value)}
                            placeholder="25.00"
                            step="0.01"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Descrição</Label>
                        <Textarea
                          value={item.description}
                          onChange={(e) => updateMenuItem(index, "description", e.target.value)}
                          placeholder="Descrição do item..."
                          rows={2}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Importante</h4>
                  <p className="text-sm text-green-700">
                    Você pode adicionar, editar ou remover itens do cardápio a qualquer momento 
                    na seção de cardápio do sistema. Esta é apenas uma configuração inicial para 
                    você começar a usar o BuffetFlow.
                  </p>
                </div>
              </div>
            )}

            {/* Navegação */}
            <div className="flex justify-between pt-6 border-t">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={step === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <Button
                onClick={handleNext}
                disabled={isLoading}
              >
                {step === totalSteps ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    {isLoading ? "Finalizando..." : "Concluir Configuração"}
                  </>
                ) : (
                  <>
                    Próximo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}