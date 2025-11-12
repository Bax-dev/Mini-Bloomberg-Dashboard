"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getFinnhubUrl } from "@/lib/finnhub-api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface StockMetricsProps {
  symbol: string
  name: string
}

interface MetricData {
  metric: string
  value: string | number
  change?: number
}

interface CandleData {
  time: string
  price: number
}

export default function StockMetrics({ symbol, name }: StockMetricsProps) {
  const [metrics, setMetrics] = useState<MetricData[]>([])
  const [chartData, setChartData] = useState<CandleData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true)
        setError(null)

        // Fetch company profile for additional metrics
        const profileUrl = getFinnhubUrl("/stock/profile2", { symbol })
        const profileResponse = await fetch(profileUrl)
        const profileData = profileResponse.ok ? await profileResponse.json() : null

        // Fetch quote data
        const quoteUrl = getFinnhubUrl("/quote", { symbol })
        const quoteResponse = await fetch(quoteUrl)
        if (!quoteResponse.ok) throw new Error("Failed to fetch quote")
        const quoteData = await quoteResponse.json()

        // Fetch candlestick data for chart
        const now = Math.floor(Date.now() / 1000)
        const oneWeekAgo = now - 7 * 24 * 60 * 60
        const candleUrl = getFinnhubUrl("/stock/candle", {
          symbol,
          resolution: "D",
          from: oneWeekAgo.toString(),
          to: now.toString(),
        })
        const candleResponse = await fetch(candleUrl)
        const candleData = candleResponse.ok ? await candleResponse.json() : null

        // Format metrics
        const formattedMetrics: MetricData[] = [
          { metric: "Current Price", value: `$${quoteData.c?.toFixed(2) || "N/A"}` },
          { metric: "Previous Close", value: `$${quoteData.pc?.toFixed(2) || "N/A"}` },
          { metric: "Open", value: `$${quoteData.o?.toFixed(2) || "N/A"}` },
          { metric: "High", value: `$${quoteData.h?.toFixed(2) || "N/A"}` },
          { metric: "Low", value: `$${quoteData.l?.toFixed(2) || "N/A"}` },
          { metric: "Change", value: `$${quoteData.d?.toFixed(2) || "N/A"}`, change: quoteData.dp },
        ]

        if (profileData?.marketCapitalization) {
          const marketCap = profileData.marketCapitalization
          const formattedCap =
            marketCap >= 1e12
              ? `$${(marketCap / 1e12).toFixed(2)}T`
              : marketCap >= 1e9
                ? `$${(marketCap / 1e9).toFixed(2)}B`
                : marketCap >= 1e6
                  ? `$${(marketCap / 1e6).toFixed(2)}M`
                  : `$${marketCap.toFixed(2)}`
          formattedMetrics.push({ metric: "Market Cap", value: formattedCap })
        }

        setMetrics(formattedMetrics)

        // Format chart data
        if (candleData?.c && Array.isArray(candleData.c) && candleData.t && Array.isArray(candleData.t)) {
          const formattedChartData = candleData.t.map((timestamp: number, index: number) => ({
            time: new Date(timestamp * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            price: candleData.c[index] || 0,
          }))
          setChartData(formattedChartData)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching metrics")
      } finally {
        setLoading(false)
      }
    }

    fetchMetrics()
  }, [symbol])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
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
          <CardTitle>{symbol} Metrics</CardTitle>
          <CardDescription>{name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">{symbol} Metrics</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{name}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-4">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
            {metrics.map((item, index) => (
              <div key={index} className="space-y-1">
                <p className="text-xs text-muted-foreground">{item.metric}</p>
                <p className="text-sm sm:text-base font-semibold text-foreground">{item.value}</p>
                {item.change !== undefined && (
                  <p
                    className={`text-xs ${
                      item.change >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {item.change >= 0 ? "+" : ""}
                    {item.change.toFixed(2)}%
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Price Chart */}
          {chartData.length > 0 && (
            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">7-Day Price Trend</p>
              <div className="w-full h-[200px] sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis
                      dataKey="time"
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "10px" }}
                    />
                    <YAxis
                      stroke="hsl(var(--muted-foreground))"
                      style={{ fontSize: "10px" }}
                      tickFormatter={(value) => `$${value.toFixed(0)}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                        fontSize: "12px",
                      }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, "Price"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

