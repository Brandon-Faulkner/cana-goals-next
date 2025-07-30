import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { setSavingState } from '@/lib/saving-state-controller';

export const addSemester = async (data) => {
  setSavingState({ isSaving: true, hasError: false });
  try {
    return await addDoc(collection(db, 'semesters'), {
      ...data,
    });
  } catch (err) {
    setSavingState({ isSaving: false, hasError: true });
    throw err;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const updateSemester = async (semesterId, updatedData) => {
  setSavingState({ isSaving: true, hasError: false });
  try {
    return await updateDoc(doc(db, 'semesters', semesterId), updatedData);
  } catch (err) {
    setSavingState({ isSaving: false, hasError: true });
    throw err;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};
