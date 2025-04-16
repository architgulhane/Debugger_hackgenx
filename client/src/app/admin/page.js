import { DashboardShell } from "../../../components/dashboard-shell"
import { AdminPanel } from "../../../components/admin-panel"

export default function AdminPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Panel</h1>
          <p className="text-muted-foreground">Administrative controls for system configuration and management</p>
        </div>

        <AdminPanel />
      </div>
    </DashboardShell>
  )
}
