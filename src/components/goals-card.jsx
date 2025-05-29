import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GoalTable } from '@/components/tables/goal-table';

export const GoalsCard = React.memo(function GoalsCard({
  userId,
  userName,
  goals,
  currentSemester,
}) {
  return (
    <Card className='animate-in fade-in-0 zoom-in-95'>
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
