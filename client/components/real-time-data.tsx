"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Clock, RefreshCw, Search, Zap } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Area, AreaChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Generate real-time data for the last 24 hours
const generateHourlyData = () => {
  const data = []
  const now = new Date()

  for (let i = 23; i >= 0; i--) {
    const time = new Date(now)
    time.setHours(now.getHours() - i)

    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      education: Math.floor(Math.random() * 100) + 150,
      healthcare: Math.floor(Math.random() * 80) + 120,
      infrastructure: Math.floor(Math.random() * 60) + 90,
      publicSafety: Math.floor(Math.random() * 40) + 60,
      socialServices: Math.floor(Math.random() * 30) + 40,
      environment: Math.floor(Math.random() * 20) + 30,
    })
  }

  return data
}

// Generate anomaly data
const generateAnomalyData = () => {
  return [
    {
      id: "ANM-1023",
      timestamp: "10:23 AM",
      sector: "Healthcare",
      type: "Spending Spike",
      severity: "High",
      status: "Unresolved",
    },
    {
      id: "ANM-1022",
      timestamp: "09:45 AM",
      sector: "Education",
      type: "Unusual Transaction",
      severity: "Medium",
      status: "Under Review",
    },
    {
      id: "ANM-1021",
      timestamp: "08:32 AM",
      sector: "Infrastructure",
      type: "Delayed Payment",
      severity: "Low",
      status: "Resolved",
    },
    {
      id: "ANM-1020",
      timestamp: "Yesterday, 4:15 PM",
      sector: "Public Safety",
      type: "Budget Overrun",
      severity: "Medium",
      status: "Resolved",
    },
    {
      id: "ANM-1019",
      timestamp: "Yesterday, 2:08 PM",
      sector: "Social Services",
      type: "Duplicate Payment",
      severity: "High",
      status: "Resolved",
    },
  ]
}

// Generate IoT data sources
const generateIoTData = () => {
  return [
    {
      id: "IOT-001",
      name: "Traffic Sensors",
      sector: "Infrastructure",
      status: "Online",
      lastUpdate: "2 minutes ago",
      dataPoints: "1,245",
    },
    {
      id: "IOT-002",
      name: "Hospital Occupancy",
      sector: "Healthcare",
      status: "Online",
      lastUpdate: "5 minutes ago",
      dataPoints: "876",
    },
    {
      id: "IOT-003",
      name: "School Attendance",
      sector: "Education",
      status: "Online",
      lastUpdate: "10 minutes ago",
      dataPoints: "1,532",
    },
    {
      id: "IOT-004",
      name: "Air Quality Monitors",
      sector: "Environment",
      status: "Offline",
      lastUpdate: "1 hour ago",
      dataPoints: "432",
    },
    {
      id: "IOT-005",
      name: "Emergency Response",
      sector: "Public Safety",
      status: "Online",
      lastUpdate: "3 minutes ago",
      dataPoints: "654",
    },
  ]
}

