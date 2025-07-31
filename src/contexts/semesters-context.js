'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { collection, onSnapshot, query, where, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/auth-context';

const SemestersContext = createContext({
  semesters: null,
  loading: true,
  currentSemester: null,
  currentGroupId: null,
  userDoc: null,
});

export function SemestersProvider({ children }) {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSemester, setCurrentSemester] = useState(null);
  const [currentGroupId, setCurrentGroupId] = useState('');
  const { user, userDoc } = useAuth();

  useEffect(() => {
    if (!user) {
      setSemesters([]);
      setCurrentSemester(null);
      setCurrentGroupId('');
      setLoading(false);
      return;
    }

    if (!currentGroupId) {
      if (userDoc?.activeGroup) {
        setCurrentGroupId(userDoc.activeGroup);
      } else if (userDoc?.assignedGroups?.length) {
        setCurrentGroupId(userDoc.assignedGroups[0]);
      }
      return;
    }

    if (!currentGroupId) return;

    const semesterQuery = query(
      collection(db, 'semesters'),
      where('group', '==', currentGroupId),
      orderBy('start', 'desc'),
    );

    const unsubscribe = onSnapshot(
      semesterQuery,
      (snapshot) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const now = new Date();
        const currentByDate = docs.find((s) => {
          const startDate = s.start?.toDate ? s.start.toDate() : null;
          const endDate = s.end?.toDate ? s.end.toDate() : null;
          return startDate && endDate && now >= startDate && now <= endDate;
        });

        setSemesters(docs);

        setCurrentSemester((prevCurrent) => {
          if (prevCurrent && docs.some((doc) => doc.id === prevCurrent.id)) {
            return docs.find((doc) => doc.id === prevCurrent.id);
          }
          return currentByDate || (docs.length > 0 ? docs[0] : null);
        });

        setLoading(false);
      },
      (error) => {
        console.error('Error fetching semesters: ', error);
        setSemesters([]);
        setCurrentSemester(null);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [currentGroupId, user, userDoc]);

  return (
    <SemestersContext.Provider
      value={{
        semesters,
        loading,
        currentSemester,
        setCurrentSemester,
        currentGroupId,
        setCurrentGroupId,
      }}
    >
      {children}
    </SemestersContext.Provider>
  );
}

export function useSemesters() {
  const context = useContext(SemestersContext);
  if (!context) throw new Error('useSemesters must be used within a SemestersProvider');
  return context;
}
