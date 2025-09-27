"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Building, CreditCard, Settings, ArrowLeft } from "lucide-react"
import { Header } from "@/components/layout/Header"
import BuffetProfileForm from "@/components/settings/BuffetProfileForm"
import PaymentMethods from "@/components/settings/PaymentMethods"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button
              onClick={() => window.location.href = "/"}
              variant="outline"
              size="sm"
              className="border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-3">
              <Settings className="h-8 w-8 text-orange-600" />
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Configurações
              </h1>
            </div>
          </div>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie as informações do seu buffet e métodos de pagamento
          </p>
        </div>

        <Card className="max-w-6xl mx-auto">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="profile" className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Perfil do Buffet
                </TabsTrigger>
                <TabsTrigger value="payment" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Pagamento
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Informações do Buffet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Atualize as informações do seu buffet que foram fornecidas durante o onboarding.
                  </p>
                  <BuffetProfileForm />
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Métodos de Pagamento
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Gerencie os cartões de crédito associados à sua assinatura do BuffetFlow.
                  </p>
                  <PaymentMethods />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}