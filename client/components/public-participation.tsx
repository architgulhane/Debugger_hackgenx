"use client"

import { useState, useEffect } from "react"
import { Check, Download, MessageSquare, Send, ThumbsDown, ThumbsUp, Users } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Textarea } from "../components/ui/textarea"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "../components/ui/alert"

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
interface Word {
  text: string;
  value: number;
  sector: string;
  x?: number;
  y?: number;
  fontSize?: number;
}

const commonConcerns: Word[] = [
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

const MAX_FEEDBACK_LENGTH = 500;

export function PublicParticipation() {
  const [activeTab, setActiveTab] = useState("feedback")
  const [feedbackText, setFeedbackText] = useState("")
  const [selectedSector, setSelectedSector] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [feedbacks, setFeedbacks] = useState(publicFeedback)
  const [votingData, setVotingData] = useState(budgetPriorityData)
  const [userVote, setUserVote] = useState("")
  const [voteSubmitted, setVoteSubmitted] = useState(false)
  const [wordCloudLayout, setWordCloudLayout] = useState<any[]>([])

  // Generate word cloud layout
  useEffect(() => {
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

    setWordCloudLayout(generateWordCloudLayout())
  }, [])

  // Occasionally update the word cloud
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setWordCloudLayout((prev) => {
          const newLayout = [...prev]
          // Randomly change the size of some words
          for (let i = 0; i < 3; i++) {
            const randomIndex = Math.floor(Math.random() * newLayout.length)
            newLayout[randomIndex] = {
              ...newLayout[randomIndex],
              value: Math.max(50, Math.min(100, newLayout[randomIndex].value + (Math.random() > 0.5 ? 5 : -5))),
              fontSize:
                10 + Math.max(50, Math.min(100, newLayout[randomIndex].value + (Math.random() > 0.5 ? 5 : -5))) / 20,
            }
          }
          return newLayout
        })
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmitFeedback = () => {
    if (feedbackText.trim() && selectedSector) {
      // Add the new feedback to the list
      const newFeedback = {
        id: feedbacks.length + 1,
        name: "You (Citizen)",
        date: new Date().toISOString().split("T")[0],
        comment: feedbackText,
        sector: selectedSector,
        sentiment: "neutral", // In a real app, this would be determined by AI
        votes: 0,
      }

      setFeedbacks([newFeedback, ...feedbacks])
      setFeedbackSubmitted(true)

      setTimeout(() => {
        setFeedbackText("")
        setSelectedSector("")
        setFeedbackSubmitted(false)
      }, 3000)
    }
  }

  const handleVote = () => {
    if (userVote) {
      // Update the voting data
      setVotingData((prev) => prev.map((item) => (item.name === userVote ? { ...item, votes: item.votes + 1 } : item)))

      setVoteSubmitted(true)
      setTimeout(() => {
        setUserVote("")
        setVoteSubmitted(false)
      }, 3000)
    }
  }

  const handleFeedbackVote = (feedbackId: number, isUpvote: boolean) => {
    setFeedbacks((prev) =>
      prev.map((feedback) =>
        feedback.id === feedbackId
          ? { ...feedback, votes: isUpvote ? feedback.votes + 1 : feedback.votes - 1 }
          : feedback,
      ),
    )
  }

  const handleEditFeedback = (feedbackId: number) => {
    const feedbackToEdit = feedbacks.find((feedback) => feedback.id === feedbackId);
    if (feedbackToEdit) {
      setFeedbackText(feedbackToEdit.comment);
      setSelectedSector(feedbackToEdit.sector);
      setFeedbacks(feedbacks.filter((feedback) => feedback.id !== feedbackId));
    }
  };

  const handleDeleteFeedback = (feedbackId: number) => {
    setFeedbacks(feedbacks.filter((feedback) => feedback.id !== feedbackId));
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="feedback">Public Feedback</TabsTrigger>
          <TabsTrigger value="voting">Budget Voting</TabsTrigger>
          <TabsTrigger value="sentiment">Sentiment Analysis</TabsTrigger>
          <TabsTrigger value="wordcloud">Common Concerns</TabsTrigger>
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
                    maxLength={MAX_FEEDBACK_LENGTH}
                  />
                  <div className="text-xs text-muted-foreground">
                    {feedbackText.length}/{MAX_FEEDBACK_LENGTH} characters
                  </div>
                </div>

                {feedbackSubmitted ? (
                  <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                    <Check className="h-5 w-5 mr-2" />
                    <AlertTitle>Thank you for your feedback!</AlertTitle>
                    <AlertDescription>Your input helps improve budget allocation decisions.</AlertDescription>
                  </Alert>
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
                {feedbacks.map((feedback) => (
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
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleFeedbackVote(feedback.id, true)}
                        >
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span className="text-xs">{feedback.votes}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 px-2"
                          onClick={() => handleFeedbackVote(feedback.id, false)}
                        >
                          <ThumbsDown className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => handleEditFeedback(feedback.id)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8"
                          onClick={() => handleDeleteFeedback(feedback.id)}
                        >
                          Delete
                        </Button>
                      </div>
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
                        data={votingData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="votes"
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        labelLine={false}
                      >
                        {votingData.map((entry, index) => (
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
                    <Select value={userVote} onValueChange={setUserVote}>
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

                    {voteSubmitted ? (
                      <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
                        <Check className="h-4 w-4 mr-2" />
                        <AlertTitle>Vote submitted!</AlertTitle>
                      </Alert>
                    ) : (
                      <Button className="w-full" onClick={handleVote} disabled={!userVote}>
                        Submit Vote
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historical Voting Trends</CardTitle>
                <CardDescription>Changes in public priorities over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[350px]">
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Demographic Breakdown</CardTitle>
              <CardDescription>Voting patterns by age group and region</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="text-sm font-medium mb-3">Priorities by Age Group</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={[
                          {
                            age: "18-24",
                            Education: 35,
                            Healthcare: 20,
                            Infrastructure: 15,
                            Environment: 30,
                          },
                          {
                            age: "25-34",
                            Education: 30,
                            Healthcare: 25,
                            Infrastructure: 20,
                            Environment: 25,
                          },
                          {
                            age: "35-44",
                            Education: 35,
                            Healthcare: 30,
                            Infrastructure: 25,
                            Environment: 10,
                          },
                          {
                            age: "45-54",
                            Education: 25,
                            Healthcare: 35,
                            Infrastructure: 30,
                            Environment: 10,
                          },
                          {
                            age: "55+",
                            Education: 20,
                            Healthcare: 40,
                            Infrastructure: 30,
                            Environment: 10,
                          },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="age" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="Education" stackId="a" fill="#22c55e" />
                        <Bar dataKey="Healthcare" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="Infrastructure" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="Environment" stackId="a" fill="#06b6d4" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Priorities by Region</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsBarChart
                        data={[
                          {
                            region: "Urban",
                            Education: 30,
                            Healthcare: 25,
                            Infrastructure: 25,
                            Environment: 20,
                          },
                          {
                            region: "Suburban",
                            Education: 35,
                            Healthcare: 25,
                            Infrastructure: 30,
                            Environment: 10,
                          },
                          {
                            region: "Rural",
                            Education: 25,
                            Healthcare: 30,
                            Infrastructure: 35,
                            Environment: 10,
                          },
                        ]}
                        layout="vertical"
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" />
                        <YAxis dataKey="region" type="category" />
                        <Tooltip />
                        <Bar dataKey="Education" stackId="a" fill="#22c55e" />
                        <Bar dataKey="Healthcare" stackId="a" fill="#3b82f6" />
                        <Bar dataKey="Infrastructure" stackId="a" fill="#f59e0b" />
                        <Bar dataKey="Environment" stackId="a" fill="#06b6d4" />
                      </RechartsBarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
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

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Sentiment Trend Analysis</h3>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        {
                          month: "Jan",
                          positive: 45,
                          neutral: 35,
                          negative: 20,
                        },
                        {
                          month: "Feb",
                          positive: 50,
                          neutral: 30,
                          negative: 20,
                        },
                        {
                          month: "Mar",
                          positive: 55,
                          neutral: 25,
                          negative: 20,
                        },
                        {
                          month: "Apr",
                          positive: 60,
                          neutral: 25,
                          negative: 15,
                        },
                        {
                          month: "May",
                          positive: 65,
                          neutral: 20,
                          negative: 15,
                        },
                        {
                          month: "Jun",
                          positive: 70,
                          neutral: 20,
                          negative: 10,
                        },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="positive" stackId="a" fill="#22c55e" name="Positive" />
                      <Bar dataKey="neutral" stackId="a" fill="#94a3b8" name="Neutral" />
                      <Bar dataKey="negative" stackId="a" fill="#ef4444" name="Negative" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="wordcloud" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Common Concerns</CardTitle>
              <CardDescription>Frequently mentioned topics in public feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative h-[350px] border rounded-lg p-4 overflow-hidden mb-6">
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

              <div className="grid grid-cols-3 gap-2">
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

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Top Concerns by Sector</h3>
                <div className="space-y-4">
                  {["Education", "Healthcare", "Infrastructure"].map((sector) => (
                    <div key={sector} className="space-y-2">
                      <h4 className="text-sm font-medium">{sector}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {commonConcerns
                          .filter((concern) => concern.sector === sector)
                          .sort((a, b) => b.value - a.value)
                          .slice(0, 2)
                          .map((concern, index) => (
                            <div key={index} className="p-2 border rounded-md">
                              <div className="flex justify-between items-center">
                                <span className="text-sm">{concern.text}</span>
                                <Badge variant="outline" className="text-xs">
                                  {concern.value}%
                                </Badge>
                              </div>
                              <div className="mt-1 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                                <div
                                  className="h-full rounded-full"
                                  style={{
                                    width: `${concern.value}%`,
                                    backgroundColor:
                                      sector === "Education"
                                        ? "#22c55e"
                                        : sector === "Healthcare"
                                          ? "#3b82f6"
                                          : "#f59e0b",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-medium mb-3">Trending Topics</h3>
                <div className="space-y-2">
                  {["School Funding", "Healthcare Access", "Road Repairs"].map((topic, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
