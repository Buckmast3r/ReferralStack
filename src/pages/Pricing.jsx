import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { SUBSCRIPTION_PLANS } from '../config/stripe';
import { startCheckout } from '../utils/stripeService';

const Pricing = () => {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async () => {
    setLoading(true);
    try {
      await startCheckout();
    } catch (error) {
      console.error('Failed to start checkout:', error);
      // You might want to show an error toast here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Pricing Plans</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">{SUBSCRIPTION_PLANS.FREE.name}</h2>
          <p className="text-3xl font-bold text-gray-900 mb-4">{SUBSCRIPTION_PLANS.FREE.price}</p>
          <p className="text-gray-600 mb-4">Basic features for individuals</p>
          <ul className="mb-6 space-y-2">
            {SUBSCRIPTION_PLANS.FREE.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <Link
            to="/register"
            className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Get Started
          </Link>
        </div>
        <div className="bg-white shadow rounded-lg p-6 border-2 border-blue-500">
          <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-lg rounded-tr-lg">
            Popular
          </div>
          <h2 className="text-2xl font-bold mb-4">{SUBSCRIPTION_PLANS.PRO.name}</h2>
          <p className="text-3xl font-bold text-gray-900 mb-4">
            {SUBSCRIPTION_PLANS.PRO.price}
            <span className="text-base font-normal text-gray-500">/{SUBSCRIPTION_PLANS.PRO.interval}</span>
          </p>
          <p className="text-gray-600 mb-4">Advanced features for professionals</p>
          <ul className="mb-6 space-y-2">
            {SUBSCRIPTION_PLANS.PRO.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                {feature}
              </li>
            ))}
          </ul>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            className="block w-full text-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Upgrade Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
