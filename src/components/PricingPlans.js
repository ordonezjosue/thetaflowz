import React, { useState } from 'react';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const PricingPlans = () => {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const plans = [
    {
      id: 'basic',
      name: 'Basic Plan',
      price: 9.99,
      period: 'month',
      icon: Zap,
      features: [
        'Access to basic trading strategies',
        'Market data (delayed)',
        'Basic trade tracking',
        'Email support',
        'Community forum access'
      ],
      popular: false,
      stripePriceId: 'price_basic_monthly' // You'll get this from Stripe
    },
    {
      id: 'premium',
      name: 'Premium Plan',
      price: 29.99,
      period: 'month',
      icon: Crown,
      features: [
        'Everything in Basic',
        'Real-time market data',
        'Advanced analytics & Greeks',
        'Priority support',
        'Exclusive strategies',
        'Portfolio optimization',
        'Risk management tools',
        'Mobile app access'
      ],
      popular: true,
      stripePriceId: 'price_premium_monthly' // You'll get this from Stripe
    }
  ];

  const handleSubscribe = async (plan) => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setSelectedPlan(plan.id);

    try {
      // This would integrate with your backend to create a Stripe checkout session
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          planId: plan.id,
          userId: currentUser.id,
          email: currentUser.email,
          stripePriceId: plan.stripePriceId
        }),
      });

      const { sessionId } = await response.json();
      
      // Redirect to Stripe Checkout
      const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.redirectToCheckout({ sessionId });
      
      if (error) {
        console.error('Stripe error:', error);
        alert('Payment failed. Please try again.');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Unable to process subscription. Please try again.');
    } finally {
      setLoading(false);
      setSelectedPlan(null);
    }
  };

  const loadStripe = async (publishableKey) => {
    if (window.Stripe) {
      return window.Stripe(publishableKey);
    }
    const { loadStripe } = await import('@stripe/stripe-js');
    return loadStripe(publishableKey);
  };

  return (
    <div className="py-16 bg-dark-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Choose Your Trading Plan
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Start with our basic plan and upgrade as you grow. All plans include our core trading tools and community access.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const IconComponent = plan.icon;
            return (
              <div
                key={plan.id}
                className={`relative bg-dark-800 rounded-2xl p-8 border-2 transition-all duration-300 hover:scale-105 ${
                  plan.popular
                    ? 'border-primary-500 shadow-2xl shadow-primary-500/20'
                    : 'border-dark-600 hover:border-gray-500'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className="flex justify-center mb-4">
                    <div className={`p-3 rounded-full ${
                      plan.popular ? 'bg-primary-500/20 text-primary-400' : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      <IconComponent className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">${plan.price}</span>
                    <span className="text-gray-400">/{plan.period}</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* Subscribe Button */}
                <button
                  onClick={() => handleSubscribe(plan)}
                  disabled={loading && selectedPlan === plan.id}
                  className={`w-full py-3 px-6 rounded-lg font-medium transition-all duration-200 ${
                    plan.popular
                      ? 'bg-primary-500 hover:bg-primary-600 text-white shadow-lg hover:shadow-xl'
                      : 'bg-dark-700 hover:bg-dark-600 text-white border border-gray-600 hover:border-gray-500'
                  } ${loading && selectedPlan === plan.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading && selectedPlan === plan.id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    plan.popular ? 'Start Premium Plan' : 'Start Basic Plan'
                  )}
                </button>

                {/* Additional Info */}
                <p className="text-center text-sm text-gray-400 mt-4">
                  Cancel anytime • No setup fees
                </p>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Frequently Asked Questions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto text-left">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Can I change plans?</h4>
              <p className="text-gray-300">Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">What payment methods do you accept?</h4>
              <p className="text-gray-300">We accept all major credit cards, debit cards, and digital wallets through our secure Stripe integration.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Is there a free trial?</h4>
              <p className="text-gray-300">Yes! New users get a 7-day free trial of our Premium plan to experience all features.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">How do I cancel my subscription?</h4>
              <p className="text-gray-300">You can cancel anytime from your account settings. No questions asked, and you'll keep access until the end of your billing period.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;
