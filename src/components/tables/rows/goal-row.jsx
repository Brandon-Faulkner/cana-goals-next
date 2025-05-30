import React, { useState, useEffect } from 'react';
import { ContextActions } from '@/components/tables/context-actions';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { StatusSelect } from '@/components/tables/status-select';
import { DatePicker } from '@/components/tables/date-picker';
import { DropdownActions } from '@/components/tables/dropdown-actions';
import { ChevronsUpDown, ListChecks, Grid2X2Plus, MessageSquarePlus, Trash2 } from 'lucide-react';

export const GoalRow = React.memo(function GoalRow({
  goal,
  isOwner,
  expanded,
  toggleGoalExpanded,
  addGoal,
  updateGoalText,
  updateGoalDueDate,
  updateGoalStatus,
  addBuildingBlock,
  addComment,
  deleteGoal,
}) {
  const [text, setText] = useState(goal.text || '');
  const [dueDate, setDueDate] = useState(goal.dueDate?.toDateString() || null);

  useEffect(() => setText(goal.text || ''), [goal.text]);
  useEffect(() => {
    setDueDate(goal.dueDate?.toDateString() || null);
  }, [goal.dueDate]);

  const handleTextChange = (e) => {
    if (!isOwner) return;
    const text = e.target.value;
    setText(text);
    updateGoalText(text);
  };

  const handleDateChange = (newDate) => {
    if (!isOwner) return;
    setDueDate(newDate);
    updateGoalDueDate(newDate);
  };

  const contextActions = [
    { text: expanded ? 'Collapse' : 'Expand', icon: ChevronsUpDown, action: toggleGoalExpanded },
    'seperator',
    { text: 'Add Goal', icon: ListChecks, action: addGoal, disabled: !isOwner },
    { text: 'Add Building Block', icon: Grid2X2Plus, action: addBuildingBlock, disabled: !isOwner },
    {
      text: 'Add Comment',
      icon: MessageSquarePlus,
      dialog: true,
      dialogContent: (props) => addComment(props),
    },
    'seperator',
    {
      text: 'Delete Goal',
      icon: Trash2,
      dialog: true,
      dialogContent: (props) => deleteGoal(props),
      destructive: true,
      disabled: !isOwner,
    },
  ];

  return (
    <ContextActions actions={contextActions}>
      <TableRow className='group animate-in fade-in-0 zoom-in-95'>
        <TableCell>
          <div className='flex items-start gap-2'>
            <Button
              variant='ghost'
              size='icon'
              className='mt-1.5 h-6 w-6 flex-shrink-0'
              onClick={toggleGoalExpanded}
            >
              {expanded ? (
                <ChevronDown className='h-4 w-4' />
              ) : (
                <ChevronRight className='h-4 w-4' />
              )}
            </Button>
            <div className='w-full'>
              <Textarea
                value={text}
                onChange={handleTextChange}
                placeholder='Enter goal'
                className='min-h-9 min-w-52'
                readOnly={!isOwner}
              />
            </div>
          </div>
        </TableCell>
        <TableCell className='align-top'>
          <DatePicker date={dueDate} onDateChange={handleDateChange} disabled={!isOwner} />
        </TableCell>
        <TableCell className='flex items-start justify-between align-top'>
          <StatusSelect value={goal.status} onValueChange={updateGoalStatus} disabled={!isOwner} />

          <DropdownActions actions={contextActions} />
        </TableCell>
      </TableRow>
    </ContextActions>
  );
});
