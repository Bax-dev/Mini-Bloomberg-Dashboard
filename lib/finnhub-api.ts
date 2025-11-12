// Finnhub API configuration
export const FINNHUB_API_KEY = "d4aeht9r01qnehvu9n50d4aeht9r01qnehvu9n5g"
export const FINNHUB_BASE_URL = "https://finnhub.io/api/v1"

export const getFinnhubUrl = (endpoint: string, params?: Record<string, string>) => {
  const url = new URL(`${FINNHUB_BASE_URL}${endpoint}`)
  url.searchParams.set("token", FINNHUB_API_KEY)
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value)
    })
  }
  return url.toString()
}

// Popular stock symbols for analytics
export const ANALYTICS_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
]

