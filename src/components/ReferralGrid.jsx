import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import ReferralCard from '../referralstack_components/ReferralCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

export default function ReferralGrid() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetchReferrals();
    } else {
      setReferrals([]);
      setLoading(false);
    }
  }, [user]);

  async function fetchReferrals() {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from('referrals')
        .select(`
          id,
          title,
          description,
          url,
          created_at,
          updated_at
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
      setError('Failed to load referrals. Please try again later.');
      toast.error('Failed to load referrals', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      });
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">Please log in to see your referral stack.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchReferrals}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {referrals.length > 0 ? (
        referrals.map((referral) => (
          <ReferralCard
            key={referral.id}
            referral={{
              app: referral.title,
              desc: referral.description,
              link: referral.url,
            }}
          />
        ))
      ) : (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-600">No referrals found. Start adding some to build your stack!</p>
        </div>
      )}
    </div>
  );
}
