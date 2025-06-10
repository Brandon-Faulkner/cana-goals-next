'use client';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useSemesters() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSemester, setCurrentSemester] = useState(null);

  useEffect(() => {
    const q = query(collection(db, 'semesters'), orderBy('start', 'desc'));

    const unsubscribe = onSnapshot(
      q,
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

        // Preserve current selection if still valid, else try currentByDate or first semester
        setCurrentSemester((prevCurrent) => {
          if (prevCurrent && docs.some((doc) => doc.id === prevCurrent.id)) {
            return docs.find((doc) => doc.id === prevCurrent.id);
          }
          return currentByDate || (docs.length > 0 ? docs[0] : null);
        });

        setLoading(false);
      },
      (error) => {
        console.error('Error fetching semesters in real-time: ', error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { semesters, loading, currentSemester, setCurrentSemester };
}
