import React, { useState } from 'react';
import { toast } from 'react-toastify';

export default function ReferralCard({ referral }) {
  const [copiedLinkIdx, setCopiedLinkIdx] = useState(null);
  const [copiedCard, setCopiedCard] = useState(false);

  // Helper to get favicon for a link
  const getFavicon = (url) => {
    try {
      const { hostname } = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    } catch {
      return null;
    }
  };

  // Copy a referral link
  const copyLink = async (url, idx) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLinkIdx(idx);
      toast.success('Link copied to clipboard!', { autoClose: 1500 });
      setTimeout(() => setCopiedLinkIdx(null), 1500);
    } catch {
      toast.error('Failed to copy link');
    }
  };

  // Copy the card share URL
  const copyCardUrl = async () => {
    const url = `${window.location.origin}/card/${referral.id}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedCard(true);
      toast.success('Card URL copied!', { autoClose: 1500 });
      setTimeout(() => setCopiedCard(false), 1500);
    } catch {
      toast.error('Failed to copy card URL');
    }
  };

  // Open public preview
  const openPreview = () => {
    window.open(`/card/${referral.id}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex flex-col gap-4 hover:shadow-2xl transition-shadow border border-gray-100">
      {/* Card Image */}
      {referral.image_url && (
        <img src={referral.image_url} alt="Card visual" className="w-full h-32 object-cover rounded-lg mb-2" />
      )}
      {/* Title & Description */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">{referral.title}</h3>
        {referral.description && <p className="text-gray-600 text-sm mb-2">{referral.description}</p>}
      </div>
      {/* Links */}
      <div className="space-y-3">
        {Array.isArray(referral.links) && referral.links.map((link, idx) => (
          <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded p-2">
            {getFavicon(link.url) && (
              <img src={getFavicon(link.url)} alt="favicon" className="w-6 h-6 rounded" />
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-800 truncate">{link.label}</div>
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 text-xs underline break-all"
              >
                {link.url}
              </a>
            </div>
            <button
              onClick={() => copyLink(link.url, idx)}
              className="px-2 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Copy referral link ${idx + 1}`}
            >
              {copiedLinkIdx === idx ? 'Copied!' : 'Copy'}
            </button>
          </div>
        ))}
      </div>
      {/* Share & Preview Buttons */}
      <div className="flex justify-between items-center mt-2 gap-2">
        <div className="flex gap-2">
          <button
            onClick={copyCardUrl}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Copy card share URL"
          >
            {copiedCard ? 'Card URL Copied!' : 'Share Card'}
          </button>
          <button
            onClick={openPreview}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Preview public card"
          >
            Preview
          </button>
        </div>
        <span className="text-xs text-gray-400">Created: {referral.created_at ? new Date(referral.created_at).toLocaleDateString() : ''}</span>
      </div>
    </div>
  );
}