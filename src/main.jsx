import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Pricing from './pages/Pricing';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { AuthProvider } from './context/AuthContext';
import { ReferralProvider } from './context/ReferralContext';
import GuestLayout from './layouts/GuestLayout';
import AuthenticatedLayout from './layouts/AuthenticatedLayout';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ReferralProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<GuestLayout><Home /></GuestLayout>} />
            <Route path="/login" element={<GuestLayout><Login /></GuestLayout>} />
            <Route path="/register" element={<GuestLayout><Register /></GuestLayout>} />
            <Route path="/pricing" element={<GuestLayout><Pricing /></GuestLayout>} />
            <Route path="/terms" element={<GuestLayout><Terms /></GuestLayout>} />
            <Route path="/privacy" element={<GuestLayout><Privacy /></GuestLayout>} />
          </Routes>
        </BrowserRouter>
      </ReferralProvider>
    </AuthProvider>
  </React.StrictMode>
);
