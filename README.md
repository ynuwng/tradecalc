# TradeCalc 📊

Professional stock calculator with real-time quotes, risk management, and P/L analysis. Built with Vue.js, Vite, and deployed on Vercel.

🌐 **Live Demo**: https://tradecalc.xyz

## Features

- 📊 **Real-time Price Charts** - Interactive price visualization with Chart.js
- 💰 **P&L Calculator** - Instant profit/loss calculations with slippage & fees
- 🎯 **Risk Management** - Stop-loss and take-profit price calculations
- ⚠️ **PDT Protection** - Pattern Day Trader rule warnings and compliance
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile
- 🚀 **Modern Architecture** - Vue.js 3 with Composition API and Vite
- ⚡ **Optimized Performance** - Fast loading with code splitting and caching
- 🔒 **Enhanced Security** - Rate limiting, input validation, and error handling

## Quick Start

### Online Usage (Recommended)
Visit **https://tradecalc.xyz** to use the full-featured application immediately.

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### API Configuration
1. Register at [Finnhub.io](https://finnhub.io) for a free API key
2. Select "Finnhub.io (REST poll)" in the app
3. Enter your API key and click "Connect"

## Technology Stack

- **Frontend**: Vue.js 3, Composition API, Vite
- **Charts**: Chart.js with Vue integration
- **Styling**: Modern CSS with CSS Variables
- **Backend**: Vercel Serverless Functions
- **API**: Finnhub.io Stock Market API
- **Deployment**: Vercel with automatic deployments
- **Analytics**: Vercel Analytics & Speed Insights

## Project Structure

```
tradecalc/
├── src/
│   ├── components/          # Vue components
│   │   ├── InputPanel.vue   # Trading parameters input
│   │   └── LivePanel.vue    # Live price display & metrics
│   ├── composables/         # Vue composition functions
│   │   ├── useStockData.js  # Stock data management
│   │   ├── useTradeCalculator.js  # Trading calculations
│   │   └── useChart.js      # Chart functionality
│   ├── utils/               # Utility functions
│   │   ├── api.js           # API service layer
│   │   ├── calculations.js  # Core trading math
│   │   └── formatters.js    # Number formatting
│   ├── styles/              # CSS styles
│   │   ├── variables.css    # CSS custom properties
│   │   └── global.css       # Global styles
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── api/
│   └── quote.js             # Enhanced Vercel serverless function
├── index.html               # HTML entry point
├── vite.config.js           # Vite configuration
├── vercel.json              # Vercel deployment config
└── package.json             # Project dependencies
```

## Key Improvements (v2.0)

### Architecture
- **Modular Design**: Code split into logical components and composables
- **Vue.js 3**: Modern reactive framework with Composition API
- **Vite**: Lightning-fast build tool with HMR and optimizations

### Performance
- **Code Splitting**: Vendor and chart libraries loaded separately
- **Caching**: 1-minute server-side cache for API responses
- **Rate Limiting**: 60 requests per minute per client
- **Lazy Loading**: Charts and analytics loaded asynchronously

### Developer Experience
- **Hot Module Replacement**: Instant updates during development
- **TypeScript Ready**: Easy to migrate to TypeScript if needed
- **Component-Based**: Reusable and testable components
- **Modern JavaScript**: ES modules, async/await, and modern syntax

### Reliability
- **Enhanced Error Handling**: Detailed error messages and recovery
- **Input Validation**: Comprehensive validation on both client and server
- **Timeout Protection**: 10-second timeout for API requests
- **Graceful Degradation**: Demo mode when API is unavailable

## Deployment

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

### Build for Static Hosting
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## API Reference

### Supported Stock Symbols
- **US Stocks**: AAPL, TSLA, GOOGL, NVDA, MSFT, AMZN
- **ETFs**: SPY, QQQ, IWM, VTI
- **Other Markets**: Refer to [Finnhub documentation](https://finnhub.io/docs/api)

### Rate Limits
- **Development**: No limits (uses demo mode)
- **Production**: 60 requests per minute per client
- **Caching**: 1-minute server-side cache

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

## Disclaimer

This tool is for educational and demonstration purposes only. Always verify calculations before making actual trades. Results do not include taxes, and market conditions can change rapidly.

## License

MIT License - see [LICENSE](LICENSE) file for details

---

**Built with ❤️ using Vue.js and Vite**   
