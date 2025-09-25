"use client"

import { useState } from "react"
import { ClientsList } from "@/components/clients/clients-list"
import { ClientDetails } from "@/components/clients/client-details"
import { useRouter } from "next/navigation"
import { Client } from "@/lib/types"

export default function ClientsPage() {
  const router = useRouter()
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client)
    setEditingClient(null)
  }

  const handleCreateNew = () => {
    router.push('/clients/new')
  }

  const handleBack = () => {
    setSelectedClient(null)
    setEditingClient(null)
  }

  const handleEdit = (client: Client) => {
    setEditingClient(client)
    setSelectedClient(null)
  }

  // If a client is selected, show the details view
  if (selectedClient) {
    return (
      <div className="container mx-auto py-6">
        <ClientDetails
          clientId={selectedClient.id.toString()}
          onBack={handleBack}
          onEdit={handleEdit}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <ClientsList
        onClientSelect={handleClientSelect}
        onCreateNew={handleCreateNew}
        editingClient={editingClient}
        onEditComplete={handleBack}
        onEdit={handleEdit}
      />
    </div>
  )
}