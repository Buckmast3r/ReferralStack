import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user || null);
        setIsAuthenticated(!!session?.user);

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
            setIsAuthenticated(!!session?.user);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const { user, error } = await supabase.auth.signIn({ email, password });
            if (error) throw error;
            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Login error:', error.message);
        }
    };

    const register = async (email, password) => {
        try {
            const { user, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            setUser(user);
            setIsAuthenticated(true);
        } catch (error) {
            console.error('Registration error:', error.message);
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
            setIsAuthenticated(false);
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    const value = {
        user,
        isAuthenticated,
        login,
        register,
        logout
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
