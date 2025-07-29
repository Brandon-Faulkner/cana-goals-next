'use client';
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, collectionGroup, onSnapshot, query, where, orderBy } from 'firebase/firestore';

export function useGoalsListener(currentSemesterId, user, loadingAuth) {
  const [goals, setGoals] = useState([]);
  const [isLoadingGoals, setIsLoadingGoals] = useState(false);

  useEffect(() => {
    if (!currentSemesterId || !user || loadingAuth) {
      setGoals([]);
      setIsLoadingGoals(false);
      return;
    }

    setGoals([]);
    setIsLoadingGoals(true);

    // --- GOALS LISTENER ---
    const goalsQueryDef = query(
      collection(db, 'semesters', currentSemesterId, 'goals'),
      orderBy('createdAt'),
    );
    const unsubGoals = onSnapshot(goalsQueryDef, (snapshot) => {
      setGoals((prevGoals) => {
        let newGoals = [...prevGoals];
        let structureChanged = false;

        snapshot.docChanges().forEach((change) => {
          structureChanged = true;
          const docData = change.doc.data();
          const goalId = change.doc.id;
          const goalCoreData = {
            ...docData,
            id: goalId,
            createdAt: docData.createdAt?.toDate(),
            dueDate: docData.dueDate?.toDate(),
          };

          if (change.type === 'added') {
            const existingIndex = newGoals.findIndex((g) => g.id === goalId);
            if (existingIndex === -1) {
              newGoals.push({
                ...goalCoreData,
                buildingBlocks: [],
                comments: [],
              });
            } else {
              newGoals[existingIndex] = {
                ...newGoals[existingIndex],
                ...goalCoreData,
              };
            }
          } else if (change.type === 'modified') {
            const index = newGoals.findIndex((g) => g.id === goalId);
            if (index !== -1) {
              newGoals[index] = {
                ...newGoals[index],
                ...goalCoreData,
              };
            } else {
              newGoals.push({
                ...goalCoreData,
                buildingBlocks: [],
                comments: [],
              });
            }
          } else if (change.type === 'removed') {
            newGoals = newGoals.filter((g) => g.id !== goalId);
          }
        });

        if (structureChanged) {
          newGoals.sort((a, b) =>
            a.createdAt && b.createdAt ? a.createdAt.getTime() - b.createdAt.getTime() : 0,
          );
          return newGoals;
        }
        return prevGoals;
      });
      setIsLoadingGoals(false);
    });

    // --- BUILDING BLOCKS LISTENER ---
    const blocksQueryDef = query(
      collectionGroup(db, 'buildingBlocks'),
      where('semesterId', '==', currentSemesterId),
    );
    const unsubBlocks = onSnapshot(blocksQueryDef, (snapshot) => {
      setGoals((prevGoals) => {
        if (snapshot.empty && !prevGoals.some((g) => g.buildingBlocks?.length > 0)) {
          return prevGoals;
        }

        let newGoals = prevGoals;
        const modifiedGoalDetails = new Map();

        snapshot.docChanges().forEach((change) => {
          const blockData = change.doc.data();
          const goalId = blockData.goalId;

          const currentGoalsArray = newGoals === prevGoals ? prevGoals : newGoals;
          const originalGoalIndex = currentGoalsArray.findIndex((g) => g.id === goalId);

          if (originalGoalIndex === -1) return;

          let targetGoalForModification;

          if (modifiedGoalDetails.has(originalGoalIndex)) {
            targetGoalForModification = modifiedGoalDetails.get(originalGoalIndex).newGoalObject;
          } else {
            if (newGoals === prevGoals) {
              newGoals = [...prevGoals];
            }
            const originalGoalObject = newGoals[originalGoalIndex];
            targetGoalForModification = {
              ...originalGoalObject,
              buildingBlocks: [...(originalGoalObject.buildingBlocks || [])],
            };
            newGoals[originalGoalIndex] = targetGoalForModification;
            modifiedGoalDetails.set(originalGoalIndex, {
              newGoalObject: targetGoalForModification,
            });
          }

          const block = {
            id: change.doc.id,
            ...blockData,
            createdAt: blockData.createdAt?.toDate(),
            dueDate: blockData.dueDate?.toDate(),
          };

          const existingBlockIndex = targetGoalForModification.buildingBlocks.findIndex(
            (b) => b.id === block.id,
          );

          if (change.type === 'added') {
            if (existingBlockIndex === -1) {
              targetGoalForModification.buildingBlocks.push(block);
            } else {
              targetGoalForModification.buildingBlocks[existingBlockIndex] = block;
            }
          } else if (change.type === 'modified') {
            if (existingBlockIndex !== -1) {
              targetGoalForModification.buildingBlocks[existingBlockIndex] = block;
            } else {
              targetGoalForModification.buildingBlocks.push(block);
            }
          } else if (change.type === 'removed') {
            targetGoalForModification.buildingBlocks =
              targetGoalForModification.buildingBlocks.filter((b) => b.id !== change.doc.id);
          }
        });

        if (modifiedGoalDetails.size > 0) {
          modifiedGoalDetails.forEach(({ newGoalObject }) => {
            if (newGoalObject.buildingBlocks) {
              newGoalObject.buildingBlocks.sort((a, b) =>
                a.createdAt && b.createdAt ? a.createdAt.getTime() - b.createdAt.getTime() : 0,
              );
            }
          });
          return newGoals;
        }
        return prevGoals;
      });
    });

    // --- COMMENTS LISTENER ---
    const commentsQueryDef = query(
      collectionGroup(db, 'comments'),
      where('semesterId', '==', currentSemesterId),
    );
    const unsubComments = onSnapshot(commentsQueryDef, (snapshot) => {
      setGoals((prevGoals) => {
        if (snapshot.empty && !prevGoals.some((g) => g.comments?.length > 0)) return prevGoals;

        let newGoals = prevGoals;
        const modifiedGoalDetails = new Map();

        snapshot.docChanges().forEach((change) => {
          const commentData = change.doc.data();
          const goalId = commentData.goalId;

          const currentGoalsArray = newGoals === prevGoals ? prevGoals : newGoals;
          const originalGoalIndex = currentGoalsArray.findIndex((g) => g.id === goalId);

          if (originalGoalIndex === -1) return;

          let targetGoalForModification;

          if (modifiedGoalDetails.has(originalGoalIndex)) {
            targetGoalForModification = modifiedGoalDetails.get(originalGoalIndex).newGoalObject;
          } else {
            if (newGoals === prevGoals) {
              newGoals = [...prevGoals];
            }
            const originalGoalObject = newGoals[originalGoalIndex];
            targetGoalForModification = {
              ...originalGoalObject,
              comments: [...(originalGoalObject.comments || [])],
            };
            newGoals[originalGoalIndex] = targetGoalForModification;
            modifiedGoalDetails.set(originalGoalIndex, {
              newGoalObject: targetGoalForModification,
            });
          }

          const comment = {
            id: change.doc.id,
            ...commentData,
            createdAt: commentData.createdAt?.toDate(),
          };

          const existingCommentIndex = targetGoalForModification.comments.findIndex(
            (c) => c.id === comment.id,
          );

          if (change.type === 'added') {
            if (existingCommentIndex === -1) {
              targetGoalForModification.comments.push(comment);
            } else {
              targetGoalForModification.comments[existingCommentIndex] = comment;
            }
          } else if (change.type === 'modified') {
            if (existingCommentIndex !== -1) {
              targetGoalForModification.comments[existingCommentIndex] = comment;
            } else {
              targetGoalForModification.comments.push(comment);
            }
          } else if (change.type === 'removed') {
            targetGoalForModification.comments = targetGoalForModification.comments.filter(
              (c) => c.id !== change.doc.id,
            );
          }
        });

        if (modifiedGoalDetails.size > 0) {
          modifiedGoalDetails.forEach(({ newGoalObject }) => {
            if (newGoalObject.comments) {
              newGoalObject.comments.sort((a, b) =>
                a.createdAt && b.createdAt ? a.createdAt.getTime() - b.createdAt.getTime() : 0,
              );
            }
          });
          return newGoals;
        }
        return prevGoals;
      });
    });

    return () => {
      unsubGoals();
      unsubBlocks();
      unsubComments();
      setIsLoadingGoals(false);
    };
  }, [currentSemesterId, user, loadingAuth]);

  return { goals, loading: isLoadingGoals };
}
