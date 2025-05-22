"use client";
import React, { useState, useCallback } from "react";
import { toast } from "sonner";
import { ContextActions } from "@/components/tables/context-actions";
import debounce from "lodash/debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GoalRow } from "@/components/tables/rows/goal-row";
import { BuildingBlockTable } from "@/components/tables/building-block-table";
import { CommentTable } from "@/components/tables/comment-table";
import {
  addGoal,
  updateGoalText,
  updateGoalDueDate,
  updateGoalStatus,
  deleteGoal,
  toggleGoalExpanded,
} from "@/lib/goal-handlers";
import { addBuildingBlock } from "@/lib/building-block-handlers";
import { addComment } from "@/lib/comment-handlers";

const useDebouncedGoalText = (semId) => {
  return useCallback(
    debounce((id, text) => {
      toast.promise(updateGoalText(semId, id, text), {
        loading: "Saving…",
        success: "Saved ✓",
        error: "Failed",
      });
    }, 1000),
    [semId]
  );
};

export function GoalTable({ goals, userId, userName, currentSemester }) {
  const [expandedGoals, setExpandedGoals] = useState({});
  const debouncedText = useDebouncedGoalText(currentSemester.id);

  const handleAddGoal = () => {
    if (!currentSemester?.id) return toast.error("Select semester");
    toast.promise(
      addGoal(currentSemester.id, userId, userName, currentSemester.end),
      { loading: "Creating…", success: "Created ✓", error: "Failed" }
    );
  };

  return (
    <ContextActions actions={[{ text: "Add Goal", action: handleAddGoal }]}>
      <div className="w-full">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-1/2 text-base">Goals</TableHead>
              <TableHead className="w-1/4 text-base">Due Date</TableHead>
              <TableHead className="w-1/4 text-base">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {goals.map((goal) => (
              <React.Fragment key={goal.id}>
                <GoalRow
                  goal={goal}
                  expanded={!!expandedGoals[goal.id]}
                  toggleGoalExpanded={() =>
                    toggleGoalExpanded(goal.id, setExpandedGoals)
                  }
                  addGoal={() => handleAddGoal}
                  updateGoalText={(text) => debouncedText(goal.id, text)}
                  updateGoalDueDate={(d) =>
                    toast.promise(
                      updateGoalDueDate(currentSemester.id, goal.id, d),
                      {
                        loading: "Saving…",
                        success: "Saved ✓",
                        error: "Failed",
                      }
                    )
                  }
                  updateGoalStatus={(s) =>
                    toast.promise(
                      updateGoalStatus(currentSemester.id, goal.id, s),
                      {
                        loading: "Saving…",
                        success: "Saved ✓",
                        error: "Failed",
                      }
                    )
                  }
                  addBuildingBlock={() =>
                    toast.promise(
                      addBuildingBlock(currentSemester.id, goal.id),
                      {
                        loading: "Adding…",
                        success: "Added ✓",
                        error: "Failed",
                      }
                    )
                  }
                  addComment={() =>
                    toast.promise(
                      addComment(currentSemester.id, goal.id, userId, userName),
                      {
                        loading: "Adding…",
                        success: "Added ✓",
                        error: "Failed",
                      }
                    )
                  }
                  deleteGoal={() =>
                    toast.promise(deleteGoal(currentSemester.id, goal.id), {
                      loading: "Deleting…",
                      success: "Deleted ✓",
                      error: "Failed",
                    })
                  }
                />

                {expandedGoals[goal.id] && (
                  <TableRow>
                    <TableCell colSpan={3} className="p-0">
                      <div className="border-l-4 border-muted ml-6 pl-4 my-4">
                        <BuildingBlockTable
                          goal={goal}
                          semesterId={currentSemester.id}
                          expanded={expandedGoals[goal.id]}
                          initialDueDate={currentSemester.end}
                          toggleGoalExpanded={() =>
                            toggleGoalExpanded(goal.id, setExpandedGoals)
                          }
                        />
                        <div className="mt-6" />
                        <CommentTable
                          goal={goal}
                          semesterId={currentSemester.id}
                          userId={userId}
                          userName={userName}
                          expanded={expandedGoals[goal.id]}
                          toggleGoalExpanded={() =>
                            toggleGoalExpanded(goal.id, setExpandedGoals)
                          }
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>

        {goals.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <p>
              No goals yet. Click the Add Goal button or right-click anywhere to
              add a goal.
            </p>
          </div>
        )}
      </div>
    </ContextActions>
  );
}
