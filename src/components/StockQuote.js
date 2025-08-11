import React, { useState, useEffect, useCallback } from 'react';
import { useMarketData } from '../contexts/MarketDataContext';
import twelveDataService from '../services/twelveDataService';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

const StockQuote = ({ symbol, showDetails = false, className = '' }) => {
  const { getQuote } = useMarketData();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchQuote = useCallback(async () => {
    if (!symbol) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Try TwelveData API first
      try {
        const realTimeData = await twelveDataService.getStockQuote(symbol);
        setQuote({
          ...realTimeData,
          shortName: symbol, // Use symbol as fallback name
          longName: symbol,
          marketCap: null // TwelveData doesn't provide market cap in basic quote
        });
        return;
      } catch (apiError) {
        console.log('TwelveData API failed, falling back to mock data:', apiError);
      }
      
      // Fallback to mock data if API fails
      const data = await getQuote(symbol);
      setQuote(data);
    } catch (err) {
      setError('Failed to fetch quote');
      console.error(`Error fetching quote for ${symbol}:`, err);
    } finally {
      setLoading(false);
    }
  }, [symbol, getQuote]);

  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

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

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-400 text-sm p-2 ${className}`}>
        {error}
      </div>
    );
  }

  if (!quote) {
    return (
      <div className={`text-gray-400 text-sm p-2 ${className}`}>
        No data available
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold text-white">{quote.shortName || quote.longName || quote.symbol}</h4>
          <p className="text-gray-400 text-sm">{quote.symbol}</p>
        </div>
        <div className="text-right">
          <p className="text-white font-semibold">{formatPrice(quote.price)}</p>
          {formatChange(quote.change, quote.changePercent)}
        </div>
      </div>
      
      {showDetails && (
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Volume</p>
            <p className="text-white">{quote.volume?.toLocaleString() || 'N/A'}</p>
          </div>
          <div>
            <p className="text-gray-400">Market Cap</p>
            <p className="text-white">
              {quote.marketCap ? `$${(quote.marketCap / 1e9).toFixed(2)}B` : 'N/A'}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Day High</p>
            <p className="text-white">{formatPrice(quote.high)}</p>
          </div>
          <div>
            <p className="text-gray-400">Day Low</p>
            <p className="text-white">{formatPrice(quote.low)}</p>
          </div>
          <div>
            <p className="text-gray-400">Open</p>
            <p className="text-white">{formatPrice(quote.open)}</p>
          </div>
          <div>
            <p className="text-gray-400">Previous Close</p>
            <p className="text-white">{formatPrice(quote.previousClose)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StockQuote; 