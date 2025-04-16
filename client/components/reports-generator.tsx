"use client"

import { Textarea } from "../components/ui/textarea"

import { useState } from "react"
import {
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Calendar,
  Check,
  Download,
  FileText,
  Filter,
  Printer,
  Search,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover"
import { Calendar as CalendarComponent } from "../components/ui/calendar"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"
import { Progress } from "../components/ui/progress"
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

// Generate report data
const generateReportData = () => {
  const sectors = ["Education", "Healthcare", "Infrastructure", "Public Safety", "Social Services", "Environment"]
  const reportTypes = ["Monthly Summary", "Quarterly Review", "Annual Report", "Audit Report", "Performance Analysis"]
  const statuses = ["Published", "Draft", "Archived"]

  const reports = []

  for (let i = 1; i <= 15; i++) {
    // Generate random date in the last 12 months
    const date = new Date()
    date.setMonth(date.getMonth() - Math.floor(Math.random() * 12))

    reports.push({
      id: `REP-${1000 + i}`,
      title: `${reportTypes[Math.floor(Math.random() * reportTypes.length)]} - ${sectors[Math.floor(Math.random() * sectors.length)]}`,
      date: date.toISOString().split("T")[0],
      author: ["Budget Officer", "Finance Director", "System Administrator", "Auditor"][Math.floor(Math.random() * 4)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      size: `${Math.floor(Math.random() * 10) + 1}MB`,
      downloads: Math.floor(Math.random() * 100) + 1,
      format: Math.random() > 0.5 ? "PDF" : "XLSX",
    })
  }

  return reports.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Generate anomaly data
const generateAnomalyData = () => {
  const sectors = ["Education", "Healthcare", "Infrastructure", "Public Safety", "Social Services", "Environment"]
  const anomalyTypes = [
    "Spending Spike",
    "Unusual Transaction",
    "Budget Overrun",
    "Delayed Payment",
    "Duplicate Payment",
  ]
  const severities = ["High", "Medium", "Low"]

  const anomalies = []

  for (let i = 1; i <= 10; i++) {
    // Generate random date in the last 30 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    const sector = sectors[Math.floor(Math.random() * sectors.length)]
    const type = anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)]
    const severity = severities[Math.floor(Math.random() * severities.length)]

    anomalies.push({
      id: `ANM-${1000 + i}`,
      date: date.toISOString().split("T")[0],
      sector,
      type,
      severity,
      amount: Math.floor(Math.random() * 500000) + 10000,
      status: Math.random() > 0.6 ? "Resolved" : "Under Review",
      aiDetected: Math.random() > 0.3,
      description: `${type} detected in ${sector} sector. ${severity} severity anomaly requiring review.`,
    })
  }

  return anomalies.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

// Generate AI vs Human decision data
const generateDecisionData = () => {
  const sectors = ["Education", "Healthcare", "Infrastructure", "Public Safety", "Social Services", "Environment"]
  const decisionTypes = ["Budget Allocation", "Fund Transfer", "Project Approval", "Resource Allocation"]

  const decisions = []

  for (let i = 1; i <= 12; i++) {
    // Generate random date in the last 60 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 60))

    const sector = sectors[Math.floor(Math.random() * sectors.length)]
    const type = decisionTypes[Math.floor(Math.random() * decisionTypes.length)]

    // Generate random amounts for AI and Human decisions
    const baseAmount = Math.floor(Math.random() * 1000000) + 100000
    const aiAmount = baseAmount + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 100000)
    const humanAmount = baseAmount

    decisions.push({
      id: `DEC-${1000 + i}`,
      date: date.toISOString().split("T")[0],
      sector,
      type,
      aiRecommendation: aiAmount,
      humanDecision: humanAmount,
      difference: Math.abs(aiAmount - humanAmount),
      percentDifference: (Math.abs(aiAmount - humanAmount) / humanAmount) * 100,
      reasoning: [
        "Based on historical performance data",
        "Adjusted for seasonal factors",
        "Aligned with strategic priorities",
        "Optimized for maximum impact",
      ][Math.floor(Math.random() * 4)],
      outcome: ["Implemented", "Modified", "Rejected"][Math.floor(Math.random() * 3)],
    })
  }

  return decisions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export function ReportsGenerator() {
  const [activeTab, setActiveTab] = useState("available")
  const [reports, setReports] = useState(generateReportData())
  const [anomalies, setAnomalies] = useState(generateAnomalyData())
  const [decisions, setDecisions] = useState(generateDecisionData())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFormat, setSelectedFormat] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationProgress, setGenerationProgress] = useState(0)
  const [reportGenerated, setReportGenerated] = useState(false)

  // Filter reports based on search and filters
  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.author.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesFormat = selectedFormat === "" || report.format === selectedFormat
    const matchesStatus = selectedStatus === "" || report.status === selectedStatus

    return matchesSearch && matchesFormat && matchesStatus
  })

  // Generate a new report
  const generateReport = () => {
    setIsGenerating(true)
    setGenerationProgress(0)
    setReportGenerated(false)

    const interval = setInterval(() => {
      setGenerationProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsGenerating(false)
          setReportGenerated(true)

          // Add the new report to the list
          const newReport = {
            id: `REP-${1000 + reports.length + 1}`,
            title: `Monthly Summary - All Sectors`,
            date: new Date().toISOString().split("T")[0],
            author: "System Administrator",
            status: "Published",
            size: "2.4MB",
            downloads: 0,
            format: "PDF",
          }

          setReports([newReport, ...reports])

          return 100
        }
        return newProgress
      })
    }, 300)
  }

  // Download a report
  const downloadReport = (reportId: string) => {
    // In a real app, this would trigger a download
    setReports((prev) =>
      prev.map((report) => (report.id === reportId ? { ...report, downloads: report.downloads + 1 } : report)),
    )

    alert(`Downloading report ${reportId}...`)
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="available">Available Reports</TabsTrigger>
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="ai-human">AI vs. Human</TabsTrigger>
        </TabsList>

        <TabsContent value="available" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Available Reports</CardTitle>
                  <CardDescription>Download and view generated reports</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Printer className="mr-2 h-4 w-4" />
                    Print List
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search reports..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedFormat} onValueChange={setSelectedFormat}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Formats" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Formats</SelectItem>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="XLSX">Excel</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Published">Published</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="ghost" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Title</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Format</TableHead>
                      <TableHead>Size</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredReports.length > 0 ? (
                      filteredReports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">{report.title}</TableCell>
                          <TableCell>{report.date}</TableCell>
                          <TableCell>{report.author}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{report.format}</Badge>
                          </TableCell>
                          <TableCell>{report.size}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                report.status === "Published"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : report.status === "Draft"
                                    ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                    : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              }
                            >
                              {report.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => downloadReport(report.id)}>
                              <Download className="mr-2 h-4 w-4" />
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No reports found matching your criteria.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredReports.length} of {reports.length} reports
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Previous
                </Button>
                <Button variant="outline" size="sm" disabled>
                  Next
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="generate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate New Report</CardTitle>
              <CardDescription>Create custom reports based on your requirements</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Report Type</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select report type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly Summary</SelectItem>
                        <SelectItem value="quarterly">Quarterly Review</SelectItem>
                        <SelectItem value="annual">Annual Report</SelectItem>
                        <SelectItem value="performance">Performance Analysis</SelectItem>
                        <SelectItem value="audit">Audit Report</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sector</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Sectors</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="healthcare">Healthcare</SelectItem>
                        <SelectItem value="infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="public-safety">Public Safety</SelectItem>
                        <SelectItem value="social-services">Social Services</SelectItem>
                        <SelectItem value="environment">Environment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <div className="flex gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left font-normal">
                            <Calendar className="mr-2 h-4 w-4" />
                            {date ? date.toLocaleDateString() : "Select date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent mode="single" selected={date} onSelect={setDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Format</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pdf">PDF</SelectItem>
                        <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                        <SelectItem value="csv">CSV</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Include Sections</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="executive-summary"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="executive-summary" className="text-sm">
                          Executive Summary
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="budget-allocation"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="budget-allocation" className="text-sm">
                          Budget Allocation
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="performance-metrics"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="performance-metrics" className="text-sm">
                          Performance Metrics
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="ai-recommendations"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="ai-recommendations" className="text-sm">
                          AI Recommendations
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="transaction-log" className="h-4 w-4 rounded border-gray-300" />
                        <label htmlFor="transaction-log" className="text-sm">
                          Transaction Log
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="charts-visualizations"
                          className="h-4 w-4 rounded border-gray-300"
                          defaultChecked
                        />
                        <label htmlFor="charts-visualizations" className="text-sm">
                          Charts & Visualizations
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Notes</label>
                    <Textarea placeholder="Add any specific requirements or notes for this report" />
                  </div>
                </div>
              </div>

              {isGenerating && (
                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Generating report...</span>
                    <span>{generationProgress}%</span>
                  </div>
                  <Progress value={generationProgress} className="h-2" />
                </div>
              )}

              {reportGenerated && (
                <Alert className="mt-6 bg-green-50 border-green-200">
                  <Check className="h-4 w-4 text-green-600" />
                  <AlertTitle>Report Generated Successfully</AlertTitle>
                  <AlertDescription>
                    Your report has been generated and is now available for download in the Available Reports tab.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-end">
              <Button variant="outline" className="mr-2">
                Cancel
              </Button>
              <Button onClick={generateReport} disabled={isGenerating}>
                {isGenerating ? (
                  <>Generating...</>
                ) : (
                  <>
                    <FileText className="mr-2 h-4 w-4" />
                    Generate Report
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Anomaly Detection Reports</CardTitle>
                  <CardDescription>AI-detected unusual patterns and spending anomalies</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Detection</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anomalies.map((anomaly) => (
                      <TableRow key={anomaly.id}>
                        <TableCell className="font-medium">{anomaly.id}</TableCell>
                        <TableCell>{anomaly.date}</TableCell>
                        <TableCell>{anomaly.sector}</TableCell>
                        <TableCell>{anomaly.type}</TableCell>
                        <TableCell>₹{anomaly.amount.toLocaleString()}</TableCell>
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
                              anomaly.status !== "Resolved" ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100" : ""
                            }
                          >
                            {anomaly.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={anomaly.aiDetected ? "bg-blue-100 text-blue-800 hover:bg-blue-100" : ""}
                          >
                            {anomaly.aiDetected ? "AI" : "Manual"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Anomalies by Sector</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            { name: "Education", count: anomalies.filter((a) => a.sector === "Education").length },
                            { name: "Healthcare", count: anomalies.filter((a) => a.sector === "Healthcare").length },
                            {
                              name: "Infrastructure",
                              count: anomalies.filter((a) => a.sector === "Infrastructure").length,
                            },
                            {
                              name: "Public Safety",
                              count: anomalies.filter((a) => a.sector === "Public Safety").length,
                            },
                            {
                              name: "Social Services",
                              count: anomalies.filter((a) => a.sector === "Social Services").length,
                            },
                            { name: "Environment", count: anomalies.filter((a) => a.sector === "Environment").length },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#ef4444" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Anomalies by Type</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Spending Spike",
                              count: anomalies.filter((a) => a.type === "Spending Spike").length,
                            },
                            {
                              name: "Unusual Transaction",
                              count: anomalies.filter((a) => a.type === "Unusual Transaction").length,
                            },
                            {
                              name: "Budget Overrun",
                              count: anomalies.filter((a) => a.type === "Budget Overrun").length,
                            },
                            {
                              name: "Delayed Payment",
                              count: anomalies.filter((a) => a.type === "Delayed Payment").length,
                            },
                            {
                              name: "Duplicate Payment",
                              count: anomalies.filter((a) => a.type === "Duplicate Payment").length,
                            },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="count" fill="#8b5cf6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">Anomaly Trend Analysis</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { month: "Jan", count: 5 },
                        { month: "Feb", count: 7 },
                        { month: "Mar", count: 4 },
                        { month: "Apr", count: 6 },
                        { month: "May", count: 8 },
                        { month: "Jun", count: 10 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Anomalies Detected"
                        stroke="#ef4444"
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-human" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI vs. Human Decision Logs</CardTitle>
              <CardDescription>Comparison of AI recommendations and human decisions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>AI Recommendation</TableHead>
                      <TableHead>Human Decision</TableHead>
                      <TableHead>Difference</TableHead>
                      <TableHead>Outcome</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {decisions.map((decision) => (
                      <TableRow key={decision.id}>
                        <TableCell className="font-medium">{decision.id}</TableCell>
                        <TableCell>{decision.date}</TableCell>
                        <TableCell>{decision.sector}</TableCell>
                        <TableCell>{decision.type}</TableCell>
                        <TableCell>₹{decision.aiRecommendation.toLocaleString()}</TableCell>
                        <TableCell>₹{decision.humanDecision.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            {decision.aiRecommendation > decision.humanDecision ? (
                              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                            ) : decision.aiRecommendation < decision.humanDecision ? (
                              <ArrowDown className="h-4 w-4 text-red-500 mr-1" />
                            ) : (
                              <span className="h-4 w-4 mr-1">-</span>
                            )}
                            <span>{decision.percentDifference.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              decision.outcome === "Implemented"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : decision.outcome === "Modified"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {decision.outcome}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Decision Comparison by Sector</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Education",
                              ai:
                                decisions
                                  .filter((d) => d.sector === "Education")
                                  .reduce((sum, d) => sum + d.aiRecommendation, 0) / 1000000,
                              human:
                                decisions
                                  .filter((d) => d.sector === "Education")
                                  .reduce((sum, d) => sum + d.humanDecision, 0) / 1000000,
                            },
                            {
                              name: "Healthcare",
                              ai:
                                decisions
                                  .filter((d) => d.sector === "Healthcare")
                                  .reduce((sum, d) => sum + d.aiRecommendation, 0) / 1000000,
                              human:
                                decisions
                                  .filter((d) => d.sector === "Healthcare")
                                  .reduce((sum, d) => sum + d.humanDecision, 0) / 1000000,
                            },
                            {
                              name: "Infrastructure",
                              ai:
                                decisions
                                  .filter((d) => d.sector === "Infrastructure")
                                  .reduce((sum, d) => sum + d.aiRecommendation, 0) / 1000000,
                              human:
                                decisions
                                  .filter((d) => d.sector === "Infrastructure")
                                  .reduce((sum, d) => sum + d.humanDecision, 0) / 1000000,
                            },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis label={{ value: "Millions ₹", angle: -90, position: "insideLeft" }} />
                          <Tooltip formatter={(value) => [`₹${value.toFixed(2)}M`, ""]} />
                          <Legend />
                          <Bar dataKey="ai" name="AI Recommendation" fill="#3b82f6" />
                          <Bar dataKey="human" name="Human Decision" fill="#22c55e" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Decision Outcomes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={[
                            {
                              name: "Implemented",
                              count: decisions.filter((d) => d.outcome === "Implemented").length,
                              percentage:
                                (decisions.filter((d) => d.outcome === "Implemented").length / decisions.length) * 100,
                            },
                            {
                              name: "Modified",
                              count: decisions.filter((d) => d.outcome === "Modified").length,
                              percentage:
                                (decisions.filter((d) => d.outcome === "Modified").length / decisions.length) * 100,
                            },
                            {
                              name: "Rejected",
                              count: decisions.filter((d) => d.outcome === "Rejected").length,
                              percentage:
                                (decisions.filter((d) => d.outcome === "Rejected").length / decisions.length) * 100,
                            },
                          ]}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip
                            formatter={(value, name) => [
                              name === "percentage" ? `${value.toFixed(1)}%` : value,
                              name === "percentage" ? "Percentage" : "Count",
                            ]}
                          />
                          <Bar dataKey="count" name="Number of Decisions" fill="#8b5cf6" />
                          <Bar dataKey="percentage" name="Percentage" fill="#f59e0b" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h3 className="text-lg font-medium mb-4">AI Accuracy Analysis</h3>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Overall AI Recommendation Accuracy</span>
                      <span className="font-bold">87.5%</span>
                    </div>
                    <Progress value={87.5} className="h-2" />
                    <p className="text-sm text-muted-foreground mt-2">
                      Based on outcome performance metrics compared to initial projections
                    </p>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Education</span>
                        <span className="font-bold">92.3%</span>
                      </div>
                      <Progress value={92.3} className="h-2" />
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Healthcare</span>
                        <span className="font-bold">89.7%</span>
                      </div>
                      <Progress value={89.7} className="h-2" />
                    </div>

                    <div className="p-4 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Infrastructure</span>
                        <span className="font-bold">84.2%</span>
                      </div>
                      <Progress value={84.2} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertTitle>AI Learning Progress</AlertTitle>
                <AlertDescription>
                  The AI system has improved its recommendation accuracy by 12.3% over the past quarter through
                  continuous learning from human decisions and outcome data.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
