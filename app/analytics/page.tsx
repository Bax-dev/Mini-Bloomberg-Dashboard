"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import StockQuote from "@/components/stock-quote"
import StockMetrics from "@/components/stock-metrics"
import MarketDepth from "@/components/market-depth"
import PriceMovement from "@/components/price-movement"
import { ANALYTICS_STOCKS } from "@/lib/finnhub-api"

export default function AnalyticsPage() {
  const [mounted, setMounted] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState<string>("AAPL")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const selectedStock = ANALYTICS_STOCKS.find((s) => s.symbol === selectedSymbol) || ANALYTICS_STOCKS[0]

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Analytics</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">
                Real-time stock market data, market depth, bid/ask spreads, and price movements
              </p>
            </div>

            {/* Stock Selection */}
            <div className="mb-4 sm:mb-6">
              <div className="flex flex-wrap gap-2">
                {ANALYTICS_STOCKS.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => setSelectedSymbol(stock.symbol)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      selectedSymbol === stock.symbol
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    {stock.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* Real-Time Price Movement */}
            <div className="mb-4 sm:mb-6">
              <PriceMovement symbol={selectedSymbol} name={selectedStock.name} />
            </div>

            {/* Market Depth and Spreads */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <MarketDepth symbol={selectedSymbol} name={selectedStock.name} />
              <StockQuote symbol={selectedSymbol} name={selectedStock.name} />
            </div>

            {/* Stock Quotes Grid */}
            <div className="mb-4 sm:mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">All Stocks</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {ANALYTICS_STOCKS.map((stock) => (
                  <StockQuote key={stock.symbol} symbol={stock.symbol} name={stock.name} />
                ))}
              </div>
            </div>

            {/* Stock Metrics */}
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-3 sm:mb-4">Detailed Metrics</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {ANALYTICS_STOCKS.slice(0, 4).map((stock) => (
                  <StockMetrics key={stock.symbol} symbol={stock.symbol} name={stock.name} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

