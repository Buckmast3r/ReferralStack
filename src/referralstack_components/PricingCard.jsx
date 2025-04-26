import React from 'react';

export default function PricingCard({ plan, price, features }) {
  return (
    <div className="border rounded-lg p-6 shadow bg-white">
      <h2 className="text-2xl font-bold mb-2">{plan}</h2>
      <p className="text-xl text-gray-700 mb-4">{price}</p>
      <ul className="text-left list-disc pl-6 mb-4">
        {features.map((feature, index) => (
          <li key={index} className="text-gray-600">{feature}</li>
        ))}
      </ul>
      <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
        {plan === 'Free' ? 'Start Free' : 'Upgrade'}
      </button>
    </div>
  );
}