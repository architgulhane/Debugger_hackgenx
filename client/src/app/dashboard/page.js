import { DashboardShell } from "../../../components/dashboard-shell"
import { OverviewSection } from "../../../components/overview-section"
import { SectorAllocation } from "../../../components/sector-allocation"
import Input from '../../../components/input'
export default function DashboardPage() {
  return (
    <DashboardShell>

      <div className="flex flex-col gap-4">
        <OverviewSection />
        <div className="mt-4 flex flex-col ">
          <SectorAllocation />
        </div>
      </div>
    </DashboardShell>
  )
}
