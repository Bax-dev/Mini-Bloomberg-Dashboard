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
      // MediaStack API endpoint with access key and filters for business/finance news
      const params = new URLSearchParams({
        access_key: "58aecf82c1b2d8312eaf2b10587e02b2",
        categories: "business",
        languages: "en",
        countries: "us",
        limit: "5",
        sort: "published_desc",
      })

      const response = await fetch(`http://api.mediastack.com/v1/news?${params.toString()}`)
      
      if (!response.ok) throw new Error("Failed to fetch news")
      
      const data = await response.json()
      
      // MediaStack returns data in a 'data' array
      if (data.data && Array.isArray(data.data)) {
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
        
        setArticles(newsItems)
      } else {
        throw new Error("Invalid response format")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error fetching news")
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

      {error && !articles.length && (
        <div className="p-3 bg-destructive/10 border border-destructive rounded-lg">
          <p className="text-xs text-destructive">Using demo news data</p>
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
