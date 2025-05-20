import { ContextActions } from "./context-actions";
import { BuildingBlockRow } from "@/components/tables/rows/building-block-row";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import {
    addBuildingBlock,
    updateBuildingBlockText,
    updateBuildingBlockDueDate,
    updateBuildingBlockStatus,
    deleteBuildingBlock
} from "@/lib/building-block-handlers";

export function BuildingBlockTable({ goals, goal, setGoals, expanded, toggleGoalExpanded }) {
    return (
        <ContextActions actions={[
            { text: expanded ? "Collapse" : "Expand", action: toggleGoalExpanded },
            { text: "Add Building Block", action: () => addBuildingBlock(goal.id, goals, setGoals) }
        ]}>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/70">
                        <TableHead className="w-[50%] font-medium text-base">
                            Building Blocks
                        </TableHead>
                        <TableHead className="w-[25%] font-medium text-base">
                            Due Date
                        </TableHead>
                        <TableHead className="w-[25%] font-medium text-base">
                            Status
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {goal.buildingBlocks.length > 0 ? (
                        goal.buildingBlocks.map(block => (
                            <BuildingBlockRow
                                key={block.id}
                                buildingBlock={block}
                                expanded={expanded}
                                toggleGoalExpanded={toggleGoalExpanded}
                                updateBuildingBlockText={changes => updateBuildingBlockText(goal.id, block.id, changes, goals, setGoals)}
                                updateBuildingBlockDueDate={dateStr => updateBuildingBlockDueDate(goal.id, block.id, dateStr, goals, setGoals)}
                                updateBuildingBlockStatus={status => updateBuildingBlockStatus(goal.id, block.id, status, goals, setGoals)}
                                deleteBuildingBlock={() => deleteBuildingBlock(goal.id, block.id, goals, setGoals)}
                            />
                        ))
                    ) : (
                        <TableRow className="bg-muted/50">
                            <TableCell colSpan={3} className="text-center text-muted-foreground py-4">
                                No building blocks yet. Right-click to add one.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </ContextActions>
    )
}