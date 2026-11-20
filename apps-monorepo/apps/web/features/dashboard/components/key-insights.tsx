"use client"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card"
import {
  Bar,
  BarChart,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
  type ChartConfig,
} from "@workspace/ui/components/chart"
import { LightbulbIcon } from "lucide-react"
import { useLayoutEffect, useRef, useState } from "react"

const CELL_SIZE = 14
const CELL_GAP = 2

const regions = [
  { key: "asia", label: "Asia", share: 60, color: "var(--chart-1)" },
  { key: "usa", label: "USA", share: 25, color: "var(--chart-2)" },
  { key: "europe", label: "Europe", share: 15, color: "var(--chart-5)" },
] as const

const shareTotal = regions.reduce((sum, region) => sum + region.share, 0)

const chartData = [
  {
    label: "Regions",
    asia: regions[0].share,
    usa: regions[1].share,
    europe: regions[2].share,
  },
]

const chartConfig = {
  asia: { label: "Asia", color: regions[0].color },
  usa: { label: "USA", color: regions[1].color },
  europe: { label: "Europe", color: regions[2].color },
} satisfies ChartConfig

function cellsForWidth(width: number) {
  if (width <= 0) return 18
  return Math.max(
    regions.length,
    Math.round((width + CELL_GAP) / (CELL_SIZE + CELL_GAP))
  )
}

function regionCounts(total: number) {
  const exact = regions.map((region) => (region.share / shareTotal) * total)
  const counts = exact.map((value) => Math.floor(value))
  let remaining = total - counts.reduce((sum, count) => sum + count, 0)

  exact
    .map((value, index) => ({ index, fraction: value - counts[index]! }))
    .sort((a, b) => b.fraction - a.fraction)
    .forEach(({ index }) => {
      if (remaining === 0) return
      counts[index]! += 1
      remaining -= 1
    })

  return counts
}

type RegionCellsProps = {
  x?: number
  y?: number
  width?: number
  height?: number
  fill?: string
}

function createRegionCells(count: number) {
  return function RegionCells({ x, y, width, height, fill }: RegionCellsProps) {
    if (
      x == null ||
      y == null ||
      width == null ||
      height == null ||
      count <= 0 ||
      width <= 0 ||
      height <= 0
    ) {
      return null
    }

    const cellWidth = (width - count * CELL_GAP) / count
    if (cellWidth <= 0) return null

    const cellSize = Math.min(height, cellWidth)
    const yOffset = y + (height - cellSize) / 2

    return (
      <g>
        {Array.from({ length: count }, (_, index) => (
          <rect
            key={index}
            x={x + index * (cellWidth + CELL_GAP)}
            y={yOffset}
            width={cellSize}
            height={cellSize}
            fill={fill}
          />
        ))}
      </g>
    )
  }
}

export function KeyInsights() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base font-bold">
          <LightbulbIcon size={16} className="text-muted-foreground" />
          Key Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4 border-t px-4 py-5">
        <p className="text-2xl font-bold">$20,320</p>
        <p className="flex items-center gap-1">
          <span className="text-emerald-500">+40%</span>
          <span className="text-muted-foreground">vs last month</span>
        </p>
        <KeyInsightsChart />
      </CardContent>
    </Card>
  )
}

export function KeyInsightsChart() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [totalCells, setTotalCells] = useState(18)
  const [asiaCount = 0, usaCount = 0, europeCount = 0] =
    regionCounts(totalCells)

  useLayoutEffect(() => {
    const track = trackRef.current
    if (!track) return

    const update = () => setTotalCells(cellsForWidth(track.clientWidth))
    update()

    const observer = new ResizeObserver(update)
    observer.observe(track)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={trackRef}>
      <ChartContainer config={chartConfig} className="aspect-auto h-16 w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
          barSize={CELL_SIZE}
          barCategoryGap={0}
          barGap={0}
        >
          <XAxis type="number" hide domain={[0, shareTotal]} />
          <YAxis type="category" dataKey="label" hide width={0} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <ChartLegend
            itemSorter={null}
            content={<ChartLegendContent className="justify-start p-0" />}
          />
          <Bar
            dataKey="asia"
            stackId="regions"
            fill="var(--color-asia)"
            isAnimationActive={false}
            shape={createRegionCells(asiaCount)}
          />
          <Bar
            dataKey="usa"
            stackId="regions"
            fill="var(--color-usa)"
            isAnimationActive={false}
            shape={createRegionCells(usaCount)}
          />
          <Bar
            dataKey="europe"
            stackId="regions"
            fill="var(--color-europe)"
            isAnimationActive={false}
            shape={createRegionCells(europeCount)}
          />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
