"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowRight, ArrowUp, Calculator, Save, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Slider } from "./ui/slider"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

// Initial sector data
const initialSectorData = [
  { id: 1, name: "Education", allocation: 28.4, impact: 85, color: "#22c55e" },
  { id: 2, name: "Healthcare", allocation: 26.2, impact: 88, color: "#3b82f6" },
  { id: 3, name: "Infrastructure", allocation: 20.2, impact: 76, color: "#f59e0b" },
  { id: 4, name: "Public Safety", allocation: 11.5, impact: 82, color: "#ef4444" },
  { id: 5, name: "Social Services", allocation: 8.2, impact: 79, color: "#8b5cf6" },
  { id: 6, name: "Environment", allocation: 5.5, impact: 72, color: "#06b6d4" },
]

// Impact metrics
const impactMetrics = [
  { name: "Economic Growth", value: 3.2 },
  { name: "Job Creation", value: 12500 },
  { name: "Poverty Reduction", value: 2.8 },
  { name: "Public Health Index", value: 76.4 },
  { name: "Education Outcomes", value: 82.1 },
  { name: "Infrastructure Quality", value: 68.9 },
]

// Scenario presets
const scenarioPresets = [
  {
    id: 1,
    name: "Economic Growth Focus",
    description: "Prioritize sectors that drive economic development",
    allocations: {
      Education: 25.0,
      Healthcare: 20.0,
      Infrastructure: 30.0,
      "Public Safety": 10.0,
      "Social Services": 7.0,
      Environment: 8.0,
    },
  },
  {
    id: 2,
    name: "Social Welfare Priority",
    description: "Focus on healthcare, education and social services",
    allocations: {
      Education: 32.0,
      Healthcare: 30.0,
      Infrastructure: 15.0,
      "Public Safety": 8.0,
      "Social Services": 12.0,
      Environment: 3.0,
    },
  },
  {
    id: 3,
    name: "Balanced Approach",
    description: "Even distribution across all sectors",
    allocations: {
      Education: 25.0,
      Healthcare: 25.0,
      Infrastructure: 20.0,
      "Public Safety": 10.0,
      "Social Services": 10.0,
      Environment: 10.0,
    },
  },
  {
    id: 4,
    name: "Sustainability Focus",
    description: "Prioritize environmental and sustainable development",
    allocations: {
      Education: 25.0,
      Healthcare: 20.0,
      Infrastructure: 18.0,
      "Public Safety": 7.0,
      "Social Services": 10.0,
      Environment: 20.0,
    },
  },
]

// Generate projection data
const generateProjectionData = (sectorData: any[]) => {
  const baselineData = []
  const projectedData = []

  // Calculate total impact score
  const totalImpact = sectorData.reduce((sum, sector) => {
    return sum + sector.impact * (sector.allocation / 100)
  }, 0)

  // Generate 5 years of data
  const currentYear = new Date().getFullYear()

  for (let i = 0; i < 5; i++) {
    const year = currentYear + i

    // Baseline assumes 2% annual growth
    const baselineGrowth = Math.pow(1.02, i)

    // Projected growth based on impact score
    // Higher impact score = higher growth multiplier
    const impactMultiplier = totalImpact / 80 // Normalize around 80 as average
    const projectedGrowth = Math.pow(1 + 0.02 * impactMultiplier, i)

    baselineData.push({
      year,
      value: Number.parseFloat((24.5 * baselineGrowth).toFixed(1)),
    })

    projectedData.push({
      year,
      value: Number.parseFloat((24.5 * projectedGrowth).toFixed(1)),
    })
  }

  return { baselineData, projectedData }
}

