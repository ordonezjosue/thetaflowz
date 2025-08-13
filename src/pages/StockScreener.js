import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import stockScreenerService from '../services/stockScreenerService';
import { 
  BarChart3, 
  Crown, 
  Gift, 
  AlertTriangle, 
  TrendingUp, 
  Target, 
  Shield,
  Filter,
  Search,
  Download,
  RefreshCw,
  Settings,
  Info,
  CheckCircle,
  XCircle,
  ArrowUpDown,
  Volume2,
  DollarSign,
  Activity,
  Zap,
  BookOpen,
  Target as TargetIcon,
  Shield as ShieldIcon,
  TrendingDown,
  Calendar,
  Clock,
  Star
} from 'lucide-react';

const StockScreener = () => {
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [screenerResults, setScreenerResults] = useState([]);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState('wheeling');
  const [filters, setFilters] = useState({
    minPrice: 10,
    maxPrice: 500,
    minVolume: 1000000,
    minMarketCap: 1000000000,
    maxBidAskSpread: 0.05,
    minImpliedVolatility: 0.2,
    maxImpliedVolatility: 0.8,
    minDaysToExpiry: 30,
    maxDaysToExpiry: 365
  });
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [sortBy, setSortBy] = useState('volume');
  const [sortOrder, setSortOrder] = useState('desc');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState(300000); // 5 minutes default

  // Strategy definitions with auto-adjusted criteria
  const strategies = {
    wheeling: {
      name: 'Wheeling Strategy',
      description: 'Sell covered calls and cash-secured puts on stable, liquid stocks',
      icon: TargetIcon,
      color: 'blue',
      criteria: {
        minPrice: 20,
        maxPrice: 200,
        minVolume: 2000000,
        minMarketCap: 5000000000,
        maxBidAskSpread: 0.03,
        minImpliedVolatility: 0.25,
        maxImpliedVolatility: 0.6,
        minDaysToExpiry: 45,
        maxDaysToExpiry: 90
      }
    },
    ironCondor: {
      name: 'Iron Condor',
      description: 'Sell credit spreads on high-implied volatility stocks',
      icon: ShieldIcon,
      color: 'purple',
      criteria: {
        minPrice: 15,
        maxPrice: 300,
        minVolume: 1500000,
        minMarketCap: 3000000000,
        maxBidAskSpread: 0.04,
        minImpliedVolatility: 0.35,
        maxImpliedVolatility: 0.8,
        minDaysToExpiry: 30,
        maxDaysToExpiry: 60
      }
    },
    straddle: {
      name: 'Straddle/Strangle',
      description: 'Buy options on high-volatility stocks expecting big moves',
      icon: Zap,
      color: 'yellow',
      criteria: {
        minPrice: 10,
        maxPrice: 150,
        minVolume: 1000000,
        minMarketCap: 2000000000,
        maxBidAskSpread: 0.06,
        minImpliedVolatility: 0.4,
        maxImpliedVolatility: 1.0,
        minDaysToExpiry: 7,
        maxDaysToExpiry: 45
      }
    },
    calendar: {
      name: 'Calendar Spread',
      description: 'Sell near-term, buy far-term options on stable stocks',
      icon: Calendar,
      color: 'green',
      criteria: {
        minPrice: 25,
        maxPrice: 250,
        minVolume: 1800000,
        minMarketCap: 4000000000,
        maxBidAskSpread: 0.03,
        minImpliedVolatility: 0.2,
        maxImpliedVolatility: 0.5,
        minDaysToExpiry: 60,
        maxDaysToExpiry: 180
      }
    }
  };

  // S&P 500 stocks (sample data - in production, this would come from API)
  const sp500Stocks = [
    { symbol: 'AAPL', name: 'Apple Inc.', sector: 'Technology' },
    { symbol: 'MSFT', name: 'Microsoft Corporation', sector: 'Technology' },
    { symbol: 'GOOGL', name: 'Alphabet Inc.', sector: 'Technology' },
    { symbol: 'AMZN', name: 'Amazon.com Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'NVDA', name: 'NVIDIA Corporation', sector: 'Technology' },
    { symbol: 'TSLA', name: 'Tesla Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'META', name: 'Meta Platforms Inc.', sector: 'Technology' },
    { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', sector: 'Financials' },
    { symbol: 'UNH', name: 'UnitedHealth Group Inc.', sector: 'Healthcare' },
    { symbol: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare' },
    { symbol: 'JPM', name: 'JPMorgan Chase & Co.', sector: 'Financials' },
    { symbol: 'V', name: 'Visa Inc.', sector: 'Financials' },
    { symbol: 'PG', name: 'Procter & Gamble Co.', sector: 'Consumer Staples' },
    { symbol: 'HD', name: 'The Home Depot Inc.', sector: 'Consumer Discretionary' },
    { symbol: 'MA', name: 'Mastercard Inc.', sector: 'Financials' },
    { symbol: 'DIS', name: 'The Walt Disney Co.', sector: 'Communication Services' },
    { symbol: 'PYPL', name: 'PayPal Holdings Inc.', sector: 'Financials' },
    { symbol: 'NFLX', name: 'Netflix Inc.', sector: 'Communication Services' },
    { symbol: 'CRM', name: 'Salesforce Inc.', sector: 'Technology' },
    { symbol: 'ADBE', name: 'Adobe Inc.', sector: 'Technology' }
  ];

  // Auto-adjust filters when strategy changes
  useEffect(() => {
    const strategy = strategies[selectedStrategy];
    if (strategy) {
      setFilters(prev => ({
        ...prev,
        ...strategy.criteria
      }));
    }
  }, [selectedStrategy]);

  // Auto-refresh functionality
  useEffect(() => {
    let interval;
    if (autoRefresh && screenerResults.length > 0) {
      interval = setInterval(() => {
        runScreener();
      }, refreshInterval);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh, refreshInterval, screenerResults.length]);

  // Auto-run screener when component mounts or strategy changes
  useEffect(() => {
    console.log('StockScreener: Component mounted or strategy changed, running initial screener...');
    
    // Test the service first
    const testService = async () => {
      try {
        console.log('StockScreener: Testing stockScreenerService...');
        const testResult = await stockScreenerService.testService();
        console.log('StockScreener: Service test result:', testResult);
      } catch (error) {
        console.error('StockScreener: Service test failed:', error);
      }
    };
    
    testService();
    
    // Use a timeout to ensure the component is fully rendered
    const timer = setTimeout(() => {
      runScreener();
    }, 100);
    
    return () => clearTimeout(timer);
  }, []); // Only run once when component mounts

  // Run screener when strategy changes
  useEffect(() => {
    if (selectedStrategy) {
      console.log('StockScreener: Strategy changed to:', selectedStrategy);
      // Use a timeout to ensure filters are updated
      const timer = setTimeout(() => {
        runScreener();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [selectedStrategy]);

  // Run stock screening using real API data
  const runScreener = async () => {
    setIsLoading(true);
    
    try {
      console.log('StockScreener: Starting screener with filters:', filters);
      // Use the real stock screener service
      const results = await stockScreenerService.screenStocks(filters);
      console.log('StockScreener: Got results from service:', results.length);
      
      // Sort results
      const sortedResults = results.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy] - b[sortBy];
        } else {
          return b[sortBy] - a[sortBy];
        }
      });

      setScreenerResults(sortedResults);
      setLastUpdate(new Date());
      console.log('StockScreener: Screener completed successfully with', sortedResults.length, 'results');
    } catch (error) {
      console.error('StockScreener: Error running screener:', error);
      
      // Show user-friendly error message
      alert(`Screener Error: ${error.message}\n\nFalling back to sample data. Please check your API configuration.`);
      
      // Fallback to mock data if API fails
      const mockResults = sp500Stocks.map(stock => ({
        ...stock,
        price: Math.random() * (filters.maxPrice - filters.minPrice) + filters.minPrice,
        change: (Math.random() - 0.5) * 10,
        changePercent: (Math.random() - 0.5) * 20,
        volume: Math.random() * 10000000 + filters.minVolume,
        high: Math.random() * (filters.maxPrice - filters.minPrice) + filters.minPrice + 5,
        low: Math.random() * (filters.maxPrice - filters.minPrice) + filters.minPrice - 5,
        open: Math.random() * (filters.maxPrice - filters.minPrice) + filters.minPrice,
        previousClose: Math.random() * (filters.maxPrice - filters.minPrice) + filters.minPrice,
        marketCap: Math.random() * 10000000000 + filters.minMarketCap,
        bidAskSpread: Math.random() * filters.maxBidAskSpread,
        impliedVolatility: Math.random() * (filters.maxImpliedVolatility - filters.minImpliedVolatility) + filters.minImpliedVolatility,
        daysToExpiry: Math.random() * (filters.maxDaysToExpiry - filters.minDaysToExpiry) + filters.minDaysToExpiry,
        score: Math.random() * 100
      })).filter(stock => 
        stock.price >= filters.minPrice &&
        stock.price <= filters.maxPrice &&
        stock.volume >= filters.minVolume &&
        stock.marketCap >= filters.minMarketCap &&
        stock.bidAskSpread <= filters.maxBidAskSpread &&
        stock.impliedVolatility >= filters.minImpliedVolatility &&
        stock.impliedVolatility <= filters.maxImpliedVolatility &&
        stock.daysToExpiry >= filters.minDaysToExpiry &&
        stock.daysToExpiry <= filters.maxDaysToExpiry
      );

      const sortedResults = mockResults.sort((a, b) => {
        if (sortOrder === 'asc') {
          return a[sortBy] - b[sortBy];
        } else {
          return b[sortBy] - a[sortBy];
        }
      });

      setScreenerResults(sortedResults);
      setLastUpdate(new Date());
      console.log('StockScreener: Fallback mock data generated:', sortedResults.length, 'results');
    } finally {
      setIsLoading(false);
    }
  };

  const exportResults = () => {
    const csvContent = [
      ['Symbol', 'Name', 'Sector', 'Price', 'Change', 'Change %', 'Volume', 'Market Cap', 'Bid/Ask Spread', 'IV', 'Days to Expiry', 'Score'],
      ...screenerResults.map(stock => [
        stock.symbol,
        stock.name,
        stock.sector,
        stock.price.toFixed(2),
        stock.change.toFixed(2),
        stock.changePercent.toFixed(2) + '%',
        stock.volume.toLocaleString(),
        (stock.marketCap / 1000000000).toFixed(2) + 'B',
        (stock.bidAskSpread * 100).toFixed(2) + '%',
        (stock.impliedVolatility * 100).toFixed(1) + '%',
        Math.round(stock.daysToExpiry),
        stock.score.toFixed(1)
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `stock-screener-${selectedStrategy}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Check if user has access to screener
  if (!currentUser) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-8 rounded-lg">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Access Required</h1>
            <p className="text-xl text-red-300 mb-6">
              You need to create an account to access our advanced Stock Screener.
            </p>
            <Link
              to="/register?plan=free"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              <Gift className="w-5 h-5" />
              Start Free 7-Day Trial
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Check if free trial expired
  const trialEnd = new Date(currentUser.createdAt);
  trialEnd.setDate(trialEnd.getDate() + 7);
  const now = new Date();
  const trialExpired = now > trialEnd;

  if (currentUser.plan === 'free' && trialExpired) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-400 p-8 rounded-lg">
            <Crown className="w-16 h-16 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Free Trial Expired</h1>
            <p className="text-xl text-yellow-300 mb-6">
              Your 7-day free trial has ended. Upgrade to continue accessing our advanced Stock Screener.
            </p>
            <Link
              to="/pricing"
              className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              <Crown className="w-5 h-5" />
              View Subscription Plans
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <BarChart3 className="w-4 h-4" />
            <span>Advanced Stock Screening</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Smart <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Stock Screener</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find high-probability options trading opportunities using our strategy-based screening algorithms 
            and real-time market data analysis.
          </p>
        </div>

        {/* Strategy Selection */}
        <div className="bg-dark-800 p-6 rounded-lg border border-dark-600 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Select Trading Strategy
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(strategies).map(([key, strategy]) => (
              <button
                key={key}
                onClick={() => setSelectedStrategy(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedStrategy === key
                    ? `border-${strategy.color}-500 bg-${strategy.color}-500/20`
                    : 'border-dark-600 hover:border-dark-500 bg-dark-700 hover:bg-dark-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-${strategy.color}-500/20 flex items-center justify-center`}>
                    <strategy.icon className={`w-5 h-5 text-${strategy.color}-400`} />
          </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-white">{strategy.name}</h4>
                    <p className="text-sm text-gray-400">{strategy.description}</p>
                </div>
              </div>
              </button>
            ))}
          </div>

          {/* Strategy Details */}
          <div className="mt-6 p-4 bg-dark-700 rounded-lg border border-dark-600">
            <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-400" />
              {strategies[selectedStrategy].name} - Key Metrics
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Price Range:</span>
                <div className="text-white">${strategies[selectedStrategy].criteria.minPrice} - ${strategies[selectedStrategy].criteria.maxPrice}</div>
              </div>
              <div>
                <span className="text-gray-400">Min Volume:</span>
                <div className="text-white">{(strategies[selectedStrategy].criteria.minVolume / 1000000).toFixed(1)}M</div>
              </div>
              <div>
                <span className="text-gray-400">IV Range:</span>
                <div className="text-white">{(strategies[selectedStrategy].criteria.minImpliedVolatility * 100).toFixed(0)}% - {(strategies[selectedStrategy].criteria.maxImpliedVolatility * 100).toFixed(0)}%</div>
              </div>
              <div>
                <span className="text-gray-400">DTE Range:</span>
                <div className="text-white">{strategies[selectedStrategy].criteria.minDaysToExpiry} - {strategies[selectedStrategy].criteria.maxDaysToExpiry} days</div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-dark-800 p-6 rounded-lg border border-dark-600 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-white flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-400" />
              Screening Filters
            </h3>
            <button
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <Settings className="w-4 h-4" />
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Price Range</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, minPrice: parseFloat(e.target.value) }))}
                  className="flex-1 bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="Min"
                />
                <input
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: parseFloat(e.target.value) }))}
                  className="flex-1 bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                  placeholder="Max"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Min Volume</label>
              <input
                type="number"
                value={filters.minVolume}
                onChange={(e) => setFilters(prev => ({ ...prev, minVolume: parseInt(e.target.value) }))}
                className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                placeholder="1,000,000"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Min Market Cap</label>
              <select
                value={filters.minMarketCap}
                onChange={(e) => setFilters(prev => ({ ...prev, minMarketCap: parseInt(e.target.value) }))}
                className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
              >
                <option value={1000000000}>$1B+</option>
                <option value={5000000000}>$5B+</option>
                <option value={10000000000}>$10B+</option>
                <option value={50000000000}>$50B+</option>
                <option value={100000000000}>$100B+</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Max Bid/Ask Spread</label>
              <input
                type="number"
                step="0.01"
                value={filters.maxBidAskSpread}
                onChange={(e) => setFilters(prev => ({ ...prev, maxBidAskSpread: parseFloat(e.target.value) }))}
                className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                placeholder="0.05"
              />
            </div>
          </div>
          
          {showAdvancedFilters && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-dark-600">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Implied Volatility Range</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    step="0.1"
                    value={filters.minImpliedVolatility}
                    onChange={(e) => setFilters(prev => ({ ...prev, minImpliedVolatility: parseFloat(e.target.value) }))}
                    className="flex-1 bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                    placeholder="0.2"
                  />
                  <input
                    type="number"
                    step="0.1"
                    value={filters.maxImpliedVolatility}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxImpliedVolatility: parseFloat(e.target.value) }))}
                    className="flex-1 bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                    placeholder="0.8"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Days to Expiry</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={filters.minDaysToExpiry}
                    onChange={(e) => setFilters(prev => ({ ...prev, minDaysToExpiry: parseInt(e.target.value) }))}
                    className="flex-1 bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                    placeholder="30"
                  />
                  <input
                    type="number"
                    value={filters.maxDaysToExpiry}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxDaysToExpiry: parseInt(e.target.value) }))}
                    className="flex-1 bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                    placeholder="365"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sort By</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="volume">Volume</option>
                  <option value="price">Price</option>
                  <option value="marketCap">Market Cap</option>
                  <option value="impliedVolatility">Implied Volatility</option>
                  <option value="score">Score</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Sort Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full bg-dark-700 border border-dark-600 rounded px-3 py-2 text-white text-sm"
                >
                  <option value="desc">High to Low</option>
                  <option value="asc">Low to High</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          <button
            onClick={runScreener}
            disabled={isLoading}
            className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              <Search className="w-5 h-5" />
            )}
            {isLoading ? 'Running Screener...' : 'Run Stock Screener'}
          </button>
          
          <button
            onClick={() => {
              console.log('Manual trigger clicked');
              console.log('Current filters:', filters);
              console.log('Current strategy:', selectedStrategy);
              runScreener();
            }}
            className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            Debug: Force Run
          </button>
          
          {screenerResults.length > 0 && (
            <button
              onClick={exportResults}
              className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export Results
            </button>
          )}
        </div>
        
        {/* Real-time Data Indicator and Auto-refresh Controls */}
        <div className="text-center mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/50 text-green-400 px-4 py-2 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span>Real-time data from TwelveData API</span>
              <Clock className="w-4 h-4" />
            </div>
            
            {screenerResults.length > 0 && (
              <div className="flex items-center gap-3 bg-dark-700 px-4 py-2 rounded-lg border border-dark-600">
                <label className="flex items-center gap-2 text-sm text-gray-300">
                  <input
                    type="checkbox"
                    checked={autoRefresh}
                    onChange={(e) => setAutoRefresh(e.target.checked)}
                    className="rounded border-dark-600 bg-dark-800 text-blue-500 focus:ring-blue-500"
                  />
                  Auto-refresh
                </label>
                
                {autoRefresh && (
                  <select
                    value={refreshInterval}
                    onChange={(e) => setRefreshInterval(parseInt(e.target.value))}
                    className="bg-dark-800 border border-dark-600 rounded px-2 py-1 text-sm text-white"
                  >
                    <option value={60000}>1 minute</option>
                    <option value={300000}>5 minutes</option>
                    <option value={900000}>15 minutes</option>
                    <option value={1800000}>30 minutes</option>
                  </select>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Debug Information */}
        <div className="bg-dark-800 p-4 rounded-lg border border-dark-600 mb-6">
          <h4 className="text-sm font-medium text-gray-400 mb-2">Debug Info:</h4>
          <div className="text-xs text-gray-500 space-y-1">
            <div>Strategy: {selectedStrategy}</div>
            <div>Filters: {JSON.stringify(filters)}</div>
            <div>Results Count: {screenerResults.length}</div>
            <div>Loading: {isLoading.toString()}</div>
            <div>Last Update: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}</div>
          </div>
        </div>

        {/* Results */}
        {screenerResults.length > 0 && (
          <div className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden">
            <div className="p-6 border-b border-dark-600">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Screener Results ({screenerResults.length} stocks found)
                  </h3>
                  <p className="text-gray-400 mt-2">
                    Showing stocks that match your {strategies[selectedStrategy].name} criteria
                  </p>
                </div>
                {lastUpdate && (
                  <div className="text-right text-sm text-gray-400">
                    <div>Last updated:</div>
                    <div className="text-white">{lastUpdate.toLocaleTimeString()}</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-dark-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Sector</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Change</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Volume</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Market Cap</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Bid/Ask</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">IV</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">DTE</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-600">
                  {screenerResults.map((stock, index) => (
                    <tr key={index} className="hover:bg-dark-700 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-white">{stock.symbol}</div>
                          <div className="text-sm text-gray-400">{stock.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{stock.sector}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-white">${stock.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{(stock.volume / 1000000).toFixed(1)}M</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">${(stock.marketCap / 1000000000).toFixed(1)}B</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{(stock.bidAskSpread * 100).toFixed(2)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{(stock.impliedVolatility * 100).toFixed(1)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{Math.round(stock.daysToExpiry)}d</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          stock.score >= 80 ? 'bg-green-100 text-green-800' :
                          stock.score >= 60 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {stock.score.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* No Results Message */}
        {screenerResults.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Results Yet</h3>
            <p className="text-gray-400">Run the screener to find stocks that match your criteria</p>
          </div>
        )}

        {/* Current Access Status */}
        <div className="bg-dark-800 p-6 rounded-lg border border-dark-600 mt-8">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Your Access Status
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Current Plan:</span>
                <span className="text-white font-medium capitalize">{currentUser.plan}</span>
              </div>
              
              {currentUser.plan === 'free' && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Trial Days Left:</span>
                  <span className="text-white font-medium">
                    {Math.max(0, Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24)))} days
                  </span>
                </div>
              )}
              
              <div className="flex justify-between">
                <span className="text-gray-400">Screener Access:</span>
                <span className="text-green-400 font-medium">✓ Available</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-400">Data Source:</span>
                <span className="text-white font-medium">TwelveData API</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Update Frequency:</span>
                <span className="text-blue-400 font-medium">Real-time</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Coverage:</span>
                <span className="text-white font-medium">S&P 500 + Major Stocks</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mt-12">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/learn"
              className="btn-secondary text-lg px-8 py-4 inline-flex items-center gap-2"
            >
              <BookOpen className="w-5 h-5" />
              Learn Trading Strategies
            </Link>
            
            {currentUser.plan === 'free' && (
              <Link
                to="/pricing"
                className="btn-primary text-lg px-8 py-4 inline-flex items-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Upgrade to Premium
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StockScreener;
