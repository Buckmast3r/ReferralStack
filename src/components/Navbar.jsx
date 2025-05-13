import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Navbar() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  console.log('Navbar - isAuthenticated:', isAuthenticated, 'User:', user);

  const handleSignOut = async () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <nav className="w-full bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
      <Link to="/dashboard" className="text-2xl font-bold text-blue-700 tracking-tight hover:text-blue-900 transition-colors">RefStack.me</Link>
      <div className="flex items-center space-x-4">
        <Link to="/pricing" className="text-gray-300 hover:text-white transition-colors" aria-label="Pricing">Pricing</Link>
        {isAuthenticated && user ? (
          <>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors" aria-label="Dashboard">Dashboard</Link>
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleDropdown}
                className="text-gray-300 hover:text-white transition-colors" 
                aria-label="Account Menu"
                aria-expanded={isDropdownOpen}
              >
                Account ▼
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                  <Link to="/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                  <Link to="/settings" className="block px-4 py-2 text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Settings</Link>
                  <button onClick={() => { handleSignOut(); setIsDropdownOpen(false); }} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">Sign Out</button>
                </div>
              )}
            </div>
          </>
        ) : null}
      </div>
    </nav>
  );
}
