import { ContextActions } from "@/components/tables/context-actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TableCell, TableRow } from "@/components/ui/table";
import { formatDateForInput } from "../goal-table";
import { StatusSelect } from "@/components/tables/status-select";
import { DropdownActions } from "@/components/tables/dropdown-actions";

export function BuildingBlockRow({
    buildingBlock,
    expanded,
    toggleGoalExpanded,
    updateBuildingBlockText,
    updateBuildingBlockDueDate,
    updateBuildingBlockStatus,
    deleteBuildingBlock
}) {
    return (
        <ContextActions actions={[
            { text: expanded ? "Collapse" : "Expand", action: toggleGoalExpanded },
            "seperator",
            { text: "Delete Building Block", action: deleteBuildingBlock, destructive: true }
        ]}>
            <TableRow className="group bg-muted/50" >
                <TableCell>
                    <div className="flex items-start gap-2">
                        <div className="w-full max-w-[800px]">
                            <Textarea
                                value={buildingBlock.text}
                                onChange={updateBuildingBlockText}
                                placeholder="Enter building block"
                                className="min-w-[200px] h-9 min-h-9"
                            />
                        </div>
                    </div>
                </TableCell>
                <TableCell className="align-top">
                    <Input
                        type="date"
                        value={formatDateForInput(buildingBlock.dueDate)}
                        onChange={updateBuildingBlockDueDate}
                    />
                </TableCell>
                <TableCell className="align-top flex items-start justify-between">
                    <StatusSelect
                        value={buildingBlock.status}
                        onValueChange={updateBuildingBlockStatus}
                    />

                    <DropdownActions actions={[
                        { text: "Delete Building Block", onClick: deleteBuildingBlock, destructive: true }
                    ]}
                    />
                </TableCell>
            </TableRow>
        </ContextActions>
    )
}