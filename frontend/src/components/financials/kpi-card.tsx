"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface KpiCardProps {
  title: string
  value: number
  icon: LucideIcon
  trend?: "up" | "down" | "neutral"
  isLoading?: boolean
  className?: string
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function KpiCard({
  title,
  value,
  icon: Icon,
  trend = "neutral",
  isLoading = false,
  className
}: KpiCardProps) {
  const trendColors = {
    up: "text-green-600",
    down: "text-red-600",
    neutral: "text-gray-600"
  }

  const bgColors = {
    up: "bg-green-50",
    down: "bg-red-50",
    neutral: "bg-gray-50"
  }

  return (
    <Card className={cn("", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", bgColors[trend])}>
          <Icon className={cn("h-4 w-4", trendColors[trend])} />
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(value)}
            </div>
            <div className={cn("text-xs", trendColors[trend])}>
              {trend === "up" && "↗ Entrada"}
              {trend === "down" && "↘ Saída"}
              {trend === "neutral" && "→ Pendente"}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}