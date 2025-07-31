'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const AuthContext = createContext({
  user: null,
  userDoc: null,
  loading: true,
  error: null,
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribeUserDoc = () => {};

    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (currentUser) => {
        setUser(currentUser);
        setError(null);

        unsubscribeUserDoc();

        if (currentUser) {
          try {
            const userDocRef = doc(db, 'users', currentUser.uid);
            unsubscribeUserDoc = onSnapshot(
              userDocRef,
              async (docSnap) => {
                if (docSnap.exists()) {
                  const userData = { id: docSnap.id, ...docSnap.data() };

                  // Check if disabled before setting anything
                  if (userData.disabled) {
                    await signOut(auth);
                    setUser(null);
                    setUserDoc(null);
                    setError('Your account has been disabled.');
                    setLoading(false);
                    return;
                  }

                  setUserDoc(userData);
                } else {
                  console.warn('No user profile found in Firestore.');
                  setUserDoc(null);
                }
                setLoading(false);
              },

              (err) => {
                console.error('Error listening to user doc:', err);
                setError(err.message);
                setUserDoc(null);
                setLoading(false);
              },
            );
          } catch (err) {
            console.error('Error setting up user doc listener:', err);
            setError(err.message);
            setUserDoc(null);
            setLoading(false);
          }
        } else {
          setUserDoc(null);
          setLoading(false);
        }
      },
      (authError) => {
        console.error('Auth state change error:', authError);
        setError(authError.message);
        setUser(null);
        setUserDoc(null);
        setLoading(false);
      },
    );

    return () => {
      unsubscribeAuth();
      unsubscribeUserDoc();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userDoc, loading, error }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
