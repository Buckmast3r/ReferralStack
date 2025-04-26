import React, { createContext, useState } from 'react';

const ReferralContext = createContext();

export const ReferralProvider = ({ children }) => {
    const [referrals, setReferrals] = useState([]);

    const addReferral = (referral) => {
        setReferrals((prev) => [...prev, referral]);
    };

    const clearReferrals = () => {
        setReferrals([]);
    };

    return (
        <ReferralContext.Provider value={{ referrals, addReferral, clearReferrals }}>
            {children}
        </ReferralContext.Provider>
    );
};

export default ReferralContext;
