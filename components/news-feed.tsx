"use client"

import { useEffect, useState } from "react"
import NewsCard from "./news-card"
import { Newspaper } from "lucide-react"

interface Article {
  title: string
  source: {
    name: string
  }
  url: string
  image?: string
  description?: string
}

export default function NewsFeeds() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNews = async () => {
    setLoading(true)
    setError(null)
    try {
      // Try using Next.js API route first (avoids CORS issues)
      let apiUrl = "/api/news"
      
      console.log("Fetching news from API route:", apiUrl)
      
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
      })
      
      console.log("Response status:", response.status, response.statusText)
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        console.error("API Error:", errorData)
        throw new Error(errorData.error || `Failed to fetch news: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("API Response:", data)
      
      // Check for API error in response
      if (data.error) {
        console.error("MediaStack API Error:", data.error)
        throw new Error(data.error)
      }
      
      // MediaStack returns data in a 'data' array
      if (data.data && Array.isArray(data.data) && data.data.length > 0) {
        const newsItems: Article[] = data.data.map((item: {
          title?: string
          description?: string
          url?: string
          source?: string
          image?: string
          published_at?: string
        }) => ({
          title: item.title || "News Article",
          source: { name: item.source || "Unknown Source" },
          url: item.url || "#",
          description: item.description || "",
          image: item.image,
        }))
        
        console.log("Parsed news items:", newsItems.length)
        setArticles(newsItems)
        setError(null)
      } else {
        console.warn("No data in response or empty array")
        throw new Error("No news articles found")
      }
    } catch (err) {
      console.error("Error fetching news:", err)
      const errorMessage = err instanceof Error ? err.message : "Error fetching news"
      setError(errorMessage)
      
      // Fallback to demo data if API fails
      setArticles([
        {
          title: "Bitcoin Rally Continues: BTC Reaches New Milestone",
          source: { name: "Crypto News Daily" },
          url: "#",
          description: "Latest market analysis shows continued bullish momentum...",
        },
        {
          title: "Ethereum Updates: What to Expect in Q4 2025",
          source: { name: "BlockChain Times" },
          url: "#",
          description: "The Ethereum development team announces upcoming improvements...",
        },
        {
          title: "Regulatory Updates: New Guidelines for Crypto Exchanges",
          source: { name: "Finance Today" },
          url: "#",
          description: "Global regulators implement new compliance framework...",
        },
        {
          title: "Market Analysis: Top Opportunities This Week",
          source: { name: "Trading Insights" },
          url: "#",
          description: "Expert analysts share key opportunities for investors...",
        },
        {
          title: "DeFi Protocol Reaches $50B Total Value Locked",
          source: { name: "Crypto Pulse" },
          url: "#",
          description: "Major milestone achieved as decentralized finance grows...",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNews()
  }, [])

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="flex items-center gap-2">
        <Newspaper className="w-5 h-5 sm:w-6 sm:h-6 text-primary flex-shrink-0" />
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-bold text-foreground">Latest News</h2>
          <p className="text-xs text-muted-foreground">Market updates & insights</p>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-xs text-destructive font-medium mb-1">Error: {error}</p>
          <p className="text-xs text-muted-foreground">Showing demo news data</p>
        </div>
      )}

      {loading && articles.length === 0 ? (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-card border border-border rounded-lg animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
          {articles.map((article, index) => (
            <NewsCard key={index} article={article} />
          ))}
        </div>
      )}
    </div>
  )
}
