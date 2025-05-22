import { useState, useEffect } from 'react';
import { ContextActions } from '@/components/tables/context-actions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { formatDateForInput } from '../goal-table';
import { StatusSelect } from '@/components/tables/status-select';
import { DropdownActions } from '@/components/tables/dropdown-actions';

export function BuildingBlockRow({
  buildingBlock,
  expanded,
  toggleGoalExpanded,
  updateBuildingBlockText,
  updateBuildingBlockDueDate,
  updateBuildingBlockStatus,
  deleteBuildingBlock,
}) {
  const [text, setText] = useState(buildingBlock.text || '');
  useEffect(() => setText(buildingBlock.text || ''), [buildingBlock.text]);

  const onTextChange = (e) => {
    const text = e.target.value;
    setText(text);
    updateBuildingBlockText(text);
  };

  return (
    <ContextActions
      actions={[
        { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
        'seperator',
        {
          text: 'Delete Building Block',
          action: deleteBuildingBlock,
          destructive: true,
        },
      ]}
    >
      <TableRow className='group bg-muted/50'>
        <TableCell>
          <div className='flex items-start gap-2'>
            <div className='w-full max-w-[800px]'>
              <Textarea
                value={text}
                onChange={onTextChange}
                placeholder='Enter building block'
                className='h-9 min-h-9 min-w-[200px]'
              />
            </div>
          </div>
        </TableCell>
        <TableCell className='align-top'>
          <Input
            type='date'
            value={buildingBlock.dueDate ? buildingBlock.dueDate.toISOString().slice(0, 10) : ''}
            onChange={updateBuildingBlockDueDate}
          />
        </TableCell>
        <TableCell className='flex items-start justify-between align-top'>
          <StatusSelect value={buildingBlock.status} onValueChange={updateBuildingBlockStatus} />

          <DropdownActions
            actions={[
              {
                text: 'Delete Building Block',
                onClick: deleteBuildingBlock,
                destructive: true,
              },
            ]}
          />
        </TableCell>
      </TableRow>
    </ContextActions>
  );
}
