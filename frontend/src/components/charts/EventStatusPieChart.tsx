"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EVENT_STATUS_COLORS, EVENT_STATUS_LABELS, EVENT_STATUS_HEX_COLORS } from '@/lib/constants';

interface EventStatusPieChartProps {
  data: { status: string; count: number }[];
}

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent * 100 < 5) return null; // Do not render label if slice is too small

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export function EventStatusPieChart({ data }: EventStatusPieChartProps) {
  const chartData = data.map(item => ({
    name: EVENT_STATUS_LABELS[item.status as keyof typeof EVENT_STATUS_LABELS] || item.status,
    value: item.count,
    color: EVENT_STATUS_COLORS[item.status as keyof typeof EVENT_STATUS_COLORS] || '#cccccc'
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Distribuição por Status</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={EVENT_STATUS_HEX_COLORS[data[index].status as keyof typeof EVENT_STATUS_HEX_COLORS] || '#cccccc'} />
              ))}            </Pie>
            <Tooltip formatter={(value) => [value, "Eventos"]} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
