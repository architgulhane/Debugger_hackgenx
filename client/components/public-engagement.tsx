"use client"

import { useState } from "react"
import { Check, Download, MessageSquare, Send, ThumbsDown, ThumbsUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Textarea } from "./ui/textarea"
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion"

// Public feedback data
const publicFeedback = [
  {
    id: 1,
    name: "Sarah Johnson",
    date: "2023-06-15",
    comment:
      "I believe we need more funding for public schools in the downtown area. The current allocation doesn't address the infrastructure needs of older school buildings.",
    sector: "Education",
    sentiment: "negative",
    votes: 24,
  },
  {
    id: 2,
    name: "Michael Chen",
    date: "2023-06-14",
    comment:
      "The recent increase in healthcare funding has made a noticeable difference in wait times at our local clinic. Great job prioritizing this sector!",
    sector: "Healthcare",
    sentiment: "positive",
    votes: 42,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    date: "2023-06-12",
    comment:
      "Why are we spending so much on new roads when our public transportation system is underfunded? We need to rethink our infrastructure priorities.",
    sector: "Infrastructure",
    sentiment: "negative",
    votes: 37,
  },
  {
    id: 4,
    name: "David Wilson",
    date: "2023-06-10",
    comment:
      "The new environmental initiatives are a step in the right direction, but we need more substantial investments to meet our sustainability goals.",
    sector: "Environment",
    sentiment: "neutral",
    votes: 18,
  },
  {
    id: 5,
    name: "Lisa Thompson",
    date: "2023-06-08",
    comment:
      "I appreciate the transparency in how our tax dollars are being allocated. The detailed breakdown by sector helps me understand the priorities.",
    sector: "General",
    sentiment: "positive",
    votes: 29,
  },
]

// Budget priority voting data
const budgetPriorityData = [
  { name: "Education", votes: 1245, percentage: 32, color: "#22c55e" },
  { name: "Healthcare", votes: 987, percentage: 25, color: "#3b82f6" },
  { name: "Infrastructure", votes: 654, percentage: 17, color: "#f59e0b" },
  { name: "Public Safety", votes: 432, percentage: 11, color: "#ef4444" },
  { name: "Social Services", votes: 321, percentage: 8, color: "#8b5cf6" },
  { name: "Environment", votes: 276, percentage: 7, color: "#06b6d4" },
]

// Sentiment analysis data
const sentimentData = [
  { sector: "Education", positive: 45, neutral: 30, negative: 25 },
  { sector: "Healthcare", positive: 60, neutral: 25, negative: 15 },
  { sector: "Infrastructure", positive: 35, neutral: 40, negative: 25 },
  { sector: "Public Safety", positive: 50, neutral: 30, negative: 20 },
  { sector: "Social Services", positive: 55, neutral: 25, negative: 20 },
  { sector: "Environment", positive: 40, neutral: 35, negative: 25 },
]

// Common concerns data (for word cloud)
const commonConcerns = [
  { text: "School Funding", value: 100, sector: "Education" },
  { text: "Road Repairs", value: 85, sector: "Infrastructure" },
  { text: "Healthcare Access", value: 95, sector: "Healthcare" },
  { text: "Public Transportation", value: 80, sector: "Infrastructure" },
  { text: "Environmental Protection", value: 75, sector: "Environment" },
  { text: "Affordable Housing", value: 90, sector: "Social Services" },
  { text: "Police Services", value: 70, sector: "Public Safety" },
  { text: "Teacher Salaries", value: 85, sector: "Education" },
  { text: "Mental Health", value: 80, sector: "Healthcare" },
  { text: "Parks and Recreation", value: 65, sector: "Environment" },
  { text: "Emergency Services", value: 75, sector: "Public Safety" },
  { text: "Homelessness", value: 85, sector: "Social Services" },
  { text: "Traffic Congestion", value: 70, sector: "Infrastructure" },
  { text: "Water Quality", value: 65, sector: "Environment" },
  { text: "Senior Services", value: 60, sector: "Social Services" },
]

