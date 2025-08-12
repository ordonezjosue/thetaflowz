import React, { useState, useEffect } from 'react';
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
  TrendingDown,
  Video,
  Clock,
  Bookmark,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Info,
  ThumbsUp,
  MessageCircle,
  BarChart,
  PieChart,
  Activity,
  Calendar,
  Minus
} from 'lucide-react';

const Learn = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedModules, setExpandedModules] = useState({});
  const [userProgress, setUserProgress] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResults, setQuizResults] = useState(null);
  const [selectedMarketCondition, setSelectedMarketCondition] = useState('bull');
  const [riskLevel, setRiskLevel] = useState('conservative');

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

  // Helper functions for enhanced features
  const toggleModule = (moduleId) => {
    setExpandedModules(prev => ({
      ...prev,
      [moduleId]: !prev[moduleId]
    }));
  };

  const updateProgress = (moduleId, completed) => {
    setUserProgress(prev => ({
      ...prev,
      [moduleId]: { ...prev[moduleId], completed, timestamp: Date.now() }
    }));
  };

  const handleQuizSubmit = () => {
    const correctAnswers = {
      q1: 'b', // Covered Call
      q2: 'a', // Time decay
      q3: 'c', // Iron Condor
      q4: 'b', // Risk management
      q5: 'a'  // Greeks
    };
    
    let score = 0;
    Object.keys(quizAnswers).forEach(question => {
      if (quizAnswers[question] === correctAnswers[question]) {
        score++;
      }
    });
    
    const percentage = (score / Object.keys(correctAnswers).length) * 100;
    setQuizResults({ score, total: Object.keys(correctAnswers).length, percentage });
    updateProgress('quiz', true);
  };

  const resetQuiz = () => {
    setQuizAnswers({});
    setQuizResults(null);
    setShowQuiz(false);
  };

  const getProgressPercentage = () => {
    const modules = ['overview', 'strategies', 'benefits', 'getting-started', 'quiz'];
    const completed = modules.filter(module => userProgress[module]?.completed).length;
    return (completed / modules.length) * 100;
  };

  // Auto-track progress when user views different sections
  useEffect(() => {
    if (currentUser && activeTab) {
      // Mark section as viewed (not necessarily completed)
      if (!userProgress[activeTab]) {
        setUserProgress(prev => ({
          ...prev,
          [activeTab]: { viewed: true, timestamp: Date.now() }
        }));
      }
    }
  }, [activeTab, currentUser]);

  // Mark overview as completed when user first visits
  useEffect(() => {
    if (currentUser && !userProgress.overview) {
      updateProgress('overview', true);
    }
  }, [currentUser]);

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

        {/* Progress Tracking Banner */}
        {currentUser && (
          <div className="mb-8 bg-dark-800 border border-dark-600 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Learning Progress
              </h3>
              <span className="text-sm text-gray-400">
                {Math.round(getProgressPercentage())}% Complete
              </span>
            </div>
            <div className="w-full bg-dark-700 rounded-full h-3 mb-3">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${getProgressPercentage()}%` }}
              ></div>
            </div>
            <div className="flex flex-wrap gap-2">
              {['overview', 'strategies', 'benefits', 'getting-started', 'quiz'].map((module) => (
                <div key={module} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${
                    userProgress[module]?.completed ? 'bg-green-400' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm text-gray-300 capitalize">{module.replace('-', ' ')}</span>
                </div>
              ))}
            </div>
          </div>
        )}

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
            { id: 'advanced-strategies', label: 'Advanced Strategies', icon: BarChart },
            { id: 'risk-management', label: 'Risk Management', icon: Shield },
            { id: 'market-conditions', label: 'Market Conditions', icon: TrendingUp },
            { id: 'video-tutorials', label: 'Video Tutorials', icon: Video },
            { id: 'benefits', label: 'Why Choose Us', icon: Star },
            { id: 'getting-started', label: 'Getting Started', icon: Play }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all text-sm ${
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

          {/* Advanced Strategies */}
          {activeTab === 'advanced-strategies' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Advanced Options Strategies for Experienced Traders
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Master complex multi-leg strategies that can generate significant returns while managing risk.
                </p>
              </div>

              <div className="space-y-8">
                {[
                  {
                    name: 'Straddle',
                    difficulty: 'Advanced',
                    description: 'Buy both a call and put option at the same strike price to profit from large price movements.',
                    benefits: ['Direction neutral', 'High profit potential', 'Volatility play'],
                    risks: ['High cost', 'Time decay sensitive', 'Needs big move'],
                    example: 'Buy AAPL $150 call and $150 put for $8 total cost. Profit if AAPL moves above $158 or below $142'
                  },
                  {
                    name: 'Strangle',
                    difficulty: 'Advanced',
                    description: 'Buy out-of-the-money call and put options to profit from large price movements at lower cost.',
                    benefits: ['Lower cost than straddle', 'Direction neutral', 'Volatility play'],
                    risks: ['Higher break-even', 'Time decay', 'Needs big move'],
                    example: 'Buy AAPL $160 call and $140 put for $4 total cost. Profit if AAPL moves above $164 or below $136'
                  },
                  {
                    name: 'Calendar Spread',
                    difficulty: 'Advanced',
                    description: 'Sell near-term option and buy longer-term option to profit from time decay differences.',
                    benefits: ['Time decay advantage', 'Lower risk', 'Volatility neutral'],
                    risks: ['Complex management', 'Assignment risk', 'Limited profit'],
                    example: 'Sell AAPL $150 call expiring next week, buy AAPL $150 call expiring next month'
                  },
                  {
                    name: 'Diagonal Spread',
                    difficulty: 'Advanced',
                    description: 'Combine calendar and vertical spreads for enhanced time decay and directional bias.',
                    benefits: ['Enhanced time decay', 'Directional bias', 'Lower cost basis'],
                    risks: ['Complex management', 'Assignment risk', 'Limited profit potential'],
                    example: 'Sell AAPL $150 call expiring next week, buy AAPL $155 call expiring next month'
                  }
                ].map((strategy, index) => (
                  <div key={index} className="bg-dark-800 p-8 rounded-lg border border-dark-600">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-2">{strategy.name}</h3>
                        <span className="inline-block px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                          {strategy.difficulty}
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-purple-400">
                          {index + 1}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-lg mb-6">{strategy.description}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                          Benefits
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
                          <AlertTriangle className="w-5 h-5 text-yellow-400" />
                          Risks
                        </h4>
                        <ul className="space-y-2">
                          {strategy.risks.map((risk, idx) => (
                            <li key={idx} className="text-gray-300 flex items-center gap-2">
                              <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                              {risk}
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                          <Lightbulb className="w-5 h-5 text-yellow-400" />
                          Example
                        </h4>
                        <p className="text-gray-300 bg-dark-700 p-4 rounded-lg text-sm">
                          {strategy.example}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Risk Management */}
          {activeTab === 'risk-management' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Master Risk Management in Options Trading
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Learn the essential principles that protect your capital and ensure long-term trading success.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Position Sizing */}
                <div className="bg-dark-800 p-8 rounded-lg border border-dark-600">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center">
                      <Calculator className="w-6 h-6 text-blue-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Position Sizing</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-dark-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">1% Rule</h4>
                      <p className="text-gray-300 text-sm">Never risk more than 1% of your portfolio on any single trade.</p>
                      <div className="mt-3 p-3 bg-blue-600/20 rounded border border-blue-500/30">
                        <p className="text-blue-300 text-sm">
                          <strong>Example:</strong> $10,000 portfolio = max $100 risk per trade
                        </p>
                      </div>
                    </div>
                    
                    <div className="bg-dark-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Kelly Criterion</h4>
                      <p className="text-gray-300 text-sm">Optimal position size based on win rate and risk/reward ratio.</p>
                    </div>
                  </div>
                </div>

                {/* Stop Losses */}
                <div className="bg-dark-800 p-8 rounded-lg border border-dark-600">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-red-600/20 rounded-lg flex items-center justify-center">
                      <Shield className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Stop Losses</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-dark-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Mental Stops</h4>
                      <p className="text-gray-300 text-sm">Pre-determined exit points you commit to before entering a trade.</p>
                    </div>
                    
                    <div className="bg-dark-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Trailing Stops</h4>
                      <p className="text-gray-300 text-sm">Dynamic stops that move with profitable trades to lock in gains.</p>
                    </div>
                  </div>
                </div>

                {/* Portfolio Diversification */}
                <div className="bg-dark-800 p-8 rounded-lg border border-dark-600">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center">
                      <PieChart className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Portfolio Diversification</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-dark-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Strategy Mix</h4>
                      <p className="text-gray-300 text-sm">Combine different strategies to reduce correlation risk.</p>
                    </div>
                    
                    <div className="bg-dark-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Sector Exposure</h4>
                      <p className="text-gray-300 text-sm">Limit exposure to any single sector or market segment.</p>
                    </div>
                  </div>
                </div>

                {/* Greeks Management */}
                <div className="bg-dark-800 p-8 rounded-lg border border-dark-600">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center">
                      <BarChart className="w-6 h-6 text-purple-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Greeks Management</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="bg-dark-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Delta Neutral</h4>
                      <p className="text-gray-300 text-sm">Balance directional risk by offsetting positive and negative deltas.</p>
                    </div>
                    
                    <div className="bg-dark-700 p-4 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">Theta Decay</h4>
                      <p className="text-gray-300 text-sm">Monitor time decay impact on your positions.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Assessment Tool */}
              <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-8 rounded-lg">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Risk Assessment Tool</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="text-white font-semibold mb-4">Risk Tolerance Level</h4>
                    <div className="space-y-3">
                      {['conservative', 'moderate', 'aggressive'].map((level) => (
                        <label key={level} className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="radio"
                            name="riskLevel"
                            value={level}
                            checked={riskLevel === level}
                            onChange={(e) => setRiskLevel(e.target.value)}
                            className="w-4 h-4 text-blue-600 bg-dark-700 border-dark-500"
                          />
                          <span className="text-gray-300 capitalize">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-semibold mb-4">Recommended Position Size</h4>
                    <div className="bg-dark-700 p-4 rounded-lg">
                      <p className="text-gray-300 mb-2">
                        <strong>Max Risk per Trade:</strong>
                      </p>
                      <p className="text-2xl font-bold text-blue-400">
                        {riskLevel === 'conservative' ? '0.5%' : 
                         riskLevel === 'moderate' ? '1%' : '2%'}
                      </p>
                      <p className="text-sm text-gray-400 mt-2">
                        {riskLevel === 'conservative' ? 'Very safe, slow growth' :
                         riskLevel === 'moderate' ? 'Balanced risk/reward' :
                         'Higher risk, faster growth potential'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Market Conditions */}
          {activeTab === 'market-conditions' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Adapt Your Strategy to Market Conditions
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Learn which options strategies work best in different market environments and how to adjust your approach.
                </p>
              </div>

              {/* Market Condition Selector */}
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {[
                  { id: 'bull', label: 'Bull Market', icon: TrendingUp, color: 'green' },
                  { id: 'bear', label: 'Bear Market', icon: TrendingDown, color: 'red' },
                  { id: 'sideways', label: 'Sideways Market', icon: Minus, color: 'yellow' },
                  { id: 'volatile', label: 'Volatile Market', icon: Activity, color: 'purple' }
                ].map((condition) => (
                  <button
                    key={condition.id}
                    onClick={() => setSelectedMarketCondition(condition.id)}
                    className={`flex items-center gap-3 px-6 py-4 rounded-lg font-medium transition-all ${
                      selectedMarketCondition === condition.id
                        ? `bg-${condition.color}-600 text-white shadow-lg`
                        : 'bg-dark-800 text-gray-300 hover:bg-dark-700 hover:text-white'
                    }`}
                  >
                    <condition.icon className="w-5 h-5" />
                    {condition.label}
                  </button>
                ))}
              </div>

              {/* Market-Specific Strategies */}
              <div className="space-y-8">
                {selectedMarketCondition === 'bull' && (
                  <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 p-8 rounded-lg">
                    <h3 className="text-3xl font-bold text-white mb-6 text-center">Bull Market Strategies</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-white mb-4">Best Strategies</h4>
                        {[
                          'Long Calls',
                          'Covered Calls',
                          'Bull Call Spreads',
                          'Diagonal Spreads'
                        ].map((strategy, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <CheckCircle className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white text-lg">{strategy}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-white mb-4">Key Considerations</h4>
                        <ul className="space-y-3">
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Momentum can continue longer than expected</span>
                          </li>
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Volatility may increase with strong moves</span>
                          </li>
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Consider longer-term options for trends</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMarketCondition === 'bear' && (
                  <div className="bg-gradient-to-r from-red-600/20 to-orange-600/20 border border-red-500/30 p-8 rounded-lg">
                    <h3 className="text-3xl font-bold text-white mb-6 text-center">Bear Market Strategies</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-white mb-4">Best Strategies</h4>
                        {[
                          'Long Puts',
                          'Cash Secured Puts',
                          'Bear Put Spreads',
                          'Protective Puts'
                        ].map((strategy, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <Shield className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white text-lg">{strategy}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-white mb-4">Key Considerations</h4>
                        <ul className="space-y-3">
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Downside moves can be swift and severe</span>
                          </li>
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Focus on capital preservation</span>
                          </li>
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Use defined risk strategies</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMarketCondition === 'sideways' && (
                  <div className="bg-gradient-to-r from-yellow-600/20 to-orange-600/20 border border-yellow-500/30 p-8 rounded-lg">
                    <h3 className="text-3xl font-bold text-white mb-6 text-center">Sideways Market Strategies</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-white mb-4">Best Strategies</h4>
                        {[
                          'Iron Condors',
                          'Butterfly Spreads',
                          'Calendar Spreads',
                          'Covered Calls'
                        ].map((strategy, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                              <Target className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white text-lg">{strategy}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-white mb-4">Key Considerations</h4>
                        <ul className="space-y-3">
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Time decay works in your favor</span>
                          </li>
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Focus on income generation</span>
                          </li>
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Monitor for breakout potential</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}

                {selectedMarketCondition === 'volatile' && (
                  <div className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 p-8 rounded-lg">
                    <h3 className="text-3xl font-bold text-white mb-6 text-center">Volatile Market Strategies</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-white mb-4">Best Strategies</h4>
                        {[
                          'Straddles',
                          'Strangles',
                          'Iron Condors',
                          'Volatility Spreads'
                        ].map((strategy, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <Zap className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-white text-lg">{strategy}</span>
                          </div>
                        ))}
                      </div>
                      
                      <div className="space-y-6">
                        <h4 className="text-2xl font-bold text-white mb-4">Key Considerations</h4>
                        <ul className="space-y-3">
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Options premiums are expensive</span>
                          </li>
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Consider selling volatility</span>
                          </li>
                          <li className="text-gray-300 flex items-start gap-3">
                            <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                            <span>Manage position sizes carefully</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Video Tutorials */}
          {activeTab === 'video-tutorials' && (
            <div className="space-y-12">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-6">
                  Learn from Expert Video Tutorials
                </h2>
                <p className="text-xl text-gray-300 max-w-4xl mx-auto">
                  Watch step-by-step tutorials from professional options traders and learn at your own pace.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    id: 'basics',
                    title: 'Options Trading Basics',
                    duration: '15:32',
                    instructor: 'Sarah Chen',
                    level: 'Beginner',
                    thumbnail: '📊',
                    description: 'Learn the fundamentals of options trading including calls, puts, and basic terminology.'
                  },
                  {
                    id: 'covered-calls',
                    title: 'Covered Call Strategy',
                    duration: '22:15',
                    instructor: 'Mike Rodriguez',
                    level: 'Beginner',
                    thumbnail: '📈',
                    description: 'Master the covered call strategy to generate consistent monthly income from your stock portfolio.'
                  },
                  {
                    id: 'iron-condor',
                    title: 'Iron Condor Mastery',
                    duration: '28:47',
                    instructor: 'Jennifer Kim',
                    level: 'Intermediate',
                    thumbnail: '🎯',
                    description: 'Learn how to construct and manage iron condor spreads for high-probability income generation.'
                  },
                  {
                    id: 'risk-management',
                    title: 'Risk Management Essentials',
                    duration: '19:23',
                    instructor: 'David Thompson',
                    level: 'All Levels',
                    thumbnail: '🛡️',
                    description: 'Essential risk management principles every options trader must know to protect their capital.'
                  },
                  {
                    id: 'greeks',
                    title: 'Understanding the Greeks',
                    duration: '25:18',
                    instructor: 'Lisa Wang',
                    level: 'Intermediate',
                    thumbnail: '📐',
                    description: 'Deep dive into Delta, Gamma, Theta, and Vega and how they affect your options positions.'
                  },
                  {
                    id: 'portfolio',
                    title: 'Portfolio Construction',
                    duration: '31:42',
                    instructor: 'Robert Johnson',
                    level: 'Advanced',
                    thumbnail: '🏗️',
                    description: 'Learn how to build a diversified options portfolio that generates consistent returns.'
                  }
                ].map((video) => (
                  <div key={video.id} className="bg-dark-800 rounded-lg border border-dark-600 overflow-hidden hover:border-blue-500/50 transition-all group">
                    <div className="p-6">
                      <div className="text-4xl mb-4">{video.thumbnail}</div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                          video.level === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                          video.level === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {video.level}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {video.duration}
                        </span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                        {video.title}
                      </h3>
                      
                      <p className="text-gray-300 text-sm mb-4">
                        {video.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400 text-sm">by {video.instructor}</span>
                        <button
                          onClick={() => setActiveVideo(video)}
                          className="btn-primary text-sm px-4 py-2 flex items-center gap-2"
                        >
                          <Play className="w-4 h-4" />
                          Watch
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Video Player Modal */}
              {activeVideo && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                  <div className="bg-dark-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
                    <div className="p-6 border-b border-dark-600">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold text-white">{activeVideo.title}</h3>
                        <button
                          onClick={() => setActiveVideo(null)}
                          className="text-gray-400 hover:text-white text-2xl"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-6">
                      <div className="bg-dark-700 rounded-lg h-64 md:h-96 flex items-center justify-center mb-6">
                        <div className="text-center">
                          <div className="text-6xl mb-4">🎥</div>
                          <p className="text-gray-400">Video Player</p>
                          <p className="text-sm text-gray-500 mt-2">
                            {activeVideo.duration} • {activeVideo.instructor}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-white">About this tutorial:</h4>
                        <p className="text-gray-300">{activeVideo.description}</p>
                        
                        <div className="flex items-center gap-4 pt-4">
                          <button className="btn-primary flex items-center gap-2">
                            <Play className="w-4 h-4" />
                            Start Learning
                          </button>
                          <button className="btn-secondary flex items-center gap-2">
                            <Bookmark className="w-4 h-4" />
                            Save for Later
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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

          {/* Community Testimonials */}
          <div className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 p-8 rounded-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Success Stories from Our Community</h3>
              <p className="text-gray-300">
                Hear from real traders who have transformed their financial future with ThetaFlowz.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  name: 'Alex Thompson',
                  role: 'Software Engineer',
                  avatar: '👨‍💻',
                  story: 'Started with covered calls and now generates $3,200 monthly income. The risk management tools are game-changing.',
                  results: '+$38,400/year',
                  rating: 5
                },
                {
                  name: 'Maria Rodriguez',
                  role: 'Retired Teacher',
                  avatar: '👩‍🏫',
                  story: 'ThetaFlowz helped me build a retirement income stream. I love the educational content and community support.',
                  results: '+$24,000/year',
                  rating: 5
                },
                {
                  name: 'David Chen',
                  role: 'Small Business Owner',
                  avatar: '👨‍💼',
                  story: 'The stock screener finds opportunities I would never see. My portfolio is up 47% this year using iron condors.',
                  results: '+47% portfolio',
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div key={index} className="bg-dark-800 p-6 rounded-lg border border-dark-600">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="text-3xl">{testimonial.avatar}</div>
                    <div>
                      <h4 className="text-white font-semibold">{testimonial.name}</h4>
                      <p className="text-gray-400 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm mb-4">{testimonial.story}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-green-400 font-semibold text-sm">{testimonial.results}</div>
                    <div className="flex items-center gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="btn-secondary px-6 py-3 flex items-center gap-2 mx-auto">
                <MessageCircle className="w-4 h-4" />
                Join Our Community
              </button>
            </div>
          </div>

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

          {/* Interactive Quiz Section */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 p-8 rounded-lg">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Test Your Knowledge</h3>
              <p className="text-gray-300">
                Take this quick quiz to reinforce what you've learned about options trading strategies.
              </p>
            </div>

            {!showQuiz && !quizResults && (
              <div className="text-center">
                <button
                  onClick={() => setShowQuiz(true)}
                  className="btn-primary text-lg px-8 py-4 flex items-center gap-2 mx-auto"
                >
                  <Target className="w-5 h-5" />
                  Start Quiz
                </button>
              </div>
            )}

            {showQuiz && !quizResults && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      id: 'q1',
                      question: 'Which strategy involves selling call options against stock you own?',
                      options: ['Cash Secured Put', 'Covered Call', 'Iron Condor', 'Butterfly Spread'],
                      correct: 'b'
                    },
                    {
                      id: 'q2',
                      question: 'What is the primary factor that causes options to lose value over time?',
                      options: ['Time decay (Theta)', 'Interest rates', 'Dividends', 'Stock splits'],
                      correct: 'a'
                    },
                    {
                      id: 'q3',
                      question: 'Which strategy is best suited for sideways markets?',
                      options: ['Long Call', 'Long Put', 'Iron Condor', 'Straddle'],
                      correct: 'c'
                    },
                    {
                                      id: 'q4',
                      question: 'What is the most important aspect of options trading?',
                      options: ['Making quick profits', 'Risk management', 'Following tips', 'Trading frequently'],
                      correct: 'b'
                    },
                    {
                      id: 'q5',
                      question: 'Which of the following measures directional risk in options?',
                      options: ['Delta', 'Gamma', 'Theta', 'Vega'],
                      correct: 'a'
                    }
                  ].map((q) => (
                    <div key={q.id} className="bg-dark-700 p-6 rounded-lg">
                      <h4 className="text-white font-semibold mb-4">{q.question}</h4>
                      <div className="space-y-3">
                        {q.options.map((option, index) => (
                          <label key={index} className="flex items-center gap-3 cursor-pointer">
                            <input
                              type="radio"
                              name={q.id}
                              value={String.fromCharCode(97 + index)} // a, b, c, d
                              checked={quizAnswers[q.id] === String.fromCharCode(97 + index)}
                              onChange={(e) => setQuizAnswers(prev => ({
                                ...prev,
                                [q.id]: e.target.value
                              }))}
                              className="w-4 h-4 text-blue-600 bg-dark-600 border-dark-500"
                            />
                            <span className="text-gray-300">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={handleQuizSubmit}
                    className="btn-primary px-8 py-3 flex items-center gap-2"
                    disabled={Object.keys(quizAnswers).length < 5}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Submit Quiz
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="btn-secondary px-8 py-3 flex items-center gap-2"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {quizResults && (
              <div className="text-center">
                <div className="mb-6">
                  <h4 className="text-2xl font-bold text-white mb-2">Quiz Results</h4>
                  <div className="text-6xl mb-4">
                    {quizResults.percentage >= 80 ? '🎉' : 
                     quizResults.percentage >= 60 ? '👍' : '📚'}
                  </div>
                  <p className="text-2xl font-bold text-white mb-2">
                    {quizResults.score} out of {quizResults.total} correct
                  </p>
                  <p className="text-xl text-gray-300">
                    {quizResults.percentage}% - {
                      quizResults.percentage >= 80 ? 'Excellent! You\'re ready for advanced strategies.' :
                      quizResults.percentage >= 60 ? 'Good job! Review the basics and try again.' :
                      'Keep studying! Review the strategies and retake the quiz.'
                    }
                  </p>
                </div>

                <div className="flex justify-center gap-4">
                  <button
                    onClick={resetQuiz}
                    className="btn-primary px-8 py-3 flex items-center gap-2"
                  >
                    <Target className="w-5 h-5" />
                    Take Quiz Again
                  </button>
                  <button
                    onClick={() => {
                      setQuizResults(null);
                      setShowQuiz(false);
                    }}
                    className="btn-secondary px-8 py-3 flex items-center gap-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                    Continue Learning
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Learn; 