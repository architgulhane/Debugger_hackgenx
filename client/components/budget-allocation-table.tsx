.."use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../components/ui/table"
import { Badge } from "../components/ui/badge"

const allocations = [
  {
    id: "AL-1023",
    date: "2023-03-15",
    sector: "Education",
    amount: "$1.2M",
    status: "Approved",
    impact: "High",
  },
  {
    id: "AL-1022",
    date: "2023-03-12",
    sector: "Healthcare",
    amount: "$0.8M",
    status: "Approved",
    impact: "Medium",
  },
  {
    id: "AL-1021",
    date: "2023-03-10",
    sector: "Infrastructure",
    amount: "$1.5M",
    status: "Pending",
    impact: "High",
  },
  {
    id: "AL-1020",
    date: "2023-03-08",
    sector: "Social Services",
    amount: "$0.5M",
    status: "Approved",
    impact: "Medium",
  },
  {
    id: "AL-1019",
    date: "2023-03-05",
    sector: "Environment",
    amount: "$0.3M",
    status: "Approved",
    impact: "Low",
  },
]

export function BudgetAllocationTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Sector</TableHead>
          <TableHead>Amount</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Impact</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allocations.map((allocation) => (
          <TableRow key={allocation.id}>
            <TableCell className="font-medium">{allocation.id}</TableCell>
            <TableCell>{allocation.date}</TableCell>
            <TableCell>{allocation.sector}</TableCell>
            <TableCell>{allocation.amount}</TableCell>
            <TableCell>
              <Badge variant={allocation.status === "Approved" ? "default" : "outline"}>{allocation.status}</Badge>
            </TableCell>
            <TableCell>
              <Badge
                variant="outline"
                className={
                  allocation.impact === "High"
                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                    : allocation.impact === "Medium"
                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                }
              >
                {allocation.impact}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
