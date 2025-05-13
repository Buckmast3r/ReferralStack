import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Button from '../components/Button';
import { ToastContainer, toast } from 'react-toastify';
import { supabase } from '../utils/supabaseClient';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const { login } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [notConfirmed, setNotConfirmed] = useState(false);
    const [resending, setResending] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setNotConfirmed(false);
        try {
            const { success, error } = await login(email, password);

            if (!success) {
                // Check for email not confirmed error
                if (
                  error &&
                  (error.toLowerCase().includes('confirm') ||
                   error.toLowerCase().includes('not confirmed'))
                ) {
                  setNotConfirmed(true);
                  toast.error('Please confirm your email before logging in.');
                } else {
                  toast.error(error || 'Failed to login. Please try again.');
                }
                setLoading(false);
                return;
            }

            toast.success('Successfully logged in!');
            navigate('/home');
        } catch (err) {
            toast.error('Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        try {
            // Supabase v2: send a magic link as a workaround for resending confirmation
            const { error } = await supabase.auth.resend({
                type: 'signup',
                email,
            });
            if (error) {
                toast.error('Failed to resend confirmation email.');
            } else {
                toast.success('Confirmation email resent! Please check your inbox.');
            }
        } catch (err) {
            toast.error('Failed to resend confirmation email.');
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <ToastContainer />
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {notConfirmed && (
                        <div className="flex flex-col items-center">
                            <div className="text-yellow-700 bg-yellow-100 border border-yellow-300 rounded p-2 text-center text-sm mb-2 w-full">
                                Please check your email and confirm your account before logging in.
                            </div>
                            <Button
                                type="button"
                                onClick={handleResend}
                                disabled={resending || !email}
                                className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600"
                            >
                                {resending ? "Resending..." : "Resend Confirmation Email"}
                            </Button>
                        </div>
                    )}

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center"
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </div>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                    </div>
                </form>
                <div className="text-sm text-center">
                    <p className="text-gray-600">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Create new account
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
