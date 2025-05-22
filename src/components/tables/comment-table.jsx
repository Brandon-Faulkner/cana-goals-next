import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ContextActions } from '@/components/tables/context-actions';
import { CommentRow } from '@/components/tables/rows/comment-row';
import { addComment, updateCommentText, deleteComment } from '@/lib/comment-handlers';

export function CommentTable({ goal, semesterId, userId, userName, expanded, toggleGoalExpanded }) {
  const handleAction = (promise, msgs) => toast.promise(promise, msgs);

  return (
    <ContextActions
      actions={[
        { text: expanded ? 'Collapse' : 'Expand', action: toggleGoalExpanded },
        {
          text: 'Add Comment',
          action: () =>
            handleAction(addComment(semesterId, goal.id, userId, userName), {
              loading: 'Adding…',
              success: 'Added ✓',
              error: 'Failed',
            }),
        },
      ]}
    >
      <Table>
        <TableHeader>
          <TableRow className='bg-muted/70'>
            <TableHead colSpan={3} className='text-base font-medium'>
              Comments
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {goal.comments.length > 0 ? (
            goal.comments.map((comment) => (
              <CommentRow
                key={comment.id}
                comment={comment}
                expanded={expanded}
                toggleGoalExpanded={toggleGoalExpanded}
                updateCommentText={(text) =>
                  updateCommentText(semesterId, goal.id, comment.id, text)
                }
                deleteComment={() =>
                  handleAction(deleteComment(semesterId, goal.id, comment.id), {
                    loading: 'Deleting…',
                    success: 'Deleted ✓',
                    error: 'Failed',
                  })
                }
              />
            ))
          ) : (
            <TableRow className='bg-muted/50'>
              <TableCell colSpan={3} className='text-muted-foreground py-4 text-center'>
                No comments yet. Right-click to add one.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ContextActions>
  );
}
