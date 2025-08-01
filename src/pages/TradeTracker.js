import React, { useState, useEffect } from 'react';
import { Plus, TrendingUp, TrendingDown, DollarSign, Calendar, BarChart3, Filter, Search, Target, Zap, Shield, Calculator, PieChart, Activity } from 'lucide-react';
import StockQuote from '../components/StockQuote';

const TradeTracker = () => {
  const [trades, setTrades] = useState([
    {
      id: 1,
      symbol: 'AAPL',
      strategy: 'Put Credit Spread',
      entryDate: '2024-01-15',
      exitDate: '2024-01-22',
      entryPrice: 150,
      exitPrice: 148,
      strikePrice: 150,
      shortStrike: 150,
      longStrike: 145,
      premium: 2.50,
      quantity: 1,
      pnl: 250,
      status: 'closed',
      notes: 'Successful trade, stock stayed above strike',
      // Advanced fields
      capitalRequired: 500,
      maxRisk: 250,
      delta: -0.30,
      theta: 0.15,
      gamma: 0.02,
      vega: 12.5,
      impliedVolatility: 0.25,
      daysToExpiration: 30,
      dcaEntries: [
        { date: '2024-01-15', price: 150, quantity: 1, premium: 2.50 }
      ]
    },
    {
      id: 2,
      symbol: 'TSLA',
      strategy: 'Call Credit Spread',
      entryDate: '2024-01-20',
      exitDate: null,
      entryPrice: 200,
      exitPrice: null,
      strikePrice: 200,
      shortStrike: 200,
      longStrike: 205,
      premium: 3.00,
      quantity: 1,
      pnl: 0,
      status: 'open',
      notes: 'Waiting for expiration or early exit',
      // Advanced fields
      capitalRequired: 500,
      maxRisk: 200,
      delta: 0.25,
      theta: -0.20,
      gamma: 0.03,
      vega: 15.2,
      impliedVolatility: 0.35,
      daysToExpiration: 45,
      dcaEntries: [
        { date: '2024-01-20', price: 200, quantity: 1, premium: 3.00 },
        { date: '2024-01-25', price: 195, quantity: 1, premium: 2.80 }
      ]
    },
    {
      id: 3,
      symbol: 'SPY',
      strategy: 'Wheel Strategy',
      entryDate: '2024-01-10',
      exitDate: '2024-01-25',
      entryPrice: 400,
      exitPrice: 405,
      strikePrice: 400,
      shortStrike: 400,
      longStrike: null,
      premium: 1.50,
      quantity: 2,
      pnl: 300,
      status: 'closed',
      notes: 'Wheel completed, stock assigned and sold',
      // Advanced fields
      capitalRequired: 80000,
      maxRisk: 80000,
      delta: -0.50,
      theta: 0.25,
      gamma: 0.01,
      vega: 8.5,
      impliedVolatility: 0.18,
      daysToExpiration: 60,
      dcaEntries: [
        { date: '2024-01-10', price: 400, quantity: 2, premium: 1.50 }
      ]
    }
  ]);

  const [showAddTrade, setShowAddTrade] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrade, setSelectedTrade] = useState(null);
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState(false);
  const [showAdjustTrade, setShowAdjustTrade] = useState(false);
  const [adjustingTrade, setAdjustingTrade] = useState(null);

  const [newTrade, setNewTrade] = useState({
    symbol: '',
    strategy: '',
    entryDate: '',
    entryPrice: '',
    strikePrice: '',
    shortStrike: '',
    longStrike: '',
    premium: '',
    quantity: '',
    notes: '',
    // Advanced fields
    capitalRequired: '',
    maxRisk: '',
    delta: '',
    theta: '',
    gamma: '',
    vega: '',
    impliedVolatility: '',
    daysToExpiration: ''
  });

  const strategies = [
    'Put Credit Spread',
    'Call Credit Spread',
    'Wheel Strategy',
    'Naked Puts',
    'Covered Calls',
    'Iron Condor',
    'Butterfly Spread',
    'Calendar Spread',
    'Diagonal Spread'
  ];

  // Calculate advanced metrics
  const calculateMetrics = () => {
    const openTrades = trades.filter(t => t.status === 'open');
    const totalCapital = trades.reduce((sum, t) => sum + (t.capitalRequired || 0), 0);
    const totalRisk = trades.reduce((sum, t) => sum + (t.maxRisk || 0), 0);
    const avgDelta = openTrades.length > 0 ? openTrades.reduce((sum, t) => sum + (t.delta || 0), 0) / openTrades.length : 0;
    const avgTheta = openTrades.length > 0 ? openTrades.reduce((sum, t) => sum + (t.theta || 0), 0) / openTrades.length : 0;
    
    return {
      totalCapital,
      totalRisk,
      avgDelta,
      avgTheta,
      openTrades: openTrades.length
    };
  };

  const metrics = calculateMetrics();

  const handleAddTrade = () => {
    const trade = {
      id: Date.now(),
      ...newTrade,
      entryPrice: parseFloat(newTrade.entryPrice),
      strikePrice: parseFloat(newTrade.strikePrice),
      shortStrike: parseFloat(newTrade.shortStrike),
      longStrike: newTrade.longStrike ? parseFloat(newTrade.longStrike) : null,
      premium: parseFloat(newTrade.premium),
      quantity: parseInt(newTrade.quantity),
      capitalRequired: parseFloat(newTrade.capitalRequired),
      maxRisk: parseFloat(newTrade.maxRisk),
      delta: parseFloat(newTrade.delta),
      theta: parseFloat(newTrade.theta),
      gamma: parseFloat(newTrade.gamma),
      vega: parseFloat(newTrade.vega),
      impliedVolatility: parseFloat(newTrade.impliedVolatility),
      daysToExpiration: parseInt(newTrade.daysToExpiration),
      pnl: 0,
      status: 'open',
      exitDate: null,
      exitPrice: null,
      dcaEntries: [{
        date: newTrade.entryDate,
        price: parseFloat(newTrade.entryPrice),
        quantity: parseInt(newTrade.quantity),
        premium: parseFloat(newTrade.premium)
      }]
    };

    setTrades([...trades, trade]);
    setNewTrade({
      symbol: '',
      strategy: '',
      entryDate: '',
      entryPrice: '',
      strikePrice: '',
      shortStrike: '',
      longStrike: '',
      premium: '',
      quantity: '',
      notes: '',
      capitalRequired: '',
      maxRisk: '',
      delta: '',
      theta: '',
      gamma: '',
      vega: '',
      impliedVolatility: '',
      daysToExpiration: ''
    });
    setShowAddTrade(false);
  };



  const handleAddDCA = (tradeId) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;

    const newDCAEntry = {
      date: new Date().toISOString().split('T')[0],
      price: trade.entryPrice * 0.95, // 5% lower for DCA
      quantity: trade.quantity,
      premium: trade.premium * 0.9 // 10% lower premium
    };

    setTrades(trades.map(t => 
      t.id === tradeId 
        ? { ...t, dcaEntries: [...t.dcaEntries, newDCAEntry] }
        : t
    ));
  };

  const handleAdjustTrade = (trade) => {
    setAdjustingTrade(trade);
    setShowAdjustTrade(true);
  };

  const handleRollTrade = (adjustmentData) => {
    const { newStrikes, newPremium, newExpiration, rollCost } = adjustmentData;
    
    setTrades(trades.map(t => 
      t.id === adjustingTrade.id 
        ? {
            ...t,
            shortStrike: newStrikes.short,
            longStrike: newStrikes.long,
            premium: newPremium,
            daysToExpiration: newExpiration,
            pnl: t.pnl - rollCost, // Subtract roll cost from P&L
            notes: `${t.notes || ''}\n[ROLLED] ${new Date().toISOString().split('T')[0]}: ${newStrikes.short}/${newStrikes.long} @ $${newPremium} (Cost: $${rollCost})`
          }
        : t
    ));
    setShowAdjustTrade(false);
    setAdjustingTrade(null);
  };

  const handleCloseTrade = (tradeId, closeData = null) => {
    const trade = trades.find(t => t.id === tradeId);
    if (!trade) return;

    let finalPnL = trade.pnl;
    let closeNotes = '';

    if (closeData) {
      // Calculate P&L based on close data
      const { closePrice, closePremium, closeCost } = closeData;
      finalPnL = (closePremium - trade.premium) * trade.quantity * 100 - (closeCost || 0);
      closeNotes = `\n[CLOSED] ${new Date().toISOString().split('T')[0]}: @ $${closePrice} (Premium: $${closePremium}, Cost: $${closeCost || 0})`;
    }

    setTrades(trades.map(t => 
      t.id === tradeId 
        ? { 
            ...t, 
            status: 'closed', 
            exitDate: new Date().toISOString().split('T')[0],
            exitPrice: closeData?.closePrice || t.entryPrice,
            pnl: finalPnL,
            notes: `${t.notes || ''}${closeNotes}`
          }
        : t
    ));
  };

  const filteredTrades = trades.filter(trade => {
    const matchesFilter = filter === 'all' || trade.status === filter;
    const matchesSearch = trade.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         trade.strategy.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalPnL = trades.reduce((sum, trade) => sum + trade.pnl, 0);
  const winRate = trades.filter(t => t.status === 'closed').length > 0 
    ? (trades.filter(t => t.status === 'closed' && t.pnl > 0).length / trades.filter(t => t.status === 'closed').length * 100).toFixed(1)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Advanced Trade Tracker</h1>
            <p className="text-gray-300">Monitor options trades with DCA, Greeks, and capital analysis</p>
          </div>
          <div className="flex space-x-3 mt-4 sm:mt-0">
            <button
              onClick={() => setShowAdvancedAnalysis(!showAdvancedAnalysis)}
              className="btn-secondary flex items-center space-x-2"
            >
              <Calculator className="h-5 w-5" />
              <span>Advanced Analysis</span>
            </button>
            <button
              onClick={() => setShowAddTrade(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Trade</span>
            </button>
          </div>
        </div>

        {/* Advanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total P&L</p>
                <p className={`text-2xl font-bold ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  ${totalPnL.toLocaleString()}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Capital Required</p>
                <p className="text-2xl font-bold text-white">
                  ${metrics.totalCapital.toLocaleString()}
                </p>
              </div>
              <Target className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Delta</p>
                <p className="text-2xl font-bold text-white">
                  {metrics.avgDelta.toFixed(2)}
                </p>
              </div>
              <Activity className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Theta</p>
                <p className="text-2xl font-bold text-white">
                  {metrics.avgTheta.toFixed(2)}
                </p>
              </div>
              <Zap className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Advanced Analysis Panel */}
        {showAdvancedAnalysis && (
          <div className="card mb-8">
            <h3 className="text-lg font-semibold text-white mb-4">Advanced Portfolio Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-dark-700 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Risk Management</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Risk:</span>
                    <span className="text-white">${metrics.totalRisk.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Risk/Reward:</span>
                    <span className="text-white">{(metrics.totalRisk / Math.max(totalPnL, 1)).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Win Rate:</span>
                    <span className="text-white">{winRate}%</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-700 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Greeks Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Delta:</span>
                    <span className="text-white">{metrics.avgDelta.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Theta:</span>
                    <span className="text-white">{metrics.avgTheta.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Open Positions:</span>
                    <span className="text-white">{metrics.openTrades}</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-700 p-4 rounded-lg">
                <h4 className="text-white font-medium mb-3">Capital Efficiency</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">ROI:</span>
                    <span className="text-white">{((totalPnL / Math.max(metrics.totalCapital, 1)) * 100).toFixed(2)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Capital Used:</span>
                    <span className="text-white">{((metrics.totalCapital / 100000) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Days:</span>
                    <span className="text-white">
                      {trades.length > 0 ? (trades.reduce((sum, t) => sum + (t.daysToExpiration || 0), 0) / trades.length).toFixed(0) : 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search trades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">All Trades</option>
            <option value="open">Open Trades</option>
            <option value="closed">Closed Trades</option>
          </select>
        </div>

        {/* Stock Quotes for Traded Symbols */}
        {filteredTrades.length > 0 && (
          <div className="card mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Current Market Prices</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from(new Set(filteredTrades.map(trade => trade.symbol))).map(symbol => (
                <div key={symbol} className="bg-dark-700 p-4 rounded-lg">
                  <StockQuote symbol={symbol} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Enhanced Trades Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700">
                <tr>
                  <th className="text-left p-4 text-gray-300 font-medium">Symbol</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Strategy</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Strikes</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Premium</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Capital</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Delta</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Theta</th>
                  <th className="text-left p-4 text-gray-300 font-medium">P&L</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-300 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-dark-700">
                {filteredTrades.map((trade) => (
                  <tr key={trade.id} className="hover:bg-dark-700/50">
                    <td className="p-4 text-white font-medium">{trade.symbol}</td>
                    <td className="p-4 text-gray-300">{trade.strategy}</td>
                    <td className="p-4 text-gray-300">
                      <div className="text-sm">
                        <div>Short: ${trade.shortStrike}</div>
                        {trade.longStrike && <div>Long: ${trade.longStrike}</div>}
                      </div>
                    </td>
                    <td className="p-4 text-gray-300">${trade.premium}</td>
                    <td className="p-4 text-gray-300">${trade.capitalRequired?.toLocaleString()}</td>
                    <td className="p-4 text-gray-300">{trade.delta?.toFixed(3)}</td>
                    <td className="p-4 text-gray-300">{trade.theta?.toFixed(3)}</td>
                    <td className="p-4">
                      <span className={`font-medium ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${trade.pnl}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        trade.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                      }`}>
                        {trade.status}
                      </span>
                    </td>
                                         <td className="p-4">
                       <div className="flex space-x-2">
                         {trade.status === 'open' && (
                           <>
                             <button
                               onClick={() => handleAdjustTrade(trade)}
                               className="text-yellow-500 hover:text-yellow-400 text-sm"
                             >
                               Adjust
                             </button>
                             <button
                               onClick={() => handleAddDCA(trade.id)}
                               className="text-blue-500 hover:text-blue-400 text-sm"
                             >
                               DCA
                             </button>
                           </>
                         )}
                         <button
                           onClick={() => setSelectedTrade(trade)}
                           className="text-gray-400 hover:text-white text-sm"
                         >
                           Details
                         </button>
                       </div>
                     </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Trade Details Modal */}
        {selectedTrade && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Trade Details: {selectedTrade.symbol}</h2>
                <button
                  onClick={() => setSelectedTrade(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Basic Info</h3>
                  <div className="bg-dark-700 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Strategy:</span>
                      <span className="text-white">{selectedTrade.strategy}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Date:</span>
                      <span className="text-white">{selectedTrade.entryDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Entry Price:</span>
                      <span className="text-white">${selectedTrade.entryPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Quantity:</span>
                      <span className="text-white">{selectedTrade.quantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Premium:</span>
                      <span className="text-white">${selectedTrade.premium}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Greeks Analysis</h3>
                  <div className="bg-dark-700 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Delta:</span>
                      <span className="text-white">{selectedTrade.delta?.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Theta:</span>
                      <span className="text-white">{selectedTrade.theta?.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Gamma:</span>
                      <span className="text-white">{selectedTrade.gamma?.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Vega:</span>
                      <span className="text-white">{selectedTrade.vega?.toFixed(1)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">IV:</span>
                      <span className="text-white">{(selectedTrade.impliedVolatility * 100).toFixed(1)}%</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Risk Management</h3>
                  <div className="bg-dark-700 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Capital Required:</span>
                      <span className="text-white">${selectedTrade.capitalRequired?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Risk:</span>
                      <span className="text-white">${selectedTrade.maxRisk?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Days to Exp:</span>
                      <span className="text-white">{selectedTrade.daysToExpiration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">P&L:</span>
                      <span className={`font-medium ${selectedTrade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        ${selectedTrade.pnl}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">DCA Entries</h3>
                  <div className="bg-dark-700 p-4 rounded-lg space-y-2">
                    {selectedTrade.dcaEntries?.map((entry, index) => (
                      <div key={index} className="border-b border-dark-600 pb-2 last:border-b-0">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Entry {index + 1}:</span>
                          <span className="text-white">{entry.date}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Price:</span>
                          <span className="text-white">${entry.price}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Premium:</span>
                          <span className="text-white">${entry.premium}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-white mb-3">Notes</h3>
                <p className="text-gray-300 bg-dark-700 p-4 rounded-lg">
                  {selectedTrade.notes || 'No notes available'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Enhanced Add Trade Modal */}
        {showAddTrade && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">Add Advanced Trade</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                  <input
                    type="text"
                    value={newTrade.symbol}
                    onChange={(e) => setNewTrade({...newTrade, symbol: e.target.value})}
                    className="input-field w-full"
                    placeholder="AAPL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Strategy</label>
                  <select
                    value={newTrade.strategy}
                    onChange={(e) => setNewTrade({...newTrade, strategy: e.target.value})}
                    className="input-field w-full"
                  >
                    <option value="">Select Strategy</option>
                    {strategies.map(strategy => (
                      <option key={strategy} value={strategy}>{strategy}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entry Date</label>
                  <input
                    type="date"
                    value={newTrade.entryDate}
                    onChange={(e) => setNewTrade({...newTrade, entryDate: e.target.value})}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Entry Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.entryPrice}
                    onChange={(e) => setNewTrade({...newTrade, entryPrice: e.target.value})}
                    className="input-field w-full"
                    placeholder="150.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Short Strike</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.shortStrike}
                    onChange={(e) => setNewTrade({...newTrade, shortStrike: e.target.value})}
                    className="input-field w-full"
                    placeholder="150.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Long Strike (Optional)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.longStrike}
                    onChange={(e) => setNewTrade({...newTrade, longStrike: e.target.value})}
                    className="input-field w-full"
                    placeholder="145.00"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Premium</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.premium}
                    onChange={(e) => setNewTrade({...newTrade, premium: e.target.value})}
                    className="input-field w-full"
                    placeholder="2.50"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Quantity</label>
                  <input
                    type="number"
                    value={newTrade.quantity}
                    onChange={(e) => setNewTrade({...newTrade, quantity: e.target.value})}
                    className="input-field w-full"
                    placeholder="1"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Capital Required</label>
                  <input
                    type="number"
                    value={newTrade.capitalRequired}
                    onChange={(e) => setNewTrade({...newTrade, capitalRequired: e.target.value})}
                    className="input-field w-full"
                    placeholder="500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Max Risk</label>
                  <input
                    type="number"
                    value={newTrade.maxRisk}
                    onChange={(e) => setNewTrade({...newTrade, maxRisk: e.target.value})}
                    className="input-field w-full"
                    placeholder="250"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Delta</label>
                  <input
                    type="number"
                    step="0.001"
                    value={newTrade.delta}
                    onChange={(e) => setNewTrade({...newTrade, delta: e.target.value})}
                    className="input-field w-full"
                    placeholder="-0.30"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Theta</label>
                  <input
                    type="number"
                    step="0.001"
                    value={newTrade.theta}
                    onChange={(e) => setNewTrade({...newTrade, theta: e.target.value})}
                    className="input-field w-full"
                    placeholder="0.15"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Gamma</label>
                  <input
                    type="number"
                    step="0.001"
                    value={newTrade.gamma}
                    onChange={(e) => setNewTrade({...newTrade, gamma: e.target.value})}
                    className="input-field w-full"
                    placeholder="0.02"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Vega</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newTrade.vega}
                    onChange={(e) => setNewTrade({...newTrade, vega: e.target.value})}
                    className="input-field w-full"
                    placeholder="12.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Implied Volatility</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newTrade.impliedVolatility}
                    onChange={(e) => setNewTrade({...newTrade, impliedVolatility: e.target.value})}
                    className="input-field w-full"
                    placeholder="0.25"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Days to Expiration</label>
                  <input
                    type="number"
                    value={newTrade.daysToExpiration}
                    onChange={(e) => setNewTrade({...newTrade, daysToExpiration: e.target.value})}
                    className="input-field w-full"
                    placeholder="30"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Notes</label>
                <textarea
                  value={newTrade.notes}
                  onChange={(e) => setNewTrade({...newTrade, notes: e.target.value})}
                  className="input-field w-full"
                  rows="3"
                  placeholder="Trade notes..."
                />
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleAddTrade}
                  className="btn-primary flex-1"
                >
                  Add Trade
                </button>
                <button
                  onClick={() => setShowAddTrade(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
                 )}

         {/* Trade Adjustment Modal */}
         {showAdjustTrade && adjustingTrade && (
           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
             <div className="bg-dark-800 rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
               <div className="flex justify-between items-center mb-6">
                 <h2 className="text-2xl font-bold text-white">Adjust Trade: {adjustingTrade.symbol}</h2>
                 <button
                   onClick={() => {
                     setShowAdjustTrade(false);
                     setAdjustingTrade(null);
                   }}
                   className="text-gray-400 hover:text-white"
                 >
                   ✕
                 </button>
               </div>

               <div className="space-y-6">
                 {/* Current Trade Info */}
                 <div className="bg-dark-700 p-4 rounded-lg">
                   <h3 className="text-lg font-semibold text-white mb-3">Current Position</h3>
                   <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                       <span className="text-gray-400">Strategy:</span>
                       <span className="text-white ml-2">{adjustingTrade.strategy}</span>
                     </div>
                     <div>
                       <span className="text-gray-400">Current P&L:</span>
                       <span className={`ml-2 font-medium ${adjustingTrade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                         ${adjustingTrade.pnl}
                       </span>
                     </div>
                     <div>
                       <span className="text-gray-400">Strikes:</span>
                       <span className="text-white ml-2">${adjustingTrade.shortStrike}/{adjustingTrade.longStrike || 'N/A'}</span>
                     </div>
                     <div>
                       <span className="text-gray-400">Premium:</span>
                       <span className="text-white ml-2">${adjustingTrade.premium}</span>
                     </div>
                   </div>
                 </div>

                 {/* Adjustment Options */}
                 <div className="space-y-4">
                   <h3 className="text-lg font-semibold text-white">Adjustment Options</h3>
                   
                   {/* Roll Option */}
                   <div className="bg-dark-700 p-4 rounded-lg">
                     <h4 className="text-white font-medium mb-3">Roll Position</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">New Short Strike</label>
                         <input
                           type="number"
                           step="0.01"
                           defaultValue={adjustingTrade.shortStrike}
                           id="newShortStrike"
                           className="input-field w-full"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">New Long Strike</label>
                         <input
                           type="number"
                           step="0.01"
                           defaultValue={adjustingTrade.longStrike || ''}
                           id="newLongStrike"
                           className="input-field w-full"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">New Premium</label>
                         <input
                           type="number"
                           step="0.01"
                           defaultValue={adjustingTrade.premium}
                           id="newPremium"
                           className="input-field w-full"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">Days to Expiration</label>
                         <input
                           type="number"
                           defaultValue={adjustingTrade.daysToExpiration}
                           id="newExpiration"
                           className="input-field w-full"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">Roll Cost (Debit)</label>
                         <input
                           type="number"
                           step="0.01"
                           placeholder="0.00"
                           id="rollCost"
                           className="input-field w-full"
                         />
                       </div>
                     </div>
                     <button
                       onClick={() => {
                         const newShortStrike = parseFloat(document.getElementById('newShortStrike').value);
                         const newLongStrike = document.getElementById('newLongStrike').value ? parseFloat(document.getElementById('newLongStrike').value) : null;
                         const newPremium = parseFloat(document.getElementById('newPremium').value);
                         const newExpiration = parseInt(document.getElementById('newExpiration').value);
                         const rollCost = parseFloat(document.getElementById('rollCost').value) || 0;

                         handleRollTrade({
                           newStrikes: { short: newShortStrike, long: newLongStrike },
                           newPremium,
                           newExpiration,
                           rollCost
                         });
                       }}
                       className="btn-primary mt-3"
                     >
                       Roll Position
                     </button>
                   </div>

                   {/* Close Option */}
                   <div className="bg-dark-700 p-4 rounded-lg">
                     <h4 className="text-white font-medium mb-3">Close Position</h4>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">Close Price</label>
                         <input
                           type="number"
                           step="0.01"
                           defaultValue={adjustingTrade.entryPrice}
                           id="closePrice"
                           className="input-field w-full"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">Close Premium</label>
                         <input
                           type="number"
                           step="0.01"
                           defaultValue={adjustingTrade.premium}
                           id="closePremium"
                           className="input-field w-full"
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-300 mb-2">Close Cost (Credit)</label>
                         <input
                           type="number"
                           step="0.01"
                           placeholder="0.00"
                           id="closeCost"
                           className="input-field w-full"
                         />
                       </div>
                     </div>
                     <button
                       onClick={() => {
                         const closePrice = parseFloat(document.getElementById('closePrice').value);
                         const closePremium = parseFloat(document.getElementById('closePremium').value);
                         const closeCost = parseFloat(document.getElementById('closeCost').value) || 0;

                         handleCloseTrade(adjustingTrade.id, {
                           closePrice,
                           closePremium,
                           closeCost
                         });
                         setShowAdjustTrade(false);
                         setAdjustingTrade(null);
                       }}
                       className="btn-secondary mt-3"
                     >
                       Close Position
                     </button>
                   </div>
                 </div>
               </div>
             </div>
           </div>
         )}
       </div>
     </div>
   );
 };

export default TradeTracker; 