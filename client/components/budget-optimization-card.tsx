"use client"

import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from "lucide-react"
import { Progress } from "../components/ui/progress"

const recommendations = [
  {
    sector: "Education",
    current: 5.2,
    recommended: 6.1,
    change: "increase",
    reason: "Underfunded relative to outcomes",
  },
  {
    sector: "Healthcare",
    current: 4.8,
    recommended: 5.3,
    change: "increase",
    reason: "Growing demand for services",
  },
  {
    sector: "Infrastructure",
    current: 3.7,
    recommended: 3.2,
    change: "decrease",
    reason: "Overallocation based on utilization",
  },
  {
    sector: "Environment",
    current: 1.0,
    recommended: 1.4,
    change: "increase",
    reason: "Critical sustainability initiatives",
  },
]

export function BudgetOptimizationCard() {
  return (
    <div className="space-y-4">
      {recommendations.map((rec) => (
        <div key={rec.sector} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{rec.sector}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                ${rec.current}M → ${rec.recommended}M
              </span>
              {rec.change === "increase" ? (
                <ArrowUpIcon className="h-4 w-4 text-green-500" />
              ) : rec.change === "decrease" ? (
                <ArrowDownIcon className="h-4 w-4 text-red-500" />
              ) : (
                <MinusIcon className="h-4 w-4 text-gray-500" />
              )}
            </div>
          </div>
          <Progress
            value={(rec.current / rec.recommended) * 100}
            className={rec.change === "increase" ? "bg-green-100" : rec.change === "decrease" ? "bg-red-100" : ""}
          />
          <p className="text-xs text-muted-foreground">{rec.reason}</p>
        </div>
      ))}
    </div>
  )
}
