"use client"

import { useEffect, useState } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface TrendData {
  time: string
  price: number
}

interface TrendChartProps {
  coinId: string
  coinName: string
  coinSymbol: string
}

export default function TrendChart({ coinId, coinName, coinSymbol }: TrendChartProps) {
  const [data, setData] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTrendData = async () => {
      try {
        setLoading(true)
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`,
        )
        if (!response.ok) throw new Error("Failed to fetch trend data")

        const result = await response.json()
        const prices = result.prices as [number, number][]

        const formattedData = prices.map((price) => {
          const date = new Date(price[0])
          return {
            time: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            price: Math.round(price[1] * 100) / 100,
          }
        })

        setData(formattedData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching trend data")
      } finally {
        setLoading(false)
      }
    }

    fetchTrendData()
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
          <CardTitle>{coinName} 7-Day Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const minPrice = Math.min(...data.map((d) => d.price))
  const maxPrice = Math.max(...data.map((d) => d.price))
  const currentPrice = data[data.length - 1]?.price || 0
  const startPrice = data[0]?.price || 0
  const changePercent = ((currentPrice - startPrice) / startPrice) * 100

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{coinName} 7-Day Trend</span>
          <span className="text-sm font-normal text-muted-foreground">{coinSymbol.toUpperCase()}</span>
        </CardTitle>
        <CardDescription>
          <span className={changePercent >= 0 ? "text-success" : "text-destructive"}>
            {changePercent >= 0 ? "+" : ""}
            {changePercent.toFixed(2)}%
          </span>
          {" • "}
          <span>${currentPrice.toLocaleString()}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="time" stroke="hsl(var(--muted-foreground))" style={{ fontSize: "12px" }} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              style={{ fontSize: "12px" }}
              domain={["dataMin - 5", "dataMax + 5"]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "var(--radius)",
              }}
              formatter={(value) => [`$${value.toLocaleString()}`, "Price"]}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={changePercent >= 0 ? "hsl(var(--success))" : "hsl(var(--destructive))"}
              dot={{ fill: "hsl(var(--primary))", r: 4 }}
              activeDot={{ r: 6 }}
              strokeWidth={2}
              isAnimationActive={true}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
