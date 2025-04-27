import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ReferralGrid from '../components/ReferralGrid';
import AddReferralModal from '../components/AddReferralModal';

export default function Home() {
    const { user, isAuthenticated } = useAuth();
    const [refreshKey, setRefreshKey] = useState(0);

    const handleReferralAdded = () => {
        setRefreshKey((prevKey) => prevKey + 1); // Trigger a refresh of the ReferralGrid
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {isAuthenticated ? (
                    // Authenticated user view
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.email}</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Manage your referral links and track your progress.
                        </p>
                        <AddReferralModal onAdded={handleReferralAdded} />
                        <ReferralGrid key={refreshKey} />
                    </div>
                ) : (
                    // Non-authenticated user view
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900">Welcome to ReferralStack</h1>
                        <p className="mt-4 text-lg text-gray-600">
                            Sign in to manage your referral links and track your progress.
                        </p>
                        <div className="mt-8 flex justify-center space-x-4">
                            <Link
                                to="/login"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                            >
                                Sign In
                            </Link>
                            <Link
                                to="/register"
                                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}