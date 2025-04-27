import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function AddReferralModal({ onAdded }) {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');

  async function handleAddReferral(e) {
    e.preventDefault();
    if (!title || !url) {
      setError('Title and URL are required.');
      return;
    }

    const { error: insertError } = await supabase
      .from('referrals')
      .insert([
        {
          user_id: user.id,
          title,
          url,
          image_url: imageUrl || null,
        },
      ]);

    if (insertError) {
      console.error('Error adding referral:', insertError.message);
      setError(insertError.message);
    } else {
      setIsOpen(false);
      setTitle('');
      setUrl('');
      setImageUrl('');
      setError('');
      if (onAdded) onAdded(); // Refresh the referral list
    }
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(true)}
        className="btn btn-primary"
      >
        Add New Referral
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-8 w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-6">Add New Referral</h2>
            <form onSubmit={handleAddReferral} className="space-y-4">
              <div>
                <label>Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label>URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label>Image URL (optional)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex justify-between mt-6">
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
