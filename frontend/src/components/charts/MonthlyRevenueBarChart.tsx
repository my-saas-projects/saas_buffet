"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MonthlyRevenueBarChartProps {
  data: { month: string; revenue: number }[];
}

const formatCurrencyForAxis = (value: number) => {
    if (value >= 1000) {
        return `R$${(value / 1000).toFixed(0)}k`;
    }
    return `R$${value}`;
};

export function MonthlyRevenueBarChart({ data }: MonthlyRevenueBarChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Faturamento Mensal (Últimos 6 Meses)</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={formatCurrencyForAxis} />
            <Tooltip formatter={(value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)} />
            <Legend formatter={() => "Faturamento"} />
            <Bar dataKey="revenue" fill="#ea580c" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
