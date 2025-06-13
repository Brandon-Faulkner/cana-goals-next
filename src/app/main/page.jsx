'use client';
import { useEffect, useState, useMemo } from 'react';
import RouteGuard from '@/components/auth/route-guard';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChevronsRight, CircleCheck, Loader2, XCircle } from 'lucide-react';
import { SemesterOverview, chartConfig } from '@/components/semester-overview';
import { GoalFocus } from '@/components/goal-focus';
import { GoalsCard } from '@/components/goals-card';
import { SemesterOverviewSkeleton } from '@/components/skeletons/semester-overview-skeleton';
import { GoalFocusSkeleton } from '@/components/skeletons/goal-focus-skeleton';
import { GoalsCardSkeleton } from '@/components/skeletons/goals-card-skeleton';
import { useSemesters } from '@/hooks/use-semesters';
import { useGoalsListener } from '@/hooks/use-goals-listener';
import { useSavingState } from '@/contexts/saving-state-context';
import { useAuth } from '@/contexts/auth-provider';
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function Page() {
  const { user, userDoc, loading: loadingAuth } = useAuth();
  const { semesters, loading, currentSemester, setCurrentSemester } = useSemesters();
  const [semesterFocus, setSemesterFocus] = useState('');
  const { goals, loading: goalsLoading } = useGoalsListener(currentSemester?.id, user, loadingAuth);
  const {
    savingState: { isSaving, hasError },
  } = useSavingState();
  const [highlightedUserId, setHighlightedUserId] = useState(null);

  useEffect(() => {
    document.title = 'Cana Goals | Dashboard';
  }, []);

  useEffect(() => {
    // Fetch semester focus
    if (currentSemester?.id) {
      const focusRef = doc(db, 'semesters', currentSemester.id);
      const unsubFocus = onSnapshot(focusRef, (snap) => {
        setSemesterFocus(snap.data()?.focus || '');
      });
      return () => unsubFocus();
    }
  }, [currentSemester?.id]);

  const [peopleData, semesterStatuses] = useMemo(() => {
    const statuses = ['Not Working On', 'Working On', 'Completed', 'Waiting', 'Stuck'];

    // Flatten all building blocks across every goal and non-empty building block text
    const allBlocks = goals
      .flatMap((g) => g.buildingBlocks || [])
      .filter((block) => block.text?.trim());

    // Aggregate per-user stats
    const peopleMap = new Map();
    for (const goal of goals) {
      if (!goal.userId) continue;
      if (!peopleMap.has(goal.userId)) {
        peopleMap.set(goal.userId, {
          id: goal.userId,
          name: goal.userName,
          goals: 0,
          blocks: 0,
          goalsCompleted: 0,
          blocksCompleted: 0,
        });
      }
      const person = peopleMap.get(goal.userId);
      if (goal.text?.trim()) person.goals += 1;
      if (goal.status === 'Completed' && goal.text?.trim()) person.goalsCompleted += 1;
      // Count building blocks for this goal
      if (Array.isArray(goal.buildingBlocks)) {
        const blocks = goal.buildingBlocks.filter((b) => b.text?.trim());
        person.blocks += blocks.length;
        person.blocksCompleted += blocks.filter((b) => b.status === 'Completed').length;
      }
    }
    const peopleData = Array.from(peopleMap.values());

    // Status breakdown for chart
    const semesterStatuses = statuses.map((status) => {
      const configKey = status.toLowerCase().replace(/\s+/g, '');
      const goalCount = goals.filter((g) => g.status === status && g.text?.trim()).length;
      const blockCount = allBlocks.filter((b) => b.status === status).length;
      return {
        status: configKey,
        goals: goalCount,
        blocks: blockCount,
        fill: chartConfig[configKey]?.color,
      };
    });

    return [peopleData, semesterStatuses];
  }, [goals]);

  useEffect(() => {
    if (highlightedUserId) {
      const timer = setTimeout(() => {
        setHighlightedUserId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedUserId]);

  const scrollToUserGoalCard = (userId) => {
    setHighlightedUserId(userId);
    const cardId = `user-goals-${userId}`;
    const cardElement = document.getElementById(cardId);
    if (cardElement) {
      const cardRect = cardElement.getBoundingClientRect();
      const cardTopRelativeToDocument = cardRect.top + window.scrollY;
      const targetScrollY = cardTopRelativeToDocument - 72; //Header height of 64px + some extra padding
      window.scrollTo({ top: targetScrollY, behavior: 'smooth' });
    }
  };

  return (
    <RouteGuard>
      <SidebarProvider>
        <AppSidebar
          semesters={semesters}
          loadingSemesters={loading}
          currentSemester={currentSemester}
          onSelectSemester={setCurrentSemester}
          usersInCurrentSemester={peopleData}
          onUserSelect={scrollToUserGoalCard}
        />
        <SidebarInset>
          <header className='bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <div className='mx-auto flex w-full items-center justify-between'>
              <div className='flex flex-col items-start sm:flex-row sm:items-center'>
                {loading ? (
                  <div className='bg-muted h-5 w-40 animate-pulse rounded' />
                ) : currentSemester ? (
                  <>
                    <h1 className='text-base font-medium'>{currentSemester.semester}</h1>
                    <ChevronsRight className='mx-2 hidden size-4 sm:block' />
                    <p className='text-xs italic sm:text-sm'>
                      {currentSemester.start.toDate().toLocaleDateString()} -{' '}
                      {currentSemester.end.toDate().toLocaleDateString()}
                    </p>
                  </>
                ) : (
                  <h1 className='text-base font-medium'>No current semester</h1>
                )}
              </div>
              <div className='flex items-center gap-4'>
                <div className='flex items-center gap-2'>
                  {isSaving ? (
                    <>
                      <Loader2 className='text-primary animate-spin' />
                      <span className='max-xs:hidden'>Saving...</span>
                    </>
                  ) : hasError ? (
                    <>
                      <XCircle className='text-destructive' />
                      <span className='max-xs:hidden'>Error Saving</span>
                    </>
                  ) : (
                    <>
                      <CircleCheck className='text-primary' />
                      <span className='max-xs:hidden'>Up to Date</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>
          <div className='flex flex-1 flex-col gap-4 p-4'>
            {loading || goalsLoading ? (
              <SemesterOverviewSkeleton />
            ) : (
              <SemesterOverview semesterData={semesterStatuses} peopleData={peopleData} />
            )}
            {loading || goalsLoading ? (
              <GoalFocusSkeleton />
            ) : (
              <GoalFocus semesterId={currentSemester?.id} focus={semesterFocus} />
            )}

            {/* Always render the current user's table first */}
            {loadingAuth || goalsLoading ? (
              <GoalsCardSkeleton />
            ) : (
              userDoc &&
              currentSemester && (
                <GoalsCard
                  key={userDoc.id}
                  userId={userDoc.id}
                  userName={userDoc.name}
                  goals={goals.filter((g) => g.userId === userDoc.id)}
                  currentSemester={currentSemester}
                  isHighlighted={highlightedUserId === userDoc.id}
                />
              )
            )}

            {/* Render other users tables if they have goals, EXCLUDING the current user */}
            {goalsLoading
              ? Array.from({ length: 2 }).map((_, index) => (
                  <GoalsCardSkeleton key={`other-skeleton-${index}`} />
                ))
              : Object.entries(
                  goals.reduce((acc, goal) => {
                    if (!acc[goal.userId]) {
                      acc[goal.userId] = {
                        userName: goal.userName,
                        goals: [],
                      };
                    }
                    acc[goal.userId].goals.push(goal);
                    return acc;
                  }, {}),
                )
                  .filter(
                    ([otherUserId, userData]) =>
                      userDoc && otherUserId !== userDoc.id && userData.goals.length > 0,
                  )
                  .map(([otherUserId, { userName: otherUserName, goals: otherUserGoals }]) => (
                    <GoalsCard
                      key={otherUserId}
                      userId={otherUserId}
                      userName={otherUserName}
                      goals={otherUserGoals}
                      currentSemester={currentSemester}
                      isHighlighted={highlightedUserId === otherUserId}
                    />
                  ))}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
}
