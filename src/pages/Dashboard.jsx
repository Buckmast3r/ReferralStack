import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';
import { MousePointerClick, Layers3, PlusCircle } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalClicks: 0,
    totalReferralCards: 0,
    averageClicksPerCard: 0,
  });

  useEffect(() => {
    if (!user?.id) {
        setLoading(false);
        return;
    }

    const fetchReferrals = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error: fetchError } = await supabase
          .from('referrals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (fetchError) throw fetchError;

        const fetchedReferrals = data || [];
        setReferrals(fetchedReferrals);

        const totalClicks = fetchedReferrals.reduce((sum, ref) => sum + (ref.clicks || 0), 0);
        const totalReferralCards = fetchedReferrals.length;

        setStats({
          totalClicks,
          totalReferralCards,
          averageClicksPerCard: totalReferralCards > 0 ? (totalClicks / totalReferralCards).toFixed(1) : 0,
        });
      } catch (err) {
        console.error('Error fetching referrals:', err);
        setError('Failed to load your referrals. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };
    fetchReferrals();
  }, [user]);

  const username = user?.username || user?.email?.split('@')[0] || 'User';
  const plan = user?.plan || 'free';

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="text-lg font-medium text-slate-600 dark:text-slate-400">Loading dashboard...</div></div>;
  if (error && referrals.length === 0) return <div className="text-center py-10 text-red-500">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      {/* Welcome Header */}
      <div className="mb-10 p-6 bg-white dark:bg-slate-800 shadow-lg rounded-xl animate-fade-in">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
            <div>
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                👋 Welcome back, {username}!
                {plan === 'pro' && (
                    <span className="text-xs font-semibold bg-green-100 dark:bg-green-700 dark:text-green-100 text-green-700 px-2.5 py-1 rounded-full">PRO</span>
                )}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1.5">
                Here's an overview of your referral activity.
                </p>
            </div>
            <Link
                to="/create"
                className="mt-4 sm:mt-0 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 text-sm flex items-center gap-2"
            >
                <PlusCircle size={18}/>
                Add New Card
            </Link>
        </div>
      </div>
      
      {error && <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <StatCard icon={<MousePointerClick />} label="Total Clicks" value={stats.totalClicks} />
        <StatCard icon={<Layers3 />} label="Total Referral Cards" value={stats.totalReferralCards} />
        <StatCard icon={<MousePointerClick />} label="Avg. Clicks / Card" value={stats.averageClicksPerCard} />
      </div>

      {/* Referrals Table */}
      <div className="bg-white dark:bg-slate-800 shadow-xl rounded-lg overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-white">Your Referral Cards</h2>
        </div>
        {referrals.length === 0 && !loading ? (
          <div className="text-center py-16">
            <Layers3 className="w-20 h-20 text-slate-300 dark:text-slate-600 mx-auto mb-5" />
            <p className="text-slate-700 dark:text-slate-300 text-xl font-medium mb-2">No referral cards found.</p>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Get started by creating your first referral card.</p>
            <Link
                to="/create"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150 text-sm flex items-center gap-2 mx-auto max-w-xs justify-center"
            >
                <PlusCircle size={18}/>
                Create First Card
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Links Inside</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Clicks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 dark:text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-200 dark:divide-slate-700">
                {referrals.map((referral) => (
                  <tr key={referral.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/40 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900 dark:text-white">{referral.title || 'Untitled Card'}</div>
                      {referral.description && <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{referral.description}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-slate-600 dark:text-slate-300">
                      {referral.links?.length || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-medium text-slate-800 dark:text-slate-200">
                      {referral.clicks || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600 dark:text-slate-300">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      {/* <Link to={`/card/${referral.id}`} className="text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition-colors duration-150" target="_blank" rel="noopener noreferrer">
                        Preview
                      </Link> */}
                      <Link to={`/edit/${referral.id}`} className="text-blue-600 hover:text-blue-700 dark:text-blue-500 dark:hover:text-blue-400 transition-colors duration-150">
                        Edit
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

function StatCard({ icon, label, value }) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-in-out">
      <div className="flex items-center mb-3">
        <div className="p-2.5 bg-blue-100 dark:bg-blue-500/20 rounded-lg mr-4 text-blue-600 dark:text-blue-400">
            {React.cloneElement(icon, { size: 22 })}
        </div>
        <div>
            <div className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</div>
            <div className="text-2xl sm:text-3xl font-bold text-slate-800 dark:text-white">{value}</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
