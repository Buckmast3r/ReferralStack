import { CheckCircle, XCircle, Lock } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    description: "For individuals getting started",
    features: [
      { label: "Up to 5 referral links", included: true },
      { label: "Basic analytics (views only)", included: true },
      { label: "Default theme + basic referral cards", included: true },
      { label: "Standard support", included: true },
      { label: "Custom URL slugs", included: false },
      { label: "Advanced layouts + media embeds", included: false },
      { label: "Detailed conversion tracking", included: false },
      { label: "Link scheduling", included: false },
      { label: "Profile page with bio & avatar", included: false },
      { label: "Custom branding/themes", included: false },
    ],
    cta: "Get Started",
    isPopular: false,
  },
  {
    name: "Pro",
    price: "$9.99/mo",
    description: "For creators and professionals ready to grow",
    features: [
      { label: "Unlimited referral links", included: true },
      { label: "Advanced analytics (CTR, geography, etc)", included: true },
      { label: "Advanced layouts + media embeds", included: true },
      { label: "Priority support", included: true },
      { label: "Custom URL slugs", included: true },
      { label: "Link scheduling", included: true },
      { label: "Profile page with bio & avatar", included: true },
      { label: "Custom branding/themes", included: true },
      { label: "Conversion tracking & top performer insights", included: true },
    ],
    cta: "Upgrade to Pro",
    isPopular: true,
  },
];

const addons = [
  { name: "Custom Domain", price: "$5/mo", description: "Use your own domain like links.mysite.com" },
  { name: "White-Labeling", price: "$10/mo", description: "Remove all ReferralStack branding" },
  { name: "Developer API Access", price: "$25/mo", description: "Integrate with your systems via secure API" },
  { name: "Auto-Expiring Links", price: "$2/mo", description: "Time-based link control for limited promos" },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-16 px-4">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-slate-900 dark:text-white">Pricing Plans</h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          Start free. Upgrade anytime. Designed for creators, marketers, and anyone who shares referral links.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border p-6 shadow-sm ${
              plan.isPopular
                ? "border-blue-600 bg-blue-50 dark:bg-blue-950"
                : "border-slate-200 dark:border-slate-700"
            }`}
          >
            {plan.isPopular && (
              <div className="text-sm font-semibold text-blue-600 mb-2">Most Popular</div>
            )}
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">{plan.name}</h2>
            <p className="text-3xl font-bold text-slate-800 dark:text-white mt-2">{plan.price}</p>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{plan.description}</p>

            <ul className="mt-6 space-y-3 text-left">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  {feature.included ? (
                    <CheckCircle className="text-green-600 w-5 h-5 mt-1" />
                  ) : (
                    <Lock className="text-slate-400 w-5 h-5 mt-1" />
                  )}
                  <span
                    className={`${
                      feature.included ? "text-slate-800 dark:text-slate-100" : "text-slate-400 line-through"
                    }`}
                  >
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>

            <button
              className={`mt-6 w-full py-2 px-4 rounded-xl font-semibold ${
                plan.isPopular
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-slate-200 text-slate-800 hover:bg-slate-300"
              }`}
            >
              {plan.cta}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-16 max-w-4xl mx-auto">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4">Optional Add-ons</h3>
        <ul className="grid gap-4 md:grid-cols-2">
          {addons.map((addon, idx) => (
            <li
              key={idx}
              className="border border-slate-200 dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-800"
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 dark:text-white">{addon.name}</span>
                <span className="text-blue-600 font-semibold">{addon.price}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm">{addon.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
