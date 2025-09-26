"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { NewTransactionForm } from "./new-transaction-form"
import { useToast } from "@/hooks/use-toast"

interface NewTransactionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (data: any) => Promise<void>
}

export function NewTransactionDialog({
  open,
  onOpenChange,
  onSubmit,
}: NewTransactionDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (data: any) => {
    try {
      setIsLoading(true)
      await onSubmit(data)
      toast({
        title: "Transação criada",
        description: "A nova transação foi criada com sucesso.",
      })
    } catch (error) {
      console.error("Erro ao criar transação:", error)
      toast({
        title: "Erro ao criar transação",
        description: "Ocorreu um erro ao criar a transação. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
          <DialogDescription>
            Adicione uma nova transação financeira (Entrada ou Saída).
          </DialogDescription>
        </DialogHeader>
        <NewTransactionForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isLoading}
        />
      </DialogContent>
    </Dialog>
  )
}