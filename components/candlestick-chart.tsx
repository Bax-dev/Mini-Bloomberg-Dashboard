"use client"

import { useEffect, useState } from "react"
import {
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface CandlestickData {
  time: string
  open: number
  high: number
  low: number
  close: number
  isPositive: boolean
  highLow: number // For rendering the wick
  body: number // For rendering the body
}

interface CandlestickChartProps {
  coinId: string
  coinName: string
  coinSymbol: string
}

export default function CandlestickChart({ coinId, coinName, coinSymbol }: CandlestickChartProps) {
  const [data, setData] = useState<CandlestickData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCandlestickData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/ohlc?vs_currency=usd&days=7`,
        )
        if (!response.ok) throw new Error("Failed to fetch candlestick data")

        const ohlcData = await response.json() as [number, number, number, number, number][]

        const formattedData = ohlcData.map(([timestamp, open, high, low, close]) => {
          const date = new Date(timestamp)
          const isPositive = close >= open
          return {
            time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            open: Math.round(open * 100) / 100,
            high: Math.round(high * 100) / 100,
            low: Math.round(low * 100) / 100,
            close: Math.round(close * 100) / 100,
            isPositive,
            highLow: high - low,
            body: Math.abs(close - open),
          }
        })

        setData(formattedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching candlestick data")
      } finally {
        setLoading(false)
      }
    }

    fetchCandlestickData()
  }, [coinId])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-32 mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{coinName} Candlestick Chart</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const minPrice = Math.min(...data.map((d) => d.low))
  const maxPrice = Math.max(...data.map((d) => d.high))
  const currentPrice = data[data.length - 1]?.close || 0
  const startPrice = data[0]?.open || 0
  const changePercent = ((currentPrice - startPrice) / startPrice) * 100

  // Transform data for rendering
  const chartData = data.map((d) => ({
    ...d,
    // Use high for positioning the top of the wick
    value: d.high,
    // Calculate body position
    bodyTop: Math.min(d.open, d.close),
    bodyBottom: Math.max(d.open, d.close),
  }))

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-lg sm:text-xl">{coinName} 7-Day Candlestick</span>
          <span className="text-xs sm:text-sm font-normal text-muted-foreground">{coinSymbol.toUpperCase()}</span>
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          <span className={changePercent >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}>
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </span>
          {" • "}
          <span>${currentPrice.toLocaleString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="w-full h-[300px] sm:h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="time"
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
              domain={[minPrice * 0.98, maxPrice * 1.02]}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value: number, name: string, props: { payload?: CandlestickData }) => {
                if (!props.payload) return [value, name]
                const { open, high, low, close } = props.payload
                return [
                  <div key="tooltip" className="space-y-1 text-sm">
                    <div>Open: ${open.toLocaleString()}</div>
                    <div>High: ${high.toLocaleString()}</div>
                    <div>Low: ${low.toLocaleString()}</div>
                    <div>Close: ${close.toLocaleString()}</div>
                  </div>,
                  "OHLC",
                ]
              }}
            />
          </ComposedChart>
          </ResponsiveContainer>
        </div>
        {/* Render candlesticks as SVG overlay */}
        <CandlestickOverlay data={chartData} minPrice={minPrice} maxPrice={maxPrice} />
      </CardContent>
    </Card>
  )
}

// Separate component for rendering candlesticks
function CandlestickOverlay({ data, minPrice, maxPrice }: { data: CandlestickData[], minPrice: number, maxPrice: number }) {
  const range = maxPrice - minPrice
  const barWidth = 8
  const spacing = 100 / data.length

  return (
    <div className="relative -mt-[300px] sm:-mt-[400px] pointer-events-none h-[300px] sm:h-[400px]">
      <svg width="100%" height="100%" className="absolute inset-0" style={{ overflow: "visible" }}>
        {data.map((entry, index) => {
          const color = entry.isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"
          const centerX = (index * spacing) + (spacing / 2)
          
          // Calculate Y positions as percentages (inverted for SVG)
          const highPercent = ((maxPrice - entry.high) / range) * 100
          const lowPercent = ((maxPrice - entry.low) / range) * 100
          const openPercent = ((maxPrice - entry.open) / range) * 100
          const closePercent = ((maxPrice - entry.close) / range) * 100
          
          const bodyTop = Math.min(openPercent, closePercent)
          const bodyBottom = Math.max(openPercent, closePercent)
          const bodyHeight = bodyBottom - bodyTop

          return (
            <g key={index}>
              {/* Wick (vertical line from high to low) */}
              <line
                x1={`${centerX}%`}
                y1={`${highPercent}%`}
                x2={`${centerX}%`}
                y2={`${lowPercent}%`}
                stroke={color}
                strokeWidth="1.5"
              />
              {/* Body (rectangle from open to close) */}
              <rect
                x={`${centerX - (barWidth / 2)}%`}
                y={`${bodyTop}%`}
                width={`${barWidth}%`}
                height={`${Math.max(bodyHeight, 0.3)}%`}
                fill={color}
                stroke={color}
                strokeWidth="1"
              />
            </g>
          )
        })}
      </svg>
    </div>
  )
}
