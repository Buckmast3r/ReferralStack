import React from 'react';
import { useAuth } from '../context/AuthContext';


const Home = () => {
    const { user } = useAuth();

    return (
        <div>
            <h1>Welcome to ReferralStack</h1>
            {user ? (
                <p>Welcome, {user.email}! Here is your referral stack.</p>
            ) : (
                <p>Please log in to see your referral stack.</p>
            )}
        </div>
    );
};

export default Home;
