"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { KpiCard } from "@/components/financials/kpi-card"
import { CashFlowChart } from "@/components/financials/cash-flow-chart"
import { TransactionsDataTable } from "@/components/financials/transactions-data-table"
import { TrendingUp, TrendingDown, DollarSign, Clock } from "lucide-react"
import { financialsAPI } from "@/services/api"

interface KpiData {
  total_income: number
  total_expense: number
  net_profit: number
  accounts_receivable: number
}

interface CashFlowData {
  month: string
  income: number
  expense: number
}

export default function FinanceiroPage() {
  const [kpiData, setKpiData] = useState<KpiData>({
    total_income: 0,
    total_expense: 0,
    net_profit: 0,
    accounts_receivable: 0,
  })
  const [cashFlowData, setCashFlowData] = useState<CashFlowData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadFinancialData = async () => {
    try {
      setIsLoading(true)
      setError(null)

      const response = await financialsAPI.financialDashboard()
      setKpiData(response.data.kpis)
      setCashFlowData(response.data.cash_flow_chart)
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error)
      setError('Erro ao carregar dados financeiros')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadFinancialData()
  }, [])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadFinancialData}
              className="text-blue-600 hover:text-blue-800"
            >
              Tentar novamente
            </button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
        <p className="text-gray-600">Visão geral da situação financeira da empresa</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Receita Total"
          value={kpiData.total_income}
          icon={TrendingUp}
          trend="up"
          isLoading={isLoading}
        />
        <KpiCard
          title="Despesas Total"
          value={kpiData.total_expense}
          icon={TrendingDown}
          trend="down"
          isLoading={isLoading}
        />
        <KpiCard
          title="Lucro Líquido"
          value={kpiData.net_profit}
          icon={DollarSign}
          trend={kpiData.net_profit >= 0 ? "up" : "down"}
          isLoading={isLoading}
        />
        <KpiCard
          title="Contas a Receber"
          value={kpiData.accounts_receivable}
          icon={Clock}
          trend="neutral"
          isLoading={isLoading}
        />
      </div>

      {/* Tabs for different views */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Cash Flow Chart */}
          <CashFlowChart data={cashFlowData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="transactions" className="space-y-6">
          {/* Transactions Table */}
          <TransactionsDataTable />
        </TabsContent>
      </Tabs>
    </div>
  )
}