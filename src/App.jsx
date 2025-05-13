import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SubscriptionProvider } from './context/SubscriptionContext';
// import Home from './pages/Home'; // Removed unused import for Home
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Pricing from './pages/Pricing';
import PublicReferralCard from './pages/PublicReferralCard';
import Navbar from './components/Navbar';
import Profile from './pages/Profile';
import Footer from './components/Footer';
import Contact from './pages/Contact';
import Dashboard from './pages/Dashboard';
// import Onboarding from './components/Onboarding'; // Removed Onboarding import
import ReferralCard from './referralstack_components/ReferralCard';
import Analytics from './pages/Analytics';
import Monitoring from './pages/Monitoring';
import AddReferralForm from './referralstack_components/AddReferralForm';

// Protected Feature component (for features that require auth)
const ProtectedFeature = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

const PrivateRoute = ({ children }) => {
  const { user, loading, profile } = useAuth(); // Cleaned up profile destructuring

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  // Removed redirection to onboarding if profile is not set up
  // if (!profile?.username) {
  //   return <Navigate to="/onboarding" />;
  // }

  return children;
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <SubscriptionProvider>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/card/:cardId" element={<PublicReferralCard />} />

                {/* Protected Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <PrivateRoute>
                      <Dashboard />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/profile"
                  element={
                    <PrivateRoute>
                      <Profile />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/create"
                  element={
                    <PrivateRoute>
                      <AddReferralForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/edit/:id"
                  element={
                    <PrivateRoute>
                      <AddReferralForm />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/analytics"
                  element={
                    <PrivateRoute>
                      <Analytics />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/monitoring"
                  element={
                    <PrivateRoute>
                      <Monitoring />
                    </PrivateRoute>
                  }
                />
                {/* Removed Onboarding Route */}
                {/* <Route
                  path="/onboarding"
                  element={
                    <PrivateRoute>
                      <Onboarding />
                    </PrivateRoute>
                  }
                /> */}

                {/* Catch all route */}
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
            <ToastContainer position="bottom-right" />
          </div>
        </SubscriptionProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
