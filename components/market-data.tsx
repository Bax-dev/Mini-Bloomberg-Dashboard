"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import MarketCard from "./market-card"
import { RotateCw } from "lucide-react"

interface Coin {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

export default function MarketData() {
  const [coins, setCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCoins = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(
        "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false",
      )
      if (!response.ok) throw new Error("Failed to fetch coins")
      const data = await response.json()
      setCoins(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCoins()
  }, [])

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Market Overview</h2>
          <p className="text-xs sm:text-sm text-muted-foreground">Top 10 cryptocurrencies by market cap</p>
        </div>
        <Button onClick={fetchCoins} disabled={loading} size="sm" className="gap-2 flex-shrink-0">
          <RotateCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          <span className="hidden sm:inline">{loading ? "Refreshing..." : "Refresh"}</span>
          <span className="sm:hidden">{loading ? "..." : "↻"}</span>
        </Button>
      </div>

      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {loading && coins.length === 0 ? (
        <div className="grid gap-3 sm:gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 sm:h-24 bg-card border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid gap-3 sm:gap-4">
          {coins.map((coin) => (
            <MarketCard key={coin.id} coin={coin} />
          ))}
        </div>
      )}
    </div>
  )
}
