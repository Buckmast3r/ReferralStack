import React, { useEffect, useState } from 'react';
import { supabase } from '../utils/supabaseClient';
import ReferralCard from '../referralstack_components/ReferralCard';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import EditReferralModal from './EditReferralModal';

export default function ReferralGrid() {
  const { user } = useAuth();
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editReferral, setEditReferral] = useState(null);
  const [deleteReferralId, setDeleteReferralId] = useState(null);

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
        .select('*')
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

  // Handler for deleting a referral
  async function handleDeleteReferral(id) {
    if (!window.confirm('Are you sure you want to delete this referral card?')) return;
    const { error } = await supabase.from('referrals').delete().eq('id', id);
    if (error) {
      toast.error('Failed to delete card');
    } else {
      setReferrals(referrals.filter(r => r.id !== id));
      toast.success('Referral card deleted');
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
    <div className="relative min-h-screen pb-20">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-4 sm:px-6">
        {referrals.length > 0 ? (
          referrals.map((referral) => (
            <div key={referral.id} className="flex flex-col gap-2">
              <ReferralCard referral={referral} />
              <div className="flex gap-2">
                <button
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  onClick={() => setEditReferral(referral)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  onClick={() => handleDeleteReferral(referral.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-600">No referrals found. Start adding some to build your stack!</p>
          </div>
        )}
      </div>

      {/* Sticky Add Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          to="/add-referral"
          className="inline-flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
        >
          <svg
            className="w-6 h-6 sm:w-8 sm:h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            />
          </svg>
        </Link>
      </div>
      {/* TODO: Edit modal will go here, using editReferral state */}
      {editReferral && (
        <EditReferralModal
          referral={editReferral}
          onClose={() => setEditReferral(null)}
          onUpdated={() => {
            setEditReferral(null);
            fetchReferrals();
          }}
        />
      )}
    </div>
  );
}
