"use client"

import { useState, useEffect } from "react"
import { Check, Clock, IndianRupee } from "lucide-react"
import { Card, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

// Generate recent activity data
const generateActivityData = () => {
  const sectors = ["Education", "Healthcare", "Infrastructure", "Public Safety", "Social Services", "Environment"]
  const activities = [
    "Budget allocation updated",
    "New transaction processed",
    "AI recommendation applied",
    "Scenario analysis completed",
    "Optimization performed",
    "Budget approval",
  ]
  const users = ["Budget Officer", "Finance Director", "Department Head", "System", "Administrator"]

  const data = []
  const now = new Date()

  for (let i = 0; i < 5; i++) {
    const time = new Date(now)
    time.setMinutes(now.getMinutes() - i * Math.floor(Math.random() * 60))

    data.push({
      id: `act-${i + 1}`,
      activity: activities[Math.floor(Math.random() * activities.length)],
      sector: sectors[Math.floor(Math.random() * sectors.length)],
      user: users[Math.floor(Math.random() * users.length)],
      time: time,
      amount: Math.random() > 0.5 ? Math.floor(Math.random() * 1000000) + 100000 : null,
    })
  }

  return data
}

export function RecentActivity() {
  const [activities, setActivities] = useState(generateActivityData())

  // Occasionally add a new activity
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newActivity = generateActivityData()[0]
        setActivities((prev) => [newActivity, ...prev.slice(0, 4)])
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const formatTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)

    if (diffMins < 1) {
      return "Just now"
    } else if (diffMins < 60) {
      return `${diffMins} min ago`
    } else {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
  }

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.id} className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                <Check className="h-4 w-4" />
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{activity.activity}</p>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTime(activity.time)}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{activity.sector}</Badge>
                    <span className="text-sm text-muted-foreground">by {activity.user}</span>
                  </div>
                  {activity.amount && (
                    <div className="flex items-center text-sm font-medium">
                      <IndianRupee className="mr-1 h-3 w-3" />
                      {new Intl.NumberFormat("en-IN").format(activity.amount)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
