import React, { useCallback } from 'react';
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
import { ChevronsUpDown, Grid2x2Plus } from 'lucide-react';

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

export const BuildingBlockTable = React.memo(function BuildingBlockTable({
  goal,
  semesterId,
  isOwner,
  userName,
  expanded,
  toggleGoalExpanded,
  addBuildingBlock,
}) {
  const debouncedBlockText = useDebouncedBlockText(semesterId, goal.id);

  const handleUpdateBuildingBlockDate = (blockId, date) => {
    if (!isOwner) {
      toast.error('You can only update building blocks on your own goals.');
      return;
    }
    toast.promise(updateBuildingBlockDueDate(semesterId, goal.id, blockId, date), {
      loading: 'Saving building block due date...',
      success: 'Building block due date saved',
      error: 'Failed to save building block due date',
    });
  };

  const handleUpdateBuildingBlockStatus = (blockId, status) => {
    if (!isOwner) {
      toast.error('You can only update building blocks on your own goals.');
      return;
    }
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
          if (!isOwner) {
            toast.error('You can only delete your own building blocks.');
            props.onSuccess?.(false);
            return null;
          }
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

  const contextActions = [
    { text: expanded ? 'Collapse' : 'Expand', icon: ChevronsUpDown, action: toggleGoalExpanded },
    'seperator',
    { text: 'Add Building Block', icon: Grid2x2Plus, action: addBuildingBlock, disabled: !isOwner },
  ];

  return (
    <ContextActions actions={contextActions}>
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/70'>
            <TableHead className='w-1/2 text-base font-medium'>Building Blocks</TableHead>
            <TableHead className='w-1/4 text-base font-medium'>Due Date</TableHead>
            <TableHead className='flex w-auto items-center justify-between text-base font-medium'>
              <span>Status</span>
              <DropdownActions actions={contextActions} />
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
                  isOwner={isOwner}
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
                {isOwner ? (
                  <>Right-click or use the 3-dot menu to add a building block.</>
                ) : (
                  <>{userName} hasn't added any building blocks yet.</>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContextActions>
  );
});
