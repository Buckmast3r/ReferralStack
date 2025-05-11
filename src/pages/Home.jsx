import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabaseClient';
import Button from '../components/Button';
import ReferralGrid from '../components/ReferralGrid';

export default function Home() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [referralCards, setReferralCards] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [stats, setStats] = useState({
        totalViews: 0,
        totalClicks: 0,
        activeCards: 0
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        fetchUserData();
    }, [user, isAuthenticated, navigate]);

    const fetchUserData = async () => {
        try {
            setLoading(true);
            setError(null);
            
            if (!user?.id) {
                console.error('No user ID available');
                return;
            }

            // Fetch user's referral cards
            const { data: cards, error: cardsError } = await supabase
                .from('referrals')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (cardsError) {
                console.error('Error fetching cards:', cardsError);
                throw cardsError;
            }
            
            console.log('Fetched cards:', cards); // Debug log
            setReferralCards(cards || []);
            
            // Calculate stats
            const totalViews = cards?.reduce((sum, card) => sum + (card.views || 0), 0) || 0;
            const totalClicks = cards?.reduce((sum, card) => sum + (card.clicks || 0), 0) || 0;
            
            setStats({
                totalViews,
                totalClicks,
                activeCards: cards?.length || 0
            });
            
        } catch (error) {
            console.error('Error in fetchUserData:', error);
            setError('Failed to load your data. Please try refreshing the page.');
        } finally {
            setLoading(false);
        }
    };

    const handleAddCard = () => {
        setShowAddModal(true);
    };

    const handleModalClose = () => {
        setShowAddModal(false);
        fetchUserData(); // Refresh data after modal closes
    };

    if (!isAuthenticated) {
        return null; // Will redirect in useEffect
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <button 
                        onClick={fetchUserData}
                        className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 font-semibold py-2 px-4 rounded"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
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
                    <p className="text-3xl font-bold">{stats.totalViews}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Total Clicks</h3>
                    <p className="text-3xl font-bold">{stats.totalClicks}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Active Cards</h3>
                    <p className="text-3xl font-bold">{stats.activeCards}</p>
                </div>
            </div>

            {/* Actions Section */}
            <div className="mb-8">
                <Button 
                    onClick={handleAddCard}
                    className="bg-blue-600 hover:bg-blue-700"
                >
                    Create New Referral Card
                </Button>
            </div>

            {/* Referral Cards Section */}
            <div>
                <h2 className="text-2xl font-bold mb-4">Your Referral Cards</h2>
                {referralCards.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600 mb-4">You haven't created any referral cards yet.</p>
                        <Button 
                            onClick={handleAddCard}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            Create Your First Card
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {referralCards.map((card) => (
                            <div key={card.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                                <h3 className="text-xl font-bold mb-2">{card.title}</h3>
                                <p className="text-gray-600 mb-4">{card.description}</p>
                                <div className="flex justify-between items-center text-sm text-gray-500">
                                    <span>Views: {card.views || 0}</span>
                                    <span>Clicks: {card.clicks || 0}</span>
                                </div>
                                <div className="mt-4 flex gap-2">
                                    <Button className="text-sm">Edit</Button>
                                    <Button className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800">Share</Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}