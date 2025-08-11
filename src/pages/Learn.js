import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  TrendingUp, 
  Target, 
  Shield, 
  Zap, 
  DollarSign, 
  BarChart3, 
  BookOpen, 
  Play, 
  ArrowRight, 
  Star,
  Crown,
  Gift,
  Calculator,
  Lightbulb,
  Rocket,
  CheckCircle,
  Users,
  Award,
  TrendingDown
} from 'lucide-react';

const Learn = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleStockScreenerAccess = () => {
    if (!currentUser) {
      // Redirect to register with free trial
      navigate('/register?plan=free');
    } else if (currentUser.plan === 'free') {
      // Check if free trial expired
      const trialEnd = new Date(currentUser.createdAt);
      trialEnd.setDate(trialEnd.getDate() + 7);
      const now = new Date();
      
      if (now > trialEnd) {
        // Trial expired, redirect to pricing
        navigate('/pricing');
      } else {
        // Still in trial, allow access
        navigate('/screener');
      }
    } else {
      // Paid user, allow access
      navigate('/screener');
    }
  };

  const getTrialStatus = () => {
    if (!currentUser) return null;
    
    const trialEnd = new Date(currentUser.createdAt);
    trialEnd.setDate(trialEnd.getDate() + 7);
    const now = new Date();
    const daysLeft = Math.ceil((trialEnd - now) / (1000 * 60 * 60 * 24));
    
    return {
      expired: now > trialEnd,
      daysLeft: Math.max(0, daysLeft)
    };
  };

  const trialStatus = getTrialStatus();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Rocket className="w-4 h-4" />
            <span>Transform Your Trading Journey</span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Master <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Options Trading</span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Discover how professional options traders build wealth through strategic, 
            risk-managed approaches. Learn from real strategies that work in any market condition.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handleStockScreenerAccess}
              className="btn-primary text-lg px-8 py-4 flex items-center gap-2 group"
            >
              <BarChart3 className="w-5 h-5" />
              Access Stock Screener
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            {!currentUser && (
              <Link
                to="/register?plan=free"
                className="btn-secondary text-lg px-8 py-4 flex items-center gap-2"
              >
                <Gift className="w-5 h-5" />
                Start Free 7-Day Trial
              </Link>
            )}
          </div>
        </div>

        {/* Trial Status Banner */}
        {currentUser && trialStatus && (
          <div className="mb-12">
            {trialStatus.expired ? (
              <div className="bg-red-900/20 border border-red-500/50 text-red-400 p-6 rounded-lg text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Shield className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Free Trial Expired</h3>
                </div>
                <p className="text-red-300 mb-4">
                  Your 7-day free trial has ended. Upgrade to continue accessing our advanced tools.
                </p>
                <Link
                  to="/pricing"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Crown className="w-4 h-4" />
                  View Plans
                </Link>
              </div>
            ) : (
              <div className="bg-green-900/20 border border-green-500/50 text-green-400 p-6 rounded-lg text-center">
                <div className="flex items-center justify-center gap-3 mb-3">
                  <Gift className="w-6 h-6" />
                  <h3 className="text-lg font-semibold">Free Trial Active</h3>
                </div>
                <p className="text-green-300 mb-4">
                  You have <span className="font-bold">{trialStatus.daysLeft} days</span> left in your free trial. 
                  Access all features including the Stock Screener!
                </p>
                <button
                  onClick={handleStockScreenerAccess}
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  Use Stock Screener
                </button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {[
            { id: 'overview', label: 'Platform Overview', icon: Rocket },
            { id: 'strategies', label: 'Basic Strategies', icon: Target },
            { id: 'benefits', label: 'Why Choose Us', icon: Star },
            { id: 'getting-started', label: 'Getting Started', icon: Play }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Sections */}
        <div className="space-y-16">
          {/* Platform Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Your Complete Options Trading Platform
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  ThetaFlowz combines cutting-edge technology with proven trading strategies 
                  to give you the edge you need in today's volatile markets.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: BarChart3,
                    title: 'Advanced Analytics',
                    description: 'Real-time market data, Greeks analysis, and portfolio optimization tools that professionals use.'
                  },
                  {
                    icon: Target,
                    title: 'Strategy Builder',
                    description: 'Design, backtest, and execute complex options strategies with our intuitive interface.'
                  },
                  {
                    icon: Shield,
                    title: 'Risk Management',
                    description: 'Built-in position sizing, stop-loss automation, and portfolio stress testing.'
                  },
                  {
                    icon: Calculator,
                    title: 'P&L Tracking',
                    description: 'Monitor your performance with detailed trade logs and performance analytics.'
                  },
                                     {
                     icon: BarChart3,
                     title: 'Stock Screener',
                     description: 'Find the perfect opportunities with our advanced screening algorithms.'
                   },
                  {
                    icon: Users,
                    title: 'Community',
                    description: 'Learn from experienced traders and share insights with our growing community.'
                  }
                ].map((feature, index) => (
                  <div key={index} className="bg-dark-800 p-6 rounded-lg border border-dark-600 hover:border-blue-500/50 transition-all group">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-600/30 transition-colors">
                      <feature.icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Strategies */}
          {activeTab === 'strategies' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Master These Essential Options Strategies
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Start with these foundational strategies that can generate income in any market condition.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  {
                    name: 'Covered Call',
                    difficulty: 'Beginner',
                    description: 'Sell call options against stock you own to generate monthly income.',
                    benefits: ['Monthly income', 'Reduced risk', 'Easy to understand'],
                    example: 'Own 100 AAPL shares, sell 1 call option for $3 premium = $300 income'
                  },
                  {
                    name: 'Cash Secured Put',
                    difficulty: 'Beginner',
                    description: 'Sell put options with cash backing to potentially buy stocks at lower prices.',
                    benefits: ['Income generation', 'Stock acquisition', 'Defined risk'],
                    example: 'Sell 1 AAPL $150 put for $2 premium = $200 income, obligation to buy at $150'
                  },
                  {
                    name: 'Iron Condor',
                    difficulty: 'Intermediate',
                    description: 'Sell both calls and puts to profit from low volatility sideways markets.',
                    benefits: ['High probability', 'Multiple income streams', 'Defined risk'],
                    example: 'Sell AAPL $160 call and $140 put, collect $4 total premium'
                  },
                  {
                    name: 'Butterfly Spread',
                    difficulty: 'Intermediate',
                    description: 'Limited risk, limited reward strategy for directional bets with high probability.',
                    benefits: ['High probability', 'Defined risk', 'Directional exposure'],
                    example: 'Buy 1 $150 call, sell 2 $155 calls, buy 1 $160 call'
                  }
                ].map((strategy, index) => (
                  <div key={index} className="bg-dark-800 p-8 rounded-lg border border-dark-600">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{strategy.name}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          strategy.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          strategy.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {strategy.difficulty}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-blue-400">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-lg mb-6">{strategy.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          Key Benefits
                        </h4>
                        <ul className="space-y-2">
                          {strategy.benefits.map((benefit, idx) => (
                            <li key={idx} className="text-gray-300 flex items-center gap-2">
                              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-400" />
                          Example
                        </h4>
                        <p className="text-gray-300 bg-dark-700 p-4 rounded-lg">
                          {strategy.example}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Why Choose Us */}
          {activeTab === 'benefits' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Why Professional Traders Choose ThetaFlowz
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Join thousands of traders who have transformed their financial future with our platform.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  {
                    icon: TrendingUp,
                    title: 'Proven Results',
                    description: 'Our users consistently outperform market averages with our systematic approach.',
                    stat: '73%',
                    statLabel: 'Win Rate'
                  },
                  {
                    icon: Shield,
                    title: 'Risk Management',
                    description: 'Built-in safeguards protect your capital while maximizing profit potential.',
                    stat: '85%',
                    statLabel: 'Risk Reduction'
                  },
                  {
                    icon: Zap,
                    title: 'Time Efficiency',
                    description: 'Automated tools save you hours of research and analysis every week.',
                    stat: '10hrs',
                    statLabel: 'Saved Weekly'
                  },
                  {
                    icon: DollarSign,
                    title: 'Income Generation',
                    description: 'Generate consistent monthly income regardless of market direction.',
                    stat: '$2,400',
                    statLabel: 'Avg Monthly'
                  }
                ].map((benefit, index) => (
                  <div key={index} className="bg-dark-800 p-8 rounded-lg border border-dark-600 text-center">
                    <div className="w-16 h-16 bg-blue-600/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <benefit.icon className="w-8 h-8 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{benefit.title}</h3>
                    <p className="text-gray-300 mb-6">{benefit.description}</p>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-400 mb-1">{benefit.stat}</div>
                      <div className="text-gray-400">{benefit.statLabel}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-8 rounded-lg text-center">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Ready to Start Your Trading Journey?
                </h3>
                <p className="text-gray-300 mb-6">
                  Join thousands of successful traders who have already transformed their financial future.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleStockScreenerAccess}
                    className="btn-primary text-lg px-8 py-4 flex items-center gap-2 justify-center"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Try Stock Screener
                  </button>
                  {!currentUser && (
                    <Link
                      to="/register?plan=free"
                      className="btn-secondary text-lg px-8 py-4 flex items-center gap-2 justify-center"
                    >
                      <Gift className="w-5 h-5" />
                      Start Free Trial
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Getting Started */}
          {activeTab === 'getting-started' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Your Path to Options Trading Success
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Follow this proven roadmap to build your trading skills and confidence step by step.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  {
                    step: '01',
                    title: 'Start Your Free Trial',
                    description: 'Sign up for our 7-day free trial to explore all platform features.',
                    action: 'No credit card required',
                    icon: Gift
                  },
                  {
                    step: '02',
                    title: 'Explore the Stock Screener',
                    description: 'Use our advanced screening tools to find high-probability trading opportunities.',
                    action: 'Available during free trial',
                    icon: BarChart3
                  },
                  {
                    step: '03',
                    title: 'Learn Basic Strategies',
                    description: 'Master covered calls and cash-secured puts through our educational content.',
                    action: 'Free learning resources',
                    icon: BookOpen
                  },
                  {
                    step: '04',
                    title: 'Practice with Paper Trading',
                    description: 'Test strategies risk-free before using real money.',
                    action: 'Simulated trading environment',
                    icon: Target
                  },
                  {
                    step: '05',
                    title: 'Execute Your First Trade',
                    description: 'Start with small positions and build confidence over time.',
                    action: 'Real-time execution',
                    icon: TrendingUp
                  },
                  {
                    step: '06',
                    title: 'Scale and Optimize',
                    description: 'Increase position sizes and refine strategies based on results.',
                    action: 'Advanced analytics',
                    icon: BarChart3
                  }
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {step.step}
                      </div>
                    </div>
                    <div className="flex-1 bg-dark-800 p-6 rounded-lg border border-dark-600">
                      <div className="flex items-center gap-3 mb-3">
                        <step.icon className="w-6 h-6 text-blue-400" />
                        <h3 className="text-xl font-bold text-white">{step.title}</h3>
                      </div>
                      <p className="text-gray-300 mb-3">{step.description}</p>
                      <div className="text-blue-400 font-medium">{step.action}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-6">
                  Ready to Begin?
                </h3>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={handleStockScreenerAccess}
                    className="btn-primary text-lg px-8 py-4 flex items-center gap-2 justify-center"
                  >
                    <BarChart3 className="w-5 h-5" />
                    Access Stock Screener
                  </button>
                  {!currentUser && (
                    <Link
                      to="/register?plan=free"
                      className="btn-secondary text-lg px-8 py-4 flex items-center gap-2 justify-center"
                    >
                      <Gift className="w-5 h-5" />
                      Start Free Trial
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Learn; 