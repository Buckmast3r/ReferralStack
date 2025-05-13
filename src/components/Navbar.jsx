import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
      <Link to="/home" className="text-2xl font-bold text-blue-700 tracking-tight hover:text-blue-900 transition-colors">RefStack.me</Link>
      {isAuthenticated && user ? (
        <div className="flex items-center space-x-4">
          <Link
            to="/pricing"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Pricing"
          >
            Pricing
          </Link>
          <Link
            to="/dashboard"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="My Referrals"
          >
            My Referrals
          </Link>
          <Link
            to="/profile"
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Profile"
          >
            Profile
          </Link>
          <button
            onClick={handleSignOut}
            className="text-gray-300 hover:text-white transition-colors"
            aria-label="Sign Out"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-4">
          <Link
            to="/login"
            className="text-gray-700 hover:text-blue-700 transition-colors px-3 py-2 rounded-md text-sm font-medium"
            aria-label="Login"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
            aria-label="Sign Up"
          >
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
