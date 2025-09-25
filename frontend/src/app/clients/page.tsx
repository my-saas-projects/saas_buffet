"use client"

import { useState } from "react"
import { ClientsList } from "@/components/clients/clients-list"
import { useRouter } from "next/navigation"

interface Client {
  id: string
  name: string
  email: string
  phone: string
  created_at: string
  updated_at: string
}

export default function ClientsPage() {
  const router = useRouter()

  const handleClientSelect = (client: Client) => {
    router.push(`/clients/${client.id}`)
  }

  const handleCreateNew = () => {
    router.push('/clients/new')
  }

  return (
    <div className="container mx-auto py-6">
      <ClientsList
        onClientSelect={handleClientSelect}
        onCreateNew={handleCreateNew}
      />
    </div>
  )
}