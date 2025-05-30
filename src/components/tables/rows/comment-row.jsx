import React, { useState, useEffect } from 'react';
import { ContextActions } from '@/components/tables/context-actions';
import { Textarea } from '@/components/ui/textarea';
import { TableCell, TableRow } from '@/components/ui/table';
import { DropdownActions } from '../dropdown-actions';
import { ChevronsUpDown, MessageSquarePlus, Trash2 } from 'lucide-react';

export const CommentRow = React.memo(function CommentRow({
  comment,
  currentUser,
  expanded,
  toggleGoalExpanded,
  addComment,
  updateCommentText,
  deleteComment,
}) {
  const isOwner = currentUser?.id === comment.userId;
  const [text, setText] = useState(comment.text || '');
  useEffect(() => setText(comment.text || ''), [comment.text]);

  const onTextChange = (e) => {
    if (!isOwner) return;
    const text = e.target.value;
    setText(text);
    updateCommentText(text);
  };

  const contextActions = [
    { text: expanded ? 'Collapse' : 'Expand', icon: ChevronsUpDown, action: toggleGoalExpanded },
    'seperator',
    {
      text: 'Add Comment',
      icons: MessageSquarePlus,
      dialog: true,
      dialogContent: (props) => addComment(props),
    },
    'seperator',
    {
      text: 'Delete Comment',
      icon: Trash2,
      dialog: true,
      dialogContent: (props) => deleteComment(props),
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
                placeholder={isOwner ? 'Enter comment' : 'View comment'}
                readOnly={!isOwner}
              />
            </div>
          </div>
        </TableCell>
        <TableCell className='flex items-start justify-between align-top'>
          {comment.userName || 'User'}

          <DropdownActions actions={contextActions} />
        </TableCell>
      </TableRow>
    </ContextActions>
  );
});
