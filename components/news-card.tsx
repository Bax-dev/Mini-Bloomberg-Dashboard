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
  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-3 bg-card border border-border rounded-lg hover:border-primary/50 hover:shadow-lg transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors text-sm leading-tight line-clamp-2 flex-1 min-w-0">
          {article.title}
        </h3>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary flex-shrink-0 mt-0.5" />
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
