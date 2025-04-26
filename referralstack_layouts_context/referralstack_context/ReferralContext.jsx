import { createContext, useContext, useState, useEffect } from 'react';
import { referralService } from '../services/referralService';

const ReferralContext = createContext();

export function ReferralProvider({ children }) {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    referralService.getReferrals().then((data) => {
      setReferrals(data);
      setLoading(false);
    });
  }, []);

  const addReferral = async (referral) => {
    const newReferral = await referralService.addReferral(referral);
    setReferrals((prev) => [...prev, newReferral]);
  };

  const deleteReferral = async (id) => {
    await referralService.deleteReferral(id);
    setReferrals((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <ReferralContext.Provider value={{ referrals, loading, addReferral, deleteReferral }}>
      {children}
    </ReferralContext.Provider>
  );
}

export function useReferralContext() {
  return useContext(ReferralContext);
}