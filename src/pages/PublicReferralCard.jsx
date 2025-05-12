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
  const [clicked, setClicked] = useState(null);

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
    setClicked(linkId);
    await trackClick(linkId);
    const linkObj = card.links.find(link => link.id === linkId);
    if (linkObj) {
      window.open(linkObj.url, '_blank', 'noopener,noreferrer');
    }
    setTimeout(() => setClicked(null), 1000);
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!card) return <div className="text-center py-8">Card not found.</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-blue-50 to-gray-100">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-8">
          {/* Placeholder avatar/icon */}
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mb-4 shadow">
            <span className="text-4xl text-blue-500">🔗</span>
          </div>
          <h1 className="text-3xl font-extrabold mb-2 text-center">{card.title}</h1>
          <p className="text-gray-600 text-center mb-4">{card.description}</p>
        </div>
        <div className="space-y-4">
          {card.links && card.links.length > 0 ? (
            card.links.map((link) => (
              <button
                key={link.id}
                onClick={() => handleClick(link.id)}
                className={`block w-full px-6 py-3 rounded-lg font-semibold transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 shadow-sm
                  ${clicked === link.id ? 'bg-blue-300 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                rel="noopener noreferrer"
                aria-label={`Open referral link: ${link.label}`}
                disabled={clicked === link.id}
              >
                {clicked === link.id ? 'Opening...' : link.label}
              </button>
            ))
          ) : (
            <div className="text-gray-400 text-center">No referral links available.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PublicReferralCard;