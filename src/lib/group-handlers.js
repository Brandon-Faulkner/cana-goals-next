import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { setSavingState } from '@/lib/saving-state-controller';

export const addGroup = async (name, slackEnabled, description) => {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const groupData = {
      name,
      slackEnabled,
      description,
    };
    await addDoc(collection(db, 'groups'), groupData);
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const updateGroup = async (groupId, updatedData) => {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const groupRef = doc(db, 'groups', groupId);
    await updateDoc(groupRef, updatedData);
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};
