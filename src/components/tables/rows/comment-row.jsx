import { useState, useEffect } from 'react';
import { ContextActions } from '@/components/tables/context-actions';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { DropdownActions } from '../dropdown-actions';

export function CommentRow({
  comment,
  expanded,
  toggleGoalExpanded,
  addComment,
  updateCommentText,
  deleteComment,
}) {
  const [text, setText] = useState(comment.text || '');
  useEffect(() => setText(comment.text || ''), [comment.text]);

  const onTextChange = (e) => {
    const text = e.target.value;
    setText(text);
    updateCommentText(text);
  };

  return (
    <ContextActions
      actions={[
        { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
        'seperator',
        { text: 'Add Comment', dialog: true, dialogContent: (props) => addComment(props) },
        'seperator',
        { text: 'Delete Comment', action: deleteComment, destructive: true },
      ]}
    >
      <TableRow className='group bg-muted/50'>
        <TableCell colSpan={3}>
          <div className='flex items-start gap-2'>
            <Textarea
              value={text}
              onChange={onTextChange}
              placeholder='Enter comment'
              className='w-full'
            />

            <DropdownActions
              actions={[
                { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
                'seperator',
                { text: 'Add Comment', dialog: true, dialogContent: (props) => addComment(props) },
                'seperator',
                { text: 'Delete Comment', action: deleteComment, destructive: true },
              ]}
            />
          </div>
        </TableCell>
      </TableRow>
    </ContextActions>
  );
}
