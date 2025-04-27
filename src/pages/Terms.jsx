import React from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Terms of Service</h1>
          <p className="mt-2 text-gray-600">Last updated: {new Date().toLocaleDateString()}</p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 sm:p-8">
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600">
              By accessing and using ReferralStack, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. User Responsibilities</h2>
            <p className="text-gray-600 mb-4">
              As a user of ReferralStack, you agree to:
            </p>
            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              <li>Provide accurate and complete information</li>
              <li>Maintain the security of your account</li>
              <li>Use the service in compliance with all applicable laws</li>
              <li>Not engage in any fraudulent or harmful activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Service Usage</h2>
            <p className="text-gray-600">
              ReferralStack provides a platform for managing and sharing referral links. We reserve the right to modify or discontinue any aspect of the service at any time.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-600">
              All content and materials available on ReferralStack are protected by intellectual property rights. Users retain ownership of their referral links and associated content.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Limitation of Liability</h2>
            <p className="text-gray-600">
              ReferralStack is provided "as is" without any warranties. We are not liable for any damages or losses resulting from your use of the service.
            </p>
          </section>

          <div className="mt-8 text-center">
            <Link to="/" className="text-indigo-600 hover:text-indigo-700">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 