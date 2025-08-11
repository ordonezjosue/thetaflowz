import React, { useState, useEffect } from 'react';
import { useMarketData } from '../contexts/MarketDataContext';
import twelveDataService from '../services/twelveDataService';
import { TrendingUp, TrendingDown, Plus, X, Search, RefreshCw, AlertCircle } from 'lucide-react';

const MarketOverview = () => {
  const {
    marketSummary,
    watchlist,
    loading,
    error,
    lastUpdate,
    addToWatchlist,
    removeFromWatchlist,
    searchSymbols,
    fetchMarketSummary
  } = useMarketData();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState(null);
  const [apiStatus, setApiStatus] = useState(null);

  // Fetch real-time market data on component mount
  useEffect(() => {
    fetchRealTimeData();
    checkApiStatus();
    
    // Set up interval to refresh data every 30 seconds
    const interval = setInterval(fetchRealTimeData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchRealTimeData = async () => {
    try {
      const data = await twelveDataService.getMarketOverview();
      setRealTimeData(data);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
      // Don't show error to user, just log it
    }
  };

  const checkApiStatus = async () => {
    try {
      const status = await twelveDataService.checkApiStatus();
      setApiStatus(status);
    } catch (error) {
      console.error('Error checking API status:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    console.log('Searching for:', searchQuery);
    setSearchLoading(true);
    try {
      const results = await searchSymbols(searchQuery);
      console.log('Search results:', results);
      setSearchResults(results.slice(0, 5)); // Limit to 5 results
    } catch (error) {
      console.error('Error in handleSearch:', error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAddToWatchlist = async (symbol) => {
    await addToWatchlist(symbol);
    setSearchQuery('');
    setSearchResults([]);
    setShowSearch(false);
  };

  const formatPrice = (price) => {
    return typeof price === 'number' ? `$${price.toFixed(2)}` : 'N/A';
  };

  const formatChange = (change, changePercent) => {
    if (typeof change !== 'number' || typeof changePercent !== 'number') return 'N/A';
    
    const isPositive = change >= 0;
    const icon = isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
    
    return (
      <div className={`flex items-center gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {icon}
        <span>{isPositive ? '+' : ''}{change.toFixed(2)} ({changePercent.toFixed(2)}%)</span>
      </div>
    );
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp).toLocaleTimeString();
  };

  // API Status Display
  const renderApiStatus = () => {
    if (!apiStatus) return null;
    
    return (
      <div className="bg-blue-900/20 border border-blue-500/50 text-blue-400 p-3 rounded-lg text-sm">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          <span>API Status: {apiStatus.plan || 'Free Plan'} • Requests: {apiStatus.requests_used || 0}/{apiStatus.requests_limit || 'Unlimited'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Market Overview</h2>
          <p className="text-gray-400 text-sm">
            Last updated: {realTimeData?.timestamp ? formatTime(realTimeData.timestamp) : 'Never'}
          </p>
        </div>
        <button
          onClick={fetchRealTimeData}
          disabled={loading}
          className="btn-secondary flex items-center gap-2"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* API Status */}
      {renderApiStatus()}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-4 rounded-lg">
          {error}
        </div>
      )}

      {/* Real-Time Major Indices */}
      <div className="card">
        <h3 className="text-lg font-semibold text-white mb-4">Real-Time Market Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {realTimeData?.sp500 && (
            <div className="bg-dark-800 p-4 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">S&P 500</h4>
                  <p className="text-gray-400 text-sm">SPY</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{formatPrice(realTimeData.sp500.price)}</p>
                  {formatChange(realTimeData.sp500.change, realTimeData.sp500.changePercent)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Vol: {realTimeData.sp500.volume?.toLocaleString() || 'N/A'}
              </div>
            </div>
          )}
          
          {realTimeData?.nasdaq && (
            <div className="bg-dark-800 p-4 rounded-lg border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">NASDAQ</h4>
                  <p className="text-gray-400 text-sm">QQQ</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{formatPrice(realTimeData.nasdaq.price)}</p>
                  {formatChange(realTimeData.nasdaq.change, realTimeData.nasdaq.changePercent)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Vol: {realTimeData.nasdaq.volume?.toLocaleString() || 'N/A'}
              </div>
            </div>
          )}
          
          {realTimeData?.dow && (
            <div className="bg-dark-800 p-4 rounded-lg border-l-4 border-purple-500">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">Dow Jones</h4>
                  <p className="text-gray-400 text-sm">DIA</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{formatPrice(realTimeData.dow.price)}</p>
                  {formatChange(realTimeData.dow.change, realTimeData.dow.changePercent)}
                </div>
              </div>
              <div className="text-xs text-gray-500">
                Vol: {realTimeData.dow.volume?.toLocaleString() || 'N/A'}
              </div>
            </div>
          )}
        </div>
        
        {!realTimeData && (
          <div className="text-center py-8 text-gray-400">
            <p>Loading real-time market data...</p>
          </div>
        )}
      </div>

      {/* Legacy Market Summary (fallback) */}
      {marketSummary.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-white mb-4">Additional Market Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketSummary.map((index) => (
              <div key={index.symbol} className="bg-dark-800 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{index.name}</h4>
                    <p className="text-gray-400 text-sm">{index.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatPrice(index.price)}</p>
                    {formatChange(index.change, index.changePercent)}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Vol: {index.volume?.toLocaleString() || 'N/A'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watchlist */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Watchlist</h3>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Symbol
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="mb-4 p-4 bg-dark-800 rounded-lg">
            <div className="flex gap-2 mb-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search for symbols (e.g., AAPL, TSLA)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="input-field pl-10"
                />
              </div>
              <button 
                onClick={handleSearch} 
                disabled={searchLoading}
                className="btn-secondary flex items-center gap-2"
              >
                {searchLoading ? 'Searching...' : 'Search'}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm text-gray-400">Search Results:</p>
                {searchResults.map((result) => (
                  <div
                    key={result.symbol}
                    className="flex items-center justify-between p-3 bg-dark-700 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-medium">{result.name}</p>
                      <p className="text-gray-400 text-sm">{result.symbol}</p>
                      <p className="text-gray-500 text-xs">{result.exchange} • {result.type}</p>
                    </div>
                    <button
                      onClick={() => handleAddToWatchlist(result.symbol)}
                      className="btn-primary text-sm"
                    >
                      Add
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Watchlist Items */}
        {watchlist.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No symbols in your watchlist</p>
            <p className="text-sm">Click "Add Symbol" to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {watchlist.map((item) => (
              <div key={item.symbol} className="bg-dark-800 p-4 rounded-lg relative">
                <button
                  onClick={() => removeFromWatchlist(item.symbol)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h4 className="font-semibold text-white">{item.name}</h4>
                    <p className="text-gray-400 text-sm">{item.symbol}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-semibold">{formatPrice(item.price)}</p>
                    {formatChange(item.change, item.changePercent)}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  Added: {new Date(item.addedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketOverview; 