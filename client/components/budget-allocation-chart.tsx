"use client"

import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const data = [
  {
    name: "Education",
    current: 5.2,
    optimal: 6.1,
  },
  {
    name: "Healthcare",
    current: 4.8,
    optimal: 5.3,
  },
  {
    name: "Infrastructure",
    current: 3.7,
    optimal: 3.2,
  },
  {
    name: "Public Safety",
    current: 2.1,
    optimal: 1.8,
  },
  {
    name: "Social Services",
    current: 1.5,
    optimal: 1.9,
  },
  {
    name: "Environment",
    current: 1.0,
    optimal: 1.4,
  },
]

export function BudgetAllocationChart() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis label={{ value: "Budget (Millions $)", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value) => [`₹${value}M`, "Budget"]} labelFormatter={(label) => `Sector: ${label}`} />
        <Legend />
        <Bar dataKey="current" name="Current Allocation" fill="#22c55e" />
        <Bar dataKey="optimal" name="Optimal Allocation" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
