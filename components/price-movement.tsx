"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownRight, TrendingUp, TrendingDown } from "lucide-react"
import { getFinnhubUrl } from "@/lib/finnhub-api"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts"

interface PriceMovementProps {
  symbol: string
  name: string
}

interface PriceData {
  time: string
  price: number
  change: number
  changePercent: number
}

export default function PriceMovement({ symbol, name }: PriceMovementProps) {
  const [priceHistory, setPriceHistory] = useState<PriceData[]>([])
  const [currentPrice, setCurrentPrice] = useState<number>(0)
  const [priceChange, setPriceChange] = useState<number>(0)
  const [priceChangePercent, setPriceChangePercent] = useState<number>(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const previousPriceRef = useRef<number>(0)

  useEffect(() => {
    const fetchPriceData = async () => {
      try {
        setError(null)
        const url = getFinnhubUrl("/quote", { symbol })
        const response = await fetch(url)
        
        if (!response.ok) throw new Error("Failed to fetch price data")
        
        const data = await response.json()
        
        if (data.c === 0 && data.d === 0) {
          throw new Error("No price data available")
        }

        const newPrice = data.c || 0
        const change = data.d || 0
        const changePercent = data.dp || 0

        // Update current price
        setCurrentPrice(newPrice)
        setPriceChange(change)
        setPriceChangePercent(changePercent)

        // Add to price history
        const now = new Date()
        const timeString = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })
        
        setPriceHistory((prev) => {
          const updated = [
            ...prev,
            {
              time: timeString,
              price: newPrice,
              change,
              changePercent,
            },
          ]
          // Keep only last 30 data points
          return updated.slice(-30)
        })

        previousPriceRef.current = newPrice
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching price data")
        setLoading(false)
      }
    }

    // Initial fetch
    fetchPriceData()
    
    // Update every 2 seconds for real-time movement
    const interval = setInterval(fetchPriceData, 2000)
    return () => clearInterval(interval)
  }, [symbol])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price)
  }

  const isPositive = priceChange >= 0
  const isRising = priceHistory.length > 1 && 
    priceHistory[priceHistory.length - 1]?.price > priceHistory[priceHistory.length - 2]?.price

  if (loading && priceHistory.length === 0) {
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

  if (error && priceHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Price Movement - {symbol}</CardTitle>
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
        <CardTitle className="text-lg sm:text-xl">Real-Time Price Movement - {symbol}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{name}</CardDescription>
        
        {/* Current Price Display */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isPositive ? "bg-emerald-500/10" : "bg-red-500/10"}`}>
              {isRising ? (
                <TrendingUp className={`w-5 h-5 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} />
              ) : (
                <TrendingDown className={`w-5 h-5 ${isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`} />
              )}
            </div>
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{formatPrice(currentPrice)}</p>
              <div className="flex items-center gap-2 mt-1">
                {isPositive ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-600 dark:text-red-400" />
                )}
                <span
                  className={`text-sm font-semibold ${
                    isPositive
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400"
                  }`}
                >
                  {isPositive ? "+" : ""}
                  {formatPrice(Math.abs(priceChange))} ({isPositive ? "+" : ""}
                  {priceChangePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        {priceHistory.length > 0 ? (
          <div className="w-full h-[300px] sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={priceHistory} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="time"
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "10px" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: "10px" }}
                  domain={["dataMin - 0.5", "dataMax + 0.5"]}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    fontSize: "12px",
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === "price") return [formatPrice(value), "Price"]
                    return [value, name]
                  }}
                />
                <ReferenceLine
                  y={priceHistory[0]?.price}
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="2 2"
                  label={{ value: "Start", position: "right" }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke={isPositive ? "hsl(142, 76%, 36%)" : "hsl(0, 84%, 60%)"}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5 }}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-muted-foreground">
            <p>Collecting price data...</p>
          </div>
        )}
        
        {/* Price History Table */}
        {priceHistory.length > 0 && (
          <div className="mt-4 max-h-[150px] overflow-y-auto">
            <div className="text-xs text-muted-foreground mb-2">Recent Price Updates</div>
            <div className="space-y-1">
              {priceHistory.slice(-10).reverse().map((data, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-xs py-1 px-2 rounded hover:bg-muted/50"
                >
                  <span className="text-muted-foreground">{data.time}</span>
                  <span className="font-medium">{formatPrice(data.price)}</span>
                  <span
                    className={`font-semibold ${
                      data.changePercent >= 0
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {data.changePercent >= 0 ? "+" : ""}
                    {data.changePercent.toFixed(2)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

