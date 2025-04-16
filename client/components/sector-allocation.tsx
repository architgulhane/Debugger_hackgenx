"use client"

import { useState } from "react"
import { ArrowDown, ArrowUp, Download, FileText, HelpCircle, Lightbulb, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"
import { Badge } from "./ui/badge"
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

const initialSectorData = [
  { id: 1, name: "Education", allocation: 28.4, optimal: 33.3, color: "#22c55e" },
  { id: 2, name: "Healthcare", allocation: 26.2, optimal: 29.0, color: "#3b82f6" },
  { id: 3, name: "Infrastructure", allocation: 20.2, optimal: 17.5, color: "#f59e0b" },
  { id: 4, name: "Public Safety", allocation: 11.5, optimal: 9.8, color: "#ef4444" },
  { id: 5, name: "Social Services", allocation: 8.2, optimal: 10.4, color: "#8b5cf6" },
  { id: 6, name: "Environment", allocation: 5.5, optimal: 7.6, color: "#06b6d4" },
]

const historicalData = [
  {
    year: "2020",
    Education: 25.1,
    Healthcare: 24.5,
    Infrastructure: 22.3,
    "Public Safety": 12.8,
    "Social Services": 7.9,
    Environment: 4.2,
  },
  {
    year: "2021",
    Education: 26.3,
    Healthcare: 25.1,
    Infrastructure: 21.5,
    "Public Safety": 12.2,
    "Social Services": 8.0,
    Environment: 4.8,
  },
  {
    year: "2022",
    Education: 27.5,
    Healthcare: 25.8,
    Infrastructure: 20.8,
    "Public Safety": 11.8,
    "Social Services": 8.1,
    Environment: 5.2,
  },
  {
    year: "2023",
    Education: 28.4,
    Healthcare: 26.2,
    Infrastructure: 20.2,
    "Public Safety": 11.5,
    "Social Services": 8.2,
    Environment: 5.5,
  },
]

export function SectorAllocation() {
  const [sectorData, setSectorData] = useState(initialSectorData)
  const [showRecommendations, setShowRecommendations] = useState(false)
  const [optimizationScore, setOptimizationScore] = useState(85)

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
            const increaseFactor = (totalOtherAllocation - difference) / totalOtherAllocation
            return {
              ...sector,
              allocation: sector.allocation * increaseFactor,
            }
          }
        })
      })
    }
    updateOptimizationScore()
  }

  const updateOptimizationScore = () => {
    let totalDeviation = 0
    sectorData.forEach((sector) => {
      totalDeviation += Math.abs(sector.allocation - sector.optimal)
    })

    const newScore = Math.max(60, 100 - totalDeviation * 2)
    setOptimizationScore(Number.parseFloat(newScore.toFixed(1)))
  }

  const applyRecommendations = () => {
    setSectorData((prev) =>
      prev.map((sector) => ({
        ...sector,
        allocation: sector.allocation + (sector.optimal - sector.allocation) * 0.5,
      })),
    )
    setShowRecommendations(false)
    updateOptimizationScore()
  }

  const pieChartData = sectorData.map((sector) => ({
    name: sector.name,
    value: sector.allocation,
    color: sector.color,
  }))

  const comparisonData = sectorData.map((sector) => ({
    name: sector.name,
    current: sector.allocation,
    optimal: sector.optimal,
  }))

  return (
    <div className="grid gap-6 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Budget Allocation by Sector</CardTitle>
              <CardDescription>Adjust sliders to reallocate budget across sectors</CardDescription>
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
            {sectorData.map((sector) => (
              <div key={sector.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: sector.color }} />
                    <span className="font-medium">{sector.name}</span>

                    {showRecommendations && Math.abs(sector.allocation - sector.optimal) > 1 && (
                      <Badge
                        variant="outline"
                        className={`ml-2   > 1 && (
                      <Badge 
                        variant="outline" 
                        className={\`ml-2 ${
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

          {showRecommendations && (
            <div className="mt-6 p-4 border rounded-lg bg-muted/50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">AI Recommendation</p>
                  <p className="text-sm text-muted-foreground">
                    Optimize budget allocation based on historical performance and current needs
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
                  label={({ name, value }) => `${name}: ${value.toFixed(1)}%`}
                  labelLine={false}
                >
                  {pieChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(value: number) => [`₹${value.toFixed(1)}M`, "Allocation"]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3 flex items-center">
              <span>Current vs. Optimal Allocation</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                      <HelpCircle className="h-3 w-3" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs">
                      Optimal allocations are calculated based on historical performance, public needs, and economic
                      indicators.
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
                  <RechartsTooltip />
                  <Bar dataKey="current" name="Current" fill="#22c55e" />
                  <Bar dataKey="optimal" name="Optimal" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
