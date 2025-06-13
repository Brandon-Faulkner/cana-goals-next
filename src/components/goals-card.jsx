import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoalTable } from '@/components/tables/goal-table';
import { cn } from '@/lib/utils';

export const GoalsCard = React.memo(function GoalsCard({
  userId,
  userName,
  goals,
  currentSemester,
  isHighlighted,
}) {
  return (
    <Card
      id={`user-goals-${userId}`}
      className={cn(
        'animate-in fade-in-0 zoom-in-95 transition-all duration-300 ease-in-out',
        isHighlighted && 'border-primary ring-primary/30',
      )}
    >
      <CardHeader>
        <CardTitle className='text-lg'>{userName}</CardTitle>
      </CardHeader>
      <CardContent>
        <GoalTable
          userId={userId}
          userName={userName}
          goals={goals}
          currentSemester={currentSemester}
        />
      </CardContent>
    </Card>
  );
});
