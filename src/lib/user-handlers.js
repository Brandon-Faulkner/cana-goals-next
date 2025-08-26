import { doc, updateDoc } from 'firebase/firestore';
import { db, functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { setSavingState } from '@/lib/saving-state-controller';

export async function createUserWithDoc(email, password, name, slackId, assignedGroups) {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const callAdminCreateUser = httpsCallable(functions, 'adminCreateUser');
    const { data } = await callAdminCreateUser({
      email,
      password,
      name,
      slackId,
      assignedGroups,
      admin: false,
    });
    return data;
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
    const callAdminDeleteUser = httpsCallable(functions, 'adminDeleteUser');
    await callAdminDeleteUser({ uid: userId });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
}
