"use client";
import { createContext, useContext, useEffect, useState, memo } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Define the context shape
const AuthContext = createContext({
    user: null,
    loading: true,
    error: null
});

export const AuthProvider = memo(function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth,
            (user) => {
                setUser(user);
                setLoading(false);
                setError(null);
            },
            (error) => {
                console.error('Auth state change error:', error);
                setError(error.message);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, error }}>
            {!loading && children}
        </AuthContext.Provider>
    );
});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};