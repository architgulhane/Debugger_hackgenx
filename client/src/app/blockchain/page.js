import { DashboardShell } from "../../../components/dashboard-shell"
import { BlockchainLedger } from "../../../components/blockchain-ledger"

export default function BlockchainPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Blockchain Ledger</h1>
          <p className="text-muted-foreground">Transparent and immutable record of all budget transactions</p>
        </div>

        <BlockchainLedger />
      </div>
    </DashboardShell>
  )
}
