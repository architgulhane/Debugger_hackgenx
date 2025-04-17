import { DashboardShell } from "../../../components/dashboard-shell"
import LoadingScreen from '../../../components/loading'
export default function ScenariosPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Fund Requests</h1>
          <p className="text-muted-foreground">
            Simulate different budget Requests and analyze their potential Chances
          </p>
        </div>

        <LoadingScreen/>
      </div>
    </DashboardShell>
  )
}
