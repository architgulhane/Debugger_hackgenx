"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, HelpCircle, Lightbulb, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Badge } from "./ui/badge"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import LoadingScreen from "./loading"

interface MinistryData {
  id: string
  name: string
  currentAllocation: number
  optimalAllocation: number
  color: string
  predictedBudget: number
  reason: string
  devIndex: number
  gdpImpact: number
  prevBudget: number
  priorityLevel: string
  projectsCount: number
  regionImpact: string
}

interface HistoricalData {
  year: string
  [key: string]: number | string
}

export function SectorAllocation() {
  const [ministryData, setMinistryData] = useState<MinistryData[]>([])
  const [historicalData, setHistoricalData] = useState<HistoricalData[]>([])
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [optimizationScore, setOptimizationScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const ministryColors = [
    "#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4",
    "#ec4899", "#14b8a6", "#f97316", "#6366f1"
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5001/get-all-data")
        if (!response.ok) {
          throw new Error("Failed to fetch data")
        }
        const data = await response.json()
        const predictions = data.predictions
        const ministries: MinistryData[] = []
        let idCounter = 1

        for (const key in predictions) {
          const pred = predictions[key]
          const input = pred.input
          
          ministries.push({
            id: key,
            name: getMinistryName(input.Ministry),
            currentAllocation: input["Prev_Budget (Cr)"],
            optimalAllocation: pred.Predicted_Allocated_Budget,
            color: ministryColors[(idCounter - 1) % ministryColors.length],
            predictedBudget: pred.Predicted_Allocated_Budget,
            reason: pred.Reason,
            devIndex: input.Dev_Index,
            gdpImpact: input["GDP_Impact (%)"],
            prevBudget: input["Prev_Budget (Cr)"],
            priorityLevel: input.Priority_Level,
            projectsCount: input.Projects_Count,
            regionImpact: input.Region_Impact
          })
          idCounter++
        }

        const totalCurrent = ministries.reduce((sum, m) => sum + m.currentAllocation, 0)
        const totalOptimal = ministries.reduce((sum, m) => sum + m.optimalAllocation, 0)

        const normalizedMinistries = ministries.map(m => ({
          ...m,
          currentAllocation: (m.currentAllocation / totalCurrent) * 100,
          optimalAllocation: (m.optimalAllocation / totalOptimal) * 100
        }))

        setMinistryData(normalizedMinistries)
        setHistoricalData(generateHistoricalData(normalizedMinistries))
        calculateOptimizationScore(normalizedMinistries)
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        setLoading(false)
      }
    }

    fetchData()
  },[])

  const getMinistryName = (code: string): string => {
    const ministries: {[key: string]: string} = {
      "1": "Education",
      "2": "Healthcare",
      "3": "Infrastructure",
      "4": "Public Safety",
      "5": "Social Services",
      "6": "Environment",
      "7": "Defense",
      "8": "Agriculture",
      "9": "Transportation",
      "10": "Energy"
    }
    return ministries[code] || `Ministry ${code}`
  }

  const generateHistoricalData = (ministries: MinistryData[]): HistoricalData[] => {
    const years = ["2020", "2021", "2022", "2023"]
    return years.map((year, i) => {
      const yearData: HistoricalData = { year }
      ministries.forEach(m => {
        const progress = i / (years.length - 1)
        yearData[m.name] = m.currentAllocation + (m.optimalAllocation - m.currentAllocation) * progress * 0.7
      })
      return yearData
    })
  }

  const calculateOptimizationScore = (data: MinistryData[]) => {
    let totalDeviation = 0
    data.forEach(ministry => {
      totalDeviation += Math.abs(ministry.currentAllocation - ministry.optimalAllocation)
    })
    const newScore = Math.max(0, 100 - totalDeviation * 2)
    setOptimizationScore(Number.parseFloat(newScore.toFixed(1)))
  }

  const handleAllocationChange = (id: string, newValue: number[]) => {
    const value = newValue[0]

    setMinistryData(prev => {
      const currentMinistry = prev.find(m => m.id === id)
      if (!currentMinistry) return prev

      const difference = value - currentMinistry.currentAllocation
      const otherMinistries = prev.filter(m => m.id !== id)
      const totalOtherAllocation = otherMinistries.reduce((sum, m) => sum + m.currentAllocation, 0)

      return prev.map(ministry => {
        if (ministry.id === id) {
          return { ...ministry, currentAllocation: value }
        } else {
          const adjustment = totalOtherAllocation > 0 
            ? (totalOtherAllocation - difference) / totalOtherAllocation
            : 1
          return {
            ...ministry,
            currentAllocation: Math.max(0.1, ministry.currentAllocation * adjustment)
          }
        }
      })
    })
  }

  const applyRecommendations = () => {
    setMinistryData(prev =>
      prev.map(ministry => ({
        ...ministry,
        currentAllocation: ministry.currentAllocation + 
          (ministry.optimalAllocation - ministry.currentAllocation) * 0.5
      })))
    setShowRecommendations(false)
  }

  const pieChartData = ministryData.map(ministry => ({
    name: ministry.name,
    value: ministry.currentAllocation,
    color: ministry.color
  }))

  const comparisonData = ministryData.map(ministry => ({
    name: ministry.name,
    current: ministry.currentAllocation,
    optimal: ministry.optimalAllocation
  }))

  if (loading) {
    return <LoadingScreen/>
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">Error: {error}</div>
  }

  if (ministryData.length === 0) {
    return <div className="p-8 text-center">No budget data available</div>
  }

  return (
    <div className="grid gap-6 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Budget Allocation by Ministry</CardTitle>
              <CardDescription>Adjust sliders to reallocate budget across ministries</CardDescription>
            </div>
            <div className="flex gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" onClick={() => setShowRecommendations(!showRecommendations)}>
                      <Lightbulb className={`h-4 w-4 ${showRecommendations ? "text-yellow-500" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Show AI recommendations</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            {ministryData.map(ministry => (
              <div key={ministry.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ministry.color }} />
                    <span className="font-medium">{ministry.name}</span>

                    {showRecommendations && Math.abs(ministry.currentAllocation - ministry.optimalAllocation) > 1 && (
                      <Badge
                        variant="outline"
                        className={`ml-2 ${
                          ministry.currentAllocation < ministry.optimalAllocation
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : "bg-red-100 text-red-800 hover:bg-red-100"
                        }`}
                      >
                        {ministry.currentAllocation < ministry.optimalAllocation ? (
                          <div className="flex items-center">
                            <ArrowUp className="h-3 w-3 mr-1" />
                            <span>
                              Increase by {(ministry.optimalAllocation - ministry.currentAllocation).toFixed(1)}%
                            </span>
                          </div>
                        ) : (
                          <div className="flex items-center">
                            <ArrowDown className="h-3 w-3 mr-1" />
                            <span>
                              Decrease by {(ministry.currentAllocation - ministry.optimalAllocation).toFixed(1)}%
                            </span>
                          </div>
                        )}
                      </Badge>
                    )}
                  </div>
                  <span className="font-bold text-sm">{ministry.currentAllocation.toFixed(1)}%</span>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[ministry.currentAllocation]}
                    min={0.1}
                    max={50}
                    step={0.1}
                    onValueChange={(value) => handleAllocationChange(ministry.id, value)}
                    className="flex-1"
                  />
                </div>
              </div>
            ))}
          </div>

          {showRecommendations && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">AI Recommendation</p>
                  <p className="text-sm text-muted-foreground">
                    Optimize budget allocation based on predictive analysis
                  </p>
                </div>
              </div>
              <Button onClick={applyRecommendations}>Apply</Button>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Optimization Score:</span>
              <span
                className={`text-sm font-bold ${
                  optimizationScore > 90
                    ? "text-green-600"
                    : optimizationScore > 75
                      ? "text-yellow-600"
                      : "text-red-600"
                }`}
              >
                {optimizationScore}%
              </span>
            </div>        
          </div>
        </CardFooter>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Distribution Analysis</CardTitle>
          <CardDescription>Visual breakdown of budget allocation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${Math.round(value)}%`}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(1)}%`, 
                    name
                  ]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <span>Current vs. Recommended Allocation</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                      <HelpCircle className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Recommended allocations are based on predictive analysis of ministry needs and impact.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip 
                    formatter={(value: number, name: string) => [
                      `${value.toFixed(1)}%`, 
                      name === 'current' ? 'Current' : 'Recommended'
                    ]}
                  />
                  <Bar dataKey="current" name="Current" fill="#22c55e" />
                  <Bar dataKey="optimal" name="Recommended" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}