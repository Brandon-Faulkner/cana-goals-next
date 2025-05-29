import React, { useState, useEffect } from 'react';
import { ContextActions } from '@/components/tables/context-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { StatusSelect } from '@/components/tables/status-select';
import { DropdownActions } from '@/components/tables/dropdown-actions';

export const BuildingBlockRow = React.memo(function BuildingBlockRow({
  buildingBlock,
  expanded,
  toggleGoalExpanded,
  isOwner,
  addBuildingBlock,
  updateBuildingBlockText,
  updateBuildingBlockDueDate,
  updateBuildingBlockStatus,
  deleteBuildingBlock,
}) {
  const [text, setText] = useState(buildingBlock.text || '');
  useEffect(() => setText(buildingBlock.text || ''), [buildingBlock.text]);

  const onTextChange = (e) => {
    if (!isOwner) return;
    const text = e.target.value;
    setText(text);
    updateBuildingBlockText(text);
  };

  const contextActions = [
    { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
    'seperator',
    { text: 'Add Building Block', action: addBuildingBlock, disabled: !isOwner },
    'seperator',
    {
      text: 'Delete Building Block',
      dialog: true,
      dialogContent: (props) => deleteBuildingBlock(props),
      destructive: true,
      disabled: !isOwner,
    },
  ];

  return (
    <ContextActions actions={contextActions}>
      <TableRow className='group bg-muted/50 animate-in fade-in-0 zoom-in-95'>
        <TableCell>
          <div className='flex items-start gap-2'>
            <div className='w-full'>
              <Textarea
                value={text}
                onChange={onTextChange}
                placeholder='Enter building block'
                className='min-h-9 min-w-52'
                readOnly={!isOwner}
              />
            </div>
          </div>
        </TableCell>
        <TableCell className='align-top'>
          <Input
            type='date'
            value={buildingBlock.dueDate ? buildingBlock.dueDate.toISOString().slice(0, 10) : ''}
            onChange={updateBuildingBlockDueDate}
            disabled={!isOwner}
          />
        </TableCell>
        <TableCell className='flex items-start justify-between align-top'>
          <StatusSelect
            value={buildingBlock.status}
            onValueChange={updateBuildingBlockStatus}
            disabled={!isOwner}
          />

          <DropdownActions actions={contextActions} />
        </TableCell>
      </TableRow>
    </ContextActions>
  );
});
