import { loadStripe } from '@stripe/stripe-js';

// Replace with your actual Stripe publishable key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export const PRICE_IDS = {
  PRO_MONTHLY: 'price_XXXXX', // Replace with your actual Stripe price ID
  PRO_YEARLY: 'price_YYYYY',  // Replace with your actual Stripe price ID
};

export const SUBSCRIPTION_PLANS = {
  FREE: {
    name: 'Free',
    price: '$0',
    features: [
      'Up to 5 referral links',
      'Basic analytics',
      'Standard support'
    ]
  },
  PRO: {
    name: 'Pro',
    price: '$9.99',
    interval: 'month',
    features: [
      'Unlimited referral links',
      'Advanced analytics',
      'Priority support',
      'Custom URL slugs',
      'Export tools'
    ]
  }
};

export default stripePromise; 