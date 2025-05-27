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
import { CommentRow } from '@/components/tables/rows/comment-row';
import { DeleteDialog } from '@/components/dialogs/delete-dialog';
import { updateCommentText, deleteComment } from '@/lib/comment-handlers';

const useDebouncedCommentText = (semesterId, goalId) => {
  return useCallback(
    debounce((id, text) => {
      toast.promise(updateCommentText(semesterId, goalId, id, text), {
        loading: 'Saving comment changes...',
        success: 'Comment changes saved',
        error: 'Failed to save comment changes',
      });
    }, 1000),
    [semesterId, goalId],
  );
};

export function CommentTable({ goal, semesterId, expanded, toggleGoalExpanded, addComment }) {
  const debouncedCommentText = useDebouncedCommentText(semesterId, goal.id);

  const handleDeleteComment = (props, commentId) => {
    return (
      <DeleteDialog
        triggerText='Delete Comment'
        deleteAction={() => {
          return toast.promise(deleteComment(semesterId, goal.id, commentId), {
            loading: 'Deleting comment...',
            success: () => {
              props.onSuccess?.(true);
              return 'Comment deleted';
            },
            error: () => {
              props.onSuccess?.(false);
              return 'Failed to delete comment';
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
        {
          text: 'Add Comment',
          dialog: true,
          dialogContent: (props) => addComment(props),
        },
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/70'>
            <TableHead
              colSpan={3}
              className='flex w-auto items-center justify-between text-base font-medium'
            >
              <span>Comments</span>
              <DropdownActions
                actions={[
                  { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
                  'seperator',
                  {
                    text: 'Add Comment',
                    dialog: true,
                    dialogContent: (props) => addComment(props),
                  },
                ]}
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goal.comments.length > 0 ? (
            goal.comments
              .slice()
              .sort((a, b) => a.createdAt - b.createdAt)
              .map((comment) => (
                <CommentRow
                  key={comment.id}
                  comment={comment}
                  expanded={expanded}
                  toggleGoalExpanded={toggleGoalExpanded}
                  addComment={addComment}
                  updateCommentText={(text) => debouncedCommentText(comment.id, text)}
                  deleteComment={(props) => handleDeleteComment(props, comment.id)}
                />
              ))
          ) : (
            <TableRow className='bg-muted/50'>
              <TableCell colSpan={3} className='text-muted-foreground text-center'>
                Right-click or use the 3-dot menu to add a comment.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContextActions>
  );
}
