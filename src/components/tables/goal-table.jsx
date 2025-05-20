"use client";
import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ContextActions } from "@/components/tables/context-actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
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
    toggleGoalExpanded
} from "@/hooks/goal-handlers";
import { addBuildingBlock } from "@/hooks/building-block-handlers";
import { addComment } from "@/hooks/comment-handlers";

export const formatDateForInput = date => {
    if (!date) return ""
    return format(date, "yyyy-MM-dd")
}

export function GoalTable({ initialGoals }) {
    // Initial sample data
    const [goals, setGoals] = useState(initialGoals || [])

    const [expandedGoals, setExpandedGoals] = useState({})

    return (
        <ContextActions actions={[{
            text: "Add Goal",
            action: () => addGoal(goals, setGoals, setExpandedGoals)
        }]}>

            <div className="w-full">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50%]">Goals</TableHead>
                            <TableHead className="w-[25%]">Due Date</TableHead>
                            <TableHead className="w-[25%]">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {goals.map(goal => (
                            <React.Fragment key={goal.id}>
                                <GoalRow
                                    goal={goal}
                                    expanded={expandedGoals[goal.id]}
                                    toggleGoalExpanded={() => toggleGoalExpanded(goal.id, setExpandedGoals)}
                                    addGoal={() => addGoal(goals, setGoals, setExpandedGoals)}
                                    updateGoalText={changes => updateGoalText(goal.id, changes, goals, setGoals)}
                                    updateGoalDueDate={dateStr => updateGoalDueDate(goal.id, dateStr, goals, setGoals)}
                                    updateGoalStatus={status => updateGoalStatus(goal.id, status, goals, setGoals)}
                                    addBuildingBlock={() => addBuildingBlock(goal.id, goals, setGoals)}
                                    addComment={() => addComment(goal.id, goals, setGoals)}
                                    deleteGoal={() => deleteGoal(goal.id, goals, setGoals)}
                                />

                                {expandedGoals[goal.id] && (
                                    <TableRow>
                                        <TableCell colSpan={3} className="p-0">
                                            <div className="border-l-4 border-muted ml-6 pl-4 my-4">
                                                <BuildingBlockTable
                                                    goals={goals}
                                                    goal={goal}
                                                    setGoals={setGoals}
                                                    expanded={expandedGoals[goal.id]}
                                                    toggleGoalExpanded={() => toggleGoalExpanded(goal.id, setExpandedGoals)}
                                                />
                                                <div className="mt-6" />
                                                <CommentTable
                                                    goals={goals}
                                                    goal={goal}
                                                    setGoals={setGoals}
                                                    expanded={expandedGoals[goal.id]}
                                                    toggleGoalExpanded={() => toggleGoalExpanded(goal.id, setExpandedGoals)}
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
    )
}