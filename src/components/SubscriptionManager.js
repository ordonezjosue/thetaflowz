import React, { useState, useEffect } from 'react';
import { CreditCard, Calendar, Download, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const SubscriptionManager = () => {
  const { currentUser } = useAuth();
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  // Mock subscription data - replace with real API calls
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setSubscription({
        id: 'sub_123456789',
        status: 'active',
        plan: 'premium',
        planName: 'Premium Plan',
        currentPeriodStart: '2024-01-01',
        currentPeriodEnd: '2024-02-01',
        cancelAtPeriodEnd: false,
        price: 29.99,
        currency: 'usd',
        nextBillingDate: '2024-02-01',
        trialEnd: null
      });
      setLoading(false);
    }, 1000);
  }, []);

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You\'ll lose access to premium features at the end of your billing period.')) {
      return;
    }

    setCancelling(true);
    try {
      // This would call your backend to cancel the subscription
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          userId: currentUser.id
        }),
      });

      if (response.ok) {
        setSubscription(prev => ({
          ...prev,
          cancelAtPeriodEnd: true
        }));
        alert('Subscription cancelled successfully. You\'ll keep access until the end of your billing period.');
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      alert('Failed to cancel subscription. Please try again or contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivateSubscription = async () => {
    setCancelling(true);
    try {
      // This would call your backend to reactivate the subscription
      const response = await fetch('/api/reactivate-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subscriptionId: subscription.id,
          userId: currentUser.id
        }),
      });

      if (response.ok) {
        setSubscription(prev => ({
          ...prev,
          cancelAtPeriodEnd: false
        }));
        alert('Subscription reactivated successfully!');
      } else {
        throw new Error('Failed to reactivate subscription');
      }
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      alert('Failed to reactivate subscription. Please try again or contact support.');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'past_due':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'text-green-500';
      case 'canceled':
        return 'text-red-500';
      case 'past_due':
        return 'text-yellow-500';
      default:
        return 'text-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold text-white mb-4">No Active Subscription</h3>
        <p className="text-gray-400 mb-6">You don't have an active subscription yet.</p>
        <button className="btn-primary">
          View Plans
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white">Current Subscription</h2>
          <div className="flex items-center space-x-2">
            {getStatusIcon(subscription.status)}
            <span className={`font-medium ${getStatusColor(subscription.status)}`}>
              {subscription.status === 'active' && subscription.cancelAtPeriodEnd 
                ? 'Cancelling' 
                : subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)
              }
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-dark-700 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <CreditCard className="h-5 w-5 text-primary-500" />
              <span className="text-gray-400 text-sm">Plan</span>
            </div>
            <p className="text-white font-semibold">{subscription.planName}</p>
            <p className="text-gray-400 text-sm">${subscription.price}/{subscription.currency.toUpperCase()}</p>
          </div>

          <div className="bg-dark-700 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Calendar className="h-5 w-5 text-primary-500" />
              <span className="text-gray-400 text-sm">Next Billing</span>
            </div>
            <p className="text-white font-semibold">
              {new Date(subscription.nextBillingDate).toLocaleDateString()}
            </p>
            <p className="text-gray-400 text-sm">
              {subscription.cancelAtPeriodEnd ? 'Final billing' : 'Auto-renewal'}
            </p>
          </div>

          <div className="bg-dark-700 p-4 rounded-lg">
            <div className="flex items-center space-x-3 mb-2">
              <Download className="h-5 w-5 text-primary-500" />
              <span className="text-gray-400 text-sm">Access Until</span>
            </div>
            <p className="text-white font-semibold">
              {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
            </p>
            <p className="text-gray-400 text-sm">
              {subscription.cancelAtPeriodEnd ? 'Then cancelled' : 'Renews automatically'}
            </p>
          </div>
        </div>
      </div>

      {/* Billing History */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">Billing History</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div>
              <p className="text-white font-medium">Premium Plan - January 2024</p>
              <p className="text-gray-400 text-sm">Jan 1, 2024</p>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">$29.99</p>
              <p className="text-green-500 text-sm">Paid</p>
            </div>
          </div>
          <div className="flex items-center justify-between p-4 bg-dark-700 rounded-lg">
            <div>
              <p className="text-white font-medium">Premium Plan - December 2023</p>
              <p className="text-gray-400 text-sm">Dec 1, 2023</p>
            </div>
            <div className="text-right">
              <p className="text-white font-medium">$29.99</p>
              <p className="text-green-500 text-sm">Paid</p>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Actions */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-6">Manage Subscription</h3>
        
        {subscription.cancelAtPeriodEnd ? (
          <div className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              <span className="text-yellow-400 font-medium">Subscription Cancelling</span>
            </div>
            <p className="text-yellow-300 text-sm">
              Your subscription will end on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}. 
              You can reactivate it anytime before then to keep your premium access.
            </p>
          </div>
        ) : (
          <div className="bg-green-900/20 border border-green-500/50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-green-400 font-medium">Subscription Active</span>
            </div>
            <p className="text-green-300 text-sm">
              Your premium subscription is active and will automatically renew on {new Date(subscription.nextBillingDate).toLocaleDateString()}.
            </p>
          </div>
        )}

        <div className="flex space-x-4">
          {subscription.cancelAtPeriodEnd ? (
            <button
              onClick={handleReactivateSubscription}
              disabled={cancelling}
              className="btn-primary"
            >
              {cancelling ? 'Reactivating...' : 'Reactivate Subscription'}
            </button>
          ) : (
            <button
              onClick={handleCancelSubscription}
              disabled={cancelling}
              className="btn-secondary"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}
          
          <button className="btn-secondary">
            Update Payment Method
          </button>
          
          <button className="btn-secondary">
            Download Invoice
          </button>
        </div>
      </div>

      {/* Support */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Need Help?</h3>
        <p className="text-gray-300 mb-4">
          Have questions about your subscription or billing? Our support team is here to help.
        </p>
        <div className="flex space-x-4">
          <button className="btn-secondary">
            Contact Support
          </button>
          <button className="btn-secondary">
            View Help Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionManager;
