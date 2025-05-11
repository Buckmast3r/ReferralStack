import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';

export default function ReferralModal({ mode = 'add', initialData = {}, onClose, onSuccess, userId }) {
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [links, setLinks] = useState(Array.isArray(initialData.links) && initialData.links.length > 0 ? initialData.links : [{ label: '', url: '' }]);
  const [imageUrl, setImageUrl] = useState(initialData.image_url || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setLinks(Array.isArray(initialData.links) && initialData.links.length > 0 ? initialData.links : [{ label: '', url: '' }]);
      setImageUrl(initialData.image_url || '');
    }
  }, [mode, initialData]);

  const handleLinkChange = (idx, field, value) => {
    setLinks((prev) => prev.map((link, i) => i === idx ? { ...link, [field]: value } : link));
  };

  const addLink = () => {
    if (links.length < 3) setLinks([...links, { label: '', url: '' }]);
  };

  const removeLink = (idx) => {
    if (links.length > 1) setLinks(links.filter((_, i) => i !== idx));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title) {
      setError('Title is required.');
      return;
    }
    if (links.length === 0 || links.some(link => !link.label || !link.url)) {
      setError('Each link must have a label and a URL.');
      return;
    }
    setLoading(true);
    try {
      if (mode === 'add') {
        // Generate a unique id for new card
        const id = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        const { error: insertError } = await supabase
          .from('referrals')
          .insert([
            {
              id,
              user_id: userId,
              title,
              description,
              links,
              image_url: imageUrl || null,
              created_at: new Date().toISOString(),
            },
          ]);
        if (insertError) throw insertError;
        toast.success('Referral card created!');
      } else {
        const { error: updateError } = await supabase
          .from('referrals')
          .update({
            title,
            description,
            links,
            image_url: imageUrl || null,
          })
          .eq('id', initialData.id);
        if (updateError) throw updateError;
        toast.success('Referral card updated!');
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save referral.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <h2 className="text-2xl font-bold mb-6 text-gray-900">{mode === 'add' ? 'Create Referral Card' : 'Edit Referral Card'}</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter referral card title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-lg"
                  required
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={e => handleLinkChange(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-lg"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter image URL"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
            >
              {loading ? (mode === 'add' ? 'Creating...' : 'Updating...') : (mode === 'add' ? 'Create' : 'Update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 