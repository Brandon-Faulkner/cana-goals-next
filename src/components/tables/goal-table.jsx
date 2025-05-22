'use client';
import { useState, useCallback, Fragment } from 'react';
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
} from '@/lib/goal-handlers';
import { addBuildingBlock } from '@/lib/building-block-handlers';
import { addComment } from '@/lib/comment-handlers';
import { DropdownActions } from '@/components/tables/dropdown-actions';

const useDebouncedGoalText = (semId) => {
  return useCallback(
    debounce((id, text) => {
      toast.promise(updateGoalText(semId, id, text), {
        loading: 'Saving goal changes...',
        success: 'Goal changes saved',
        error: 'Failed to save goal changes',
      });
    }, 1000),
    [semId],
  );
};

export function GoalTable({ goals, userId, userName, currentSemester }) {
  const [expandedGoals, setExpandedGoals] = useState({});
  const debouncedText = useDebouncedGoalText(currentSemester.id);

  return (
    <div className='w-full'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-1/2 text-base'>Goals</TableHead>
            <TableHead className='w-1/4 text-base'>Due Date</TableHead>
            <TableHead className='w-auto text-base items-center flex justify-between'>
              <span>Status</span>
              <DropdownActions
                actions={[
                  { text: 'Add Goal', onClick: addGoal },
                  { text: 'Add Building Block', onClick: addBuildingBlock },
                  { text: 'Add Comment', onClick: addComment },
                  'seperator',
                  { text: 'Delete Goal', onClick: deleteGoal, destructive: true },
                ]}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goals.map((goal) => (
            <Fragment key={goal.id}>
              <GoalRow
                goal={goal}
                expanded={!!expandedGoals[goal.id]}
                toggleGoalExpanded={() => toggleGoalExpanded(goal.id, setExpandedGoals)}
                addGoal={() => {
                  if (!currentSemester?.id) return toast.error('Select semester');
                  toast.promise(
                    addGoal(currentSemester.id, userId, userName, currentSemester.end),
                    {
                      loading: 'Adding new goal...',
                      success: 'New goal added',
                      error: 'Failed to add new goal',
                    },
                  );
                }}
                updateGoalText={(text) => debouncedText(goal.id, text)}
                updateGoalDueDate={(d) =>
                  toast.promise(updateGoalDueDate(currentSemester.id, goal.id, d), {
                    loading: 'Saving goal due date...',
                    success: 'Goal due date saved',
                    error: 'Failed to save goal due date',
                  })
                }
                updateGoalStatus={(s) =>
                  toast.promise(updateGoalStatus(currentSemester.id, goal.id, s), {
                    loading: 'Saving goal status...',
                    success: 'Goal status saved',
                    error: 'Failed to save goal status',
                  })
                }
                addBuildingBlock={() =>
                  toast.promise(addBuildingBlock(currentSemester.id, goal.id), {
                    loading: 'Adding new building block...',
                    success: 'New building block added',
                    error: 'Failed to add new building block',
                  })
                }
                addComment={() =>
                  toast.promise(addComment(currentSemester.id, goal.id, userId, userName), {
                    loading: 'Adding…',
                    success: 'Added ✓',
                    error: 'Failed',
                  })
                }
                deleteGoal={() =>
                  toast.promise(deleteGoal(currentSemester.id, goal.id), {
                    loading: 'Deleting goal...',
                    success: 'Goal deleted',
                    error: 'Failed to delete goal',
                  })
                }
              />

              {expandedGoals[goal.id] && (
                <TableRow>
                  <TableCell colSpan={3} className='p-0'>
                    <div className='border-muted my-4 ml-6 border-l-4 pl-4'>
                      <BuildingBlockTable
                        goal={goal}
                        semesterId={currentSemester.id}
                        expanded={expandedGoals[goal.id]}
                        initialDueDate={currentSemester.end}
                        toggleGoalExpanded={() => toggleGoalExpanded(goal.id, setExpandedGoals)}
                      />
                      <div className='mt-6' />
                      <CommentTable
                        goal={goal}
                        semesterId={currentSemester.id}
                        userId={userId}
                        userName={userName}
                        expanded={expandedGoals[goal.id]}
                        toggleGoalExpanded={() => toggleGoalExpanded(goal.id, setExpandedGoals)}
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
        <div className='text-muted-foreground py-8 text-center'>
          <p>No goals yet. Click the Add Goal button or right-click anywhere to add a goal.</p>
        </div>
      )}
    </div>
  );
}
