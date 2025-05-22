"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

export function useSemesters() {
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSemester, setCurrentSemester] = useState(null);

  useEffect(() => {
    const fetchSemesters = async () => {
      const snapshot = await getDocs(collection(db, "semesters"));
      const docs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const now = new Date();
      const current = docs.find(
        (s) => now >= s.start.toDate() && now <= s.end.toDate()
      );

      setSemesters(docs);
      setCurrentSemester(current || null);
      setLoading(false);
    };

    fetchSemesters();
  }, []);

  return { semesters, loading, currentSemester, setCurrentSemester };
}
