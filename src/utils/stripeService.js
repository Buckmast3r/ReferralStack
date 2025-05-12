import { PRICE_IDS } from '../config/stripe';

export const startCheckout = async (priceId = PRICE_IDS.PRO_MONTHLY) => {
  try {
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        priceId,
        successUrl: `${window.location.origin}/dashboard?payment=success`,
        cancelUrl: `${window.location.origin}/pricing?payment=cancelled`
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to create checkout session');
    }

    const data = await response.json();
    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error('No checkout URL returned');
    }
  } catch (err) {
    console.error('Checkout error:', err);
    throw err;
  }
};

export const handleSubscriptionStatus = async (subscriptionId) => {
  try {
    const response = await fetch(`/api/subscription-status/${subscriptionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch subscription status');
    }
    return await response.json();
  } catch (err) {
    console.error('Subscription status error:', err);
    throw err;
  }
};

export const cancelSubscription = async (subscriptionId) => {
  try {
    const response = await fetch(`/api/cancel-subscription/${subscriptionId}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
    return await response.json();
  } catch (err) {
    console.error('Cancel subscription error:', err);
    throw err;
  }
}; 