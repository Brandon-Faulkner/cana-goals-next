import { useState, useEffect } from 'react';
import { ContextActions } from "@/components/tables/context-actions";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TableCell, TableRow } from "@/components/ui/table";
import { StatusSelect } from "@/components/tables/status-select";
import { DropdownActions } from "@/components/tables/dropdown-actions";

export function GoalRow({
    goal,
    expanded,
    toggleGoalExpanded,
    addGoal,
    updateGoalText,
    updateGoalDueDate,
    updateGoalStatus,
    addBuildingBlock,
    addComment,
    deleteGoal
}) {
    const [text, setText] = useState(goal.text || '');
    useEffect(() => setText(goal.text || ''), [goal.text]);

    const onChange = e => setText(e.target.value);
    const onBlur = () => updateGoalText(text);

    return (
        <ContextActions actions={[
            { text: expanded ? "Collapse" : "Expand", action: toggleGoalExpanded },
            { text: "Add Goal", action: addGoal },
            { text: "Add Building Block", action: addBuildingBlock },
            { text: "Add Comment", action: addComment },
            "seperator",
            { text: "Delete Goal", action: deleteGoal, destructive: true }
        ]}>
            <TableRow className="group">
                <TableCell>
                    <div className="flex items-start gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 flex-shrink-0 mt-1.5"
                            onClick={toggleGoalExpanded}
                        >
                            {expanded ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                        <div className="w-full max-w-[800px]">
                            <Textarea
                                value={text}
                                onChange={onChange}
                                onBlur={onBlur}
                                placeholder="Enter goal"
                                className="min-w-[200px] h-9 min-h-9"
                            />
                        </div>
                    </div>
                </TableCell>
                <TableCell className="align-top">
                    <Input
                        type="date"
                        value={goal.dueDate ? goal.dueDate.toISOString().slice(0,10) : ''}
                        onChange={updateGoalDueDate}
                    />
                </TableCell>
                <TableCell className="align-top flex items-start justify-between">
                    <StatusSelect
                        value={goal.status}
                        onValueChange={updateGoalStatus}
                    />

                    <DropdownActions
                        actions={[
                            { text: expanded ? "Collapse" : "Expand", onClick: toggleGoalExpanded },
                            { text: "Add Building Block", onClick: addBuildingBlock },
                            { text: "Add Comment", onClick: addComment },
                            "seperator",
                            { text: "Delete Goal", onClick: deleteGoal, destructive: true }
                        ]}
                    />
                </TableCell>
            </TableRow>
        </ContextActions>

    )
}