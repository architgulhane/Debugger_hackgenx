"use client"

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "Education", value: 5.2, percentage: "28.4%" },
  { name: "Healthcare", value: 4.8, percentage: "26.2%" },
  { name: "Infrastructure", value: 3.7, percentage: "20.2%" },
  { name: "Public Safety", value: 2.1, percentage: "11.5%" },
  { name: "Social Services", value: 1.5, percentage: "8.2%" },
  { name: "Environment", value: 1.0, percentage: "5.5%" },
]

const COLORS = ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4"]

export function BudgetDistributionChart() {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percentage }) => `${name}: ${percentage}`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`₹${value}M`, "Budget"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
