"use client"

import { useState, useEffect } from "react"
import { Check, Clock, Download, FileText, Link2, QrCode, Search, SlidersHorizontal } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { Progress } from "../components/ui/progress"

// Generate transaction data
const generateTransactionData = () => {
  const sectors = ["Education", "Healthcare", "Infrastructure", "Public Safety", "Social Services", "Environment"]
  const departments = [
    "Ethereum",
    "Solana",
    "Solana Testnet",
    "Ethereum Sepolia",
    "Polygon",
    "Sui",
    "Monad",
    "Monad Testnet",
    "Base",
    "Ripple",
    "Cardano",
    "Binanace",
  ]
  const projects = [
    "School Renovation",
    "Medical Equipment",
    "Road Construction",
    "Security Systems",
    "Food Assistance",
    "Waste Management",
    "Teacher Training",
    "Vaccine Distribution",
    "Bridge Repair",
    "Emergency Response",
    "Housing Assistance",
    "Water Conservation",
  ]
  const statuses = ["Completed", "In Progress", "Pending", "Verified"]

  const transactions = []

  for (let i = 1; i <= 20; i++) {
    const sectorIndex = Math.floor(Math.random() * sectors.length)
    const sector = sectors[sectorIndex]

    // Match department to sector
    let departmentIndex
    if (sectorIndex === 0) departmentIndex = Math.floor(Math.random() * 2)
    else if (sectorIndex === 1) departmentIndex = 2 + Math.floor(Math.random() * 2)
    else if (sectorIndex === 2) departmentIndex = 4 + Math.floor(Math.random() * 2)
    else if (sectorIndex === 3) departmentIndex = 6 + Math.floor(Math.random() * 2)
    else if (sectorIndex === 4) departmentIndex = 8 + Math.floor(Math.random() * 2)
    else departmentIndex = 10 + Math.floor(Math.random() * 2)

    const department = departments[departmentIndex]

    // Match project to sector
    let projectIndex
    if (sectorIndex === 0) projectIndex = Math.floor(Math.random() * 2)
    else if (sectorIndex === 1) projectIndex = 2 + Math.floor(Math.random() * 2)
    else if (sectorIndex === 2) projectIndex = 4 + Math.floor(Math.random() * 2)
    else if (sectorIndex === 3) projectIndex = 6 + Math.floor(Math.random() * 2)
    else if (sectorIndex === 4) projectIndex = 8 + Math.floor(Math.random() * 2)
    else projectIndex = 10 + Math.floor(Math.random() * 2)

    const project = projects[projectIndex]

    // Generate random date in the last 30 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 30))

    // Generate random amount between ₹10,000 and ₹500,000
    const amount = Math.floor(Math.random() * 490000) + 10000

    transactions.push({
      id: `TX-${1000 + i}`,
      date: date.toISOString().split("T")[0],
      sector,
      department,
      project,
      amount,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      blockchainId: `0x${Math.random().toString(16).substr(2, 40)}`,
      approvedBy: ["Budget Officer", "Finance Director", "Department Head", "System (Automated)"][
        Math.floor(Math.random() * 4)
      ],
      timestamp: date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    })
  }

  return transactions
}

