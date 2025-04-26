import React, { useState } from 'react';
import { useReferrals } from '../hooks/useReferrals';

export default function AddReferralForm() {
  const { addReferral } = useReferrals();
  const [app, setApp] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addReferral({ app, desc, link });
    setApp('');
    setDesc('');
    setLink('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input className="w-full p-2 border rounded" placeholder="App Name" value={app} onChange={(e) => setApp(e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} />
      <input className="w-full p-2 border rounded" placeholder="Referral Link" value={link} onChange={(e) => setLink(e.target.value)} />
      <button type="submit" className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">Add Referral</button>
    </form>
  );
}