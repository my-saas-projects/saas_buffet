"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CashFlowData {
  month: string
  income: number
  expense: number
}

interface CashFlowChartProps {
  data: CashFlowData[]
  isLoading?: boolean
}

const formatCurrencyForAxis = (value: number) => {
  if (value >= 1000000) {
    return `R$${(value / 1000000).toFixed(1)}M`
  }
  if (value >= 1000) {
    return `R$${(value / 1000).toFixed(0)}k`
  }
  return `R$${value}`
}

const formatCurrencyTooltip = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

export function CashFlowChart({ data, isLoading = false }: CashFlowChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Fluxo de Caixa (Últimos 12 Meses)</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-gray-500">Carregando gráfico...</div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickFormatter={(value) => {
                  const [year, month] = value.split('-')
                  const monthNames = [
                    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
                  ]
                  return monthNames[parseInt(month) - 1]
                }}
              />
              <YAxis tickFormatter={formatCurrencyForAxis} />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrencyTooltip(value),
                  name === 'income' ? 'Entradas' : 'Saídas'
                ]}
                labelFormatter={(label) => {
                  const [year, month] = label.split('-')
                  const monthNames = [
                    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
                  ]
                  return `${monthNames[parseInt(month) - 1]} ${year}`
                }}
              />
              <Legend
                formatter={(value) => value === 'income' ? 'Entradas' : 'Saídas'}
              />
              <Bar dataKey="income" fill="#22c55e" name="income" />
              <Bar dataKey="expense" fill="#ef4444" name="expense" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}