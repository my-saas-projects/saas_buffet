"use client"

import { ClientForm } from "@/components/clients/client-form"
import { useRouter } from "next/navigation"

export default function NewClientPage() {
  const router = useRouter()

  const handleSuccess = () => {
    router.push('/clients')
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <div className="container mx-auto py-6">
      <ClientForm
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  )
}