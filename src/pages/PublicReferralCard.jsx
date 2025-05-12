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

  const handleClick = async (linkId) => {
    await trackClick(linkId);
    window.open(card.links.find(link => link.id === linkId).url, '_blank');
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!card) return <div className="text-center py-8">Card not found.</div>;

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-4">{card.title}</h1>
      <p className="text-gray-600 mb-8">{card.description}</p>
      <div className="space-y-4">
        {card.links.map((link) => (
          <button
            key={link.id}
            onClick={() => handleClick(link.id)}
            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {link.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PublicReferralCard;