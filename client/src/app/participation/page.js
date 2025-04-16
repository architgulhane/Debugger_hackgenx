import { DashboardShell } from "../../../components/dashboard-shell"
import {FeedbackForm} from '../../../components/reports-generator'

export default function ReportsPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Reports</h1>
          <p className="text-muted-foreground">
            Comprehensive reports and analytics for budget allocation and performance
          </p>
        </div>
        <FeedbackForm/>
      </div>
    </DashboardShell>
  )
}
