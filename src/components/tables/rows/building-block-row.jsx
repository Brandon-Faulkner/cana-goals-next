import React, { useState, useEffect } from 'react';
import { ContextActions } from '@/components/tables/context-actions';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { StatusSelect } from '@/components/tables/status-select';
import { DatePicker } from '@/components/tables/date-picker';
import { DropdownActions } from '@/components/tables/dropdown-actions';
import { ChevronsUpDown, Trash2, Grid2x2Plus } from 'lucide-react';

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
  const [dueDate, setDueDate] = useState(buildingBlock.dueDate?.toDateString() || null);

  useEffect(() => setText(buildingBlock.text || ''), [buildingBlock.text]);
  useEffect(() => {
    setDueDate(buildingBlock.dueDate?.toDateString() || null);
  }, [buildingBlock.dueDate]);

  const handleTextChange = (e) => {
    if (!isOwner) return;
    const text = e.target.value;
    setText(text);
    updateBuildingBlockText(text);
  };

  const handleDateChange = (newDate) => {
    if (!isOwner) return;
    setDueDate(newDate);
    updateBuildingBlockDueDate(newDate);
  };

  const contextActions = [
    { text: expanded ? 'Collapse' : 'Expand', icon: ChevronsUpDown, action: toggleGoalExpanded },
    'seperator',
    { text: 'Add Building Block', icon: Grid2x2Plus, action: addBuildingBlock, disabled: !isOwner },
    'seperator',
    {
      text: 'Delete Building Block',
      icon: Trash2,
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
                onChange={handleTextChange}
                placeholder='Enter building block'
                className='min-h-9 min-w-52'
                readOnly={!isOwner}
                disabled={!isOwner}
              />
            </div>
          </div>
        </TableCell>
        <TableCell className='align-top'>
          <DatePicker date={dueDate} onDateChange={handleDateChange} disabled={!isOwner} />
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
