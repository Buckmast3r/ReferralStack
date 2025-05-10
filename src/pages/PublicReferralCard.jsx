import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import ReferralCard from '../referralstack_components/ReferralCard';

export default function PublicReferralCard() {
  const { cardId } = useParams();
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchReferral() {
      setLoading(true);
      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('id', cardId)
        .single();
      if (error || !data) {
        setNotFound(true);
      } else {
        setReferral(data);
      }
      setLoading(false);
    }
    fetchReferral();
  }, [cardId]);

  if (loading) return <div className="text-center py-12">Loading...</div>;
  if (notFound) return <div className="text-center py-12 text-red-500">Referral card not found.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div>
        <ReferralCard referral={referral} />
      </div>
    </div>
  );
}