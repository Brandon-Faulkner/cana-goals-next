import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db, auth } from '@/lib/firebase';
import { setSavingState } from '@/lib/saving-state-controller';

export async function createUserWithDoc(email, password, name, slackId, assignedGroups) {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    const userDoc = {
      name,
      email,
      slackId,
      admin: false,
      assignedGroups,
      disabled: false,
      settings: {
        confetti: true,
        emails: true,
      },
    };
    await setDoc(doc(db, 'users', cred.user.uid), userDoc);
    return cred.user;
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
}

export async function updateUserDoc(userId, updates) {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const ref = doc(db, 'users', userId);
    await updateDoc(ref, updates);
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
}

export async function deleteUserDoc(userId) {
  setSavingState({ isSaving: true, hasError: false });
  try {
    await deleteDoc(doc(db, 'users', userId));
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
}

// Note: Firebase Admin SDK is required to delete an auth user by UID from a server environment.
// If you plan to allow deleting users fully (auth + Firestore), use a cloud function or backend endpoint.
