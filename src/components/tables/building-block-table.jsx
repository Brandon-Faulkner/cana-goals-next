import { useCallback } from "react";
import { toast } from "sonner";
import debounce from "lodash/debounce";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContextActions } from "@/components/tables/context-actions";
import { BuildingBlockRow } from "@/components/tables/rows/building-block-row";
import {
  addBuildingBlock,
  updateBuildingBlockText,
  updateBuildingBlockDueDate,
  updateBuildingBlockStatus,
  deleteBuildingBlock,
} from "@/lib/building-block-handlers";

const useDebouncedTextUpdater = (semesterId, goalId) => {
  return useCallback(
    debounce((id, text) => {
      toast.promise(updateBuildingBlockText(semesterId, goalId, id, text), {
        loading: "Saving changes...",
        success: "Changes saved",
        error: "Failed to save changes",
      });
    }, 1000),
    [semesterId]
  );
};

export function BuildingBlockTable({
  goal,
  semesterId,
  expanded,
  toggleGoalExpanded,
  initialDueDate,
}) {
  const debouncedUpdate = useDebouncedTextUpdater(semesterId, goal.id);
  const handleAction = (promise, msgs) => toast.promise(promise, msgs);

  return (
    <ContextActions
      actions={[
        { text: expanded ? "Collapse" : "Expand", action: toggleGoalExpanded },
        {
          text: "Add Building Block",
          action: () =>
            handleAction(
              addBuildingBlock(semesterId, goal.id, initialDueDate),
              {
                loading: "Adding building block...",
                success: "Building block added",
                error: "Failed to add building block",
              }
            ),
        },
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/70">
            <TableHead className="w-1/2 font-medium text-base">
              Building Blocks
            </TableHead>
            <TableHead className="w-1/4 font-medium text-base">
              Due Date
            </TableHead>
            <TableHead className="w-1/4 font-medium text-base">
              Status
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goal.buildingBlocks.length > 0 ? (
            goal.buildingBlocks.map((block) => (
              <BuildingBlockRow
                key={block.id}
                buildingBlock={block}
                expanded={expanded}
                toggleGoalExpanded={toggleGoalExpanded}
                updateBuildingBlockText={(text) =>
                  debouncedUpdate(block.id, text)
                }
                updateBuildingBlockDueDate={(date) =>
                  handleAction(
                    updateBuildingBlockDueDate(
                      semesterId,
                      goal.id,
                      block.id,
                      date
                    ),
                    {
                      loading: "Saving date…",
                      success: "Saved ✓",
                      error: "Failed",
                    }
                  )
                }
                updateBuildingBlockStatus={(status) =>
                  handleAction(
                    updateBuildingBlockStatus(
                      semesterId,
                      goal.id,
                      block.id,
                      status
                    ),
                    {
                      loading: "Saving status…",
                      success: "Saved ✓",
                      error: "Failed",
                    }
                  )
                }
                deleteBuildingBlock={() =>
                  handleAction(
                    deleteBuildingBlock(semesterId, goal.id, block.id),
                    {
                      loading: "Deleting…",
                      success: "Deleted ✓",
                      error: "Failed",
                    }
                  )
                }
              />
            ))
          ) : (
            <TableRow className="bg-muted/50">
              <TableCell
                colSpan={3}
                className="text-center text-muted-foreground py-4"
              >
                No building blocks yet. Right-click to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContextActions>
  );
}
