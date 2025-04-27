import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

export default function ReferralCard({ referral }) {
  const [favicon, setFavicon] = useState(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const fetchFavicon = async () => {
      try {
        const url = new URL(referral.link);
        const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=32`;
        setFavicon(faviconUrl);
      } catch (error) {
        console.error('Error fetching favicon:', error);
      }
    };

    fetchFavicon();
  }, [referral.link]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referral.link);
      setIsCopied(true);
      toast.success('Link copied to clipboard!', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link', {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
      });
    }
  };

  return (
    <div className="border rounded-lg p-4 flex flex-col space-y-4 shadow-sm bg-white hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start space-x-3">
        {favicon && (
          <img 
            src={favicon} 
            alt={`${referral.app} favicon`} 
            className="w-6 h-6 mt-1 flex-shrink-0"
          />
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{referral.app}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{referral.desc}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <button
          onClick={copyToClipboard}
          className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-1.5 rounded-md hover:bg-gray-50"
        >
          <svg 
            className="w-4 h-4" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" 
            />
          </svg>
          <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'Copy Link'}</span>
          <span className="sm:hidden">{isCopied ? '✓' : 'Copy'}</span>
        </button>
        
        <a 
          href={referral.link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <span className="hidden sm:inline">Sign Up</span>
          <span className="sm:hidden">Go</span>
          <svg 
            className="ml-2 -mr-1 w-4 h-4" 
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
  );
}