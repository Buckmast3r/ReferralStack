import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../utils/supabaseClient';
import { trackClick } from '../utils/analyticsService';
import ReferralCard from '../referralstack_components/ReferralCard';

const PublicReferralCard = () => {
  const { cardId } = useParams();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const { data, error } = await supabase
          .from('referrals')
          .select('*')
          .eq('id', cardId)
          .single();
        if (error) throw error;
        setCard(data);
      } catch (err) {
        setError('Failed to load referral card.');
      } finally {
        setLoading(false);
      }
    };
    fetchCard();
  }, [cardId]);

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
      <div className="text-red-500 text-center">
        <p className="text-xl font-semibold mb-2">{error}</p>
        <p className="text-sm text-gray-600">Please try again later.</p>
      </div>
    </div>
  );

  if (!card) return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <p className="text-xl font-semibold mb-2">Card not found</p>
        <p className="text-sm text-gray-600">The referral card you're looking for doesn't exist.</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-16">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 dark:text-slate-50 relative inline-block">
            Referral Stack
            <span className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-3/4 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full animate-pulse"></span>
          </h1>
          <p className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Organize and share your favorite referral and affiliate links in one place. Help others discover great
            products while earning rewards.
          </p>
        </header>

        <div className="max-w-4xl mx-auto">
          <ReferralCard referral={card} />
        </div>
      </div>
    </div>
  );
};

export default PublicReferralCard;