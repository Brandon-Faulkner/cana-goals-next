import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db, functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { setSavingState } from '@/lib/saving-state-controller';

export const addBuildingBlock = async (semesterId, goalId, initialDueDate) => {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const ref = collection(db, 'semesters', semesterId, 'goals', goalId, 'buildingBlocks');
    return await addDoc(ref, {
      text: '',
      dueDate: initialDueDate,
      status: 'Not Working On',
      createdAt: serverTimestamp(),
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

export const updateBuildingBlockText = async (semesterId, goalId, blockId, text) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(db, 'semesters', semesterId, 'goals', goalId, 'buildingBlocks', blockId);
  try {
    await updateDoc(ref, { text });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const updateBuildingBlockDueDate = async (semesterId, goalId, blockId, dueDate) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(db, 'semesters', semesterId, 'goals', goalId, 'buildingBlocks', blockId);
  try {
    const date = dueDate?.target?.value || dueDate;
    const dateObj = new Date(date);
    await updateDoc(ref, { dueDate: Timestamp.fromDate(dateObj) });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const updateBuildingBlockStatus = async (
  semesterId,
  goalId,
  blockId,
  status,
  ownerUserName,
  ownerSlackId,
  goalText,
  blockText,
  semesterName,
  slackEnabled,
) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(db, 'semesters', semesterId, 'goals', goalId, 'buildingBlocks', blockId);
  try {
    await updateDoc(ref, { status });

    // Send slack notification if allowed
    if (ownerSlackId && ownerUserName && slackEnabled) {
      console.log('Building block');
      return;
      try {
        const callSendSlackMessage = httpsCallable(functions, 'sendSlackMessage');
        const message = `Status of building block "${blockText.substring(0, 40)}${blockText.length > 40 ? '...' : ''}" for goal "${goalText.substring(0, 40)}${goalText.length > 40 ? '...' : ''}" in the ${semesterName} semester for <@${ownerSlackId}> changed to "*${status}*"`;
        await callSendSlackMessage({ message });
      } catch (slackError) {
        console.error('Error sending Slack notification for goal status:', slackError);
      }
    }
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const deleteBuildingBlock = async (semesterId, goalId, blockId) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(db, 'semesters', semesterId, 'goals', goalId, 'buildingBlocks', blockId);
  try {
    await deleteDoc(ref);
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};
