import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import marketDataService from '../services/marketDataService';

const MarketDataContext = createContext();

export const useMarketData = () => {
  const context = useContext(MarketDataContext);
  if (!context) {
    throw new Error('useMarketData must be used within a MarketDataProvider');
  }
  return context;
};

export const MarketDataProvider = ({ children }) => {
  const [marketSummary, setMarketSummary] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Load initial watchlist from localStorage
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('thetaflowz-watchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Error loading watchlist from localStorage:', error);
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('thetaflowz-watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  // Fetch market summary
  const fetchMarketSummary = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const summary = await marketDataService.getMarketSummary();
      setMarketSummary(summary);
      setLastUpdate(new Date());
    } catch (error) {
      setError('Failed to fetch market summary');
      console.error('Error fetching market summary:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch watchlist quotes
  const fetchWatchlistQuotes = useCallback(async () => {
    if (watchlist.length === 0) return;

    try {
      setLoading(true);
      setError(null);
      const symbols = watchlist.map(item => item.symbol);
      const quotes = await marketDataService.getQuotes(symbols);
      
      const updatedWatchlist = watchlist.map((item, index) => ({
        ...item,
        ...quotes[index]
      }));
      
      setWatchlist(updatedWatchlist);
      setLastUpdate(new Date());
    } catch (error) {
      setError('Failed to fetch watchlist quotes');
      console.error('Error fetching watchlist quotes:', error);
    } finally {
      setLoading(false);
    }
  }, [watchlist]);

  // Add symbol to watchlist
  const addToWatchlist = useCallback(async (symbol) => {
    try {
      const quote = await marketDataService.getQuote(symbol);
      const newItem = {
        symbol: quote.symbol,
        name: quote.shortName || quote.longName || symbol,
        price: quote.price,
        change: quote.change,
        changePercent: quote.changePercent,
        addedAt: new Date().toISOString()
      };

      setWatchlist(prev => {
        const exists = prev.find(item => item.symbol === symbol);
        if (exists) return prev;
        return [...prev, newItem];
      });
    } catch (error) {
      setError(`Failed to add ${symbol} to watchlist`);
      console.error(`Error adding ${symbol} to watchlist:`, error);
    }
  }, []);

  // Remove symbol from watchlist
  const removeFromWatchlist = useCallback((symbol) => {
    setWatchlist(prev => prev.filter(item => item.symbol !== symbol));
  }, []);

  // Search for symbols
  const searchSymbols = useCallback(async (query) => {
    try {
      setLoading(true);
      setError(null);
      const results = await marketDataService.searchSymbols(query);
      return results;
    } catch (error) {
      setError('Failed to search symbols');
      console.error('Error searching symbols:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Get quote for a single symbol
  const getQuote = useCallback(async (symbol) => {
    try {
      setLoading(true);
      setError(null);
      const quote = await marketDataService.getQuote(symbol);
      return quote;
    } catch (error) {
      setError(`Failed to fetch quote for ${symbol}`);
      console.error(`Error fetching quote for ${symbol}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get historical data
  const getHistoricalData = useCallback(async (symbol, period = '1mo', interval = '1d') => {
    try {
      setLoading(true);
      setError(null);
      const data = await marketDataService.getHistoricalData(symbol, period, interval);
      return data;
    } catch (error) {
      setError(`Failed to fetch historical data for ${symbol}`);
      console.error(`Error fetching historical data for ${symbol}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get options chain
  const getOptionsChain = useCallback(async (symbol) => {
    try {
      setLoading(true);
      setError(null);
      const options = await marketDataService.getOptionsChain(symbol);
      return options;
    } catch (error) {
      setError(`Failed to fetch options chain for ${symbol}`);
      console.error(`Error fetching options chain for ${symbol}:`, error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial data fetch only (no auto-refresh to prevent flashing)
  useEffect(() => {
    fetchMarketSummary();
    fetchWatchlistQuotes();
  }, [fetchMarketSummary, fetchWatchlistQuotes]);

  const value = {
    marketSummary,
    watchlist,
    loading,
    error,
    lastUpdate,
    addToWatchlist,
    removeFromWatchlist,
    searchSymbols,
    getQuote,
    getHistoricalData,
    getOptionsChain,
    fetchMarketSummary,
    fetchWatchlistQuotes
  };

  return (
    <MarketDataContext.Provider value={value}>
      {children}
    </MarketDataContext.Provider>
  );
}; 