// Yahoo Finance API configuration
export const YAHOO_FINANCE_API_KEY = "ccdc6a6ec0msh7c917b1437342d7p1cfeb4jsn49f44f13263e"
export const YAHOO_FINANCE_API_HOST = "apidojo-yahoo-finance-v1.p.rapidapi.com"
export const YAHOO_FINANCE_BASE_URL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com"

export const getYahooFinanceHeaders = () => ({
  "x-rapidapi-host": YAHOO_FINANCE_API_HOST,
  "x-rapidapi-key": YAHOO_FINANCE_API_KEY,
})

// Popular stock symbols to display
export const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc." },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
]

