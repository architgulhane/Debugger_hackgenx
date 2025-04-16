"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, IndianRupee, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { Progress } from "../components/ui/progress"

export function SummaryMetrics() {
  const [totalBudget, setTotalBudget] = useState(24500000)
  const [allocatedBudget, setAllocatedBudget] = useState(18300000)
  const [transactionsCount, setTransactionsCount] = useState(1245)
  const [efficiencyScore, setEfficiencyScore] = useState(87.3)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Small random fluctuations to simulate real-time data
      setAllocatedBudget((prev) => {
        const change = Math.random() * 50000 - 25000
        return Math.min(totalBudget, Math.max(0, prev + change))
      })

      setTransactionsCount((prev) => {
        // Occasionally increment transaction count
        if (Math.random() > 0.7) {
          return prev + 1
        }
        return prev
      })

      setEfficiencyScore((prev) => {
        const change = Math.random() * 0.4 - 0.2
        return Math.min(100, Math.max(0, prev + change))
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [totalBudget])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const utilizationRate = (allocatedBudget / totalBudget) * 100

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
          <p className="text-xs text-muted-foreground">+2.5% from previous fiscal year</p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Fiscal Year Progress</span>
              <span>58%</span>
            </div>
            <Progress value={58} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Allocated Budget</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(allocatedBudget)}</div>
          <div className="flex items-center pt-1">
            <span className="text-xs text-muted-foreground mr-2">{utilizationRate.toFixed(1)}% of total budget</span>
            {utilizationRate > 75 ? (
              <ArrowUp className="h-3 w-3 text-green-500" />
            ) : (
              <ArrowDown className="h-3 w-3 text-red-500" />
            )}
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Allocation Rate</span>
              <span>{utilizationRate.toFixed(1)}%</span>
            </div>
            <Progress value={utilizationRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unallocated Funds</CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalBudget - allocatedBudget)}</div>
          <p className="text-xs text-muted-foreground">{(100 - utilizationRate).toFixed(1)}% of total budget</p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Reserve Status</span>
              <span>{100 - utilizationRate > 20 ? "Healthy" : "Low"}</span>
            </div>
            <Progress value={100 - utilizationRate} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{transactionsCount.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">+12.5% from previous month</p>
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs mb-1">
              <span>Efficiency Score</span>
              <span>{efficiencyScore.toFixed(1)}%</span>
            </div>
            <Progress
              value={efficiencyScore}
              className={`h-2 ${
                efficiencyScore > 85 ? "bg-green-100" : efficiencyScore > 70 ? "bg-yellow-100" : "bg-red-100"
              }`}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
