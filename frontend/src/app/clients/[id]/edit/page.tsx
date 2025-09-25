"use client"

import { useState, useEffect } from "react"
import { ClientForm } from "@/components/clients/client-form"
import { useRouter } from "next/navigation"
import { clientsAPI } from "@/services/api"
import { Card, CardContent } from "@/components/ui/card"

interface EditClientPageProps {
  params: {
    id: string
  }
}

export default function EditClientPage({ params }: EditClientPageProps) {
  const router = useRouter()
  const [client, setClient] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadClient()
  }, [params.id])

  const loadClient = async () => {
    try {
      const response = await clientsAPI.get(params.id)
      setClient(response.data)
    } catch (error) {
      console.error('Erro ao carregar cliente:', error)
      setError('Erro ao carregar dados do cliente')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccess = () => {
    router.push('/clients')
  }

  const handleCancel = () => {
    router.back()
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="container mx-auto py-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-red-600">{error || 'Cliente não encontrado'}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <ClientForm
        clientId={params.id}
        initialData={client}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}