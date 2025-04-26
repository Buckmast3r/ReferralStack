import { useState, useEffect } from 'react';
import { referralService } from '../services/referralService';

export function useReferrals() {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReferrals = async () => {
      const data = await referralService.getReferrals();
      setReferrals(data);
      setLoading(false);
    };
    loadReferrals();
  }, []);

  const addReferral = async (referral) => {
    const newReferral = await referralService.addReferral(referral);
    setReferrals((prev) => [...prev, newReferral]);
  };

  const deleteReferral = async (id) => {
    await referralService.deleteReferral(id);
    setReferrals((prev) => prev.filter(r => r.id !== id));
  };

  return { referrals, loading, addReferral, deleteReferral };
}