'use client';
import { createContext, useContext, useEffect, useState, memo } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Define the context shape
const AuthContext = createContext({
  user: null,
  userDoc: null,
  loading: true,
  error: null,
});

export const AuthProvider = memo(function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        setUser(user);
        setError(null);

        if (user) {
          try {
            const docRef = doc(db, 'users', user.uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
              setUserDoc({ id: docSnap.id, ...docSnap.data() });
            } else {
              console.warn('No user profile found in Firestore.');
              setUserDoc(null);
            }
          } catch (err) {
            console.error('Error fetching user doc:', err);
            setError(err.message);
            setUserDoc(null);
          }
        } else {
          setUserDoc(null);
        }

        setLoading(false);
      },
      (error) => {
        console.error('Auth state change error:', error);
        setError(error.message);
        setUser(null);
        setUserDoc(null);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userDoc, loading, error }}>
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
