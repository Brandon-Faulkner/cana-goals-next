'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';

const GroupsContext = createContext({
  groups: null,
  loading: true,
});

export function GroupsProvider({ children }) {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      setGroups([]);
      setLoading(false);
      return;
    }

    const unsubscribe = onSnapshot(
      collection(db, 'groups'),
      (snapshot) => {
        const groupsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        groupsData.sort((a, b) => a.name.localeCompare(b.name));
        setGroups(groupsData);

        setLoading(false);
      },
      (error) => {
        console.error('Error fetching groups:', error);
        setGroups([]);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  return <GroupsContext.Provider value={{ groups, loading }}>{children}</GroupsContext.Provider>;
}

export function useGroups() {
  const context = useContext(GroupsContext);
  if (!context) throw new Error('useGroups must be used within a GroupsProvider');
  return context;
}
