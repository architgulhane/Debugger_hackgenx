"use client"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

const performanceData = [
  {
    name: "Education",
    budget: 5.2,
    performance: 87,
    roi: 1.67,
  },
  {
    name: "Healthcare",
    budget: 4.8,
    performance: 92,
    roi: 1.92,
  },
  {
    name: "Infrastructure",
    budget: 3.7,
    performance: 78,
    roi: 1.43,
  },
  {
    name: "Public Safety",
    budget: 2.1,
    performance: 85,
    roi: 1.62,
  },
  {
    name: "Social Services",
    budget: 1.5,
    performance: 81,
    roi: 1.35,
  },
  {
    name: "Environment",
    budget: 1.0,
    performance: 76,
    roi: 1.52,
  },
]

export function SectorPerformanceMetrics() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-medium mb-4">Performance Score by Sector</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "Performance Score", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="performance" name="Performance Score">
              {performanceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.performance >= 90 ? "#22c55e" : entry.performance >= 80 ? "#3b82f6" : "#f59e0b"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4">Return on Investment (ROI) by Sector</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis label={{ value: "ROI Multiplier", angle: -90, position: "insideLeft" }} />
            <Tooltip />
            <Bar dataKey="roi" name="ROI Multiplier" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