// Generate audit log data
const generateAuditLogData = () => {
  const actions = [
    "Transaction Created",
    "Transaction Approved",
    "Funds Released",
    "Documentation Added",
    "Status Updated",
    "Verification Completed",
  ]
  const users = [
    "John Smith (Budget Officer)",
    "Maria Garcia (Finance Director)",
    "David Chen (Department Head)",
    "Sarah Johnson (Auditor)",
    "System (Automated)",
  ]

  const auditLogs = []

  for (let i = 1; i <= 15; i++) {
    // Generate random date in the last 7 days
    const date = new Date()
    date.setDate(date.getDate() - Math.floor(Math.random() * 7))

    auditLogs.push({
      id: `LOG-${1000 + i}`,
      timestamp: date.toISOString().replace("T", " ").substr(0, 19),
      action: actions[Math.floor(Math.random() * actions.length)],
      user: users[Math.floor(Math.random() * users.length)],
      transactionId: `TX-${1000 + Math.floor(Math.random() * 20) + 1}`,
      ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      metadata: {
        reason: ["Budget approval", "Emergency allocation", "Scheduled payment", "Policy implementation"][
          Math.floor(Math.random() * 4)
        ],
        notes: ["Approved as per policy", "Verified documentation", "Expedited process", "Standard procedure"][
          Math.floor(Math.random() * 4)
        ],
      },
    })
  }

  return auditLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

export function BlockchainLedger() {
  const [transactions, setTransactions] = useState(generateTransactionData())
  const [auditLogs, setAuditLogs] = useState(generateAuditLogData())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSector, setSelectedSector] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("")
  const [selectedTransaction, setSelectedTransaction] = useState<any>(null)
  const [showQRCode, setShowQRCode] = useState(false)
  const [activeTab, setActiveTab] = useState("transactions")
  const [verificationProgress, setVerificationProgress] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<string | null>(null)

  // Filter transactions based on search and filters
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.project.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesSector = selectedSector === "" || transaction.sector === selectedSector
    const matchesStatus = selectedStatus === "" || transaction.status === selectedStatus

    return matchesSearch && matchesSector && matchesStatus
  })

  // Filter audit logs based on search
  const filteredAuditLogs = auditLogs.filter((log) => {
    return (
      searchTerm === "" ||
      log.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  // Simulate transaction verification
  const verifyTransaction = (transactionId: string) => {
    setIsVerifying(true)
    setVerificationProgress(0)
    setVerificationResult(null)

    const interval = setInterval(() => {
      setVerificationProgress((prev) => {
        const newProgress = prev + Math.floor(Math.random() * 10) + 5
        if (newProgress >= 100) {
          clearInterval(interval)
          setIsVerifying(false)
          setVerificationResult("Transaction verified successfully on the blockchain. Hash integrity confirmed.")
          return 100
        }
        return newProgress
      })
    }, 300)
  }

  // Add a new transaction occasionally
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newTransaction = generateTransactionData()[0]
        setTransactions((prev) => [newTransaction, ...prev.slice(0, -1)])

        // Also add an audit log for this transaction
        const newAuditLog = {
          id: `LOG-${1000 + Math.floor(Math.random() * 1000)}`,
          timestamp: new Date().toISOString().replace("T", " ").substr(0, 19),
          action: "Transaction Created",
          user: ["John Smith (Budget Officer)", "System (Automated)"][Math.floor(Math.random() * 2)],
          transactionId: newTransaction.id,
          ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
          metadata: {
            reason: "New allocation",
            notes: "Created via system",
          },
        }

        setAuditLogs((prev) => [newAuditLog, ...prev])
      }
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-1 w-full">
          <TabsTrigger value="transactions">Transaction Ledger</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Transaction Ledger</CardTitle>
                  <CardDescription>Transparent record of all budget transactions</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Select value={selectedSector} onValueChange={setSelectedSector}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Sectors" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Sectors</SelectItem>
                      <SelectItem value="Education">Education</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                      <SelectItem value="Public Safety">Public Safety</SelectItem>
                      <SelectItem value="Social Services">Social Services</SelectItem>
                      <SelectItem value="Environment">Environment</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="All Statuses" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Verified">Verified</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="ghost" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">SHA256 ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Blockchain</TableHead>
                      <TableHead>Project</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TableRow key={crypto.randomUUID()}>
                          <TableCell className="font-medium">T{Math.floor(Math.random() * 1000)}</TableCell>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>{transaction.department}</TableCell>
                          <TableCell>{transaction.project}</TableCell>
                          <TableCell className="text-right">₹{transaction.amount.toLocaleString()}</TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className={
                                transaction.status === "Verified"
                                  ? "bg-green-100 text-green-800 hover:bg-green-100"
                                  : transaction.status === "Completed"
                                    ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                                    : transaction.status === "In Progress"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                              }
                            >
                              {transaction.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => setSelectedTransaction(transaction)}>
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} className="h-24 text-center">
                          No transactions found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredTransactions.length} of {transactions.length} transactions
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

        <TabsContent value="audit" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>Chronological record of system activities and changes</CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search audit logs..."
                      className="pl-8 w-[250px]"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export Logs
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {filteredAuditLogs.length > 0 ? (
                  filteredAuditLogs.map((log) => (
                    <div key={log.id} className="flex gap-4 text-sm border-l-2 border-muted pl-4 pb-6 relative">
                      <div className="absolute -left-1.5 top-0 h-3 w-3 rounded-full bg-primary"></div>
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="font-normal">
                            {log.action}
                          </Badge>
                          <span className="text-xs text-muted-foreground">Transaction {log.transactionId}</span>
                        </div>
                        <p className="text-sm font-medium">{log.user}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {new Date(log.timestamp).toLocaleString()}
                        </div>

                        <div className="mt-2 p-2 bg-muted/30 rounded-md">
                          <div className="text-xs">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">IP Address:</span>
                              <span>{log.ipAddress}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-muted-foreground">Reason:</span>
                              <span>{log.metadata.reason}</span>
                            </div>
                            <div className="flex justify-between mt-1">
                              <span className="text-muted-foreground">Notes:</span>
                              <span>{log.metadata.notes}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 flex justify-end">
                          <Button variant="ghost" size="sm">
                            Verify on Blockchain
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-muted-foreground">No audit logs found matching your search criteria.</p>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div className="text-sm text-muted-foreground">
                Showing {filteredAuditLogs.length} of {auditLogs.length} audit logs
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" disabled>
                  Load More
                </Button>
              </div>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="verification" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Blockchain Verification</CardTitle>
              <CardDescription>Verify transaction integrity on the blockchain</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <div className="p-4 border rounded-lg bg-muted/30">
                    <h3 className="font-medium mb-2">What is Blockchain Verification?</h3>
                    <p className="text-sm text-muted-foreground">
                      All budget transactions are recorded on a public blockchain, ensuring transparency and preventing
                      tampering. Each transaction receives a unique hash that can be independently verified.
                    </p>
                  </div>

                  <div className="space-y-4 mt-6">
                    <h3 className="font-medium">Verify Transaction</h3>
                    <div className="flex gap-2">
                      <Input placeholder="Enter transaction ID or hash" />
                      <Button onClick={() => verifyTransaction("TX-1001")}>Verify</Button>
                    </div>

                    {isVerifying && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Verifying transaction on blockchain...</span>
                          <span>{verificationProgress}%</span>
                        </div>
                        <Progress value={verificationProgress} className="h-2" />
                      </div>
                    )}

                    {verificationResult && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-md text-green-800 flex items-start">
                        <Check className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <p>{verificationResult}</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-4">QR Code Verification</h3>
                    <div className="flex justify-center p-4 border rounded-lg">
                      <div className="text-center">
                        <div className="w-48 h-48 bg-white border flex items-center justify-center mx-auto">
                          <QrCode className="w-32 h-32 text-primary/20" />
                        </div>
                        <p className="text-xs text-center mt-2 text-muted-foreground">
                          Scan to verify transaction TX-1001 on blockchain
                        </p>
                        <Button variant="outline" size="sm" className="mt-4">
                          Download QR Code
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-4">Recent Verified Transactions</h3>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Transaction ID</TableHead>
                          <TableHead>Verification Time</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {transactions
                          .filter((t) => t.status === "Verified")
                          .slice(0, 5)
                          .map((transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell className="font-medium">{transaction.id}</TableCell>
                              <TableCell>
                                {transaction.date} {transaction.timestamp}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                                  Verified
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div className="mt-6">
                    <h3 className="font-medium mb-4">Blockchain Statistics</h3>
                    <div className="space-y-4">
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Total Transactions</span>
                          <span className="font-bold">{transactions.length}</span>
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Verified Transactions</span>
                          <span className="font-bold">
                            {transactions.filter((t) => t.status === "Verified").length}
                          </span>
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Average Verification Time</span>
                          <span className="font-bold">2.3 minutes</span>
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Blockchain Network</span>
                          <span className="font-bold">Ethereum</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedTransaction && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
              <DialogDescription>Complete information about transaction {selectedTransaction.id}</DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium mb-1">Transaction ID</h3>
                  <p className="text-sm">{selectedTransaction.id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Date</h3>
                  <p className="text-sm">{selectedTransaction.date}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Sector</h3>
                  <p className="text-sm">{selectedTransaction.sector}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Department</h3>
                  <p className="text-sm">{selectedTransaction.department}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Project</h3>
                  <p className="text-sm">{selectedTransaction.project}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Amount</h3>
                  <p className="text-sm">₹{selectedTransaction.amount.toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Status</h3>
                  <Badge
                    variant="outline"
                    className={
                      selectedTransaction.status === "Verified"
                        ? "bg-green-100 text-green-800 hover:bg-green-100"
                        : selectedTransaction.status === "Completed"
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-100"
                          : selectedTransaction.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                    }
                  >
                    {selectedTransaction.status}
                  </Badge>
                </div>
                <div>
                  <h3 className="text-sm font-medium mb-1">Blockchain Hash</h3>
                  <p className="text-xs text-muted-foreground font-mono">{selectedTransaction.blockchainId}</p>
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <h3 className="text-sm font-medium mb-2">Transaction Timeline</h3>
                <div className="space-y-3">
                  <div className="flex gap-2 items-center text-sm">
                    <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </Badge>
                    <span>Transaction Created</span>
                    <span className="text-xs text-muted-foreground ml-auto">{selectedTransaction.date} 09:15 AM</span>
                  </div>
                  <div className="flex gap-2 items-center text-sm">
                    <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </Badge>
                    <span>Approval Process</span>
                    <span className="text-xs text-muted-foreground ml-auto">{selectedTransaction.date} 10:22 AM</span>
                  </div>
                  <div className="flex gap-2 items-center text-sm">
                    <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                      <Check className="h-3 w-3" />
                    </Badge>
                    <span>Funds Released</span>
                    <span className="text-xs text-muted-foreground ml-auto">{selectedTransaction.date} 11:45 AM</span>
                  </div>
                  {selectedTransaction.status === "Verified" && (
                    <div className="flex gap-2 items-center text-sm">
                      <Badge variant="outline" className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
                        <Check className="h-3 w-3" />
                      </Badge>
                      <span>Verification Complete</span>
                      <span className="text-xs text-muted-foreground ml-auto">{selectedTransaction.date} 02:30 PM</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t pt-4 mt-2">
                <h3 className="text-sm font-medium mb-2">QR Code Verification</h3>
                <div className="flex justify-center">
                  <div className="text-center">
                    <div className="w-32 h-32 bg-white border flex items-center justify-center mx-auto">
                      <QrCode className="w-24 h-24 text-primary/20" />
                    </div>
                    <p className="text-xs text-center mt-2 text-muted-foreground">Scan to verify on blockchain</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export Details
              </Button>
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