// FAQ data
const faqData = [
  {
    question: "How is the budget allocation determined?",
    answer:
      "Budget allocation is determined through a data-driven process that considers historical performance, current needs, public input, and strategic priorities. The system uses machine learning algorithms to optimize resource distribution across sectors.",
  },
  {
    question: "How can I provide input on budget priorities?",
    answer:
      "You can provide input through the public feedback form on this page, participate in budget priority voting, or attend virtual town halls that are scheduled throughout the year. All public input is analyzed and incorporated into the decision-making process.",
  },
  {
    question: "How often is the budget updated?",
    answer:
      "The budget is reviewed and adjusted quarterly based on real-time data and changing needs. Major allocations are set annually, but the system allows for dynamic adjustments throughout the fiscal year to respond to emerging priorities.",
  },
  {
    question: "How is budget performance measured?",
    answer:
      "Budget performance is measured through a comprehensive set of key performance indicators (KPIs) for each sector. These include outcome metrics, efficiency ratios, and impact assessments that are continuously monitored and reported.",
  },
  {
    question: "How does the blockchain verification work?",
    answer:
      "All budget transactions are recorded on a public blockchain, creating an immutable and transparent record. Each transaction receives a unique hash that can be independently verified, ensuring accountability and preventing tampering with financial records.",
  },
]

