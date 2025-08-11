import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Crown, Zap, Gift } from 'lucide-react';

const AccessRestricted = ({ feature, currentPlan, requiredPlan }) => {
  const getFeatureInfo = (feature) => {
    switch (feature) {
      case 'market':
        return {
          name: 'Market Data',
          description: 'Access real-time and delayed market data, stock quotes, and market overview.',
          icon: Zap
        };
      case 'trades':
        return {
          name: 'Trade Tracking',
          description: 'Log, track, and analyze your options trades with advanced analytics.',
          icon: Crown
        };
      case 'learn':
        return {
          name: 'Learning Center',
          description: 'Access our comprehensive trading education and strategy guides.',
          icon: Gift
        };
      default:
        return {
          name: 'Premium Feature',
          description: 'This feature requires a premium subscription.',
          icon: Lock
        };
    }
  };

  const getPlanInfo = (plan) => {
    switch (plan) {
      case 'premium':
        return {
          name: 'Premium Plan',
          price: '$29.99/month',
          color: 'text-purple-500',
          bgColor: 'bg-purple-500/20',
          icon: Crown,
          features: [
            'Real-time market data',
            'Advanced analytics & Greeks',
            'Priority support',
            'Exclusive strategies',
            'Portfolio optimization',
            'Risk management tools'
          ]
        };
      case 'basic':
        return {
          name: 'Basic Plan',
          price: '$9.99/month',
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/20',
          icon: Zap,
          features: [
            'Delayed market data',
            'Basic trade tracking',
            'Email support',
            'Community forum access'
          ]
        };
      default:
        return {
          name: 'Free Plan',
          price: 'Free (7 days)',
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          icon: Gift,
          features: [
            'Learn section access',
            'Basic trading education',
            'Community forum access'
          ]
        };
    }
  };

  const featureInfo = getFeatureInfo(feature);
  const planInfo = getPlanInfo(requiredPlan);
  const IconComponent = featureInfo.icon;
  const PlanIcon = planInfo.icon;

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Feature Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500/20 rounded-full">
            <IconComponent className="h-16 w-16 text-red-500" />
          </div>
        </div>

        {/* Main Message */}
        <h1 className="text-4xl font-bold text-white mb-4">
          Access Restricted
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          {featureInfo.description}
        </p>

        {/* Current Plan Status */}
        {currentPlan && (
          <div className="bg-dark-800 rounded-lg p-6 mb-8 max-w-md mx-auto">
            <h3 className="text-lg font-semibold text-white mb-3">Your Current Plan</h3>
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="p-2 bg-gray-500/20 rounded-full">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <span className="text-gray-400 font-medium">
                {currentPlan === 'free' ? 'Free Plan' : currentPlan === 'basic' ? 'Basic Plan' : 'Premium Plan'}
              </span>
            </div>
            <p className="text-sm text-gray-400">
              {currentPlan === 'free' 
                ? 'You have limited access with the free plan. Upgrade to unlock more features!'
                : 'Your current plan doesn\'t include this feature. Upgrade to Premium for full access!'
              }
            </p>
          </div>
        )}

        {/* Required Plan */}
        <div className="bg-dark-800 rounded-lg p-8 mb-8 max-w-lg mx-auto">
          <h3 className="text-2xl font-bold text-white mb-4">Upgrade to {planInfo.name}</h3>
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className={`p-3 rounded-full ${planInfo.bgColor}`}>
              <PlanIcon className={`h-8 w-8 ${planInfo.color}`} />
            </div>
            <div>
              <p className={`text-2xl font-bold ${planInfo.color}`}>{planInfo.price}</p>
            </div>
          </div>
          
          <ul className="space-y-3 mb-6 text-left">
            {planInfo.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            to="/pricing"
            className="btn-primary w-full py-3 text-lg"
          >
            View All Plans
          </Link>
        </div>

        {/* Alternative Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="btn-secondary"
          >
            Back to Home
          </Link>
          {currentPlan === 'free' && (
            <Link
              to="/learn"
              className="btn-secondary"
            >
              Access Learn Section
            </Link>
          )}
        </div>

        {/* Help Text */}
        <p className="text-gray-400 text-sm mt-8">
          Need help choosing a plan?{' '}
          <Link to="/pricing" className="text-primary-500 hover:text-primary-400">
            Compare all features
          </Link>
        </p>
      </div>
    </div>
  );
};

export default AccessRestricted;