export function RealTimeData() {
  const [hourlyData, setHourlyData] = useState(generateHourlyData())
  const [anomalyData, setAnomalyData] = useState(generateAnomalyData())
  const [iotData, setIoTData] = useState(generateIoTData())
  const [selectedSector, setSelectedSector] = useState("all")
  const [refreshing, setRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Update hourly data with new data point
      setHourlyData((prev) => {
        const newData = [...prev]
        newData.shift() // Remove oldest data point

        const now = new Date()
        newData.push({
          time: now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          education: Math.floor(Math.random() * 100) + 150,
          healthcare: Math.floor(Math.random() * 80) + 120,
          infrastructure: Math.floor(Math.random() * 60) + 90,
          publicSafety: Math.floor(Math.random() * 40) + 60,
          socialServices: Math.floor(Math.random() * 30) + 40,
          environment: Math.floor(Math.random() * 20) + 30,
        })

        return newData
      })

      setLastUpdated(new Date())

      // Randomly update IoT data status
      if (Math.random() > 0.7) {
        setIoTData((prev) => {
          const newData = [...prev]
          const randomIndex = Math.floor(Math.random() * newData.length)
          newData[randomIndex] = {
            ...newData[randomIndex],
            lastUpdate: "Just now",
            dataPoints: (
              Number.parseInt(newData[randomIndex].dataPoints.replace(",", "")) + Math.floor(Math.random() * 50)
            ).toLocaleString(),
          }
          return newData
        })
      }

      // Randomly add new anomaly
      if (Math.random() > 0.9) {
        const sectors = ["Education", "Healthcare", "Infrastructure", "Public Safety", "Social Services", "Environment"]
        const types = [
          "Spending Spike",
          "Unusual Transaction",
          "Delayed Payment",
          "Budget Overrun",
          "Duplicate Payment",
        ]
        const severities = ["Low", "Medium", "High"]

        const newAnomaly = {
          id: `ANM-${1000 + Math.floor(Math.random() * 100)}`,
          timestamp: "Just now",
          sector: sectors[Math.floor(Math.random() * sectors.length)],
          type: types[Math.floor(Math.random() * types.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          status: "Unresolved",
        }

        setAnomalyData((prev) => [newAnomaly, ...prev.slice(0, 4)])
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)

    // Simulate refresh delay
    setTimeout(() => {
      setHourlyData(generateHourlyData())
      setLastUpdated(new Date())
      setRefreshing(false)
    }, 1000)
  }

  const filteredAnomalies =
    selectedSector === "all" ? anomalyData : anomalyData.filter((a) => a.sector.toLowerCase() === selectedSector)

  const filteredIoT =
    selectedSector === "all" ? iotData : iotData.filter((i) => i.sector.toLowerCase() === selectedSector)

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <span className="text-sm text-muted-foreground flex items-center">
            <Clock className="h-3 w-3 mr-1" />
            Last updated: {lastUpdated.toLocaleTimeString()}
          </span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Select value={selectedSector} onValueChange={setSelectedSector}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by sector" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="infrastructure">Infrastructure</SelectItem>
              <SelectItem value="public safety">Public Safety</SelectItem>
              <SelectItem value="social services">Social Services</SelectItem>
              <SelectItem value="environment">Environment</SelectItem>
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search data..." className="w-full sm:w-[200px] pl-8" />
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Real-Time Spending Activity</CardTitle>
            <CardDescription>Live transaction data across all sectors (last 24 hours)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}M`, "Budget"]} />
                  <Line
                    type="monotone"
                    dataKey="education"
                    stroke="#22c55e"
                    name="Education"
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="healthcare"
                    stroke="#3b82f6"
                    name="Healthcare"
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="infrastructure"
                    stroke="#f59e0b"
                    name="Infrastructure"
                    dot={false}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cumulative Budget Utilization</CardTitle>
            <CardDescription>Progressive budget consumption over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`₹${value}M`, "Budget"]} />
                  <Area
                    type="monotone"
                    dataKey="publicSafety"
                    stackId="1"
                    stroke="#ef4444"
                    fill="#ef4444"
                    name="Public Safety"
                  />
                  <Area
                    type="monotone"
                    dataKey="socialServices"
                    stackId="1"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    name="Social Services"
                  />
                  <Area
                    type="monotone"
                    dataKey="environment"
                    stackId="1"
                    stroke="#06b6d4"
                    fill="#06b6d4"
                    name="Environment"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>Unusual spending patterns and budget anomalies</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {filteredAnomalies.filter((a) => a.status === "Unresolved").length} Active
            </Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnomalies.length > 0 ? (
                  filteredAnomalies.map((anomaly) => (
                    <TableRow key={anomaly.id}>
                      <TableCell className="font-medium">{anomaly.timestamp}</TableCell>
                      <TableCell>{anomaly.sector}</TableCell>
                      <TableCell>{anomaly.type}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            anomaly.severity === "High"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : anomaly.severity === "Medium"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : "bg-green-100 text-green-800 hover:bg-green-100"
                          }
                        >
                          {anomaly.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={anomaly.status === "Resolved" ? "outline" : "default"}
                          className={
                            anomaly.status === "Unresolved"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : anomaly.status === "Under Review"
                                ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                : ""
                          }
                        >
                          {anomaly.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No anomalies detected for the selected filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>IoT Data Sources</CardTitle>
              <CardDescription>Real-time data feeds from connected devices and systems</CardDescription>
            </div>
            <Badge variant="outline" className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {filteredIoT.filter((i) => i.status === "Online").length} Active
            </Badge>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Source</TableHead>
                  <TableHead>Sector</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Data Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIoT.length > 0 ? (
                  filteredIoT.map((source) => (
                    <TableRow key={source.id}>
                      <TableCell className="font-medium">{source.name}</TableCell>
                      <TableCell>{source.sector}</TableCell>
                      <TableCell>
                        <Badge
                          variant={source.status === "Online" ? "default" : "outline"}
                          className={
                            source.status === "Online"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-red-100 text-red-800 hover:bg-red-100"
                          }
                        >
                          {source.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{source.lastUpdate}</TableCell>
                      <TableCell>{source.dataPoints}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center text-muted-foreground">
                      No IoT sources for the selected filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
