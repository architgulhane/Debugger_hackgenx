import { DashboardShell } from "../../../components/dashboard-shell"
import { TransactionTransparency } from "../../../components/transaction-transparency"

export default function TransparencyPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Budget Transparency</h1>
          <p className="text-muted-foreground">
            Complete transparency of all budget transactions with blockchain verification
          </p>
        </div>

        <TransactionTransparency />
      </div>
    </DashboardShell>
  )
}
