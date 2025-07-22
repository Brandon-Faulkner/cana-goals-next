'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useGroups() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'groups'),
      (snapshot) => {
        setGroups(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })),
        );
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching groups:', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { groups, loading };
}
