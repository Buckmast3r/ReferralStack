import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 px-4">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-gray-900">Welcome to ReferralStack</h1>
        <p className="text-xl text-gray-600 mb-8">Stack. Share. Grow. Your referrals, organized professionally.</p>
        {!user ? (
          <Link to="/login">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200">
              Login to Get Started
            </button>
          </Link>
        ) : (
          <Link to="/home">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200">
              Go to Dashboard
            </button>
          </Link>
        )}
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-16 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-6 rounded-lg hover:bg-white transition-colors duration-200">
            <h3 className="text-2xl font-semibold mb-2 text-gray-900">Stack Links</h3>
            <p className="text-gray-600">Save and organize all your favorite referral codes in one clean place.</p>
          </div>
          <div className="p-6 rounded-lg hover:bg-white transition-colors duration-200">
            <h3 className="text-2xl font-semibold mb-2 text-gray-900">Share Easily</h3>
            <p className="text-gray-600">One simple profile to share your entire referral network professionally.</p>
          </div>
          <div className="p-6 rounded-lg hover:bg-white transition-colors duration-200">
            <h3 className="text-2xl font-semibold mb-2 text-gray-900">Grow Your Rewards</h3>
            <p className="text-gray-600">Make the most of your referrals by showcasing them elegantly.</p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">What is ReferralStack?</h2>
          <p className="text-gray-700 text-lg">
            ReferralStack is a simple, powerful platform where you can collect and manage all your referral links. 
            Whether it's for apps, services, or stores — organize them in one clean, shareable space.
          </p>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-indigo-600 text-white text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Build Your Stack?</h2>
        {!user ? (
          <Link to="/register">
            <button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200">
              Create Your Stack
            </button>
          </Link>
        ) : (
          <Link to="/home">
            <button className="bg-white text-indigo-600 hover:bg-gray-100 px-8 py-3 rounded-md text-lg font-medium transition-colors duration-200">
              View Your Stack
            </button>
          </Link>
        )}
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-gray-500 text-sm">
        <div className="flex justify-center gap-4 mb-2">
          <Link to="/privacy" className="hover:text-gray-700 transition-colors duration-200">Privacy</Link>
          <span>|</span>
          <Link to="/terms" className="hover:text-gray-700 transition-colors duration-200">Terms</Link>
        </div>
        <p>&copy; {new Date().getFullYear()} ReferralStack. All rights reserved.</p>
      </footer>
    </div>
  );
} 