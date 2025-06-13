import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  Timestamp,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { db, functions } from '@/lib/firebase';
import { httpsCallable } from 'firebase/functions';
import { setSavingState } from '@/lib/saving-state-controller';

export const updateSemesterFocus = async (semesterId, focus) => {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const ref = doc(db, 'semesters', semesterId);
    return await updateDoc(ref, { focus });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const addGoal = async (semesterId, userId, userName, initialDueDate) => {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const ref = collection(db, 'semesters', semesterId, 'goals');
    return await addDoc(ref, {
      text: '',
      dueDate: initialDueDate,
      status: 'Not Working On',
      createdAt: serverTimestamp(),
      userId,
      userName,
      semesterId,
    });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const updateGoalText = async (semesterId, goalId, text) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(db, 'semesters', semesterId, 'goals', goalId);
  try {
    await updateDoc(ref, { text });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const updateGoalDueDate = async (semesterId, goalId, dueDate) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(db, 'semesters', semesterId, 'goals', goalId);
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

export const updateGoalStatus = async (
  semesterId,
  goalId,
  status,
  ownerUserName,
  ownerSlackId,
  goalText,
  semesterName,
) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(db, 'semesters', semesterId, 'goals', goalId);
  try {
    await updateDoc(ref, { status });

    // Send slack notification
    if (ownerSlackId && ownerUserName) {
      try {
        const callSendSlackMessage = httpsCallable(functions, 'sendSlackMessage');
        const message = `Status of goal "${goalText.substring(0, 50)}${goalText.length > 50 ? '...' : ''}" in the ${semesterName} semester for <@${ownerSlackId}> changed to "*${status}*"`;
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

export const deleteGoal = async (semesterId, goalId) => {
  setSavingState({ isSaving: true, hasError: false });
  const goalRef = doc(db, 'semesters', semesterId, 'goals', goalId);
  const buildingBlocksRef = collection(
    db,
    'semesters',
    semesterId,
    'goals',
    goalId,
    'buildingBlocks',
  );
  const commentsRef = collection(db, 'semesters', semesterId, 'goals', goalId, 'comments');

  try {
    const batch = writeBatch(db);

    const buildingBlocksSnapshot = await getDocs(buildingBlocksRef);
    buildingBlocksSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    const commentsSnapshot = await getDocs(commentsRef);
    commentsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    batch.delete(goalRef);

    await batch.commit();
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export function toggleGoalExpanded(goalId, setExpandedGoals) {
  setExpandedGoals((prev) => ({ ...prev, [goalId]: !prev[goalId] }));
}

export function toggleAllGoalsExpanded(goals, setExpandedGoals, expand) {
  setExpandedGoals(goals.reduce((acc, g) => ({ ...acc, [g.id]: expand }), {}));
}
