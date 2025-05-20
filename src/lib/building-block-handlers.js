export function addBuildingBlock(goalId, goals, setGoals) {
    const newBlock = {
        id: `bb-${goalId}-${Date.now()}`,
        text: "",
        dueDate: null,
        status: "Not Started"
    }
    setGoals(goals.map(goal =>
        goal.id === goalId ? {
            ...goal,
            buildingBlocks: [...goal.buildingBlocks, newBlock]
        } : goal
    ))
}

export function updateBuildingBlockText(goalId, blockId, text, goals, setGoals) {
    setGoals(goals.map(goal =>
        goal.id === goalId ? {
            ...goal,
            buildingBlocks: goal.buildingBlocks.map(block =>
                block.id === blockId ? { ...block, text } : block
            )
        } : goal
    ))
}

export function updateBuildingBlockDueDate(goalId, blockId, dateStr, goals, setGoals) {
    const dueDate = dateStr ? new Date(dateStr) : null
    setGoals(goals.map(goal =>
        goal.id === goalId ? {
            ...goal,
            buildingBlocks: goal.buildingBlocks.map(block =>
                block.id === blockId ? { ...block, dueDate } : block
            )
        } : goal
    ))
}

export function updateBuildingBlockStatus(goalId, blockId, status, goals, setGoals) {
    setGoals(goals.map(goal =>
        goal.id === goalId ? {
            ...goal,
            buildingBlocks: goal.buildingBlocks.map(block =>
                block.id === blockId ? { ...block, status } : block
            )
        } : goal
    ))
}

export function deleteBuildingBlock(goalId, blockId, goals, setGoals) {
    setGoals(goals.map(goal =>
        goal.id === goalId ? {
            ...goal,
            buildingBlocks: goal.buildingBlocks.filter(block => block.id !== blockId)
        } : goal
    ))
}