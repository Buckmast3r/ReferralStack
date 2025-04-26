import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-8">
      <h1 className="text-4xl font-bold mb-4">Welcome to ReferralStack</h1>
      <p className="text-gray-600 mb-8 text-center max-w-xl">Stack, save, and share your favorite referral links with ease. Upgrade to Pro for more features!</p>
      <Link to="/register" className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">Get Started</Link>
    </div>
  );
}