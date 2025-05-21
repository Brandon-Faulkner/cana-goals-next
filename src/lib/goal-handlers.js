import { collection, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { setSavingState } from '@/lib/saving-state-controller';

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

export const updateGoalStatus = async (semesterId, goalId, status) => {
    setSavingState({ isSaving: true, hasError: false });
    const ref = doc(db, 'semesters', semesterId, 'goals', goalId);
    try {
        await updateDoc(ref, { status });
    } catch (error) {
        setSavingState({ isSaving: false, hasError: true });
        throw error;
    } finally {
        setSavingState({ isSaving: false, hasError: false });
    }
};

export const deleteGoal = async (semesterId, goalId) => {
    setSavingState({ isSaving: true, hasError: false });
    const ref = doc(db, 'semesters', semesterId, 'goals', goalId);
    try {
        await deleteDoc(ref);
    } catch (error) {
        setSavingState({ isSaving: false, hasError: true });
        throw error;
    } finally {
        setSavingState({ isSaving: false, hasError: false });
    }
};

export function toggleGoalExpanded(goalId, setExpandedGoals) {
    setExpandedGoals(prev => ({ ...prev, [goalId]: !prev[goalId] }))
}