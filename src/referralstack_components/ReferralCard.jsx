import React from 'react';

export default function ReferralCard({ referral }) {
  return (
    <div className="border rounded-lg p-4 flex justify-between items-center shadow-sm bg-white">
      <div>
        <h3 className="text-lg font-semibold">{referral.app}</h3>
        <p className="text-sm text-gray-600">{referral.desc}</p>
      </div>
      <a href={referral.link} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Sign Up</a>
    </div>
  );
}