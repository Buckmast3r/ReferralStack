import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Helmet>
        <title>RefStack.me - Your All-in-One Referral Management Platform</title>
        <meta name="description" content="RefStack.me helps you manage and share your referral links efficiently. Get started today!" />
        <meta name="keywords" content="referral management, referral links, SaaS" />
      </Helmet>
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-700 mb-4">Welcome to RefStack.me</h1>
          <p className="text-xl text-gray-600 mb-8">Your all-in-one referral management platform</p>
          <Link
            to="/login"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            aria-label="Get Started"
          >
            Get Started
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Landing; 