import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import ReferralCard from '../referralstack_components/ReferralCard';
import { useAuth } from '../context/AuthContext';

export default function ReferralGrid() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchReferrals();
    }
  }, [user]);

  async function fetchReferrals() {
    setLoading(true);
    const { data, error } = await supabase
      .from('referrals')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching referrals:', error.message);
    } else {
      setReferrals(data);
    }
    setLoading(false);
  }

  if (!user) {
    return <p>Please log in to see your referral stack.</p>;
  }

  if (loading) {
    return <p>Loading referrals...</p>;
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
        <p className="text-center col-span-full">No referrals added yet. Start stacking!</p>
      )}
    </div>
  );
}
