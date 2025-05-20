export function addComment(goalId, goals, setGoals) {
  const newComment = {
    id: `comment-${goalId}-${Date.now()}`,
    text: ""
  }
  setGoals(goals.map(goal =>
    goal.id === goalId ? {
      ...goal,
      comments: [...goal.comments, newComment]
    } : goal
  ))
}

export function updateCommentText(goalId, commentId, text, goals, setGoals) {
  setGoals(goals.map(goal =>
    goal.id === goalId ? {
      ...goal,
      comments: goal.comments.map(comment =>
        comment.id === commentId ? { ...comment, text } : comment
      )
    } : goal
  ))
} 

export function deleteComment(goalId, commentId, goals, setGoals) {
  setGoals(goals.map(goal =>
    goal.id === goalId ? {
      ...goal,
      comments: goal.comments.filter(comment => comment.id !== commentId)
    } : goal
  ))
}