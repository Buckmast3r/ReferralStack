import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUserProfile = async (userId) => {
        if (!userId) {
            setUserProfile(null);
            return;
        }
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) {
                if (error.code === 'PGRST116') { // Specifically handle "No rows found"
                    // console.log('No profile found for user, needs to be created.');
                    setUserProfile(null); // Or an empty object: setUserProfile({});
                } else {
                    console.warn('Error fetching user profile:', error.message);
                    setUserProfile(null); 
                }
            } else {
                setUserProfile(data || null);
            }
        } catch (err) {
            console.error('Unexpected error fetching user profile:', err);
            setUserProfile(null);
        }
    };

    useEffect(() => {
        const checkSessionAndProfile = async () => {
            setLoading(true);
            try {
                const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                if (sessionError) throw sessionError;
                
                const currentUser = session?.user || null;
                setUser(currentUser);
                setIsAuthenticated(!!currentUser);
                if (currentUser) {
                    await fetchUserProfile(currentUser.id);
                } else {
                    setUserProfile(null);
                }
            } catch (error) {
                console.error('Error checking session:', error.message);
                setUser(null);
                setIsAuthenticated(false);
                setUserProfile(null);
            } finally {
                setLoading(false);
            }
        };

        checkSessionAndProfile();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            setLoading(true);
            const currentUser = session?.user || null;
            setUser(currentUser);
            setIsAuthenticated(!!currentUser);
            if (currentUser) {
                await fetchUserProfile(currentUser.id);
            } else {
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => {
            subscription?.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            setUser(data.user);
            setIsAuthenticated(true);
            if (data.user) {
                await fetchUserProfile(data.user.id);
            }
            setLoading(false);
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Login error:', error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    const register = async (email, password) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            setUser(data.user);
            setIsAuthenticated(true);
            if (data.user) {
                await fetchUserProfile(data.user.id);
            }
            setLoading(false);
            return { success: true, user: data.user };
        } catch (error) {
            console.error('Registration error:', error.message);
            setLoading(false);
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
        } catch (error) {
            console.error('Logout error:', error.message);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
            setUserProfile(null);
            setLoading(false);
        }
    };

    // Function to manually refresh the user profile data
    const refreshUserProfile = async () => {
        if (user?.id) {
            setLoading(true); // Optionally set loading state for UI feedback
            await fetchUserProfile(user.id);
            setLoading(false);
        } else {
            // console.warn("refreshUserProfile called without a user.");
            // No user to refresh, or user logged out, profile should be null via onAuthStateChange
        }
    };

    const value = {
        user,
        userProfile,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshUserProfile // Expose the refresh function
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
