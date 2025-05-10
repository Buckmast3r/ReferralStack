import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

// Function to generate a unique ID
function generateUniqueId() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export default function AddReferralModal({ onClose, onAdded }) {
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [links, setLinks] = useState([{ label: '', url: '' }]);
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  const handleLinkChange = (idx, field, value) => {
    setLinks((prev) => prev.map((link, i) => i === idx ? { ...link, [field]: value } : link));
  };

  const addLink = () => {
    if (links.length < 3) setLinks([...links, { label: '', url: '' }]);
  };

  const removeLink = (idx) => {
    if (links.length > 1) setLinks(links.filter((_, i) => i !== idx));
  };

  async function handleAddReferral(e) {
    e.preventDefault();
    if (!title) {
      setError('Title is required.');
      return;
    }
    if (links.length === 0 || links.some(link => !link.label || !link.url)) {
      setError('Each link must have a label and a URL.');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('referrals')
        .insert([
          {
            id: generateUniqueId(),
            user_id: user.id,
            title,
            description,
            links,
            image_url: imageUrl || null,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        console.error('Error adding referral:', insertError.message);
        setError(insertError.message);
      } else {
        setTitle('');
        setDescription('');
        setLinks([{ label: '', url: '' }]);
        setImageUrl('');
        setError('');
        if (onAdded) onAdded();
        if (onClose) onClose();
      }
    } catch (err) {
      console.error('Error adding referral:', err);
      setError('Failed to add referral. Please try again.');
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-2xl font-bold mb-6">Add New Referral</h2>
        <form onSubmit={handleAddReferral} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter referral card title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Describe this referral card"
              rows={2}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Referral Links (up to 3)</label>
            {links.map((link, idx) => (
              <div key={idx} className="flex gap-2 mb-2 items-center">
                <input
                  type="text"
                  value={link.label}
                  onChange={e => handleLinkChange(idx, 'label', e.target.value)}
                  placeholder="Link label (e.g. Sofi)"
                  className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  required
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={e => handleLinkChange(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-2 py-1 border border-gray-300 rounded"
                  required
                />
                {links.length > 1 && (
                  <button type="button" onClick={() => removeLink(idx)} className="text-red-500 px-2">✕</button>
                )}
              </div>
            ))}
            {links.length < 3 && (
              <button type="button" onClick={addLink} className="mt-1 text-blue-600 hover:underline text-sm">+ Add another link</button>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL (optional)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter image URL"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
