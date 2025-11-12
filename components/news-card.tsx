"use client"

import { ExternalLink } from "lucide-react"

interface Article {
  title: string
  source: {
    name: string
  }
  url: string
  description?: string
}

export default function NewsCard({ article }: { article: Article }) {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Only open if URL is valid (not "#" or empty)
    if (!article.url || article.url === "#" || article.url.trim() === "") {
      e.preventDefault()
      return false
    }
    // Let the anchor tag handle the navigation naturally
    return true
  }

  const isValidUrl = article.url && article.url !== "#" && article.url.trim() !== ""

  return (
    <a
      href={isValidUrl ? article.url : "#"}
      onClick={handleClick}
      target={isValidUrl ? "_blank" : undefined}
      rel={isValidUrl ? "noopener noreferrer" : undefined}
      className={`group block p-3 bg-card border border-border rounded-lg transition-all ${
        isValidUrl
          ? "cursor-pointer hover:border-primary/50 hover:shadow-lg hover:bg-accent/50"
          : "cursor-not-allowed opacity-60"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className={`font-semibold text-foreground transition-colors text-sm leading-tight line-clamp-2 flex-1 min-w-0 ${
          isValidUrl ? "group-hover:text-primary" : ""
        }`}>
          {article.title}
        </h3>
        {isValidUrl && (
          <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5" />
        )}
      </div>

      {article.description && (
        <p className="text-xs text-muted-foreground mb-2 line-clamp-2 leading-relaxed">
          {article.description}
        </p>
      )}

      <p className="text-xs text-primary font-medium truncate">{article.source.name}</p>
    </a>
  )
}
