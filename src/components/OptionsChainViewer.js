import React, { useState, useEffect } from 'react';
import { useMarketData } from '../contexts/MarketDataContext';
import { Search, RefreshCw, Calendar, DollarSign } from 'lucide-react';

const OptionsChainViewer = ({ symbol, onSelectOption }) => {
  const { getOptionsChain } = useMarketData();
  const [optionsData, setOptionsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedExpiry, setSelectedExpiry] = useState(null);

  const fetchOptionsChain = async () => {
    if (!symbol) return;
    
    try {
      setLoading(true);
      setError(null);
      const data = await getOptionsChain(symbol);
      setOptionsData(data);
      if (data.expirationDates && data.expirationDates.length > 0) {
        setSelectedExpiry(data.expirationDates[0]);
      }
    } catch (err) {
      setError('Failed to fetch options chain');
      console.error(`Error fetching options chain for ${symbol}:`, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (symbol) {
      fetchOptionsChain();
    }
  }, [symbol]);

  const formatStrike = (strike) => {
    return typeof strike === 'number' ? `$${strike.toFixed(2)}` : 'N/A';
  };

  const formatBidAsk = (bid, ask) => {
    if (typeof bid !== 'number' || typeof ask !== 'number') return 'N/A';
    return `$${bid.toFixed(2)} - $${ask.toFixed(2)}`;
  };

  const formatVolume = (volume) => {
    return typeof volume === 'number' ? volume.toLocaleString() : 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-400">Loading options chain...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 text-center">
        {error}
      </div>
    );
  }

  if (!optionsData || !selectedExpiry) {
    return (
      <div className="text-gray-400 p-4 text-center">
        No options data available
      </div>
    );
  }

  const currentExpiryData = optionsData.strikes?.find(
    strike => strike.expirationDate === selectedExpiry
  );

  if (!currentExpiryData) {
    return (
      <div className="text-gray-400 p-4 text-center">
        No options data for selected expiration
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Expiration Date Selector */}
      <div className="flex items-center gap-4">
        <Calendar className="w-5 h-5 text-gray-400" />
        <select
          value={selectedExpiry}
          onChange={(e) => setSelectedExpiry(e.target.value)}
          className="input-field"
        >
          {optionsData.expirationDates?.map((date) => (
            <option key={date} value={date}>
              {new Date(date).toLocaleDateString()}
            </option>
          ))}
        </select>
      </div>

      {/* Options Chain Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-700">
              <tr>
                <th className="text-left p-3 text-gray-300 font-medium text-sm">Strike</th>
                <th className="text-left p-3 text-gray-300 font-medium text-sm">Type</th>
                <th className="text-left p-3 text-gray-300 font-medium text-sm">Bid/Ask</th>
                <th className="text-left p-3 text-gray-300 font-medium text-sm">Volume</th>
                <th className="text-left p-3 text-gray-300 font-medium text-sm">Open Interest</th>
                <th className="text-left p-3 text-gray-300 font-medium text-sm">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-700">
              {currentExpiryData.callExpDateMap?.[selectedExpiry]?.map((call) => (
                <tr key={`call-${call.strikePrice}`} className="hover:bg-dark-700/50">
                  <td className="p-3 text-white font-medium">{formatStrike(call.strikePrice)}</td>
                  <td className="p-3 text-blue-400 text-sm">Call</td>
                  <td className="p-3 text-gray-300 text-sm">
                    {formatBidAsk(call.bid, call.ask)}
                  </td>
                  <td className="p-3 text-gray-300 text-sm">
                    {formatVolume(call.volume)}
                  </td>
                  <td className="p-3 text-gray-300 text-sm">
                    {formatVolume(call.openInterest)}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onSelectOption && onSelectOption(call)}
                      className="text-primary-500 hover:text-primary-400 text-sm"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
              {currentExpiryData.putExpDateMap?.[selectedExpiry]?.map((put) => (
                <tr key={`put-${put.strikePrice}`} className="hover:bg-dark-700/50">
                  <td className="p-3 text-white font-medium">{formatStrike(put.strikePrice)}</td>
                  <td className="p-3 text-red-400 text-sm">Put</td>
                  <td className="p-3 text-gray-300 text-sm">
                    {formatBidAsk(put.bid, put.ask)}
                  </td>
                  <td className="p-3 text-gray-300 text-sm">
                    {formatVolume(put.volume)}
                  </td>
                  <td className="p-3 text-gray-300 text-sm">
                    {formatVolume(put.openInterest)}
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => onSelectOption && onSelectOption(put)}
                      className="text-primary-500 hover:text-primary-400 text-sm"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Total Calls</span>
          </div>
          <p className="text-white font-semibold">
            {currentExpiryData.callExpDateMap?.[selectedExpiry]?.length || 0}
          </p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Total Puts</span>
          </div>
          <p className="text-white font-semibold">
            {currentExpiryData.putExpDateMap?.[selectedExpiry]?.length || 0}
          </p>
        </div>
        <div className="card">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400 text-sm">Expiration</span>
          </div>
          <p className="text-white font-semibold">
            {new Date(selectedExpiry).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OptionsChainViewer; 