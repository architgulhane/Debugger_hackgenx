"use client"

import { useState, useEffect } from "react"
import { AlertCircle, ArrowDown, ArrowUp, Calendar, Download, Percent, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Progress } from "./ui/progress"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { Calendar as CalendarComponent } from "./ui/calendar"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"
import { IndianRupee } from "lucide-react"

export function OverviewSection() {
  const [totalBudget, setTotalBudget] = useState(24500000)
  const [allocatedBudget, setAllocatedBudget] = useState(18300000)
  const [efficiencyScore, setEfficiencyScore] = useState(87.3)
  const [utilizationRate, setUtilizationRate] = useState(74.7)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [showAlert, setShowAlert] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setAllocatedBudget((prev) => {
        const change = Math.random() * 50000 - 25000
        return Math.min(totalBudget, Math.max(0, prev + change))
      })

      setEfficiencyScore((prev) => {
        const change = Math.random() * 0.4 - 0.2
        return Math.min(100, Math.max(0, prev + change))
      })

      setUtilizationRate((prev) => {
        const newRate = (allocatedBudget / totalBudget) * 100
        return Number.parseFloat(newRate.toFixed(1))
      })

      if (0) {
        setShowAlert(true)
        setTimeout(() => setShowAlert(false), 5000)
      }
    }, 3000)

    return () => clearInterval(interval)
  }, [allocatedBudget, totalBudget])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budget Dashboard</h1>
          <p className="text-muted-foreground">Real-time overview of public budget allocation and performance</p>
        </div>
        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
                <Calendar className="mr-2 h-4 w-4" />
                {date ? date.toLocaleDateString() : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {showAlert && (
        <Alert variant="destructive" className="animate-pulse">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Anomaly Detected</AlertTitle>
          <AlertDescription>
            Unusual spending pattern detected in Healthcare sector. Review recommended.
          </AlertDescription>
        </Alert>
      )}

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
            <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{efficiencyScore.toFixed(1)}%</div>
            <div className="flex items-center pt-1">
              <span className="text-xs text-muted-foreground mr-2">+5.1% from previous allocation</span>
              <TrendingUp className="h-3 w-3 text-green-500" />
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span>Performance Rating</span>
                <span>{efficiencyScore > 85 ? "Excellent" : efficiencyScore > 70 ? "Good" : "Needs Improvement"}</span>
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
    </div>
  )
}
