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
      <div className="flex items-center space-x-4">
        <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors" aria-label="Pricing">Pricing</Link>
        {isAuthenticated && user ? (
          <>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors" aria-label="Dashboard">My Stack</Link>
            <div className="relative">
              <button className="text-gray-300 hover:text-white transition-colors" aria-label="Account Menu">
                Account ▼
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">Settings</Link>
                <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Sign Out</button>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
}
