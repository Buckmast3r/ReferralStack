import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ReferralGrid from '../components/ReferralGrid';
import { supabase } from '../utils/supabaseClient';
import { Link } from 'react-router-dom';

export default function Home() {
    const { user, isAuthenticated } = useAuth();
    const [stats, setStats] = useState({ totalViews: 0, totalClicks: 0, activeCards: 0 });
    const [statsLoading, setStatsLoading] = useState(true);
    const [statsError, setStatsError] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) return;
        async function fetchStats() {
            setStatsLoading(true);
            setStatsError(null);
            try {
                const { data: cards, error } = await supabase
                    .from('referrals')
                    .select('*')
                    .eq('user_id', user.id);
                if (error) throw error;
                const totalViews = cards?.reduce((sum, card) => sum + (card.views || 0), 0) || 0;
                const totalClicks = cards?.reduce((sum, card) => sum + (card.clicks || 0), 0) || 0;
                setStats({
                    totalViews,
                    totalClicks,
                    activeCards: cards?.length || 0
                });
            } catch (err) {
                setStatsError('Failed to load stats.');
            } finally {
                setStatsLoading(false);
            }
        }
        fetchStats();
    }, [user, isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    // Placeholder for user plan - replace with actual logic
    const userPlan = 'Pro'; // or 'Free'

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Welcome Section */}
            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center mb-2">
                    <span className="text-3xl mr-3">👋</span>
                    <h1 className="text-3xl font-bold">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h1>
                    <span className={`ml-3 px-2 py-0.5 rounded-full text-sm font-semibold ${userPlan === 'Pro' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                        {userPlan}
                    </span>
                </div>
                <p className="text-gray-600 mb-4">Manage your referral cards and track your performance.</p>
                <Link to="/add-referral" className="text-blue-600 hover:text-blue-800 font-semibold">
                    Let's add your next card →
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:scale-105 transition-transform duration-200 ease-in-out">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-600">Total Views</h3>
                        <span className="text-2xl">👁️</span>
                    </div>
                    <p className="text-3xl font-bold">
                        {statsLoading ? '...' : stats.totalViews}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:scale-105 transition-transform duration-200 ease-in-out">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-600">Total Clicks</h3>
                        <span className="text-2xl">🖱️</span>
                    </div>
                    <p className="text-3xl font-bold">
                        {statsLoading ? '...' : stats.totalClicks}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:scale-105 transition-transform duration-200 ease-in-out">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-600">Active Cards</h3>
                        <span className="text-2xl">🃏</span>
                    </div>
                    <p className="text-3xl font-bold">
                        {statsLoading ? '...' : stats.activeCards}
                    </p>
                </div>
            </div>
            {statsError && <div className="text-red-600 mb-4">{statsError}</div>}

            {/* Referral Card Preview Section - Placeholder */}
            {/* 
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Your Latest Card</h2>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    // Add your ReferralCard component here
                    // e.g., <ReferralCard data={latestCardData} /> 
                    <p>Referral Card Preview will be here.</p>
                </div>
            </div>
            */}

            {/* Referral Cards Grid Section */}
            <ReferralGrid />
        </div>
    );
}