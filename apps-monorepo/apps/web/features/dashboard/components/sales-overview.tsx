"use client"

import { Button } from "@workspace/ui/components/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu"
import {
  ActivityIcon,
  ArrowUpIcon,
  ChevronDownIcon,
  CircleArrowUpIcon,
} from "lucide-react"
import { useState } from "react"

const chartConfig = {
  teamA: { label: "Team A", color: "var(--chart-1)" },
  teamB: { label: "Team B", color: "var(--chart-2)" },
  teamC: { label: "Team C", color: "var(--chart-4)" },
} satisfies ChartConfig

const teams = [
  { key: "teamA", label: "Team A", color: "var(--chart-1)" },
  { key: "teamB", label: "Team B", color: "var(--chart-2)" },
  { key: "teamC", label: "Team C", color: "var(--chart-4)" },
] as const

const yTicks = [0, 5000, 10000, 15000, 20000, 25000, 30000]

type Range = "7" | "30" | "90"

type RevenuePoint = {
  date: string
  teamA: number
  teamB: number
  teamC: number
}

const ranges: Record<
  Range,
  { label: string; total: string; change: string; data: RevenuePoint[] }
> = {
  "7": {
    label: "Last 7 Days",
    total: "$148,000",
    change: "+6.2%",
    data: [
      { date: "Feb 2", teamA: 4200, teamB: 2100, teamC: 1800 },
      { date: "Feb 3", teamA: 5100, teamB: 2400, teamC: 2200 },
      { date: "Feb 4", teamA: 4600, teamB: 2300, teamC: 1900 },
      { date: "Feb 5", teamA: 6200, teamB: 2800, teamC: 2400 },
      { date: "Feb 6", teamA: 5400, teamB: 2600, teamC: 2100 },
      { date: "Feb 7", teamA: 4800, teamB: 2200, teamC: 2000 },
      { date: "Feb 8", teamA: 7100, teamB: 3200, teamC: 2700 },
    ],
  },
  "30": {
    label: "Last 30 Days",
    total: "$640,000",
    change: "+18.0%",
    data: [
      { date: "Jan 1", teamA: 7600, teamB: 4500, teamC: 4900 },
      { date: "Jan 4", teamA: 7400, teamB: 4200, teamC: 4400 },
      { date: "Jan 6", teamA: 9100, teamB: 5400, teamC: 5500 },
      { date: "Jan 8", teamA: 8300, teamB: 5100, teamC: 4600 },
      { date: "Jan 12", teamA: 10000, teamB: 6200, teamC: 6300 },
      { date: "Jan 16", teamA: 7000, teamB: 4100, teamC: 4400 },
      { date: "Jan 20", teamA: 8600, teamB: 5400, teamC: 5500 },
      { date: "Jan 24", teamA: 11200, teamB: 6500, teamC: 6800 },
      { date: "Jan 28", teamA: 10100, teamB: 6100, teamC: 6200 },
      { date: "Feb 1", teamA: 8900, teamB: 5400, teamC: 5200 },
      { date: "Feb 5", teamA: 9800, teamB: 6900, teamC: 5300 },
      { date: "Feb 8", teamA: 12000, teamB: 8000, teamC: 6500 },
    ],
  },
  "90": {
    label: "Last 90 Days",
    total: "$1,820,000",
    change: "+12.4%",
    data: [
      { date: "Nov 10", teamA: 6400, teamB: 3800, teamC: 3200 },
      { date: "Nov 17", teamA: 7200, teamB: 4100, teamC: 3600 },
      { date: "Nov 24", teamA: 6800, teamB: 4000, teamC: 3900 },
      { date: "Dec 1", teamA: 8100, teamB: 4700, teamC: 4200 },
      { date: "Dec 8", teamA: 7600, teamB: 4500, teamC: 4100 },
      { date: "Dec 15", teamA: 9200, teamB: 5400, teamC: 4800 },
      { date: "Dec 22", teamA: 11000, teamB: 6200, teamC: 5600 },
      { date: "Dec 29", teamA: 8400, teamB: 4900, teamC: 4300 },
      { date: "Jan 5", teamA: 9000, teamB: 5300, teamC: 5000 },
      { date: "Jan 12", teamA: 10200, teamB: 6000, teamC: 5800 },
      { date: "Jan 19", teamA: 8800, teamB: 5200, teamC: 4900 },
      { date: "Jan 26", teamA: 10800, teamB: 6400, teamC: 6100 },
      { date: "Feb 2", teamA: 9600, teamB: 5700, teamC: 5200 },
      { date: "Feb 8", teamA: 12000, teamB: 7100, teamC: 6400 },
    ],
  },
}

function formatTick(value: number) {
  if (value === 0) return "0"
  return `${value / 1000}k`
}

export function SalesOverview() {
  const [range, setRange] = useState<Range>("30")
  const selected = ranges[range]

  return (
    <Card className="h-full">
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-base font-bold">
            <ActivityIcon size={16} className="text-muted-foreground" />
            Sales Overview
          </CardTitle>
          <p className="flex flex-wrap items-center gap-2">
            <CircleArrowUpIcon size={16} className="text-emerald-500" />
            <span className="text-sm font-medium text-emerald-500">
              {selected.change}
            </span>
          </p>
        </div>
      </CardHeader>
      <CardContent className="gap-4 border-t px-4 py-5">
        <div className="mb-4 flex flex-wrap items-center justify-between">
          <div className="flex flex-col flex-wrap items-start gap-1">
            <p className="text-base font-normal text-foreground">
              Revenue Overview
            </p>
            <p className="flex flex-wrap items-baseline gap-2">
              <span className="text-2xl font-bold">{selected.total}</span>
              <span className="text-sm font-medium text-emerald-500">
                {selected.change}
              </span>
              <span className="text-sm text-muted-foreground">
                vs last month
              </span>
            </p>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            {teams.map((team) => (
              <span key={team.key} className="flex items-center gap-1.5">
                <span
                  aria-hidden
                  className="size-2 shrink-0 rounded-full"
                  style={{ backgroundColor: team.color }}
                />
                {team.label}
              </span>
            ))}

            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    className="min-w-36 justify-between"
                  />
                }
              >
                {selected.label}
                <ChevronDownIcon />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                <DropdownMenuRadioGroup
                  value={range}
                  onValueChange={(value) => {
                    if (value === "7" || value === "30" || value === "90") {
                      setRange(value)
                    }
                  }}
                >
                  {(Object.keys(ranges) as Range[]).map((key) => (
                    <DropdownMenuRadioItem key={key} value={key} closeOnClick>
                      {ranges[key].label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-72 w-full"
        >
          <BarChart
            accessibilityLayer
            data={selected.data}
            margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
            barCategoryGap="22%"
          >
            <CartesianGrid
              vertical={false}
              stroke="#ccc"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={12}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              ticks={yTicks}
              domain={[0, 30000]}
              tickFormatter={formatTick}
              width={36}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="teamA"
              stackId="revenue"
              fill="var(--color-teamA)"
              maxBarSize={48}
            />
            <Bar
              dataKey="teamB"
              stackId="revenue"
              fill="var(--color-teamB)"
              maxBarSize={48}
            />
            <Bar
              dataKey="teamC"
              stackId="revenue"
              fill="var(--color-teamC)"
              maxBarSize={48}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
