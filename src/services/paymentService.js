// Payment Service for Stripe Integration
// This is a mock service - in production, you'd connect to your backend

class PaymentService {
  constructor() {
    this.baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  }

  // Create a Stripe checkout session
  async createCheckoutSession(planData) {
    try {
      // In production, this would call your backend API
      const response = await fetch(`${this.baseUrl}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // Get user's subscription details
  async getUserSubscription(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${userId}`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching subscription:', error);
      throw error;
    }
  }

  // Cancel subscription
  async cancelSubscription(subscriptionId, userId) {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to cancel subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      throw error;
    }
  }

  // Reactivate subscription
  async reactivateSubscription(subscriptionId, userId) {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/reactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to reactivate subscription');
      }

      return await response.json();
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  // Update payment method
  async updatePaymentMethod(subscriptionId, paymentMethodId) {
    try {
      const response = await fetch(`${this.baseUrl}/subscriptions/${subscriptionId}/payment-method`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
        body: JSON.stringify({ paymentMethodId }),
      });

      if (!response.ok) {
        throw new Error('Failed to update payment method');
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating payment method:', error);
      throw error;
    }
  }

  // Get billing history
  async getBillingHistory(userId) {
    try {
      const response = await fetch(`${this.baseUrl}/billing/${userId}/history`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch billing history');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching billing history:', error);
      throw error;
    }
  }

  // Download invoice
  async downloadInvoice(invoiceId) {
    try {
      const response = await fetch(`${this.baseUrl}/invoices/${invoiceId}/download`, {
        headers: {
          'Authorization': `Bearer ${this.getAuthToken()}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to download invoice');
      }

      // Create blob and download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Error downloading invoice:', error);
      throw error;
    }
  }

  // Get auth token from localStorage or context
  getAuthToken() {
    // In production, get this from your auth context or localStorage
    return localStorage.getItem('authToken') || 'mock-token';
  }

  // Mock methods for development (remove in production)
  getMockSubscription() {
    return {
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
    };
  }

  getMockBillingHistory() {
    return [
      {
        id: 'inv_001',
        date: '2024-01-01',
        amount: 29.99,
        status: 'paid',
        description: 'Premium Plan - January 2024'
      },
      {
        id: 'inv_002',
        date: '2023-12-01',
        amount: 29.99,
        status: 'paid',
        description: 'Premium Plan - December 2023'
      }
    ];
  }
}

export default new PaymentService();
