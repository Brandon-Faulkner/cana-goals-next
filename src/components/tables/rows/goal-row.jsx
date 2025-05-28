import React, { useState, useEffect } from 'react';
import { ContextActions } from '@/components/tables/context-actions';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { StatusSelect } from '@/components/tables/status-select';
import { DropdownActions } from '@/components/tables/dropdown-actions';

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
  useEffect(() => setText(goal.text || ''), [goal.text]);

  const onTextChange = (e) => {
    if (!isOwner) return;
    const text = e.target.value;
    setText(text);
    updateGoalText(text);
  };

  const contextActions = [
    { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
    'seperator',
    { text: 'Add Goal', action: addGoal, disabled: !isOwner },
    { text: 'Add Building Block', action: addBuildingBlock, disabled: !isOwner },
    { text: 'Add Comment', dialog: true, dialogContent: (props) => addComment(props) },
    'seperator',
    {
      text: 'Delete Goal',
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
                onChange={onTextChange}
                placeholder='Enter goal'
                className='min-h-9 min-w-52'
                readOnly={!isOwner}
              />
            </div>
          </div>
        </TableCell>
        <TableCell className='align-top'>
          <Input
            type='date'
            value={goal.dueDate ? goal.dueDate.toISOString().slice(0, 10) : ''}
            onChange={updateGoalDueDate}
            disabled={!isOwner}
          />
        </TableCell>
        <TableCell className='flex items-start justify-between align-top'>
          <StatusSelect value={goal.status} onValueChange={updateGoalStatus} disabled={!isOwner}/>

          <DropdownActions actions={contextActions} />
        </TableCell>
      </TableRow>
    </ContextActions>
  );
});
