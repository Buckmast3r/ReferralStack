import React from 'react';

export default function Upgrade() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h2 className="text-3xl font-bold mb-4">Upgrade to Pro</h2>
      <p className="text-gray-600 mb-6 text-center max-w-md">Unlock unlimited referral links, export tools, and analytics by upgrading to ReferralStack Pro.</p>
      {/* Stripe payment integration will go here */}
    </div>
  );
}