export function PublicEngagement() {
  const [activeTab, setActiveTab] = useState("feedback")
  const [feedbackText, setFeedbackText] = useState("")
  const [selectedSector, setSelectedSector] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const handleSubmitFeedback = () => {
    if (feedbackText.trim() && selectedSector) {
      setFeedbackSubmitted(true)
      setTimeout(() => {
        setFeedbackText("")
        setSelectedSector("")
        setFeedbackSubmitted(false)
      }, 3000)
    }
  }

  // Generate word cloud layout
  const generateWordCloudLayout = () => {
    const containerWidth = 400
    const containerHeight = 300
    const words = [...commonConcerns]

    // Simple layout algorithm (not as sophisticated as real word cloud libraries)
    words.forEach((word) => {
      word.x = Math.random() * (containerWidth - word.value / 2)
      word.y = Math.random() * (containerHeight - 30)
      word.fontSize = 10 + word.value / 20
    })

    return words
  }

  const wordCloudLayout = generateWordCloudLayout()

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="feedback">Public Feedback</TabsTrigger>
          <TabsTrigger value="voting">Budget Voting</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="faq">FAQ</TabsTrigger>
        </TabsList>

        <TabsContent value="feedback" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Submit Your Feedback</CardTitle>
              <CardDescription>Share your thoughts on budget priorities and allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Sector</label>
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a sector" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Public Safety">Public Safety</SelectItem>
                      <SelectItem value="Social Services">Social Services</SelectItem>
                      <SelectItem value="Environment">Environment</SelectItem>
                      <SelectItem value="General">General</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Feedback</label>
                  <Textarea
                    placeholder="Share your thoughts on budget allocation..."
                    className="min-h-[100px]"
                    value={feedbackText}
                    onChange={(e) => setFeedbackText(e.target.value)}
                  />
                </div>

                {feedbackSubmitted ? (
                  <div className="bg-green-50 text-green-800 p-3 rounded-md flex items-center">
                    <Check className="h-5 w-5 mr-2" />
                    Thank you for your feedback! Your input helps improve budget allocation.
                  </div>
                ) : (
                  <Button onClick={handleSubmitFeedback} disabled={!feedbackText.trim() || !selectedSector}>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Feedback
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Community Feedback</CardTitle>
                  <CardDescription>Recent public comments on budget allocation</CardDescription>
                </div>
                <Button variant="outline" size="sm">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {publicFeedback.map((feedback) => (
                  <div key={feedback.id} className="p-4 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                          <Users className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium">{feedback.name}</div>
                          <div className="text-xs text-muted-foreground">{feedback.date}</div>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          feedback.sentiment === "positive"
                            ? "bg-green-100 text-green-800 hover:bg-green-100"
                            : feedback.sentiment === "negative"
                              ? "bg-red-100 text-red-800 hover:bg-red-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                        }
                      >
                        {feedback.sector}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{feedback.comment}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">{feedback.votes}</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2">
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button variant="ghost" size="sm" className="h-8">
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span className="text-xs">Reply</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-center">
              <Button variant="outline">Load More Comments</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="voting" className="mt-6 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Budget Priority Voting</CardTitle>
                <CardDescription>Public votes on sector funding priorities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={budgetPriorityData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="votes"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        labelLine={false}
                      >
                        {budgetPriorityData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string, props: any) => {
                          return [`${value} votes (${props.payload.percentage}%)`, name]
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-medium mb-2">Cast Your Vote</h3>
                  <div className="space-y-2">
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Education">Education</SelectItem>
                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                        <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                        <SelectItem value="Public Safety">Public Safety</SelectItem>
                        <SelectItem value="Social Services">Social Services</SelectItem>
                        <SelectItem value="Environment">Environment</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button className="w-full">Submit Vote</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Common Concerns</CardTitle>
                <CardDescription>Frequently mentioned topics in public feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-[350px] border rounded-lg p-4 overflow-hidden">
                  {wordCloudLayout.map((word, index) => (
                    <div
                      key={index}
                      className="absolute"
                      style={{
                        left: word.x,
                        top: word.y,
                        fontSize: `${word.fontSize}px`,
                        fontWeight: word.value > 80 ? "bold" : "normal",
                        color:
                          word.sector === "Education"
                            ? "#22c55e"
                            : word.sector === "Healthcare"
                              ? "#3b82f6"
                              : word.sector === "Infrastructure"
                                ? "#f59e0b"
                                : word.sector === "Public Safety"
                                  ? "#ef4444"
                                  : word.sector === "Social Services"
                                    ? "#8b5cf6"
                                    : "#06b6d4",
                      }}
                    >
                      {word.text}
                    </div>
                  ))}
                </div>

                <div className="mt-4 grid grid-cols-3 gap-2">
                  {["Education", "Healthcare", "Infrastructure", "Public Safety", "Social Services", "Environment"].map(
                    (sector) => (
                      <div key={sector} className="flex items-center gap-1 text-xs">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              sector === "Education"
                                ? "#22c55e"
                                : sector === "Healthcare"
                                  ? "#3b82f6"
                                  : sector === "Infrastructure"
                                    ? "#f59e0b"
                                    : sector === "Public Safety"
                                      ? "#ef4444"
                                      : sector === "Social Services"
                                        ? "#8b5cf6"
                                        : "#06b6d4",
                          }}
                        />
                        <span>{sector}</span>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Historical Voting Trends</CardTitle>
              <CardDescription>Changes in public priorities over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={[
                      {
                        year: "2020",
                        Education: 28,
                        Healthcare: 22,
                        Infrastructure: 20,
                        "Public Safety": 12,
                        "Social Services": 10,
                        Environment: 8,
                      },
                      {
                        year: "2021",
                        Education: 30,
                        Healthcare: 24,
                        Infrastructure: 18,
                        "Public Safety": 11,
                        "Social Services": 9,
                        Environment: 8,
                      },
                      {
                        year: "2022",
                        Education: 31,
                        Healthcare: 25,
                        Infrastructure: 17,
                        "Public Safety": 11,
                        "Social Services": 8,
                        Environment: 8,
                      },
                      {
                        year: "2023",
                        Education: 32,
                        Healthcare: 25,
                        Infrastructure: 17,
                        "Public Safety": 11,
                        "Social Services": 8,
                        Environment: 7,
                      },
                    ]}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis label={{ value: "Percentage of Votes", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Bar dataKey="Education" fill="#22c55e" />
                    <Bar dataKey="Healthcare" fill="#3b82f6" />
                    <Bar dataKey="Infrastructure" fill="#f59e0b" />
                    <Bar dataKey="Public Safety" fill="#ef4444" />
                    <Bar dataKey="Social Services" fill="#8b5cf6" />
                    <Bar dataKey="Environment" fill="#06b6d4" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sentiment" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Public Sentiment Analysis</CardTitle>
              <CardDescription>AI-powered analysis of public feedback sentiment by sector</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsBarChart
                    data={sentimentData}
                    layout="vertical"
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="sector" type="category" />
                    <Tooltip />
                    <Bar dataKey="positive" stackId="a" fill="#22c55e" name="Positive" />
                    <Bar dataKey="neutral" stackId="a" fill="#94a3b8" name="Neutral" />
                    <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium">Key Insights</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Healthcare
                      </Badge>
                      <span className="text-sm font-medium">Highest Positive Sentiment</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Recent increases in healthcare funding have been well-received by the public, with many commenting
                      on improved access to services.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                        Infrastructure
                      </Badge>
                      <span className="text-sm font-medium">Mixed Sentiment</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Public opinion on infrastructure spending is divided, with concerns about project prioritization
                      and completion timelines frequently mentioned.
                    </p>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Environment
                      </Badge>
                      <span className="text-sm font-medium">Growing Concern</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Environmental funding sentiment shows increasing public interest, with many suggesting higher
                      allocations for sustainability initiatives.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="faq" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Common questions about the budget allocation system</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                {faqData.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                    <AccordionContent>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              <div className="mt-6 p-4 border rounded-lg bg-muted/30">
                <h3 className="font-medium mb-2">Have a question not listed here?</h3>
                <div className="flex gap-2">
                  <Input placeholder="Type your question..." className="flex-1" />
                  <Button>Submit</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
