import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { startCheckout } from '../utils/stripeService';

export default function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState({ username: '', full_name: '', avatar_url: '', custom_slug: '', payment_status: 'free' });
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
      const { error } = await supabase
        .from('profiles')
        .update({
          username: profile.username,
          full_name: profile.full_name,
          avatar_url: profile.avatar_url,
          custom_slug: profile.custom_slug,
        })
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

  if (loading) return <div className="text-center py-12">Loading...</div>;

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Your Profile</h1>
      <form onSubmit={handleSave} className="space-y-5">
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
          <input name="avatar_url" value={profile.avatar_url || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Custom URL Slug (Pro feature)</label>
          <input name="custom_slug" value={profile.custom_slug || ''} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded" placeholder="yourbrand" disabled />
          <div className="text-xs text-gray-400 mt-1">Coming soon: Set your custom referral URL (e.g. refstack.me/yourbrand)</div>
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