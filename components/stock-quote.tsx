"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"
import { getFinnhubUrl } from "@/lib/finnhub-api"

interface StockQuoteProps {
  symbol: string
  name: string
}

interface QuoteData {
  c: number // Current price
  d: number // Change
  dp: number // Percent change
  h: number // High price
  l: number // Low price
  o: number // Open price
  pc: number // Previous close
  t: number // Timestamp
}

export default function StockQuote({ symbol, name }: StockQuoteProps) {
  const [quote, setQuote] = useState<QuoteData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true)
        setError(null)
        const url = getFinnhubUrl("/quote", { symbol })
        const response = await fetch(url)
        
        if (!response.ok) throw new Error("Failed to fetch quote")
        
        const data = await response.json()
        
        if (data.c === 0 && data.d === 0) {
          throw new Error("No data available")
        }
        
        setQuote(data as QuoteData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching data")
      } finally {
        setLoading(false)
      }
    }

    fetchQuote()
    // Refresh every 30 seconds
    const interval = setInterval(fetchQuote, 30000)
    return () => clearInterval(interval)
  }, [symbol])

  if (loading) {
    return (
      <Card>
        <CardHeader className="p-4">
          <Skeleton className="h-5 w-24 mb-2" />
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="p-4">
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-16" />
        </CardContent>
      </Card>
    )
  }

  if (error || !quote) {
    return (
      <Card>
        <CardHeader className="p-4">
          <CardTitle className="text-base">{symbol}</CardTitle>
          <CardDescription>{name}</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-destructive">{error || "No data available"}</p>
        </CardContent>
      </Card>
    )
  }

  const isPositive = quote.dp >= 0
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  return (
    <Card className="hover:border-primary/50 transition-colors">
      <CardHeader className="p-4">
        <CardTitle className="text-base sm:text-lg">{symbol}</CardTitle>
        <CardDescription className="text-xs sm:text-sm line-clamp-1">{name}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xl sm:text-2xl font-bold text-foreground">
              {formatPrice(quote.c)}
            </span>
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs sm:text-sm ${
                isPositive
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "bg-red-500/10 text-red-600 dark:text-red-400"
              }`}
            >
              {isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5" />
              )}
              <span className="font-semibold">
                {isPositive ? "+" : ""}
                {quote.dp.toFixed(2)}%
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>High: {formatPrice(quote.h)}</span>
            <span>Low: {formatPrice(quote.l)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

