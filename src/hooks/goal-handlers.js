export function addGoal(goals, setGoals, setExpandedGoals) {
    const newGoal = {
        id: `goal-${Date.now()}`,
        text: "",
        dueDate: null,
        status: "Not Started",
        buildingBlocks: [],
        comments: []
    }
    setGoals([...goals, newGoal])
    setExpandedGoals(prev => ({ ...prev, [newGoal.id]: true }))
}

export function updateGoalText(goalId, changes, goals, setGoals) {
    setGoals(goals.map(goal => goal.id === goalId ? { ...goal, ...changes } : goal))
}

export function updateGoalDueDate(goalId, dateStr, goals, setGoals) {
    const dueDate = dateStr ? new Date(dateStr) : null
    setGoals(
        goals.map(goal => (goal.id === goalId ? { ...goal, dueDate } : goal))
    )
}

export function updateGoalStatus(goalId, status, goals, setGoals) {
    setGoals(
        goals.map(goal => (goal.id === goalId ? { ...goal, status } : goal))
    )
}

export function deleteGoal(goalId, goals, setGoals) {
    setGoals(goals.filter(goal => goal.id !== goalId))
}

export function toggleGoalExpanded(goalId, setExpandedGoals) {
    setExpandedGoals(prev => ({ ...prev, [goalId]: !prev[goalId] }))
}
