import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useMarketData } from '../contexts/MarketDataContext';
import twelveDataService from '../services/twelveDataService';
import { BookOpen, TrendingUp, BarChart3, Target, ArrowRight, Calendar, DollarSign, TrendingDown, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const { marketSummary } = useMarketData();
  const [marketDataStatus, setMarketDataStatus] = useState('checking'); // 'checking', 'live', 'mock'

  // Check market data status on component mount
  useEffect(() => {
    checkMarketDataStatus();
  }, []);

  const checkMarketDataStatus = async () => {
    try {
      await twelveDataService.getMarketOverview();
      setMarketDataStatus('live');
    } catch (error) {
      console.log('Market data API unavailable, using mock data');
      setMarketDataStatus('mock');
    }
  };

  const recentTrades = [
    { id: 1, symbol: 'AAPL', strategy: 'Put Credit Spread', pnl: 250, status: 'closed' },
    { id: 2, symbol: 'TSLA', strategy: 'Call Credit Spread', pnl: 0, status: 'open' },
    { id: 3, symbol: 'SPY', strategy: 'Wheel Strategy', pnl: 300, status: 'closed' }
  ];

  const learningProgress = [
    { strategy: 'Put Credit Spread', progress: 100, completed: true },
    { strategy: 'Call Credit Spread', progress: 75, completed: false },
    { strategy: 'Wheel Strategy', progress: 50, completed: false },
    { strategy: 'Naked Puts', progress: 25, completed: false }
  ];

  const quickActions = [
    {
      title: 'Learn Strategies',
      description: 'Continue your options education',
      icon: <BookOpen className="h-6 w-6" />,
      link: '/learn',
      color: 'bg-blue-500/10 text-blue-500'
    },
    {
      title: 'Track Trades',
      description: 'Monitor your performance',
      icon: <BarChart3 className="h-6 w-6" />,
      link: '/trades',
      color: 'bg-green-500/10 text-green-500'
    },
    {
      title: 'Set Goals',
      description: 'Define your trading objectives',
      icon: <Target className="h-6 w-6" />,
      link: '#',
      color: 'bg-purple-500/10 text-purple-500'
    }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome back, {currentUser.name}!
          </h1>
          <p className="text-gray-300">
            Here's your options trading overview and next steps
          </p>
        </div>

        {/* Plan Status */}
        {currentUser && (
          <div className="mb-6">
            <div className="bg-dark-800 rounded-lg p-4 border border-dark-600">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${
                    currentUser.plan === 'premium' ? 'bg-purple-500/20' :
                    currentUser.plan === 'basic' ? 'bg-blue-500/20' :
                    currentUser.plan === 'free' ? 'bg-green-500/20' : 'bg-yellow-500/20'
                  }`}>
                    {currentUser.plan === 'premium' ? <TrendingUp className="h-5 w-5 text-purple-500" /> :
                     currentUser.plan === 'basic' ? <BarChart3 className="h-5 w-5 text-blue-500" /> :
                     currentUser.plan === 'free' ? <BookOpen className="h-5 w-5 text-green-500" /> :
                     <AlertCircle className="h-5 w-5 text-yellow-500" />}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">
                      {currentUser.plan === 'premium' ? 'Premium Plan' :
                       currentUser.plan === 'basic' ? 'Basic Plan' :
                       currentUser.plan === 'free' ? 'Free Plan' : 'Plan Expired'}
                    </h3>
                    <p className="text-gray-400 text-sm">
                      {currentUser.plan === 'premium' ? 'Full access to all features' :
                       currentUser.plan === 'basic' ? 'Access to basic features and market data' :
                       currentUser.plan === 'free' ? 'Limited access - Learn section only' : 'No active plan'}
                    </p>
                  </div>
                </div>
                
                {currentUser.plan === 'free' && (
                  <div className="text-right">
                    <p className="text-green-400 text-sm font-medium">Free Trial</p>
                    <p className="text-gray-400 text-xs">
                      {currentUser.planExpiry ? 
                        `${Math.ceil((new Date(currentUser.planExpiry) - new Date()) / (1000 * 60 * 60 * 24))} days remaining` :
                        '7 days remaining'
                      }
                    </p>
                  </div>
                )}
                
                {currentUser.plan !== 'premium' && !currentUser.isAdmin && (
                  <Link
                    to="/pricing"
                    className="btn-primary text-sm px-4 py-2"
                  >
                    Upgrade Plan
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Market Data Status Notification */}
        {marketDataStatus === 'mock' && (
          <div className="bg-yellow-900/20 border border-yellow-500/50 text-yellow-400 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              <div>
                <p className="font-medium">📊 Market Data Status</p>
                <p className="text-sm text-yellow-300">
                  Currently showing mock/demo data. Real-time market information is temporarily unavailable. 
                  Your dashboard data is for demonstration purposes only.
                </p>
              </div>
            </div>
          </div>
        )}

        {marketDataStatus === 'live' && (
          <div className="bg-green-900/20 border border-green-500/50 text-green-400 p-4 rounded-lg mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <div>
                <p className="font-medium">📊 Live Market Data</p>
                <p className="text-sm text-green-300">
                  Connected to real-time market data. All information is current and accurate.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total P&L</p>
                <p className="text-2xl font-bold text-green-500">$550</p>
              </div>
              <DollarSign className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Win Rate</p>
                <p className="text-2xl font-bold text-white">66.7%</p>
              </div>
              <TrendingUp className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Open Trades</p>
                <p className="text-2xl font-bold text-white">1</p>
              </div>
              <BarChart3 className="h-8 w-8 text-gray-400" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Strategies Learned</p>
                <p className="text-2xl font-bold text-white">1/4</p>
              </div>
              <BookOpen className="h-8 w-8 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Market Overview */}
        {marketSummary.length > 0 && (
          <div className="card mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Market Overview</h2>
              <Link to="/market" className="text-primary-500 hover:text-primary-400 text-sm">
                View Full Market
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketSummary.slice(0, 3).map((index) => (
                <div key={index.symbol} className="bg-dark-700 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-white">{index.name}</h4>
                      <p className="text-gray-400 text-sm">{index.symbol}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-semibold">${index.price?.toFixed(2) || 'N/A'}</p>
                      <div className={`flex items-center gap-1 text-sm ${
                        index.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {index.changePercent >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        <span>
                          {index.changePercent >= 0 ? '+' : ''}{index.changePercent?.toFixed(2) || 'N/A'}%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Learning Progress */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Learning Progress</h2>
              <Link to="/learn" className="text-primary-500 hover:text-primary-400 text-sm">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {learningProgress.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                      item.completed ? 'bg-green-500' : 'bg-gray-600'
                    }`}>
                      {item.completed && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-gray-300">{item.strategy}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-24 bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-sm text-gray-400">{item.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Trades */}
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Recent Trades</h2>
              <Link to="/trades" className="text-primary-500 hover:text-primary-400 text-sm">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {recentTrades.map((trade) => (
                <div key={trade.id} className="flex items-center justify-between p-3 bg-dark-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500" />
                    <div>
                      <p className="text-white font-medium">{trade.symbol}</p>
                      <p className="text-gray-400 text-sm">{trade.strategy}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-medium ${trade.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                      ${trade.pnl}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      trade.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'
                    }`}>
                      {trade.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="card hover:border-primary-500 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className={`p-3 rounded-lg ${action.color}`}>
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white mb-2">
                      {action.title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {action.description}
                    </p>
                    <div className="flex items-center text-primary-500 text-sm">
                      <span>Get Started</span>
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-6">Upcoming Events</h2>
          <div className="card">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="text-white font-medium">TSLA Call Credit Spread Expires</p>
                    <p className="text-gray-400 text-sm">Tomorrow at 4:00 PM</p>
                  </div>
                </div>
                <span className="text-yellow-400 text-sm">Action Required</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BookOpen className="h-5 w-5 text-primary-500" />
                  <div>
                    <p className="text-white font-medium">Weekly Strategy Review</p>
                    <p className="text-gray-400 text-sm">Friday at 2:00 PM</p>
                  </div>
                </div>
                <span className="text-gray-400 text-sm">Reminder</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 