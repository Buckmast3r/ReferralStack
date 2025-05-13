import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { startCheckout } from '../utils/stripeService';
import { Link } from 'react-router-dom';
import { Copy } from 'lucide-react';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({
    username: '',
    full_name: '',
    avatar_url: '',
    bio: '',
    twitter_url: '',
    custom_slug: '',
    payment_status: 'free'
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setProfile(data || {});
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    }
    if (user?.id) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const updates = {
        username: profile.username,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        bio: profile.bio,
        twitter_url: profile.twitter_url,
      };
      if (profile.payment_status === 'paid') {
        updates.custom_slug = profile.custom_slug;
      }

      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) throw error;
      setSuccess('Profile updated!');
    } catch (err) {
      setError('Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleUpgrade = async () => {
    setUpgradeLoading(true);
    try {
      await startCheckout();
    } catch (err) {
      alert('Failed to start checkout. Please try again.');
    } finally {
      setUpgradeLoading(false);
    }
  };

  const handleCopyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setSuccess('Link copied to clipboard!');
      setTimeout(() => setSuccess(null), 3000);
    }).catch(err => {
      setError('Failed to copy link.');
      setTimeout(() => setError(null), 3000);
    });
  };

  if (loading) return <div className="text-center py-12">Loading...</div>;

  const publicPageUrl = profile.custom_slug 
    ? `https://refstack.me/${profile.custom_slug}` 
    : `https://refstack.me/user/${profile.username}`;
  
  const isProUser = profile.payment_status === 'paid';

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Your Profile</h1>
      
      {profile.avatar_url && (
        <div className="flex justify-center mb-6">
          <img src={profile.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-lg"/>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" value={user.email} readOnly className="w-full px-3 py-2 border border-gray-200 rounded bg-gray-50" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
          <input name="username" value={profile.username || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
          <input name="full_name" value={profile.full_name || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
          <input name="avatar_url" value={profile.avatar_url || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="https://example.com/avatar.png" />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Short Bio</label>
          <textarea id="bio" name="bio" value={profile.bio || ''} onChange={handleChange} rows="3" className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Tell us a little about yourself..."></textarea>
        </div>
        <div>
          <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-700 mb-1">Twitter Profile URL</label>
          <input id="twitter_url" type="url" name="twitter_url" value={profile.twitter_url || ''} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="https://twitter.com/yourhandle" />
        </div>
        <div>
          <label htmlFor="custom_slug" className={`block text-sm font-medium mb-1 ${isProUser ? 'text-gray-700' : 'text-gray-400'}`}>
            Custom URL Slug { !isProUser && '(Pro feature)'}
          </label>
          <input 
            id="custom_slug" 
            name="custom_slug" 
            value={profile.custom_slug || ''} 
            onChange={handleChange} 
            className={`w-full px-4 py-2 border rounded-md shadow-sm ${isProUser ? 'border-gray-300 focus:ring-blue-500 focus:border-blue-500' : 'border-gray-200 bg-gray-100 cursor-not-allowed'}`} 
            placeholder="your-unique-slug" 
            disabled={!isProUser} 
          />
          {!isProUser && <p className="text-xs text-gray-400 mt-1">Upgrade to Pro to set a custom URL slug.</p>}
           <p className="text-xs text-gray-500 mt-1">Your public page: <a href={publicPageUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{publicPageUrl}</a></p>
        </div>

        <div className="pt-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Your Public Page Link</label>
            <div className="flex items-center space-x-2">
                <input 
                    type="text" 
                    value={publicPageUrl} 
                    readOnly 
                    className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-700 shadow-sm"
                />
                <button 
                    type="button" 
                    onClick={() => handleCopyToClipboard(publicPageUrl)}
                    className="p-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition ease-in-out duration-150"
                    title="Copy to clipboard"
                >
                    <Copy size={20} />
                </button>
            </div>
             <p className="text-xs text-gray-500 mt-1">Share this link to your public profile.</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Payment Status</label>
          <div className="px-3 py-2 border border-gray-200 rounded bg-gray-50 text-gray-500 flex items-center gap-4">
            {profile.payment_status === 'paid' ? 'Paid' : 'Free'}
            {profile.payment_status === 'free' && (
              <button
                type="button"
                onClick={handleUpgrade}
                className="ml-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
                disabled={upgradeLoading}
              >
                {upgradeLoading ? 'Redirecting...' : 'Upgrade'}
              </button>
            )}
          </div>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <div className="flex justify-end">
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  );
} 