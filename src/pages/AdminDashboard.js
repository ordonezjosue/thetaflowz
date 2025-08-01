import React, { useState } from 'react';
import { Settings, Bot, TrendingUp, AlertTriangle, Play, Pause, Save, RefreshCw, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const [botStatus, setBotStatus] = useState('running');
  const [strategies, setStrategies] = useState([
    {
      id: 1,
      name: 'Put Credit Spread Bot',
      status: 'active',
      symbol: 'SPY',
      parameters: {
        maxRisk: 500,
        targetPremium: 2.0,
        daysToExpiration: 30,
        delta: 0.30,
        positionSize: 5
      },
      performance: {
        totalTrades: 45,
        winRate: 78.5,
        totalPnL: 1250,
        monthlyPnL: 320
      }
    },
    {
      id: 2,
      name: 'Wheel Strategy Bot',
      status: 'paused',
      symbol: 'AAPL',
      parameters: {
        maxRisk: 1000,
        targetPremium: 1.5,
        daysToExpiration: 45,
        delta: 0.25,
        positionSize: 3
      },
      performance: {
        totalTrades: 23,
        winRate: 82.6,
        totalPnL: 890,
        monthlyPnL: 180
      }
    },
    {
      id: 3,
      name: 'Iron Condor Bot',
      status: 'active',
      symbol: 'QQQ',
      parameters: {
        maxRisk: 750,
        targetPremium: 3.0,
        daysToExpiration: 21,
        delta: 0.15,
        positionSize: 4
      },
      performance: {
        totalTrades: 67,
        winRate: 71.6,
        totalPnL: 2100,
        monthlyPnL: 450
      }
    }
  ]);

  const [selectedStrategy, setSelectedStrategy] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleToggleBot = (strategyId) => {
    setStrategies(strategies.map(strategy => 
      strategy.id === strategyId 
        ? { ...strategy, status: strategy.status === 'active' ? 'paused' : 'active' }
        : strategy
    ));
  };

  const handleEditStrategy = (strategy) => {
    setSelectedStrategy(strategy);
    setShowEditModal(true);
  };

  const handleSaveStrategy = () => {
    if (selectedStrategy) {
      setStrategies(strategies.map(strategy => 
        strategy.id === selectedStrategy.id ? selectedStrategy : strategy
      ));
      setShowEditModal(false);
      setSelectedStrategy(null);
    }
  };

  const totalPnL = strategies.reduce((sum, strategy) => sum + strategy.performance.totalPnL, 0);
  const activeBots = strategies.filter(s => s.status === 'active').length;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
            <p className="text-gray-300">Manage your trading bot strategies and parameters</p>
          </div>
          <div className="flex items-center space-x-4 mt-4 sm:mt-0">
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${botStatus === 'running' ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className="text-gray-300">Bot Status: {botStatus}</span>
            </div>
            <button className="btn-primary flex items-center space-x-2">
              <RefreshCw className="h-4 w-4" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total P&L</p>
                <p className="text-2xl font-bold text-green-500">${totalPnL.toLocaleString()}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active Bots</p>
                <p className="text-2xl font-bold text-white">{activeBots}</p>
              </div>
              <Bot className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Strategies</p>
                <p className="text-2xl font-bold text-white">{strategies.length}</p>
              </div>
              <Settings className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Avg Win Rate</p>
                <p className="text-2xl font-bold text-white">
                  {(strategies.reduce((sum, s) => sum + s.performance.winRate, 0) / strategies.length).toFixed(1)}%
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Strategy Management */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">Strategy Management</h2>
            <button className="btn-primary flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Add Strategy</span>
            </button>
          </div>

          <div className="space-y-4">
            {strategies.map((strategy) => (
              <div key={strategy.id} className="bg-dark-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-3 h-3 rounded-full ${strategy.status === 'active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                    <div>
                      <h3 className="text-lg font-semibold text-white">{strategy.name}</h3>
                      <p className="text-gray-400 text-sm">Symbol: {strategy.symbol}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleToggleBot(strategy.id)}
                      className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm ${
                        strategy.status === 'active' 
                          ? 'bg-yellow-500/20 text-yellow-400' 
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {strategy.status === 'active' ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span>{strategy.status === 'active' ? 'Pause' : 'Start'}</span>
                    </button>
                    <button
                      onClick={() => handleEditStrategy(strategy)}
                      className="text-primary-500 hover:text-primary-400 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Parameters */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Parameters</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Max Risk:</span>
                        <span className="text-white">${strategy.parameters.maxRisk}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Target Premium:</span>
                        <span className="text-white">${strategy.parameters.targetPremium}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">DTE:</span>
                        <span className="text-white">{strategy.parameters.daysToExpiration} days</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Delta:</span>
                        <span className="text-white">{strategy.parameters.delta}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Position Size:</span>
                        <span className="text-white">{strategy.parameters.positionSize}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Performance */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Performance</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total Trades:</span>
                        <span className="text-white">{strategy.performance.totalTrades}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Win Rate:</span>
                        <span className="text-white">{strategy.performance.winRate}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Total P&L:</span>
                        <span className={`font-medium ${strategy.performance.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${strategy.performance.totalPnL}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Monthly P&L:</span>
                        <span className={`font-medium ${strategy.performance.monthlyPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          ${strategy.performance.monthlyPnL}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Edit Strategy Modal */}
        {showEditModal && selectedStrategy && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-dark-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold text-white mb-6">Edit Strategy</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Strategy Name</label>
                  <input
                    type="text"
                    value={selectedStrategy.name}
                    onChange={(e) => setSelectedStrategy({...selectedStrategy, name: e.target.value})}
                    className="input-field w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Symbol</label>
                  <input
                    type="text"
                    value={selectedStrategy.symbol}
                    onChange={(e) => setSelectedStrategy({...selectedStrategy, symbol: e.target.value})}
                    className="input-field w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Max Risk ($)</label>
                    <input
                      type="number"
                      value={selectedStrategy.parameters.maxRisk}
                      onChange={(e) => setSelectedStrategy({
                        ...selectedStrategy, 
                        parameters: {...selectedStrategy.parameters, maxRisk: parseInt(e.target.value)}
                      })}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Target Premium ($)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={selectedStrategy.parameters.targetPremium}
                      onChange={(e) => setSelectedStrategy({
                        ...selectedStrategy, 
                        parameters: {...selectedStrategy.parameters, targetPremium: parseFloat(e.target.value)}
                      })}
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Days to Expiration</label>
                    <input
                      type="number"
                      value={selectedStrategy.parameters.daysToExpiration}
                      onChange={(e) => setSelectedStrategy({
                        ...selectedStrategy, 
                        parameters: {...selectedStrategy.parameters, daysToExpiration: parseInt(e.target.value)}
                      })}
                      className="input-field w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Delta</label>
                    <input
                      type="number"
                      step="0.01"
                      value={selectedStrategy.parameters.delta}
                      onChange={(e) => setSelectedStrategy({
                        ...selectedStrategy, 
                        parameters: {...selectedStrategy.parameters, delta: parseFloat(e.target.value)}
                      })}
                      className="input-field w-full"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position Size (%)</label>
                  <input
                    type="number"
                    value={selectedStrategy.parameters.positionSize}
                    onChange={(e) => setSelectedStrategy({
                      ...selectedStrategy, 
                      parameters: {...selectedStrategy.parameters, positionSize: parseInt(e.target.value)}
                    })}
                    className="input-field w-full"
                  />
                </div>
              </div>

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={handleSaveStrategy}
                  className="btn-primary flex-1 flex items-center justify-center space-x-2"
                >
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard; 