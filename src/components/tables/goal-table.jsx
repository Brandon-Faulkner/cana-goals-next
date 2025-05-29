'use client';
import React, { useState, useCallback, Fragment } from 'react';
import { toast } from 'sonner';
import debounce from 'lodash/debounce';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { GoalRow } from '@/components/tables/rows/goal-row';
import { BuildingBlockTable } from '@/components/tables/building-block-table';
import { CommentTable } from '@/components/tables/comment-table';
import {
  addGoal,
  updateGoalText,
  updateGoalDueDate,
  updateGoalStatus,
  deleteGoal,
  toggleGoalExpanded,
  toggleAllGoalsExpanded,
} from '@/lib/goal-handlers';
import { addBuildingBlock } from '@/lib/building-block-handlers';
import { addComment } from '@/lib/comment-handlers';
import { ContextActions } from '@/components/tables/context-actions';
import { DropdownActions } from '@/components/tables/dropdown-actions';
import { CommentDialog } from '@/components/dialogs/comment-dialog';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { useAuth } from '@/contexts/auth-provider';

const useDebouncedGoalText = (semesterId) => {
  return useCallback(
    debounce((id, text) => {
      toast.promise(updateGoalText(semesterId, id, text), {
        loading: 'Saving goal changes...',
        success: 'Goal changes saved',
        error: 'Failed to save goal changes',
      });
    }, 1000),
    [semesterId],
  );
};

export const GoalTable = React.memo(function GoalTable({
  goals,
  userId,
  userName,
  currentSemester,
}) {
  const { userDoc } = useAuth();
  const isOwner = userDoc?.id === userId;
  const [expandedGoals, setExpandedGoals] = useState({});
  const allExpanded = goals.length > 0 && goals.every((g) => expandedGoals[g.id]);
  const debouncedGoalText = useDebouncedGoalText(currentSemester.id);

  const handleAddGoal = () => {
    if (!isOwner) {
      toast.error('You can only add goals to your own table.');
      return;
    }
    toast.promise(addGoal(currentSemester.id, userId, userName, currentSemester.end), {
      loading: 'Adding new goal...',
      success: 'New goal added',
      error: 'Failed to add new goal',
    });
  };

  const handleUpdateGoalDate = (goalId, date) => {
    if (!isOwner) {
      toast.error('You can only update goals on your own table.');
      return;
    }
    toast.promise(updateGoalDueDate(currentSemester.id, goalId, date), {
      loading: 'Saving goal due date...',
      success: 'Goal due date saved',
      error: 'Failed to save goal due date',
    });
  };

  const handleUpdateGoalStatus = (goalId, status) => {
    if (!isOwner) {
      toast.error('You can only update goals on your own table.');
      return;
    }
    toast.promise(updateGoalStatus(currentSemester.id, goalId, status), {
      loading: 'Saving goal status...',
      success: 'Goal status saved',
      error: 'Failed to save goal status',
    });
  };

  const handleAddBuildingBlock = (goalId) => {
    if (!isOwner) {
      toast.error('You can only add building blocks to your own goals.');
      return;
    }
    toast.promise(addBuildingBlock(currentSemester.id, goalId, currentSemester.end), {
      loading: 'Adding new building block...',
      success: 'New building block added',
      error: 'Failed to add new building block',
    });
  };

  const handleAddComment = (props, goalId) => {
    return (
      <CommentDialog
        addComment={(text) => {
          if (!userDoc) {
            toast.error('You must be logged in to add a comment.');
            props.onSuccess?.(false);
            return null;
          }
          return toast.promise(
            addComment(currentSemester.id, goalId, userDoc.id, userDoc.name, text),
            {
              loading: 'Adding new comment...',
              success: () => {
                props.onSuccess?.(true);
                return 'New comment added';
              },
              error: () => {
                props.onSuccess?.(false);
                return 'Failed to add new comment';
              },
            },
          );
        }}
        {...props}
      />
    );
  };

  const handleDeleteGoal = (props, goalId) => {
    return (
      <DeleteDialog
        triggerText='Delete Goal'
        deleteAction={() => {
          if (!isOwner) {
            toast.error('You can only delete your own goals.');
            props.onSuccess?.(false);
            return null;
          }
          return toast.promise(deleteGoal(currentSemester.id, goalId), {
            loading: 'Deleting goal...',
            success: () => {
              props.onSuccess?.(true);
              return 'Goal deleted';
            },
            error: () => {
              props.onSuccess?.(false);
              return 'Failed to delete goal';
            },
          });
        }}
        {...props}
      />
    );
  };

  const contextActions = [
    {
      text: allExpanded ? 'Collapse All' : 'Expand All',
      action: () => toggleAllGoalsExpanded(goals, setExpandedGoals, !allExpanded),
    },
    'seperator',
    { text: 'Add Goal', action: handleAddGoal, disabled: !isOwner },
  ];

  return (
    <ContextActions actions={contextActions}>
      <div className='w-full'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-1/2 text-base'>Goals</TableHead>
              <TableHead className='w-1/4 text-base'>Due Date</TableHead>
              <TableHead className='flex w-auto items-center justify-between text-base'>
                <span>Status</span>
                <DropdownActions actions={contextActions} />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals
              .slice()
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((goal) => (
                <Fragment key={goal.id}>
                  <GoalRow
                    goal={goal}
                    isOwner={isOwner}
                    expanded={!!expandedGoals[goal.id]}
                    toggleGoalExpanded={() => toggleGoalExpanded(goal.id, setExpandedGoals)}
                    addGoal={() => handleAddGoal()}
                    updateGoalText={(text) => debouncedGoalText(goal.id, text)}
                    updateGoalDueDate={(date) => handleUpdateGoalDate(goal.id, date)}
                    updateGoalStatus={(status) => handleUpdateGoalStatus(goal.id, status)}
                    addBuildingBlock={() => handleAddBuildingBlock(goal.id)}
                    addComment={(props) => handleAddComment(props, goal.id)}
                    deleteGoal={(props) => handleDeleteGoal(props, goal.id)}
                  />

                  {expandedGoals[goal.id] && (
                    <TableRow>
                      <TableCell colSpan={3} className='p-0'>
                        <div className='border-muted my-4 ml-6 border-l-4 pl-4'>
                          <BuildingBlockTable
                            goal={goal}
                            semesterId={currentSemester.id}
                            isOwner={isOwner}
                            userName={userName}
                            expanded={expandedGoals[goal.id]}
                            toggleGoalExpanded={() => toggleGoalExpanded(goal.id, setExpandedGoals)}
                            addBuildingBlock={() => handleAddBuildingBlock(goal.id)}
                          />
                          <div className='mt-6' />
                          <CommentTable
                            goal={goal}
                            semesterId={currentSemester.id}
                            expanded={expandedGoals[goal.id]}
                            toggleGoalExpanded={() => toggleGoalExpanded(goal.id, setExpandedGoals)}
                            addComment={(props) => handleAddComment(props, goal.id)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </Fragment>
              ))}
          </TableBody>
        </Table>

        {goals.length === 0 && (
          <div className='text-muted-foreground py-4 text-center'>
            {isOwner ? (
              <>Right-click or use the 3-dot menu to add a goal.</>
            ) : (
              <>{userName} hasn't added any goals yet.</>
            )}
          </div>
        )}
      </div>
    </ContextActions>
  );
});
