# FinanceFlow - Bloomberg Replica

A modern, real-time financial dashboard application that provides comprehensive market data, analytics, and news. Built with Next.js and TypeScript, featuring cryptocurrency market data, stock analytics, candlestick charts, market depth visualization, and real-time price movements.

## 🚀 Features

### Dashboard
- **Market Overview**: Real-time cryptocurrency market data from CoinGecko API
- **Top 10 Cryptocurrencies**: Displayed by market capitalization
- **Live News Feed**: Business and financial news from MediaStack API
- **Responsive Design**: Optimized for mobile, tablet, and desktop

### Market Trends
- **Candlestick Charts**: 7-day OHLC (Open, High, Low, Close) price movements
- **Multiple Cryptocurrencies**: Bitcoin, Ethereum, Solana, and Cardano
- **Interactive Charts**: Built with Recharts library
- **Price Change Indicators**: Visual representation of price movements

### Analytics
- **Real-Time Stock Quotes**: Live stock prices from Finnhub API
- **Market Depth Visualization**: Bid/ask order book with spread calculations
- **Price Movement Tracking**: Real-time price updates every 2 seconds
- **Stock Metrics**: Detailed financial metrics including market cap, volume, and price history
- **7-Day Price Trends**: Line charts showing price movements over time
- **Stock Selection**: Easy switching between different stocks

### Additional Features
- **Dark/Light Theme**: Theme switching support
- **Collapsible Sidebar**: Space-efficient navigation
- **Active Route Highlighting**: Visual indication of current page
- **Auto-refresh**: Real-time data updates
- **Error Handling**: Graceful fallbacks and error messages

## 🛠️ Tech Stack

### Frontend
- **Next.js 16.0.0**: React framework with App Router
- **React 19.2.0**: UI library
- **TypeScript 5**: Type-safe development
- **Tailwind CSS 4.1.9**: Utility-first CSS framework
- **Recharts**: Charting library for data visualization

### UI Components
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **shadcn/ui**: Pre-built component library

### APIs
- **CoinGecko API**: Cryptocurrency market data
- **Finnhub API**: Stock market data and analytics
- **MediaStack API**: Financial news aggregation

## 📋 Prerequisites

- Node.js 18+ and npm
- Git

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bloomberg-replica
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Keys** (Optional - keys are already configured)
   
   The project includes API keys in the configuration files:
   - `lib/finnhub-api.ts` - Finnhub API key
   - `lib/yahoo-finance-api.ts` - Yahoo Finance API key (RapidAPI)
   - `components/news-feed.tsx` - MediaStack API key
   
   If you need to use your own keys, update these files accordingly.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
bloomberg-replica/
├── app/                      # Next.js app directory
│   ├── analytics/           # Analytics page
│   │   └── page.tsx
│   ├── trends/              # Market trends page
│   │   └── page.tsx
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home/Dashboard page
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # Reusable UI components
│   ├── candlestick-chart.tsx
│   ├── header.tsx
│   ├── market-card.tsx
│   ├── market-data.tsx
│   ├── market-depth.tsx
│   ├── news-card.tsx
│   ├── news-feed.tsx
│   ├── price-movement.tsx
│   ├── sidebar.tsx
│   ├── stock-metrics.tsx
│   └── stock-quote.tsx
├── lib/                     # Utility functions and API configs
│   ├── finnhub-api.ts      # Finnhub API configuration
│   ├── utils.ts            # Utility functions
│   └── yahoo-finance-api.ts # Yahoo Finance API configuration
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
└── styles/                  # Additional styles
```

## 🎯 Available Routes

- `/` - Dashboard (Market Overview & News)
- `/trends` - Market Trends (Candlestick Charts)
- `/analytics` - Analytics (Stock Data, Market Depth, Price Movements)

## 📊 API Integrations

### CoinGecko API
- **Endpoint**: `https://api.coingecko.com/api/v3`
- **Usage**: Cryptocurrency market data and OHLC data
- **Rate Limit**: Free tier available

### Finnhub API
- **Endpoint**: `https://finnhub.io/api/v1`
- **Usage**: Stock quotes, company profiles, and candlestick data
- **API Key**: Configured in `lib/finnhub-api.ts`

### MediaStack API
- **Endpoint**: `http://api.mediastack.com/v1`
- **Usage**: Business and financial news
- **API Key**: Configured in `components/news-feed.tsx`

## 🎨 Features Breakdown

### Market Depth Component
- Visualizes bid/ask order book
- Calculates and displays spread
- Shows volume at each price level
- Auto-refreshes every 5 seconds

### Price Movement Component
- Real-time price updates (every 2 seconds)
- Live price chart with 30 data points
- Price history table
- Visual trend indicators

### Stock Quote Component
- Current stock price
- Price change percentage
- High/low prices
- Auto-refresh every 30 seconds

### Stock Metrics Component
- Comprehensive financial metrics
- 7-day price trend chart
- Market capitalization
- Price, volume, and change data

## 🚀 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

### Code Style
- TypeScript strict mode enabled
- ESLint for code quality
- No `any` types (as per project rules)

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Mobile**: 320px and above
- **Tablet**: 768px and above
- **Desktop**: 1024px and above
- **Large Screens**: 1280px and above

## 🔐 API Keys

**Note**: API keys are included in the codebase for development purposes. For production, consider:
- Using environment variables
- Implementing a backend proxy
- Using secure API key management

### Current API Keys
- **Finnhub**: `d4aeht9r01qnehvu9n50d4aeht9r01qnehvu9n5g`
- **MediaStack**: `58aecf82c1b2d8312eaf2b10587e02b2`
- **Yahoo Finance (RapidAPI)**: `ccdc6a6ec0msh7c917b1437342d7p1cfeb4jsn49f44f13263e`

## 🎯 Key Components

### Market Data
- Fetches top 10 cryptocurrencies by market cap
- Displays price, change percentage, and market cap
- Auto-refresh functionality

### News Feed
- Business and financial news
- Responsive card layout
- Scrollable container

### Candlestick Charts
- 7-day OHLC data visualization
- Custom SVG overlay for candlesticks
- Color-coded (green for up, red for down)

### Analytics Dashboard
- Stock selection interface
- Real-time price movements
- Market depth visualization
- Comprehensive stock metrics

## 🐛 Troubleshooting

### API Errors
- Check API key validity
- Verify network connectivity
- Check browser console for detailed error messages
- Some APIs may have rate limits

### Build Issues
- Ensure Node.js version is 18+
- Clear `.next` folder and rebuild
- Delete `node_modules` and reinstall dependencies

## 📝 License

This project is private and for educational/demonstration purposes.

## 👨‍💻 Author

Bassey Bloomberg Portfolio

## 🙏 Acknowledgments

- CoinGecko for cryptocurrency data
- Finnhub for stock market data
- MediaStack for news aggregation
- Next.js and React communities

---

**Note**: This is a replica/demo project inspired by Bloomberg Terminal. It uses free-tier APIs and is intended for educational purposes.

