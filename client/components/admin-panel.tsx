"use client"

import { useState } from "react"
import { AlertCircle, ArrowDown, Check, Edit, Lock, Plus, Save, Trash } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Switch } from "../components/ui/switch"
import { Label } from "../components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog"
import { Progress } from "../components/ui/progress"

// Generate sector data
const generateSectorData = () => {
  return [
    { id: 1, name: "Education", budget: 5200000, minAllocation: 20, maxAllocation: 35, active: true },
    { id: 2, name: "Healthcare", budget: 4800000, minAllocation: 20, maxAllocation: 35, active: true },
    { id: 3, name: "Infrastructure", budget: 3700000, minAllocation: 15, maxAllocation: 30, active: true },
    { id: 4, name: "Public Safety", budget: 2100000, minAllocation: 8, maxAllocation: 15, active: true },
    { id: 5, name: "Social Services", budget: 1500000, minAllocation: 5, maxAllocation: 12, active: true },
    { id: 6, name: "Environment", budget: 1000000, minAllocation: 3, maxAllocation: 10, active: true },
  ]
}

// Generate user data
const generateUserData = () => {
  return [
    {
      id: 1,
      name: "John Smith",
      email: "john.smith@example.com",
      role: "Administrator",
      status: "Active",
      lastLogin: "2023-06-15 09:23",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.garcia@example.com",
      role: "Finance Director",
      status: "Active",
      lastLogin: "2023-06-14 14:45",
    },
    {
      id: 3,
      name: "David Chen",
      email: "david.chen@example.com",
      role: "Department Head",
      status: "Active",
      lastLogin: "2023-06-13 11:30",
    },
    {
      id: 4,
      name: "Sarah Johnson",
      email: "sarah.johnson@example.com",
      role: "Auditor",
      status: "Inactive",
      lastLogin: "2023-05-28 16:12",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.brown@example.com",
      role: "Viewer",
      status: "Active",
      lastLogin: "2023-06-15 08:05",
    },
  ]
}

// Generate feedback data
const generateFeedbackData = () => {
  return [
    {
      id: 1,
      user: "Citizen",
      content: "We need more funding for public schools in the downtown area.",
      sector: "Education",
      status: "Approved",
      date: "2023-06-15",
    },
    {
      id: 2,
      user: "Citizen",
      content:
        "The recent increase in healthcare funding has made a noticeable difference in wait times at our local clinic.",
      sector: "Healthcare",
      status: "Approved",
      date: "2023-06-14",
    },
    {
      id: 3,
      user: "Citizen",
      content: "Why are we spending so much on new roads when our public transportation system is underfunded?",
      sector: "Infrastructure",
      status: "Flagged",
      date: "2023-06-12",
    },
    {
      id: 4,
      user: "Citizen",
      content:
        "The new environmental initiatives are a step in the right direction, but we need more substantial investments.",
      sector: "Environment",
      status: "Approved",
      date: "2023-06-10",
    },
    {
      id: 5,
      user: "Citizen",
      content: "This is spam content that should be removed.",
      sector: "General",
      status: "Rejected",
      date: "2023-06-08",
    },
  ]
}

