'use client';
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
    <Card>
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
