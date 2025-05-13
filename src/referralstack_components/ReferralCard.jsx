import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function ReferralCard({ referral }) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referral.links[0]?.url || '');
      setCopied(true);
      toast.success('Link copied to clipboard!', { autoClose: 1500 });
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareReferral = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${referral.title} Referral`,
          text: `Check out my referral link for ${referral.title}!`,
          url: referral.links[0]?.url || '',
        });
      } catch (error) {
        console.error('Error sharing:', error);
        copyToClipboard();
      }
    } else {
      copyToClipboard();
    }
  };

  // Get a color scheme based on the referral title
  const getColorScheme = (title) => {
    const colors = {
      default: {
        bg: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50',
        accent: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-800',
      },
      dropbox: {
        bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20',
        accent: 'text-blue-600 dark:text-blue-400',
        border: 'border-blue-200 dark:border-blue-800',
      },
      airbnb: {
        bg: 'bg-gradient-to-br from-rose-50 to-rose-100 dark:from-rose-900/20 dark:to-rose-800/20',
        accent: 'text-rose-600 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800',
      },
      uber: {
        bg: 'bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50',
        accent: 'text-slate-600 dark:text-slate-400',
        border: 'border-slate-200 dark:border-slate-800',
      },
      robinhood: {
        bg: 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20',
        accent: 'text-green-600 dark:text-green-400',
        border: 'border-green-200 dark:border-green-800',
      },
      doordash: {
        bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20',
        accent: 'text-red-600 dark:text-red-400',
        border: 'border-red-200 dark:border-red-800',
      },
      coinbase: {
        bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-900/20 dark:to-amber-800/20',
        accent: 'text-amber-600 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800',
      },
    };

    const key = title.toLowerCase();
    return colors[key] || colors.default;
  };

  const colors = getColorScheme(referral.title);

  return (
    <div
      className={`overflow-hidden transition-transform duration-300 ease-in-out border ${colors.border} hover:shadow-2xl hover:scale-[1.015] backdrop-blur-md rounded-xl`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col md:flex-row">
        <div className={`p-6 ${colors.bg} md:w-2/3 space-y-4`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white dark:bg-slate-700 p-1 shadow-md">
                {referral.image_url ? (
                  <img src={referral.image_url} alt={`${referral.title} logo`} className="object-contain w-full h-full" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100">
                    <span className="text-2xl">🔗</span>
                  </div>
                )}
              </div>
              <h3 className="font-bold text-xl text-slate-900 dark:text-slate-50">{referral.title}</h3>
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${colors.accent} bg-white/60 dark:bg-slate-800/60 shadow-sm`}>
              {referral.category || 'Referral'}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{referral.description}</p>
          {referral.reward && (
            <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colors.accent} bg-white/70 dark:bg-slate-800/70`}>
              🎁 Reward: {referral.reward}
            </div>
          )}
        </div>

        <div className="md:w-1/3 flex flex-col backdrop-blur-sm bg-white/80 dark:bg-slate-800/80 border-l border-slate-200 dark:border-slate-700">
          <div className="px-6 py-5 flex-grow space-y-3">
            <div className="text-xs text-slate-500 dark:text-slate-400 mb-1 break-all font-mono">
              {referral.links[0]?.url || ''}
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
              <button
                onClick={shareReferral}
                className="flex-1 px-3 py-2 text-sm border border-gray-200 rounded-md hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
              >
                Share
              </button>
            </div>
          </div>

          <a
            href={referral.links[0]?.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full py-3 flex justify-center items-center gap-2 text-white font-medium text-sm transition-transform hover:scale-105 ${
              isHovered
                ? "bg-gradient-to-r from-emerald-400 to-teal-400"
                : "bg-gradient-to-r from-teal-600 to-emerald-600"
            }`}
          >
            Use Referral
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}