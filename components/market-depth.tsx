"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getFinnhubUrl } from "@/lib/finnhub-api"

interface MarketDepthProps {
  symbol: string
  name: string
}

interface OrderBookEntry {
  price: number
  volume: number
}

interface OrderBookData {
  bids: OrderBookEntry[]
  asks: OrderBookEntry[]
  spread: number
  spreadPercent: number
}

export default function MarketDepth({ symbol, name }: MarketDepthProps) {
  const [orderBook, setOrderBook] = useState<OrderBookData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchOrderBook = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Finnhub doesn't have a direct order book endpoint in free tier
        // We'll simulate market depth using quote data and calculate spreads
        const quoteUrl = getFinnhubUrl("/quote", { symbol })
        const quoteResponse = await fetch(quoteUrl)
        
        if (!quoteResponse.ok) throw new Error("Failed to fetch quote")
        const quoteData = await quoteResponse.json()
        
        // Simulate order book from quote data
        // In production, you'd use WebSocket or Level 2 data
        const currentPrice = quoteData.c || 0
        const high = quoteData.h || currentPrice
        const low = quoteData.l || currentPrice
        
        if (currentPrice === 0) {
          throw new Error("No price data available")
        }
        
        // Generate simulated bid/ask levels
        const generateLevels = (basePrice: number, isBid: boolean, count: number): OrderBookEntry[] => {
          const levels: OrderBookEntry[] = []
          const step = basePrice * 0.001 // 0.1% steps
          
          for (let i = 0; i < count; i++) {
            const price = isBid 
              ? basePrice - (step * (i + 1))
              : basePrice + (step * (i + 1))
            const volume = Math.random() * 10000 + 1000 // Simulated volume
            levels.push({ price, volume })
          }
          
          return levels.sort((a, b) => isBid ? b.price - a.price : a.price - b.price)
        }
        
        const bids = generateLevels(currentPrice, true, 10)
        const asks = generateLevels(currentPrice, false, 10)
        
        // Calculate spread
        const bestBid = bids[0]?.price || currentPrice
        const bestAsk = asks[0]?.price || currentPrice
        const spread = bestAsk - bestBid
        const spreadPercent = (spread / currentPrice) * 100
        
        setOrderBook({
          bids,
          asks,
          spread,
          spreadPercent,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error fetching market depth")
      } finally {
        setLoading(false)
      }
    }

    fetchOrderBook()
    // Refresh every 5 seconds for real-time updates
    const interval = setInterval(fetchOrderBook, 5000)
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

  const formatVolume = (volume: number) => {
    if (volume >= 1000) {
      return `${(volume / 1000).toFixed(1)}K`
    }
    return volume.toFixed(0)
  }

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

  if (error || !orderBook) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Market Depth - {symbol}</CardTitle>
          <CardDescription>{name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">{error || "No data available"}</p>
        </CardContent>
      </Card>
    )
  }

  const maxVolume = Math.max(
    ...orderBook.bids.map((b) => b.volume),
    ...orderBook.asks.map((a) => a.volume)
  )

  return (
    <Card>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl">Market Depth - {symbol}</CardTitle>
        <CardDescription className="text-xs sm:text-sm">{name}</CardDescription>
        <div className="mt-3 flex items-center gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Spread: </span>
            <span className="font-semibold text-foreground">{formatPrice(orderBook.spread)}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Spread %: </span>
            <span className="font-semibold text-foreground">{orderBook.spreadPercent.toFixed(3)}%</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6 pt-0">
        <div className="space-y-4">
          {/* Asks (Sell Orders) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-red-600 dark:text-red-400">Asks (Sell)</h4>
              <div className="text-xs text-muted-foreground">Price | Volume</div>
            </div>
            <div className="space-y-1">
              {orderBook.asks.slice(0, 10).map((ask, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs sm:text-sm hover:bg-muted/50 rounded px-2 py-1 transition-colors"
                >
                  <div className="flex-1 flex items-center gap-2">
                    <div
                      className="h-4 bg-red-500/20 rounded"
                      style={{ width: `${(ask.volume / maxVolume) * 100}%` }}
                    />
                    <span className="text-red-600 dark:text-red-400 font-medium min-w-[80px]">
                      {formatPrice(ask.price)}
                    </span>
                  </div>
                  <span className="text-muted-foreground min-w-[60px] text-right">
                    {formatVolume(ask.volume)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Spread Indicator */}
          <div className="border-t border-b border-border py-2">
            <div className="flex items-center justify-center gap-2">
              <span className="text-xs text-muted-foreground">Best Bid</span>
              <span className="text-sm font-bold text-foreground">
                {formatPrice(orderBook.bids[0]?.price || 0)}
              </span>
              <span className="text-xs text-muted-foreground">→</span>
              <span className="text-sm font-bold text-foreground">
                {formatPrice(orderBook.asks[0]?.price || 0)}
              </span>
              <span className="text-xs text-muted-foreground">Best Ask</span>
            </div>
          </div>

          {/* Bids (Buy Orders) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">Bids (Buy)</h4>
              <div className="text-xs text-muted-foreground">Price | Volume</div>
            </div>
            <div className="space-y-1">
              {orderBook.bids.slice(0, 10).map((bid, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-xs sm:text-sm hover:bg-muted/50 rounded px-2 py-1 transition-colors"
                >
                  <div className="flex-1 flex items-center gap-2">
                    <div
                      className="h-4 bg-emerald-500/20 rounded"
                      style={{ width: `${(bid.volume / maxVolume) * 100}%` }}
                    />
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium min-w-[80px]">
                      {formatPrice(bid.price)}
                    </span>
                  </div>
                  <span className="text-muted-foreground min-w-[60px] text-right">
                    {formatVolume(bid.volume)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

