import {
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { setSavingState } from "@/lib/saving-state-controller";

export const addBuildingBlock = async (semesterId, goalId, initialDueDate) => {
  setSavingState({ isSaving: true, hasError: false });
  try {
    const ref = collection(
      db,
      "semesters",
      semesterId,
      "goals",
      goalId,
      "buildingBlocks"
    );
    return await addDoc(ref, {
      text: "",
      dueDate: initialDueDate,
      status: "Not Working On",
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

export const updateBuildingBlockText = async (
  semesterId,
  goalId,
  blockId,
  text
) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(
    db,
    "semesters",
    semesterId,
    "goals",
    goalId,
    "buildingBlocks",
    blockId
  );
  try {
    await updateDoc(ref, { text });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const updateBuildingBlockDueDate = async (
  semesterId,
  goalId,
  blockId,
  dueDate
) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(
    db,
    "semesters",
    semesterId,
    "goals",
    goalId,
    "buildingBlocks",
    blockId
  );
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
  status
) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(
    db,
    "semesters",
    semesterId,
    "goals",
    goalId,
    "buildingBlocks",
    blockId
  );
  try {
    await updateDoc(ref, { status });
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};

export const deleteBuildingBlock = async (semesterId, goalId, blockId) => {
  setSavingState({ isSaving: true, hasError: false });
  const ref = doc(
    db,
    "semesters",
    semesterId,
    "goals",
    goalId,
    "buildingBlocks",
    blockId
  );
  try {
    await deleteDoc(ref);
  } catch (error) {
    setSavingState({ isSaving: false, hasError: true });
    throw error;
  } finally {
    setSavingState({ isSaving: false, hasError: false });
  }
};
