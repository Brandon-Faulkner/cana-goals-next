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
import { DropdownActions } from '@/components/tables/dropdown-actions';
import { BuildingBlockRow } from '@/components/tables/rows/building-block-row';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import {
  updateBuildingBlockText,
  updateBuildingBlockDueDate,
  updateBuildingBlockStatus,
  deleteBuildingBlock,
} from '@/lib/building-block-handlers';

const useDebouncedBlockText = (semesterId, goalId) => {
  return useCallback(
    debounce((id, text) => {
      toast.promise(updateBuildingBlockText(semesterId, goalId, id, text), {
        loading: 'Saving building block changes...',
        success: 'Building block changes saved',
        error: 'Failed to save building block changes',
      });
    }, 1000),
    [semesterId, goalId],
  );
};

export function BuildingBlockTable({
  goal,
  semesterId,
  expanded,
  toggleGoalExpanded,
  addBuildingBlock,
}) {
  const debouncedBlockText = useDebouncedBlockText(semesterId, goal.id);

  const handleUpdateBuildingBlockDate = (blockId, date) => {
    toast.promise(updateBuildingBlockDueDate(semesterId, goal.id, blockId, date), {
      loading: 'Saving building block due date...',
      success: 'Building block due date saved',
      error: 'Failed to save building block due date',
    });
  };

  const handleUpdateBuildingBlockStatus = (blockId, status) => {
    toast.promise(updateBuildingBlockStatus(semesterId, goal.id, blockId, status), {
      loading: 'Saving building block status...',
      success: 'Building block status saved',
      error: 'Failed to save building block status',
    });
  };

  const handleDeleteBuildingBlock = (props, blockId) => {
    return (
      <DeleteDialog
        triggerText='Delete Building Block'
        deleteAction={() => {
          return toast.promise(deleteBuildingBlock(semesterId, goal.id, blockId), {
            loading: 'Deleting building block...',
            success: () => {
              props.onSuccess?.(true);
              return 'Building block deleted';
            },
            error: () => {
              props.onSuccess?.(false);
              return 'Failed to delete building block';
            },
          });
        }}
        {...props}
      />
    );
  };

  return (
    <ContextActions
      actions={[
        { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
        'seperator',
        { text: 'Add Building Block', action: addBuildingBlock },
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/70'>
            <TableHead className='w-1/2 text-base font-medium'>Building Blocks</TableHead>
            <TableHead className='w-1/4 text-base font-medium'>Due Date</TableHead>
            <TableHead className='flex w-auto items-center justify-between text-base font-medium'>
              <span>Status</span>
              <DropdownActions
                actions={[
                  { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
                  'seperator',
                  { text: 'Add Building Block', action: addBuildingBlock },
                ]}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goal.buildingBlocks.length > 0 ? (
            goal.buildingBlocks
              .slice()
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((block) => (
                <BuildingBlockRow
                  key={block.id}
                  buildingBlock={block}
                  expanded={expanded}
                  toggleGoalExpanded={toggleGoalExpanded}
                  addBuildingBlock={addBuildingBlock}
                  updateBuildingBlockText={(text) => debouncedBlockText(block.id, text)}
                  updateBuildingBlockDueDate={(date) =>
                    handleUpdateBuildingBlockDate(block.id, date)
                  }
                  updateBuildingBlockStatus={(status) =>
                    handleUpdateBuildingBlockStatus(block.id, status)
                  }
                  deleteBuildingBlock={(props) => handleDeleteBuildingBlock(props, block.id)}
                />
              ))
          ) : (
            <TableRow className='bg-muted/50'>
              <TableCell colSpan={3} className='text-muted-foreground text-center'>
                Right-click or use the 3-dot menu to add a building block.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContextActions>
  );
}
