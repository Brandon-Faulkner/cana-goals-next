import { useCallback } from 'react';
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
import { ContextActions } from '@/components/tables/context-actions';
import { BuildingBlockRow } from '@/components/tables/rows/building-block-row';
import {
  addBuildingBlock,
  updateBuildingBlockText,
  updateBuildingBlockDueDate,
  updateBuildingBlockStatus,
  deleteBuildingBlock,
} from '@/lib/building-block-handlers';

const useDebouncedTextUpdater = (semesterId, goalId) => {
  return useCallback(
    debounce((id, text) => {
      toast.promise(updateBuildingBlockText(semesterId, goalId, id, text), {
        loading: 'Saving building block changes...',
        success: 'Building block changes saved',
        error: 'Failed to save building block changes',
      });
    }, 1000),
    [semesterId],
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
        { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
        {
          text: 'Add Building Block',
          action: () =>
            handleAction(addBuildingBlock(semesterId, goal.id, initialDueDate), {
              loading: 'Adding new building block...',
              success: 'New building block added',
              error: 'Failed to add new building block',
            }),
        },
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/70'>
            <TableHead className='w-1/2 text-base font-medium'>Building Blocks</TableHead>
            <TableHead className='w-1/4 text-base font-medium'>Due Date</TableHead>
            <TableHead className='w-1/4 text-base font-medium'>Status</TableHead>
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
                updateBuildingBlockText={(text) => debouncedUpdate(block.id, text)}
                updateBuildingBlockDueDate={(date) =>
                  handleAction(updateBuildingBlockDueDate(semesterId, goal.id, block.id, date), {
                    loading: 'Saving building block due date...',
                    success: 'Building block due date saved',
                    error: 'Failed to save building block due date',
                  })
                }
                updateBuildingBlockStatus={(status) =>
                  handleAction(updateBuildingBlockStatus(semesterId, goal.id, block.id, status), {
                    loading: 'Saving building block status...',
                    success: 'Building block status saved',
                    error: 'Failed to save building block status',
                  })
                }
                deleteBuildingBlock={() =>
                  handleAction(deleteBuildingBlock(semesterId, goal.id, block.id), {
                    loading: 'Deleting building block...',
                    success: 'Building block deleted',
                    error: 'Failed to delete building block',
                  })
                }
              />
            ))
          ) : (
            <TableRow className='bg-muted/50'>
              <TableCell colSpan={3} className='text-muted-foreground py-4 text-center'>
                No building blocks yet. Right-click to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContextActions>
  );
}
