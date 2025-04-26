import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const session = supabase.auth.session();
        setUser(session?.user || null);

        const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email, password) => {
        try {
            const { user, error } = await supabase.auth.signIn({ email, password });
            if (error) throw error;
            setUser(user);
        } catch (error) {
            console.error('Login error:', error.message);
        }
    };

    const register = async (email, password) => {
        try {
            const { user, error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            setUser(user);
        } catch (error) {
            console.error('Registration error:', error.message);
        }
    };

    const logout = async () => {
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
        } catch (error) {
            console.error('Logout error:', error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
