import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../utils/supabaseClient';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { checkLinkLimit } from '../utils/analyticsService';

function isValidUrl(url) {
  try {
    // Simple URL validation
    const pattern = new RegExp('^(https?:\/\/)?'+ // protocol
      '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
      '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
      '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
      '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
      '(\#[-a-z\d_]*)?$','i'); // fragment locator
    return !!pattern.test(url);
  } catch {
    return false;
  }
}

export default function ReferralModal({ mode = 'add', initialData = {}, onClose, onSuccess, userId }) {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData.title || '');
  const [description, setDescription] = useState(initialData.description || '');
  const [links, setLinks] = useState(Array.isArray(initialData.links) && initialData.links.length > 0 ? initialData.links : [{ label: '', url: '' }]);
  const [imageUrl, setImageUrl] = useState(initialData.image_url || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (mode === 'edit' && initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setLinks(Array.isArray(initialData.links) && initialData.links.length > 0 ? initialData.links : [{ label: '', url: '' }]);
      setImageUrl(initialData.image_url || '');
    }
    // Focus the modal for accessibility
    if (modalRef.current) {
      modalRef.current.focus();
    }
    // Esc key closes modal
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [mode, initialData, onClose]);

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
    setLoading(true);
    setError(null);

    try {
      // Check link limit for free users
      if (mode === 'add') {
        const canAddMore = await checkLinkLimit(user.id);
        if (!canAddMore) {
          setError('Free users are limited to 5 referral links. Please upgrade to Pro for unlimited links.');
          return;
        }
      }

      // Validate inputs
      if (!title.trim()) {
        setError('Title is required');
        return;
      }

      const validLinks = links.filter(link => link.label.trim() && link.url.trim());
      if (validLinks.length === 0) {
        setError('At least one link is required');
        return;
      }

      // Validate URLs
      const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
      const invalidUrls = validLinks.filter(link => !urlRegex.test(link.url));
      if (invalidUrls.length > 0) {
        setError('Please enter valid URLs for all links');
        return;
      }

      const referralData = {
        title,
        description,
        links: validLinks,
        user_id: userId,
        created_at: new Date().toISOString(),
        clicks: 0
      };

      if (mode === 'add') {
        const { error: insertError } = await supabase
          .from('referrals')
          .insert([referralData]);
        if (insertError) throw insertError;
        toast.success('Referral card created!');
      } else {
        const { error: updateError } = await supabase
          .from('referrals')
          .update(referralData)
          .eq('id', initialData.id);
        if (updateError) throw updateError;
        toast.success('Referral card updated!');
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to save referral.');
      toast.error('Failed to save referral');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div
        className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg relative outline-none"
        tabIndex={-1}
        ref={modalRef}
        aria-modal="true"
        role="dialog"
      >
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  aria-label={`Referral link label ${idx + 1}`}
                />
                <input
                  type="url"
                  value={link.url}
                  onChange={e => handleLinkChange(idx, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-2 py-1 border border-gray-300 rounded-lg"
                  required
                  aria-label={`Referral link URL ${idx + 1}`}
                />
                {links.length > 1 && (
                  <button type="button" onClick={() => removeLink(idx)} className="text-red-500 px-2" aria-label={`Remove link ${idx + 1}`}>✕</button>
                )}
              </div>
            ))}
            {links.length < 3 && (
              <button type="button" onClick={addLink} className="mt-1 text-blue-600 hover:underline text-sm" aria-label="Add another link">+ Add another link</button>
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
              aria-label="Image URL"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
              aria-label="Cancel"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={loading}
              aria-label={mode === 'add' ? 'Create referral card' : 'Update referral card'}
            >
              {loading ? (mode === 'add' ? 'Creating...' : 'Updating...') : (mode === 'add' ? 'Create' : 'Update')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 