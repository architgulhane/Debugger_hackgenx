"use client"

import { useState } from "react"
import { ArrowDown, ArrowRight, ArrowUp, Brain, Check, Download, Loader2, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Slider } from "../components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"
import { Badge } from "../components/ui/badge"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

// Initial sector data
const initialSectorData = [
  { id: 1, name: "Education", allocation: 28.4, optimal: 33.3, impact: 85, color: "#22c55e" },
  { id: 2, name: "Healthcare", allocation: 26.2, optimal: 29.0, impact: 88, color: "#3b82f6" },
  { id: 3, name: "Infrastructure", allocation: 20.2, optimal: 17.5, impact: 76, color: "#f59e0b" },
  { id: 4, name: "Public Safety", allocation: 11.5, optimal: 9.8, impact: 82, color: "#ef4444" },
  { id: 5, name: "Social Services", allocation: 8.2, optimal: 10.4, impact: 79, color: "#8b5cf6" },
  { id: 6, name: "Environment", allocation: 5.5, optimal: 7.6, impact: 72, color: "#06b6d4" },
]

// Impact metrics
const initialImpactMetrics = [
  { name: "Economic Growth", value: 3.2, optimal: 4.1 },
  { name: "Job Creation", value: 12500, optimal: 15200 },
  { name: "Poverty Reduction", value: 2.8, optimal: 3.5 },
  { name: "Public Health Index", value: 76.4, optimal: 82.7 },
  { name: "Education Outcomes", value: 82.1, optimal: 87.5 },
  { name: "Infrastructure Quality", value: 68.9, optimal: 74.2 },
]