// Generate AI log data
const generateAILogData = () => {
  return [
    {
      id: 1,
      timestamp: "2023-06-15 09:23:45",
      action: "Budget Optimization",
      recommendation: "Increase Education allocation by 2.3%",
      reasoning: "Historical performance data indicates higher ROI in education sector",
      status: "Implemented",
      user: "John Smith",
    },
    {
      id: 2,
      timestamp: "2023-06-14 14:45:12",
      action: "Anomaly Detection",
      recommendation: "Review unusual transaction in Healthcare sector",
      reasoning: "Transaction pattern deviates from historical norms by 3 standard deviations",
      status: "Implemented",
      user: "System",
    },
    {
      id: 3,
      timestamp: "2023-06-13 11:30:28",
      action: "Budget Optimization",
      recommendation: "Decrease Infrastructure allocation by 1.8%",
      reasoning: "Current allocation exceeds optimal level based on utilization metrics",
      status: "Overridden",
      user: "Maria Garcia",
    },
    {
      id: 4,
      timestamp: "2023-06-12 16:12:33",
      action: "Performance Analysis",
      recommendation: "Reallocate funds from Project A to Project B within Social Services",
      reasoning: "Project B shows 27% higher impact metrics per rupee spent",
      status: "Implemented",
      user: "System",
    },
    {
      id: 5,
      timestamp: "2023-06-11 08:05:19",
      action: "Budget Optimization",
      recommendation: "Increase Environment allocation by 1.2%",
      reasoning: "Current initiatives show promising results and could benefit from additional funding",
      status: "Pending",
      user: "System",
    },
  ]
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState("sectors")
  const [sectors, setSectors] = useState(generateSectorData())
  const [users, setUsers] = useState(generateUserData())
  const [feedback, setFeedback] = useState(generateFeedbackData())
  const [aiLogs, setAILogs] = useState(generateAILogData())
  const [editingSector, setEditingSector] = useState<any>(null)
  const [showAddSector, setShowAddSector] = useState(false)
  const [newSector, setNewSector] = useState({ name: "", budget: 0, minAllocation: 0, maxAllocation: 0, active: true })
  const [showAddUser, setShowAddUser] = useState(false)
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "", status: "Active" })
  const [systemSettings, setSystemSettings] = useState({
    aiEnabled: true,
    autoOptimization: true,
    anomalyDetection: true,
    publicFeedback: true,
    blockchainVerification: true,
    dataRetentionDays: 365,
    maxBudgetAdjustment: 5,
    notificationLevel: "High",
    auditFrequency: "Daily",
  })

  // Save sector changes
  const saveSectorChanges = () => {
    if (editingSector) {
      setSectors((prev) => prev.map((sector) => (sector.id === editingSector.id ? editingSector : sector)))
      setEditingSector(null)
    }
  }

  // Add new sector
  const addNewSector = () => {
    const newId = Math.max(...sectors.map((s) => s.id)) + 1
    setSectors([...sectors, { ...newSector, id: newId }])
    setNewSector({ name: "", budget: 0, minAllocation: 0, maxAllocation: 0, active: true })
    setShowAddSector(false)
  }

  // Delete sector
  const deleteSector = (id: number) => {
    setSectors((prev) => prev.filter((sector) => sector.id !== id))
  }

  // Add new user
  const addNewUser = () => {
    const newId = Math.max(...users.map((u) => u.id)) + 1
    setUsers([...users, { ...newUser, id: newId, lastLogin: "Never" }])
    setNewUser({ name: "", email: "", role: "", status: "Active" })
    setShowAddUser(false)
  }

  // Update feedback status
  const updateFeedbackStatus = (id: number, status: string) => {
    setFeedback((prev) => prev.map((item) => (item.id === id ? { ...item, status } : item)))
  }

  // Override AI recommendation
  const overrideAIRecommendation = (id: number) => {
    setAILogs((prev) => prev.map((log) => (log.id === id ? { ...log, status: "Overridden" } : log)))
  }

  // Implement AI recommendation
  const implementAIRecommendation = (id: number) => {
    setAILogs((prev) => prev.map((log) => (log.id === id ? { ...log, status: "Implemented" } : log)))
  }

  // Save system settings
  const saveSystemSettings = () => {
    // In a real app, this would save to a database
    alert("System settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="sectors">Sector Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="feedback">Feedback Moderation</TabsTrigger>
          <TabsTrigger value="ai">AI Controls</TabsTrigger>
        </TabsList>

        <TabsContent value="sectors" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>Sector & Budget Management</CardTitle>
                  <CardDescription>Add, edit, or remove budget sectors</CardDescription>
                </div>
                <Button onClick={() => setShowAddSector(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Sector
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sector Name</TableHead>
                      <TableHead>Budget</TableHead>
                      <TableHead>Min Allocation</TableHead>
                      <TableHead>Max Allocation</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sectors.map((sector) => (
                      <TableRow key={sector.id}>
                        <TableCell className="font-medium">
                          {editingSector?.id === sector.id ? (
                            <Input 
                              value={editingSector.name} 
                              onChange={(e) => setEditingSector({ ...editingSector, name: e.target.value })}
                            />
                          ) : (
                            sector.name
                          )}
                        </TableCell>
                        <TableCell>
                          {editingSector?.id === sector.id ? (
                            <Input 
                              type="number"
                              value={editingSector.budget} 
                              onChange={(e) => setEditingSector({ ...editingSector, budget: Number.parseInt(e.target.value) })}
                            />
                          ) : (
                            `₹${sector.budget.toLocaleString()}`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingSector?.id === sector.id ? (
                            <Input 
                              type="number"
                              value={editingSector.minAllocation} 
                              onChange={(e) => setEditingSector({ ...editingSector, minAllocation: Number.parseInt(e.target.value) })}
                            />
                          ) : (
                            `${sector.minAllocation}%`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingSector?.id === sector.id ? (
                            <Input 
                              type="number"
                              value={editingSector.maxAllocation} 
                              onChange={(e) => setEditingSector({ ...editingSector, maxAllocation: Number.parseInt(e.target.value) })}
                            />
                          ) : (
                            `${sector.maxAllocation}%`
                          )}
                        </TableCell>
                        <TableCell>
                          {editingSector?.id === sector.id ? (
                            <Select 
                              value={editingSector.active ? "active" : "inactive"}
                              onValueChange={(value) => setEditingSector({ ...editingSector, active: value === "active" })}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="inactive">Inactive</SelectItem>
                              </SelectContent>
                            </Select>
                          ) : (
                            <Badge
                              variant={sector.active ? "default" : "outline"}
                              className={!sector.active ? "bg-gray-100 text-gray-800 hover:bg-gray-100" : ""}
                            >
                              {sector.active ? "Active" : "Inactive"}
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          {editingSector?.id === sector.id ? (
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditingSector(null)}>
                                Cancel
                              </Button>
                              <Button size="sm" onClick={saveSectorChanges}>
                                Save
                              </Button>
                            </div>
                          ) : (
                            <div className="flex justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => setEditingSector({ ...sector })}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => deleteSector(sector.id)}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Dialog open={showAddSector} onOpenChange={setShowAddSector}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Sector</DialogTitle>
                <DialogDescription>
                  Create a new budget sector with allocation limits
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Sector Name</Label>
                  <Input 
                    id="name" 
                    value={newSector.name} 
                    onChange={(e) => setNewSector({ ...newSector, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="budget">Initial Budget (₹)</Label>
                  <Input 
                    id="budget" 
                    type="number"
                    value={newSector.budget || ""} 
                    onChange={(e) => setNewSector({ ...newSector, budget: Number.parseInt(e.target.value) })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="min">Minimum Allocation (%)</Label>
                    <Input 
                      id="min" 
                      type="number"
                      value={newSector.minAllocation || ""} 
                      onChange={(e) => setNewSector({ ...newSector, minAllocation: Number.parseInt(e.target.value) })}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="max">Maximum Allocation (%)</Label>
                    <Input 
                      id="max" 
                      type="number"
                      value={newSector.maxAllocation || ""} 
                      onChange={(e) => setNewSector({ ...newSector, maxAllocation: Number.parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    id="active" 
                    checked={newSector.active}
                    onCheckedChange={(checked) => setNewSector({ ...newSector, active: checked })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddSector(false)}>Cancel</Button>
                <Button onClick={addNewSector}>Add Sector</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage user accounts and permissions</CardDescription>
                </div>
                <Button onClick={() => setShowAddUser(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Last Login</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>
                          <Badge
                            variant={user.status === "Active" ? "default" : "outline"}
                            className={user.status !== "Active" ? "bg-gray-100 text-gray-800 hover:bg-gray-100" : ""}
                          >
                            {user.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.lastLogin}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Lock className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
          
          <Dialog open={showAddUser} onOpenChange={setShowAddUser}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with appropriate permissions
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input 
                    id="name" 
                    value={newUser.name} 
                    onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input 
                    id="email" 
                    type="email"
                    value={newUser.email} 
                    onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Select 
                    value={newUser.role}
                    onValueChange={(value) => setNewUser({ ...newUser, role: value })}
                  >
                    <SelectTrigger id="role">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Finance Director">Finance Director</SelectItem>
                      <SelectItem value="Department Head">Department Head</SelectItem>
                      <SelectItem value="Auditor">Auditor</SelectItem>
                      <SelectItem value="Viewer">Viewer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex items-center gap-2">
                  <Switch 
                    id="active" 
                    checked={newUser.status === "Active"}
                    onCheckedChange={(checked) => setNewUser({ ...newUser, status: checked ? "Active" : "Inactive" })}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
                <Button onClick={addNewUser}>Add User</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="feedback" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Feedback Moderation</CardTitle>
              <CardDescription>Review and moderate public feedback submissions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Feedback</TableHead>
                      <TableHead>Sector</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {feedback.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.user}</TableCell>
                        <TableCell className="max-w-xs truncate">{item.content}</TableCell>
                        <TableCell>{item.sector}</TableCell>
                        <TableCell>{item.date}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              item.status === "Approved"
                                ? "bg-green-100 text-green-800 hover:bg-green-100"
                                : item.status === "Flagged"
                                  ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                  : "bg-red-100 text-red-800 hover:bg-red-100"
                            }
                          >
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => updateFeedbackStatus(item.id, "Approved")}
                              disabled={item.status === "Approved"}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => updateFeedbackStatus(item.id, "Flagged")}
                              disabled={item.status === "Flagged"}
                            >
                              <AlertCircle className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => updateFeedbackStatus(item.id, "Rejected")}
                              disabled={item.status === "Rejected"}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              
              <div className="mt-6 space-y-4">
                <h3 className="text-lg font-medium">Moderation Guidelines</h3>
                <div className="space-y-2">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Approve
                      </Badge>
                      <span className="text-sm font-medium">Constructive Feedback</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Approve feedback that is constructive, relevant to budget allocation, and provides specific suggestions or observations.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Flag
                      </Badge>
                      <span className="text-sm font-medium">Needs Review</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Flag feedback that contains potentially inappropriate content, requires fact-checking, or needs further review.
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
                        Reject
                      </Badge>
                      <span className="text-sm font-medium">Inappropriate Content</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reject feedback that contains spam, offensive language, personal attacks, or is completely unrelated to budget allocation.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>AI Logs & Overrides</CardTitle>
                <CardDescription>Review AI decisions and implement or override recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Timestamp</TableHead>
                        <TableHead>Action</TableHead>
                        <TableHead>Recommendation</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {aiLogs.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell className="whitespace-nowrap">{log.timestamp}</TableCell>
                          <TableCell>{log.action}</TableCell>
                          <TableCell className="max-w-xs truncate">{log.recommendation}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                log.status === "Implemented"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : log.status === "Overridden"
                                    ? "bg-red-100 text-red-800 hover:bg-red-100"
                                    : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                              }
                            >
                              {log.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {log.status === "Pending" && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => implementAIRecommendation(log.id)}
                                  >
                                    <Check className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant='ghost'  />
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => overrideAIRecommendation(log.id)}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                </>
                              )}
                              <Button variant="ghost" size="sm">
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-6">
                  <h3 className="text-lg font-medium mb-4">AI Performance Metrics</h3>
                  <div className="space-y-4">
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Recommendation Accuracy</span>
                        <span className="font-bold">87.5%</span>
                      </div>
                      <Progress value={87.5} className="h-2" />
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Implementation Rate</span>
                        <span className="font-bold">76.2%</span>
                      </div>
                      <Progress value={76.2} className="h-2" />
                    </div>
                    
                    <div className="p-3 border rounded-lg">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">Override Rate</span>
                        <span className="font-bold">23.8%</span>
                      </div>
                      <Progress value={23.8} className="h-2" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>System Settings</CardTitle>
                <CardDescription>Configure AI behavior and system parameters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">AI Controls</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="ai-enabled">AI System Enabled</Label>
                          <p className="text-xs text-muted-foreground">Enable or disable the entire AI system</p>
                        </div>
                        <Switch 
                          id="ai-enabled" 
                          checked={systemSettings.aiEnabled}
                          onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, aiEnabled: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-optimization">Automatic Optimization</Label>
                          <p className="text-xs text-muted-foreground">Allow AI to automatically optimize budget allocations</p>
                        </div>
                        <Switch 
                          id="auto-optimization" 
                          checked={systemSettings.autoOptimization}
                          onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, autoOptimization: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="anomaly-detection">Anomaly Detection</Label>
                          <p className="text-xs text-muted-foreground">Enable AI to detect unusual spending patterns</p>
                        </div>
                        <Switch 
                          id="anomaly-detection" 
                          checked={systemSettings.anomalyDetection}
                          onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, anomalyDetection: checked })}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">System Parameters</h3>
                    <div className="space-y-2">
                      <div className="grid gap-2">
                        <Label htmlFor="max-adjustment">Maximum Budget Adjustment (%)</Label>
                        <Input 
                          id="max-adjustment" 
                          type="number"
                          value={systemSettings.maxBudgetAdjustment} 
                          onChange={(e) => setSystemSettings({ ...systemSettings, maxBudgetAdjustment: Number.parseInt(e.target.value) })}
                        />
                        <p className="text-xs text-muted-foreground">Maximum percentage the AI can adjust any sector's budget</p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="data-retention">Data Retention Period (days)</Label>
                        <Input 
                          id="data-retention" 
                          type="number"
                          value={systemSettings.dataRetentionDays} 
                          onChange={(e) => setSystemSettings({ ...systemSettings, dataRetentionDays: Number.parseInt(e.target.value) })}
                        />
                        <p className="text-xs text-muted-foreground">How long to keep transaction and audit data</p>
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="notification-level">Notification Level</Label>
                        <Select 
                          value={systemSettings.notificationLevel}
                          onValueChange={(value) => setSystemSettings({ ...systemSettings, notificationLevel: value })}
                        >
                          <SelectTrigger id="notification-level">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="High">High (All Events)</SelectItem>
                            <SelectItem value="Medium">Medium (Important Events)</SelectItem>
                            <SelectItem value="Low">Low (Critical Events Only)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Security & Compliance</h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="blockchain">Blockchain Verification</Label>
                          <p className="text-xs text-muted-foreground">Enable blockchain-based transaction verification</p>
                        </div>
                        <Switch 
                          id="blockchain" 
                          checked={systemSettings.blockchainVerification}
                          onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, blockchainVerification: checked })}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="public-feedback">Public Feedback System</Label>
                          <p className="text-xs text-muted-foreground">Allow citizens to submit feedback and vote on priorities</p>
                        </div>
                        <Switch 
                          id="public-feedback" 
                          checked={systemSettings.publicFeedback}
                          onCheckedChange={(checked) => setSystemSettings({ ...systemSettings, publicFeedback: checked })}
                        />
                      </div>
                      
                      <div className="grid gap-2">
                        <Label htmlFor="audit-frequency">Audit Frequency</Label>
                        <Select 
                          value={systemSettings.auditFrequency}
                          onValueChange={(value) => setSystemSettings({ ...systemSettings, auditFrequency: value })}
                        >
                          <SelectTrigger id="audit-frequency">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Daily">Daily</SelectItem>
                            <SelectItem value="Weekly">Weekly</SelectItem>
                            <SelectItem value="Monthly">Monthly</SelectItem>
                            <SelectItem value="Quarterly">Quarterly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4 flex justify-end">
                <Button variant="outline" className="mr-2">Reset to Defaults</Button>
                <Button onClick={saveSystemSettings}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
  </Tabs>
    </div>
  )
}
