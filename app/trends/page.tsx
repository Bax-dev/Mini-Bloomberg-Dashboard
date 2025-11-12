"use client"

import { useEffect, useState } from "react"
import Header from "@/components/header"
import Sidebar from "@/components/sidebar"
import CandlestickChart from "@/components/candlestick-chart"

export default function MarketTrendsPage() {
  const [mounted, setMounted] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-background overflow-hidden">
      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6 md:py-8">
            <div className="mb-4 sm:mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Market Trends</h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 sm:mt-2">Candlestick charts showing 7-day price movements</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <CandlestickChart coinId="bitcoin" coinName="Bitcoin" coinSymbol="BTC" />
              <CandlestickChart coinId="ethereum" coinName="Ethereum" coinSymbol="ETH" />
              <CandlestickChart coinId="solana" coinName="Solana" coinSymbol="SOL" />
              <CandlestickChart coinId="cardano" coinName="Cardano" coinSymbol="ADA" />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

