import { HeaderCard } from "./components/header"
import { KeyInsights } from "./components/key-insights"
import { SalesOverview } from "./components/sales-overview"

export default function DashboardPage() {
  return (
    <div className="grid gap-4 md:grid-cols-12">
      <div className="col-span-12 h-full md:col-span-8">
        <HeaderCard />
      </div>
      <div className="col-span-12 h-full md:col-span-4">
        <KeyInsights />
      </div>
      <div className="col-span-12 h-full md:col-span-8">
        <SalesOverview />
      </div>
    </div>
  )
}
