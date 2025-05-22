import { collection, addDoc, doc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { setSavingState } from '@/lib/saving-state-controller';

export const addComment = async (semesterId, goalId, userId, userName) => {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const ref = collection(db, 'semesters', semesterId, 'goals', goalId, 'comments');
    return await addDoc(ref, {
      text: '',
      createdAt: serverTimestamp(),
      userId,
      userName,
      semesterId,
      goalId,
    });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const updateCommentText = async (semesterId, goalId, commentId, text) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(db, 'semesters', semesterId, 'goals', goalId, 'comments', commentId);
  try {
    await updateDoc(ref, { text });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const deleteComment = async (semesterId, goalId, commentId) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(db, 'semesters', semesterId, 'goals', goalId, 'comments', commentId);
  try {
    await deleteDoc(ref);
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};
