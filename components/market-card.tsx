import { ArrowDownRight, ArrowUpRight } from "lucide-react"

interface Coin {
  id: string
  symbol: string
  name: string
  current_price: number
  price_change_percentage_24h: number
  market_cap: number
}

export default function MarketCard({ coin }: { coin: Coin }) {
  const isPositive = coin.price_change_percentage_24h >= 0
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 8,
    }).format(price)
  }

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`
    return formatPrice(cap)
  }

  return (
    <div className="p-3 sm:p-4 bg-card border border-border rounded-lg hover:border-primary/50 transition-colors">
      <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] sm:text-xs font-bold text-primary uppercase">{coin.symbol}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-semibold text-foreground text-sm sm:text-base truncate">{coin.name}</h3>
            <p className="text-xs text-muted-foreground uppercase">{coin.symbol}</p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-lg flex-shrink-0 ${
            isPositive
              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
              : "bg-red-500/10 text-red-600 dark:text-red-400"
          }`}
        >
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
          <span className="text-xs sm:text-sm font-semibold">{Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Price</p>
          <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatPrice(coin.current_price)}</p>
        </div>
        <div className="min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
          <p className="text-base sm:text-lg font-bold text-foreground truncate">{formatMarketCap(coin.market_cap)}</p>
        </div>
      </div>
    </div>
  )
}
