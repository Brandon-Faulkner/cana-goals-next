import { ContextActions } from "@/components/tables/context-actions";
import { CommentRow } from "@/components/tables/rows/comment-row";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { addComment, updateCommentText, deleteComment } from "@/lib/comment-handlers";

export function CommentTable({ goals, goal, setGoals, expanded, toggleGoalExpanded }) {
    return (
        <ContextActions actions={[
            { text: expanded ? "Collapse" : "Expand", action: toggleGoalExpanded },
            { text: "Add Comment", action: () => addComment(goal.id, goals, setGoals) }
        ]}>
            <Table>
                <TableHeader>
                    <TableRow className="bg-muted/70">
                        <TableHead colSpan={3} className="font-medium text-base">
                            Comments
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {goal.comments.length > 0 ? (
                        goal.comments.map(comment => (
                            <CommentRow
                                key={comment.id}
                                comment={comment}
                                expanded={expanded}
                                toggleGoalExpanded={toggleGoalExpanded}
                                updateCommentText={changes => updateCommentText(goal.id, comment.id, changes, goals, setGoals)}
                                deleteComment={() => deleteComment(goal.id, comment.id, goals, setGoals)}
                            />
                        ))
                    ) : (
                        <TableRow className="bg-muted/50">
                            <TableCell
                                colSpan={3}
                                className="text-center text-muted-foreground py-4"
                            >
                                No comments yet. Right-click to add one.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </ContextActions>
    )
}