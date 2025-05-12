import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import ReferralGrid from '../components/ReferralGrid';
import { supabase } from '../utils/supabaseClient';

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

    return (
        <div className="max-w-7xl mx-auto p-6">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.email?.split('@')[0] || 'User'}!</h1>
                <p className="text-gray-600">Manage your referral cards and track your performance.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Views</h3>
                    <p className="text-3xl font-bold">
                        {statsLoading ? '...' : stats.totalViews}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Clicks</h3>
                    <p className="text-3xl font-bold">
                        {statsLoading ? '...' : stats.totalClicks}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Cards</h3>
                    <p className="text-3xl font-bold">
                        {statsLoading ? '...' : stats.activeCards}
                    </p>
                </div>
            </div>
            {statsError && <div className="text-red-600 mb-4">{statsError}</div>}

            {/* Referral Cards Section */}
            <ReferralGrid />
        </div>
    );
}