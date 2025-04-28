import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Flexible Plans for Every Stage</h1>
        <p className="text-lg text-gray-600">Pick the plan that fits your needs. Upgrade anytime.</p>
        <p className="text-sm text-gray-400 mt-2">No hidden fees. Cancel anytime.</p>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {/* Starter Plan */}
        <Card className="border border-gray-200">
          <CardContent className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Starter</h2>
            <p className="text-gray-500 mb-4">Perfect for individuals exploring referral stacking. Get started for free.</p>
            <p className="text-3xl font-bold mb-4">$0<span className="text-lg font-normal">/mo</span></p>
            <Button className="mb-6 w-full">Get Started</Button>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Create referral cards
              </li>
              <li className="text-gray-400">✗ Share unlimited referral links
              </li>
              <li className="text-gray-400">✗ Custom branding
              </li>
              <li className="text-gray-400">✗ Analytics (views, clicks)
              </li>
              <li className="text-gray-400">✗ Priority support
              </li>
              <li className="text-gray-400">✗ Team collaboration
              </li>
              <li className="text-gray-400">✗ Advanced customization
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Pro Plan (Highlighted) */}
        <Card className="border-2 border-blue-600 shadow-lg relative">
          <CardContent className="p-6 flex flex-col items-center">
            <span className="absolute -top-4 bg-blue-600 text-white px-4 py-1 text-sm rounded-full">Most Popular</span>
            <h2 className="text-2xl font-bold mb-2">Pro</h2>
            <p className="text-gray-500 mb-4">For serious users ready to optimize and grow their reach.</p>
            <p className="text-3xl font-bold mb-4">$19<span className="text-lg font-normal">/mo</span></p>
            <Button className="mb-6 w-full bg-blue-600 hover:bg-blue-700">Go Pro</Button>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Create referral cards
              </li>
              <li>✓ Share unlimited referral links
              </li>
              <li>✓ Custom branding
              </li>
              <li>✓ Analytics (views, clicks)
              </li>
              <li className="text-gray-400">✗ Priority support
              </li>
              <li className="text-gray-400">✗ Team collaboration
              </li>
              <li className="text-gray-400">✗ Advanced customization
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Unlimited Plan */}
        <Card className="border border-gray-200">
          <CardContent className="p-6 flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-2">Unlimited</h2>
            <p className="text-gray-500 mb-4">Unlock full potential — maximum features, no limits, ultimate flexibility.</p>
            <p className="text-3xl font-bold mb-4">$49<span className="text-lg font-normal">/mo</span></p>
            <Button className="mb-6 w-full">Unlock Unlimited</Button>
            <ul className="space-y-2 text-gray-600">
              <li>✓ Create referral cards
              </li>
              <li>✓ Share unlimited referral links
              </li>
              <li>✓ Custom branding
              </li>
              <li>✓ Analytics (views, clicks)
              </li>
              <li>✓ Priority support
              </li>
              <li>✓ Team collaboration
              </li>
              <li>✓ Advanced customization
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Small Notes */}
      <div className="text-center mt-10 text-gray-500">
        <p>7-Day Money Back Guarantee 🛡️ | Cancel Anytime | Save 20% with Annual Billing</p>
      </div>

      {/* Add-ons Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-4 text-center">Optional Add-ons</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Custom Domain</h3>
              <p className="text-gray-500 mb-4">Use your own domain for $5/mo extra.</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">White-label Option</h3>
              <p className="text-gray-500 mb-4">Remove all branding for $10/mo extra.</p>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <h3 className="text-xl font-bold mb-2">Developer API Access</h3>
              <p className="text-gray-500 mb-4">Integrate via API for $25/mo extra.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
