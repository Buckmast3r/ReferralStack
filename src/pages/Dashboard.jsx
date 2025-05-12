import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalLinks: 0,
    averageClicks: 0
  });

  useEffect(() => {
    const fetchReferrals = async () => {
      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('user_id', user.id);
        if (error) throw error;
        setReferrals(data || []);

        // Calculate stats
        const totalClicks = data.reduce((sum, ref) => sum + (ref.clicks || 0), 0);
        const totalLinks = data.reduce((sum, ref) => sum + (ref.links?.length || 0), 0);
        setStats({
          totalClicks,
          totalLinks,
          averageClicks: totalLinks > 0 ? (totalClicks / totalLinks).toFixed(1) : 0
        });
      } catch (err) {
        setError('Failed to load referrals.');
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [user]);

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link
          to="/create"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create New Referral
        </Link>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Clicks</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalClicks}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Links</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalLinks}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-600 mb-2">Average Clicks per Link</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.averageClicks}</p>
        </div>
      </div>

      {/* Referrals List */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Your Referrals</h2>
        {referrals.length === 0 ? (
          <p className="text-gray-600">No referrals found. Start adding some!</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Links</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {referrals.map((referral) => (
                  <tr key={referral.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{referral.title}</div>
                      <div className="text-sm text-gray-500">{referral.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{referral.links?.length || 0} links</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{referral.clicks || 0} clicks</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(referral.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/edit/${referral.id}`}
                        className="text-blue-600 hover:text-blue-900 mr-4"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/card/${referral.id}`}
                        className="text-green-600 hover:text-green-900"
                        target="_blank"
                      >
                        Preview
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 