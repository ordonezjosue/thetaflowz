import React, { useState } from 'react';
import { BookOpen, TrendingUp, Shield, Target, ArrowRight, CheckCircle } from 'lucide-react';

const Learn = () => {
  const [selectedStrategy, setSelectedStrategy] = useState(null);

  const strategies = [
    {
      id: 'put-credit-spread',
      name: 'Put Credit Spread',
      description: 'A defined-risk strategy that sells a put option while buying a lower-strike put for protection.',
      difficulty: 'Intermediate',
      risk: 'Limited',
      profit: 'Premium received',
      icon: <TrendingUp className="h-6 w-6" />,
      content: {
        overview: 'A put credit spread is a bullish strategy that involves selling a put option at a higher strike price while simultaneously buying a put option at a lower strike price.',
        steps: [
          'Identify a stock you believe will stay above a certain price',
          'Sell a put option at the strike price you expect the stock to stay above',
          'Buy a put option at a lower strike price for protection',
          'Collect the net premium (difference between the two put prices)',
          'Profit if the stock stays above your short put strike at expiration'
        ],
        example: {
          stock: 'AAPL',
          shortPut: 'Sell AAPL $150 Put for $3.00',
          longPut: 'Buy AAPL $145 Put for $1.50',
          netCredit: '$1.50 per share',
          maxRisk: '$3.50 per share',
          maxProfit: '$1.50 per share'
        }
      }
    },
    {
      id: 'call-credit-spread',
      name: 'Call Credit Spread',
      description: 'A bearish strategy that sells a call option while buying a higher-strike call for protection.',
      difficulty: 'Intermediate',
      risk: 'Limited',
      profit: 'Premium received',
      icon: <TrendingUp className="h-6 w-6" />,
      content: {
        overview: 'A call credit spread is a bearish strategy that involves selling a call option at a lower strike price while simultaneously buying a call option at a higher strike price.',
        steps: [
          'Identify a stock you believe will stay below a certain price',
          'Sell a call option at the strike price you expect the stock to stay below',
          'Buy a call option at a higher strike price for protection',
          'Collect the net premium (difference between the two call prices)',
          'Profit if the stock stays below your short call strike at expiration'
        ],
        example: {
          stock: 'TSLA',
          shortCall: 'Sell TSLA $200 Call for $4.00',
          longCall: 'Buy TSLA $205 Call for $2.00',
          netCredit: '$2.00 per share',
          maxRisk: '$3.00 per share',
          maxProfit: '$2.00 per share'
        }
      }
    },
    {
      id: 'wheel-strategy',
      name: 'The Wheel Strategy',
      description: 'A systematic approach combining cash-secured puts and covered calls for consistent income.',
      difficulty: 'Advanced',
      risk: 'Moderate',
      profit: 'Premium income + stock appreciation',
      icon: <Target className="h-6 w-6" />,
      content: {
        overview: 'The Wheel Strategy is a systematic approach that combines selling cash-secured puts and covered calls to generate consistent income while potentially acquiring shares of quality companies.',
        steps: [
          'Sell cash-secured puts on stocks you want to own',
          'If assigned, you buy the stock at the strike price',
          'Once you own the stock, sell covered calls against it',
          'If the covered call is assigned, you sell the stock and start over',
          'If not assigned, keep the premium and sell another covered call'
        ],
        example: {
          stock: 'SPY',
          putStrike: 'Sell SPY $400 Put for $2.00',
          assignment: 'Buy 100 shares at $400 if assigned',
          callStrike: 'Sell SPY $410 Call for $1.50',
          income: '$350 total premium ($200 + $150)'
        }
      }
    },
    {
      id: 'naked-puts',
      name: 'Naked Puts',
      description: 'Selling put options without buying protection, requiring significant capital and risk management.',
      difficulty: 'Advanced',
      risk: 'High',
      profit: 'Full premium received',
      icon: <Shield className="h-6 w-6" />,
      content: {
        overview: 'Naked puts involve selling put options without buying protective puts. This strategy requires significant capital and careful risk management.',
        steps: [
          'Identify a stock you want to own at a lower price',
          'Sell put options at your desired purchase price',
          'Collect the full premium upfront',
          'If the stock stays above your strike, keep the premium',
          'If assigned, you buy the stock at the strike price minus the premium received'
        ],
        example: {
          stock: 'NVDA',
          putStrike: 'Sell NVDA $400 Put for $8.00',
          effectivePrice: '$392 per share if assigned ($400 - $8)',
          maxRisk: 'Unlimited below $400',
          maxProfit: '$800 per contract'
        }
      }
    }
  ];

  const handleStrategySelect = (strategy) => {
    setSelectedStrategy(strategy);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Learn Options Strategies
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Master the most effective options selling strategies. Each strategy includes step-by-step instructions, 
            real examples, and risk management guidelines.
          </p>
        </div>

        {/* Strategy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {strategies.map((strategy) => (
            <div
              key={strategy.id}
              onClick={() => handleStrategySelect(strategy)}
              className={`card cursor-pointer transition-all duration-200 hover:border-primary-500 ${
                selectedStrategy?.id === strategy.id ? 'border-primary-500 bg-dark-700' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-primary-500/10 rounded-lg text-primary-500">
                  {strategy.icon}
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    strategy.difficulty === 'Beginner' ? 'bg-green-500/20 text-green-400' :
                    strategy.difficulty === 'Intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {strategy.difficulty}
                  </span>
                </div>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">
                {strategy.name}
              </h3>
              
              <p className="text-gray-300 text-sm mb-4">
                {strategy.description}
              </p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Risk:</span>
                  <span className="text-white">{strategy.risk}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Profit:</span>
                  <span className="text-white">{strategy.profit}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Strategy Details */}
        {selectedStrategy && (
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                {selectedStrategy.name}
              </h2>
              <button
                onClick={() => setSelectedStrategy(null)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Overview */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Overview</h3>
                <p className="text-gray-300 mb-6">
                  {selectedStrategy.content.overview}
                </p>

                <h3 className="text-lg font-semibold text-white mb-4">Steps</h3>
                <ol className="space-y-3">
                  {selectedStrategy.content.steps.map((step, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                        {index + 1}
                      </span>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Example */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Example Trade</h3>
                <div className="bg-dark-700 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stock:</span>
                    <span className="text-white font-medium">{selectedStrategy.content.example.stock}</span>
                  </div>
                  
                  {selectedStrategy.content.example.shortPut && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Short Put:</span>
                      <span className="text-white">{selectedStrategy.content.example.shortPut}</span>
                    </div>
                  )}
                  
                  {selectedStrategy.content.example.longPut && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Long Put:</span>
                      <span className="text-white">{selectedStrategy.content.example.longPut}</span>
                    </div>
                  )}
                  
                  {selectedStrategy.content.example.shortCall && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Short Call:</span>
                      <span className="text-white">{selectedStrategy.content.example.shortCall}</span>
                    </div>
                  )}
                  
                  {selectedStrategy.content.example.longCall && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Long Call:</span>
                      <span className="text-white">{selectedStrategy.content.example.longCall}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-400">Net Credit:</span>
                    <span className="text-primary-500 font-medium">{selectedStrategy.content.example.netCredit}</span>
                  </div>
                  
                  {selectedStrategy.content.example.maxRisk && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Risk:</span>
                      <span className="text-red-400 font-medium">{selectedStrategy.content.example.maxRisk}</span>
                    </div>
                  )}
                  
                  {selectedStrategy.content.example.maxProfit && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Max Profit:</span>
                      <span className="text-green-400 font-medium">{selectedStrategy.content.example.maxProfit}</span>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
                  <h4 className="text-sm font-semibold text-primary-500 mb-2">Key Takeaways</h4>
                  <ul className="space-y-1 text-sm text-gray-300">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary-500" />
                      <span>Always understand your maximum risk before entering a trade</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary-500" />
                      <span>Use proper position sizing (1-5% of portfolio per trade)</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-primary-500" />
                      <span>Have an exit plan before entering any position</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Learn; 