export function ScenarioAnalysis() {
  const [sectorData, setSectorData] = useState(initialSectorData)
  const [impactData, setImpactData] = useState(impactMetrics)
  const [projectionData, setProjectionData] = useState<any>({})
  const [selectedScenario, setSelectedScenario] = useState<number | null>(null)
  const [showAIRecommendation, setShowAIRecommendation] = useState(false)

  // Calculate projections when sector data changes
  useEffect(() => {
    setProjectionData(generateProjectionData(sectorData))

    // Update impact metrics based on allocation changes
    const newImpactData = [...impactMetrics]

    // Education affects Education Outcomes
    const educationAllocation = sectorData.find((s) => s.name === "Education")?.allocation || 0
    if (educationAllocation) {
      const educationIndex = newImpactData.findIndex((m) => m.name === "Education Outcomes")
      if (educationIndex >= 0) {
        // Adjust education outcomes based on allocation changes
        // Higher allocation = better outcomes
        const baseValue = 75
        const multiplier = educationAllocation / 25 // 25% is baseline
        newImpactData[educationIndex].value = Number.parseFloat((baseValue + multiplier * 10).toFixed(1))
      }
    }

    // Healthcare affects Public Health Index
    const healthcareAllocation = sectorData.find((s) => s.name === "Healthcare")?.allocation || 0
    if (healthcareAllocation) {
      const healthIndex = newImpactData.findIndex((m) => m.name === "Public Health Index")
      if (healthIndex >= 0) {
        const baseValue = 70
        const multiplier = healthcareAllocation / 25 // 25% is baseline
        newImpactData[healthIndex].value = Number.parseFloat((baseValue + multiplier * 8).toFixed(1))
      }
    }

    // Infrastructure affects Economic Growth and Infrastructure Quality
    const infrastructureAllocation = sectorData.find((s) => s.name === "Infrastructure")?.allocation || 0
    if (infrastructureAllocation) {
      const economicIndex = newImpactData.findIndex((m) => m.name === "Economic Growth")
      if (economicIndex >= 0) {
        const baseValue = 2.5
        const multiplier = infrastructureAllocation / 20 // 20% is baseline
        newImpactData[economicIndex].value = Number.parseFloat((baseValue + multiplier * 1).toFixed(1))
      }

      const infraIndex = newImpactData.findIndex((m) => m.name === "Infrastructure Quality")
      if (infraIndex >= 0) {
        const baseValue = 60
        const multiplier = infrastructureAllocation / 20 // 20% is baseline
        newImpactData[infraIndex].value = Number.parseFloat((baseValue + multiplier * 10).toFixed(1))
      }
    }

    // Social Services affects Poverty Reduction
    const socialAllocation = sectorData.find((s) => s.name === "Social Services")?.allocation || 0
    if (socialAllocation) {
      const povertyIndex = newImpactData.findIndex((m) => m.name === "Poverty Reduction")
      if (povertyIndex >= 0) {
        const baseValue = 2.0
        const multiplier = socialAllocation / 8 // 8% is baseline
        newImpactData[povertyIndex].value = Number.parseFloat((baseValue + multiplier * 1).toFixed(1))
      }
    }

    // Job Creation is affected by multiple sectors
    const jobIndex = newImpactData.findIndex((m) => m.name === "Job Creation")
    if (jobIndex >= 0) {
      const educationFactor = (educationAllocation / 25) * 0.3
      const infraFactor = (infrastructureAllocation / 20) * 0.5
      const socialFactor = (socialAllocation / 8) * 0.2

      const baseValue = 10000
      const totalMultiplier = educationFactor + infraFactor + socialFactor
      newImpactData[jobIndex].value = Math.round(baseValue * totalMultiplier)
    }

    setImpactData(newImpactData)
  }, [sectorData])

  // Handle slider changes
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

    // Reset selected scenario when manual changes are made
    setSelectedScenario(null)
  }

  // Apply scenario preset
  const applyScenario = (scenarioId: number) => {
    const scenario = scenarioPresets.find((s) => s.id === scenarioId)
    if (!scenario) return

    setSectorData((prev) =>
      prev.map((sector) => ({
        ...sector,
        allocation: scenario.allocations[sector.name as keyof typeof scenario.allocations] || sector.allocation,
      })),
    )

    setSelectedScenario(scenarioId)
  }

  // Generate AI recommendation
  const generateAIRecommendation = () => {
    setShowAIRecommendation(true)

    // Simulate AI recommendation by optimizing for balanced impact
    setTimeout(() => {
      setSectorData([
        { id: 1, name: "Education", allocation: 30.5, impact: 85, color: "#22c55e" },
        { id: 2, name: "Healthcare", allocation: 28.0, impact: 88, color: "#3b82f6" },
        { id: 3, name: "Infrastructure", allocation: 18.5, impact: 76, color: "#f59e0b" },
        { id: 4, name: "Public Safety", allocation: 9.0, impact: 82, color: "#ef4444" },
        { id: 5, name: "Social Services", allocation: 9.5, impact: 79, color: "#8b5cf6" },
        { id: 6, name: "Environment", allocation: 4.5, impact: 72, color: "#06b6d4" },
      ])

      setSelectedScenario(null)
    }, 1500)
  }

  // Format data for impact comparison chart
  const impactComparisonData = sectorData.map((sector) => ({
    name: sector.name,
    allocation: sector.allocation,
    impact: sector.impact,
  }))

  return (
    <div className="grid gap-6 lg:grid-cols-7">
      <Card className="lg:col-span-4">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle>Scenario Analysis</CardTitle>
              <CardDescription>Adjust allocations to see projected outcomes</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={generateAIRecommendation}
                className={showAIRecommendation ? "bg-yellow-50" : ""}
              >
                <Sparkles className={`mr-2 h-4 w-4 ${showAIRecommendation ? "text-yellow-500" : ""}`} />
                AI Optimize
              </Button>
              <Button variant="outline" size="sm">
                <Save className="mr-2 h-4 w-4" />
                Save Scenario
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Scenario Presets</h3>
              <div className="grid grid-cols-2 gap-2">
                {scenarioPresets.map((scenario) => (
                  <Button
                    key={scenario.id}
                    variant={selectedScenario === scenario.id ? "default" : "outline"}
                    className="justify-start h-auto py-2"
                    onClick={() => applyScenario(scenario.id)}
                  >
                    <div className="text-left">
                      <div className="font-medium">{scenario.name}</div>
                      <div className="text-xs text-muted-foreground">{scenario.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Budget Allocation Adjustments</h3>
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
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4 flex-col items-start">
          <h3 className="text-sm font-medium mb-3">Projected Impact Metrics</h3>
          <div className="w-full space-y-3">
            {impactData.map((metric, index) => (
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
        </CardFooter>
      </Card>

      <Card className="lg:col-span-3">
        <CardHeader>
          <CardTitle>Outcome Projections</CardTitle>
          <CardDescription>Projected impact of current allocation strategy</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="year"
                  type="number"
                  domain={[new Date().getFullYear(), new Date().getFullYear() + 4]}
                  tickCount={5}
                />
                <YAxis label={{ value: "Budget (Millions ₹)", angle: -90, position: "insideLeft" }} />
                <Tooltip formatter={(value) => [`₹${value}M`, "Budget"]} />
                <Legend />
                {projectionData.baselineData && (
                  <Line
                    data={projectionData.baselineData}
                    type="monotone"
                    dataKey="value"
                    name="Baseline Projection"
                    stroke="#94a3b8"
                    strokeDasharray="5 5"
                  />
                )}
                {projectionData.projectedData && (
                  <Line
                    data={projectionData.projectedData}
                    type="monotone"
                    dataKey="value"
                    name="Optimized Projection"
                    stroke="#22c55e"
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-3">Allocation vs. Impact Analysis</h3>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={impactComparisonData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    label={{ value: "Allocation %", angle: -90, position: "insideLeft" }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    label={{ value: "Impact Score", angle: 90, position: "insideRight" }}
                  />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="allocation" name="Budget Allocation %" fill="#3b82f6" />
                  <Bar yAxisId="right" dataKey="impact" name="Impact Score" fill="#f59e0b" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <Calculator className="h-4 w-4" />
                  <span>ROI Analysis</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3 pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Overall ROI Multiplier:</span>
                    <span className="font-bold">1.8x</span>
                  </div>

                  <div className="space-y-2">
                    {sectorData.map((sector) => (
                      <div key={sector.id} className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: sector.color }} />
                          <span>{sector.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{((sector.impact / 100) * 2.5).toFixed(1)}x</span>
                          {sector.impact > 85 ? (
                            <ArrowUp className="h-3 w-3 text-green-500" />
                          ) : sector.impact < 75 ? (
                            <ArrowDown className="h-3 w-3 text-red-500" />
                          ) : (
                            <ArrowRight className="h-3 w-3 text-yellow-500" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  )
}