export function AIOptimizationEngine() {
  const [sectorData, setSectorData] = useState(initialSectorData)
  const [impactMetrics, setImpactMetrics] = useState(initialImpactMetrics)
  const [optimizationScore, setOptimizationScore] = useState(78)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [isOptimized, setIsOptimized] = useState(false)
  const [activeTab, setActiveTab] = useState("input")

  // Calculate total allocation to ensure it stays at 100%
  const totalAllocation = sectorData.reduce((sum, sector) => sum + sector.allocation, 0)

  // Function to handle slider changes
  const handleAllocationChange = (id: number, newValue: number[]) => {
    const value = newValue[0]

    // Calculate the difference from the current value
    const currentSector = sectorData.find((s) => s.id === id)
    if (!currentSector) return

    const difference = value - currentSector.allocation

    // If increasing allocation, decrease others proportionally
    if (difference > 0) {
      setSectorData((prev) => {
        const otherSectors = prev.filter((s) => s.id !== id)
        const totalOtherAllocation = otherSectors.reduce((sum, s) => sum + s.allocation, 0)

        return prev.map((sector) => {
          if (sector.id === id) {
            return { ...sector, allocation: value }
          } else {
            // Proportionally decrease other sectors
            const decreaseFactor = (totalOtherAllocation - difference) / totalOtherAllocation
            return {
              ...sector,
              allocation: Math.max(0.5, sector.allocation * decreaseFactor),
            }
          }
        })
      })
    }
    // If decreasing allocation, increase others proportionally
    else if (difference < 0) {
      setSectorData((prev) => {
        const otherSectors = prev.filter((s) => s.id !== id)
        const totalOtherAllocation = otherSectors.reduce((sum, s) => sum + s.allocation, 0)

        return prev.map((sector) => {
          if (sector.id === id) {
            return { ...sector, allocation: value }
          } else {
            // Proportionally increase other sectors
            const increaseFactor = (totalOtherAllocation - difference) / totalOtherAllocation
            return {
              ...sector,
              allocation: sector.allocation * increaseFactor,
            }
          }
        })
      })
    }

    // Reset optimization state
    setIsOptimized(false)

    // Update optimization score based on how close allocations are to optimal
    updateOptimizationScore()
  }

  // Calculate optimization score based on how close allocations are to optimal
  const updateOptimizationScore = () => {
    let totalDeviation = 0
    sectorData.forEach((sector) => {
      totalDeviation += Math.abs(sector.allocation - sector.optimal)
    })

    // Convert deviation to a score (lower deviation = higher score)
    const newScore = Math.max(60, 100 - totalDeviation * 2)
    setOptimizationScore(Number.parseFloat(newScore.toFixed(1)))
  }

  // Run AI optimization
  const runOptimization = () => {
    setIsOptimizing(true)
    setActiveTab("output")

    // Simulate AI processing time
    setTimeout(() => {
      // Gradually move allocations toward optimal values
      setSectorData((prev) =>
        prev.map((sector) => ({
          ...sector,
          allocation: sector.optimal,
        })),
      )

      // Update impact metrics to optimal values
      setImpactMetrics((prev) =>
        prev.map((metric) => ({
          ...metric,
          value: metric.optimal,
        })),
      )

      setOptimizationScore(98.5)
      setIsOptimizing(false)
      setIsOptimized(true)
    }, 3000)
  }

  // Apply optimized allocations
  const applyOptimization = () => {
    // In a real application, this would send the optimized allocations to the backend
    // For now, we'll just show a success message
    setActiveTab("comparison")
  }

  // Format data for pie chart
  const pieChartData = sectorData.map((sector) => ({
    name: sector.name,
    value: sector.allocation,
    color: sector.color,
  }))

  // Format data for comparison chart
  const comparisonData = sectorData.map((sector) => ({
    name: sector.name,
    current: sector.allocation,
    optimal: sector.optimal,
  }))

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="input">Input Data</TabsTrigger>
          <TabsTrigger value="output">AI Output</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
        </TabsList>

        <TabsContent value="input" className="mt-6 space-y-6">
          <div className="grid gap-6 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Current Budget Allocation</CardTitle>
                <CardDescription>Adjust sliders to set your current budget allocation across sectors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6">
                  {sectorData.map((sector) => (
                    <div key={sector.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                          <span className="font-medium">{sector.name}</span>
                        </div>
                        <span className="font-bold text-sm">{sector.allocation.toFixed(1)}%</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <Slider
                          value={[sector.allocation]}
                          min={0.5}
                          max={50}
                          step={0.1}
                          onValueChange={(value) => handleAllocationChange(sector.id, value)}
                          className="flex-1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Current Score:</span>
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
                  <Button onClick={runOptimization}>
                    <Brain className="mr-2 h-4 w-4" />
                    Run AI Optimization
                  </Button>
                </div>
              </CardFooter>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Current Distribution</CardTitle>
                <CardDescription>Visual breakdown of your budget allocation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                        labelLine={false}
                      >
                        {pieChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => [`${value.toFixed(1)}%`, "Allocation"]} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Current Impact Metrics</h3>
                  <div className="space-y-3">
                    {impactMetrics.map((metric, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{metric.name}</span>
                          <div className="flex items-center">
                            <span className="font-medium">
                              {typeof metric.value === "number" && metric.value > 1000
                                ? metric.value.toLocaleString()
                                : metric.value}
                            </span>
                            {metric.name === "Economic Growth" && <span className="ml-1">%</span>}
                          </div>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${
                                metric.name === "Economic Growth"
                                  ? (metric.value / 5) * 100
                                  : metric.name === "Job Creation"
                                    ? (metric.value / 20000) * 100
                                    : metric.name === "Poverty Reduction"
                                      ? (metric.value / 5) * 100
                                      : (metric.value / 100) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="output" className="mt-6 space-y-6">
          {isOptimizing ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <h3 className="text-xl font-medium mb-2">AI Optimization in Progress</h3>
                <p className="text-muted-foreground mb-6 text-center max-w-md">
                  Our AI is analyzing historical data, current needs, and impact metrics to determine the optimal budget
                  allocation.
                </p>
                <Progress value={65} className="w-full max-w-md h-2" />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 lg:grid-cols-7">
              <Card className="lg:col-span-4">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>AI Optimized Allocation</CardTitle>
                      <CardDescription>Recommended budget distribution based on AI analysis</CardDescription>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-100 text-green-800 hover:bg-green-100 flex items-center gap-1"
                    >
                      <Sparkles className="h-3 w-3" />
                      Optimized
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-6">
                    {sectorData.map((sector) => (
                      <div key={sector.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                            <span className="font-medium">{sector.name}</span>

                            {Math.abs(sector.allocation - sector.optimal) > 0.1 && (
                              <Badge
                                variant="outline"
                                className={`ml-2 ${
                                  sector.allocation < sector.optimal
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-red-100 text-red-800 hover:bg-red-100"
                                }`}
                              >
                                {sector.allocation < sector.optimal ? (
                                  <div className="flex items-center">
                                    <ArrowUp className="h-3 w-3 mr-1" />
                                    <span>Increase by {(sector.optimal - sector.allocation).toFixed(1)}%</span>
                                  </div>
                                ) : (
                                  <div className="flex items-center">
                                    <ArrowDown className="h-3 w-3 mr-1" />
                                    <span>Decrease by {(sector.allocation - sector.optimal).toFixed(1)}%</span>
                                  </div>
                                )}
                              </Badge>
                            )}
                          </div>
                          <span className="font-bold text-sm">{sector.allocation.toFixed(1)}%</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <Progress
                            value={sector.allocation}
                            max={50}
                            className={`h-2 ${
                              Math.abs(sector.allocation - sector.optimal) < 0.5
                                ? "bg-green-100"
                                : Math.abs(sector.allocation - sector.optimal) < 2
                                  ? "bg-yellow-100"
                                  : "bg-red-100"
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {isOptimized && (
                    <Alert className="mt-6 bg-blue-50 border-blue-200">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                      <AlertTitle>AI Optimization Complete</AlertTitle>
                      <AlertDescription>
                        The AI has analyzed your budget and recommended an optimal allocation that maximizes impact
                        across all sectors.
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Optimization Score:</span>
                      <span className="text-sm font-bold text-green-600">{optimizationScore}%</span>
                    </div>
                    <Button onClick={applyOptimization}>
                      <Check className="mr-2 h-4 w-4" />
                      Apply Optimization
                    </Button>
                  </div>
                </CardFooter>
              </Card>

              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Optimized Impact</CardTitle>
                  <CardDescription>Projected outcomes with optimized allocation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="current" name="Current" fill="#22c55e" />
                        <Bar dataKey="optimal" name="Optimal" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Optimized Impact Metrics</h3>
                    <div className="space-y-3">
                      {impactMetrics.map((metric, index) => (
                        <div key={index} className="space-y-1">
                          <div className="flex items-center justify-between text-sm">
                            <span>{metric.name}</span>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">
                                {typeof metric.value === "number" && metric.value > 1000
                                  ? metric.value.toLocaleString()
                                  : metric.value}
                              </span>
                              {metric.name === "Economic Growth" && <span>%</span>}
                              {metric.value < metric.optimal && (
                                <div className="flex items-center text-green-600 text-xs">
                                  <ArrowUp className="h-3 w-3 mr-0.5" />
                                  <span>{(((metric.optimal - metric.value) / metric.value) * 100).toFixed(1)}%</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{
                                width: `${
                                  metric.name === "Economic Growth"
                                    ? (metric.value / 5) * 100
                                    : metric.name === "Job Creation"
                                      ? (metric.value / 20000) * 100
                                      : metric.name === "Poverty Reduction"
                                        ? (metric.value / 5) * 100
                                        : (metric.value / 100) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="comparison" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Current vs. Optimized Comparison</CardTitle>
              <CardDescription>Side-by-side comparison of current and AI-optimized budget allocations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-8 md:grid-cols-2">
                <div>
                  <h3 className="text-lg font-medium mb-4">Allocation Comparison</h3>
                  <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={comparisonData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 60, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="name" type="category" />
                        <Tooltip formatter={(value) => [`${value}%`, "Allocation"]} />
                        <Legend />
                        <Bar dataKey="current" name="Current" fill="#22c55e" />
                        <Bar dataKey="optimal" name="Optimal" fill="#3b82f6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Impact Difference</h3>
                  <div className="space-y-4">
                    {impactMetrics.map((metric, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">{metric.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-1">Current:</span>
                              <span className="font-medium">
                                {typeof metric.value === "number" && metric.value > 1000
                                  ? metric.value.toLocaleString()
                                  : metric.value}
                              </span>
                              {metric.name === "Economic Growth" && <span>%</span>}
                            </div>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <div className="flex items-center">
                              <span className="text-sm text-muted-foreground mr-1">Optimal:</span>
                              <span className="font-medium">
                                {typeof metric.optimal === "number" && metric.optimal > 1000
                                  ? metric.optimal.toLocaleString()
                                  : metric.optimal}
                              </span>
                              {metric.name === "Economic Growth" && <span>%</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full"
                              style={{
                                width: `${
                                  metric.name === "Economic Growth"
                                    ? (metric.value / 5) * 100
                                    : metric.name === "Job Creation"
                                      ? (metric.value / 20000) * 100
                                      : metric.name === "Poverty Reduction"
                                        ? (metric.value / 5) * 100
                                        : (metric.value / 100) * 100
                                }%`,
                              }}
                            />
                          </div>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500 rounded-full"
                              style={{
                                width: `${
                                  metric.name === "Economic Growth"
                                    ? (metric.optimal / 5) * 100
                                    : metric.name === "Job Creation"
                                      ? (metric.optimal / 20000) * 100
                                      : metric.name === "Poverty Reduction"
                                        ? (metric.optimal / 5) * 100
                                        : (metric.optimal / 100) * 100
                                }%`,
                              }}
                            />
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {metric.value < metric.optimal ? (
                            <div className="flex items-center text-green-600">
                              <ArrowUp className="h-3 w-3 mr-1" />
                              <span>
                                Potential improvement: +
                                {(((metric.optimal - metric.value) / metric.value) * 100).toFixed(1)}%
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center text-red-600">
                              <ArrowDown className="h-3 w-3 mr-1" />
                              <span>
                                Potential decrease:{" "}
                                {(((metric.value - metric.optimal) / metric.value) * 100).toFixed(1)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-between">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Comparison
              </Button>
              <Button>
                <Check className="mr-2 h-4 w-4" />
                Implement Optimized Budget
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
