# ThetaFlowz - Options Trading Platform

A comprehensive options trading learning platform with bot management capabilities, built with React and modern web technologies.

## Features

### 🎓 Learning Platform
- **Interactive Strategy Lessons**: Learn put credit spreads, call credit spreads, wheel strategies, and naked puts
- **Step-by-step Instructions**: Detailed walkthroughs for each strategy
- **Real Examples**: Practical trade examples with calculations
- **Risk Management**: Built-in risk management guidelines

### 📊 Trade Tracking
- **Detailed Trade Logging**: Track every aspect of your options trades
- **Performance Analytics**: Win rate, P&L, and strategy analysis
- **Trade History**: Complete trade history with notes and lessons learned
- **Search & Filter**: Find specific trades quickly
- **Real-time Market Data**: Live stock quotes for traded symbols

### 🤖 Admin Dashboard (Bot Management)
- **Strategy Management**: Create and manage trading bot strategies
- **Parameter Controls**: Set risk limits, target premiums, delta, DTE, and position sizing
- **Real-time Monitoring**: Track bot performance and status
- **Strategy Performance**: Individual strategy analytics and P&L tracking

### 🔐 User Authentication
- **Secure Login/Registration**: User account management
- **Admin Access**: Special admin privileges for bot management
- **Protected Routes**: Secure access to different platform sections

### 📈 Market Data Integration
- **Real-time Quotes**: Live stock prices from Yahoo Finance
- **Market Overview**: Major indices and user watchlist
- **Options Chains**: View options data for any symbol
- **Auto-refresh**: Data updates every 30 seconds
- **Symbol Search**: Search and add symbols to watchlist

## Tech Stack

- **Frontend**: React 18 with React Router
- **Styling**: Tailwind CSS with custom dark theme
- **Icons**: Lucide React
- **Authentication**: Custom auth context (ready for Firebase integration)
- **Charts**: Recharts (for future analytics)
- **Market Data**: Yahoo Finance API via yahoo-finance2
- **Build Tool**: Create React App

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd thetaflowz-platform
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Demo Login

For testing purposes, you can use any email/password combination:

- **Regular User**: Any email/password
- **Admin User**: Use an email containing "admin" (e.g., "admin@example.com")

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.js       # Navigation header
│   ├── ProtectedRoute.js # Route protection
│   ├── MarketOverview.js # Market data display
│   ├── StockQuote.js   # Individual stock quotes
│   └── OptionsChainViewer.js # Options chain display
├── contexts/           # React contexts
│   ├── AuthContext.js  # Authentication state
│   └── MarketDataContext.js # Market data state
├── services/           # API services
│   └── marketDataService.js # Yahoo Finance API integration
├── pages/              # Main application pages
│   ├── Home.js         # Landing page
│   ├── Login.js        # User login
│   ├── Register.js     # User registration
│   ├── Dashboard.js    # User dashboard
│   ├── Learn.js        # Strategy learning
│   ├── Market.js       # Market overview page
│   ├── TradeTracker.js # Trade tracking
│   └── AdminDashboard.js # Bot management
├── App.js              # Main app component
└── index.js            # App entry point
```

## Key Features Explained

### Learning Platform
The learning section provides comprehensive education on options trading strategies:

- **Put Credit Spreads**: Bullish strategy with defined risk
- **Call Credit Spreads**: Bearish strategy with defined risk

### Market Data Integration
The platform now includes real-time market data from Yahoo Finance:

- **Market Overview Page**: View major indices (S&P 500, Dow Jones, NASDAQ, Russell 2000, VIX)
- **Personal Watchlist**: Add and track your favorite stocks
- **Real-time Quotes**: Live stock prices with change indicators
- **Options Chains**: View options data for any symbol (calls and puts)
- **Auto-refresh**: Data updates automatically every 30 seconds
- **Symbol Search**: Search for any stock symbol and add to watchlist  
- **Wheel Strategy**: Systematic income generation
- **Naked Puts**: Advanced strategy requiring careful risk management

Each strategy includes:
- Step-by-step instructions
- Real trade examples
- Risk/reward calculations
- Key takeaways and best practices

### Trade Tracker
Comprehensive trade management system:

- **Add Trades**: Log new positions with detailed information
- **Track Performance**: Monitor P&L, win rate, and strategy performance
- **Search & Filter**: Find specific trades by symbol, strategy, or status
- **Trade Analytics**: Performance metrics and insights

### Admin Dashboard
Advanced bot management interface:

- **Strategy Configuration**: Set parameters for each trading strategy
- **Risk Management**: Configure max risk, position sizing, and targets
- **Performance Monitoring**: Real-time bot performance tracking
- **Bot Control**: Start/pause individual strategies

## Customization

### Theme Colors
The application uses a custom dark theme with green accents. Colors can be modified in `tailwind.config.js`:

```javascript
colors: {
  primary: {
    // Green accent colors
    500: '#22c55e',
    // ... other shades
  },
  dark: {
    // Dark theme colors
    900: '#0f172a',
    // ... other shades
  }
}
```

### Adding New Strategies
To add new trading strategies to the learning platform:

1. Edit `src/pages/Learn.js`
2. Add new strategy object to the `strategies` array
3. Include overview, steps, and example trade data

### Bot Integration
The admin dashboard is designed to integrate with your trading bot:

1. Replace mock data with real API calls
2. Connect to your bot's API endpoints
3. Implement real-time data updates
4. Add strategy execution controls

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy Options
- **Vercel**: Connect your GitHub repository
- **Netlify**: Drag and drop the build folder
- **AWS S3**: Upload build files to S3 bucket
- **Firebase Hosting**: Use Firebase CLI

## Future Enhancements

- [ ] Real-time market data integration
- [ ] Advanced charting with TradingView
- [ ] Paper trading simulation
- [ ] Social features and community
- [ ] Mobile app development
- [ ] Advanced analytics and reporting
- [ ] API integration with major brokers
- [ ] Automated trade execution

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the development team.

---

**Note**: This is a demo application. For production use, implement proper authentication, data persistence, and security measures. 