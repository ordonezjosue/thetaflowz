import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Graph, Crown, Gift, AlertTriangle, TrendingUp, Target, Shield } from 'lucide-react';

const StockScreener = () => {
  const { currentUser, hasAccess } = useAuth();

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
            <Graph className="w-4 h-4" />
            <span>Advanced Stock Screening</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Professional <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Stock Screener</span>
          </h1>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Find high-probability options trading opportunities using our advanced screening algorithms 
            and real-time market data analysis.
          </p>
        </div>

        {/* Coming Soon Banner */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-8 rounded-lg text-center mb-12">
          <div className="w-20 h-20 bg-blue-600/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <Graph className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Coming Soon!
          </h2>
          <p className="text-xl text-gray-300 mb-6">
            Our advanced Stock Screener is currently in development. This powerful tool will help you:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              {
                icon: Target,
                title: 'Find Opportunities',
                description: 'Screen for stocks with high implied volatility and optimal options pricing'
              },
              {
                icon: Shield,
                title: 'Risk Assessment',
                description: 'Evaluate risk-reward ratios and probability of profit for each trade'
              },
              {
                icon: TrendingUp,
                title: 'Performance Tracking',
                description: 'Monitor how your screened stocks perform over time'
              }
            ].map((feature, index) => (
              <div key={index} className="bg-dark-800 p-6 rounded-lg border border-dark-600">
                <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="space-y-4">
            <p className="text-gray-300">
              <strong>Expected Launch:</strong> Q1 2024
            </p>
            <p className="text-gray-300">
              <strong>Access:</strong> Available to all subscribers (Basic Plan and above)
            </p>
          </div>
        </div>

        {/* Current Access Status */}
        <div className="bg-dark-800 p-6 rounded-lg border border-dark-600">
          <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Graph className="w-5 h-5 text-blue-400" />
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
                <span className="text-gray-400">Launch Date:</span>
                <span className="text-white font-medium">Q1 2024</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Updates:</span>
                <span className="text-blue-400 font-medium">Coming Soon</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-400">Priority Access:</span>
                <span className="text-white font-medium">All Subscribers</span>
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
              <Target className="w-5 h-5" />
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
