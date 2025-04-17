"use client"

import { useState, useEffect } from "react"
import { AlertCircle, ArrowDown, ArrowUp, Brain, Lightbulb, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"

// AI insights data
const initialInsights = [
  {
    id: 1,
    type: "alert",
    sector: "Healthcare",
    message: "Healthcare sector is underfunded by 8.2% based on current needs and outcomes.",
    severity: "high",
    action: "Increase allocation",
  },
  {
    id: 2,
    type: "optimization",
    sector: "Education",
    message: "Increasing education budget by 5% could improve literacy rates by an estimated 3.7%.",
    severity: "medium",
    action: "Consider reallocation",
  },
  {
    id: 3,
    type: "efficiency",
    sector: "Infrastructure",
    message: "Infrastructure spending efficiency has improved by 4.3% in the last quarter.",
    severity: "low",
    action: "Monitor progress",
  },
  {
    id: 4,
    type: "alert",
    sector: "Environment",
    message: "Environmental protection is significantly underfunded relative to sustainability goals.",
    severity: "high",
    action: "Review allocation",
  },
]

export function AIInsightPanel() {
  const [insights, setInsights] = useState(initialInsights)
  const [activeInsight, setActiveInsight] = useState(0)

  // Rotate through insights
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveInsight((prev) => (prev + 1) % insights.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [insights.length])

  // Occasionally add a new insight
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newInsights = [
          {
            id: Date.now(),
            type: "alert",
            sector: "Social Services",
            message: "Recent data suggests increasing social services funding could reduce poverty rates by 2.1%.",
            severity: "medium",
            action: "Evaluate impact",
          },
          {
            id: Date.now() + 1,
            type: "optimization",
            sector: "Public Safety",
            message: "AI model suggests optimal public safety budget is 2.3% higher than current allocation.",
            severity: "medium",
            action: "Consider adjustment",
          },
          {
            id: Date.now() + 2,
            type: "efficiency",
            sector: "Healthcare",
            message: "Healthcare spending efficiency could be improved by 5.8% through targeted programs.",
            severity: "high",
            action: "Optimize allocation",
          },
        ]

        const randomInsight = newInsights[Math.floor(Math.random() * newInsights.length)]
        setInsights((prev) => {
          const updated = [...prev, randomInsight]
          if (updated.length > 6) {
            // Keep the list manageable
            return updated.slice(1)
          }
          return updated
        })
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const currentInsight = insights[activeInsight]

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle>AI Insights</CardTitle>
          <Brain className="h-5 w-5 text-primary" />
        </div>
        <CardDescription>Real-time recommendations from our AI engine</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative overflow-hidden rounded-lg border p-4 min-h-[180px]">
          <div className="absolute top-2 right-2">
            <Badge
              variant="outline"
              className={
                currentInsight.severity === "high"
                  ? "bg-red-100 text-red-800 hover:bg-red-100"
                  : currentInsight.severity === "medium"
                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                    : "bg-green-100 text-green-800 hover:bg-green-100"
              }
            >
              {currentInsight.severity === "high" ? (
                <AlertCircle className="h-3 w-3 mr-1" />
              ) : currentInsight.severity === "medium" ? (
                <Lightbulb className="h-3 w-3 mr-1" />
              ) : (
                <Sparkles className="h-3 w-3 mr-1" />
              )}
              {currentInsight.severity}
            </Badge>
          </div>

          <div className="flex items-start gap-3 mb-3">
            {currentInsight.type === "alert" ? (
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            ) : currentInsight.type === "optimization" ? (
              <Sparkles className="h-5 w-5 text-blue-500 mt-0.5" />
            ) : (
              <Lightbulb className="h-5 w-5 text-yellow-500 mt-0.5" />
            )}
            <div>
              <h4 className="font-medium text-sm">
                {currentInsight.sector}{" "}
                <span className="text-muted-foreground font-normal">
                  {currentInsight.type === "alert"
                    ? "Alert"
                    : currentInsight.type === "optimization"
                      ? "Optimization"
                      : "Efficiency"}
                </span>
              </h4>
              <p className="mt-1">{currentInsight.message}</p>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-1 text-sm">
              {currentInsight.type === "alert" ? (
                <ArrowUp className="h-4 w-4 text-red-500" />
              ) : currentInsight.type === "optimization" ? (
                <ArrowUp className="h-4 w-4 text-blue-500" />
              ) : (
                <ArrowDown className="h-4 w-4 text-green-500" />
              )}
              <span className="text-muted-foreground">Recommended action: {currentInsight.action}</span>
            </div>
            <Button variant="outline" size="sm">
              Details
            </Button>
          </div>
        </div>

        <div className="flex justify-center gap-1 pt-2">
          {insights.map((_, index) => (
            <Button
              key={index}
              variant="ghost"
              size="icon"
              className={`w-2 h-2 rounded-full p-0 ${index === activeInsight ? "bg-primary" : "bg-muted"}`}
              onClick={() => setActiveInsight(index)}
            >
              <span className="sr-only">View insight {index + 1}</span>
            </Button>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button variant="outline" className="w-full">
          <Brain className="mr-2 h-4 w-4" />
          View All AI Insights
        </Button>
      </CardFooter>
    </Card>
  )
}
