import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ReferralGrid from '../components/ReferralGrid';
import AddReferralModal from '../components/AddReferralModal';

const Home = () => {
    const { user } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleReferralAdded = () => {
        setRefreshKey((prevKey) => prevKey + 1); // Trigger a refresh of the ReferralGrid
    };

    return (
        <div className="max-w-6xl mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Welcome to ReferralStack</h1>
            {user ? (
                <>
                    <p className="mb-4">Welcome, {user.email}! Here is your referral stack:</p>
                    <AddReferralModal onAdded={handleReferralAdded} />
                    <ReferralGrid key={refreshKey} />
                </>
            ) : (
                <p>Please log in to see your referral stack.</p>
            )}
        </div>
    );
};

export default Home;