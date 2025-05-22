'use client';
import { useEffect, useState, useMemo } from 'react';
import RouteGuard from '@/components/auth/route-guard';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronsRight, CircleCheck, Loader2, XCircle } from 'lucide-react';
import { SemesterOverview, chartConfig } from '@/components/semester-overview';
import { GoalFocus } from '@/components/goal-focus';
import { GoalTable } from '@/components/tables/goal-table';
import { useSemesters } from '@/hooks/use-semesters';
import { useSavingState } from '@/contexts/saving-state-context';
import { useAuth } from '@/contexts/auth-provider';
import { db } from '@/lib/firebase';
import { collection, collectionGroup, onSnapshot, query, where } from 'firebase/firestore';

export default function Page() {
  const { user, userDoc, loading: loadingAuth } = useAuth();
  const { semesters, loading, currentSemester, setCurrentSemester } = useSemesters();
  const [goals, setGoals] = useState([]);
  const {
    savingState: { isSaving, hasError },
  } = useSavingState();

  useEffect(() => {
    document.title = 'Cana Goals | Dashboard';
  }, []);

  useEffect(() => {
    if (loadingAuth || !user || !currentSemester?.id) return;
    const semId = currentSemester.id;
    console.log(user);

    // Listen for goal collection changes
    const unsubGoals = onSnapshot(collection(db, 'semesters', semId, 'goals'), (snap) => {
      setGoals((prev) => {
        const newGoals = snap.docs.map((d) => {
          // Find existing goal and preserve its buildingBlocks and comments
          const existingGoal = prev.find((g) => g.id === d.id);
          const data = d.data();
          return {
            id: d.id,
            ...data,
            text: data.text || '', // Ensure text is never undefined
            createdAt: data.createdAt?.toDate() || new Date(),
            dueDate: data.dueDate?.toDate() || new Date(),
            buildingBlocks: existingGoal?.buildingBlocks || [],
            comments: existingGoal?.comments || [],
          };
        });

        // Preserve goals that might not be in the new snapshot
        const preserveGoals = prev.filter((p) => !newGoals.some((n) => n.id === p.id));

        return [...newGoals, ...preserveGoals];
      });
    });

    // Listen for building block collection changes
    const blocksQuery = query(
      collectionGroup(db, 'buildingBlocks'),
      where('semesterId', '==', semId),
    );
    const unsubBlocks = onSnapshot(blocksQuery, (snap) => {
      setGoals((prev) =>
        prev.map((goal) => ({
          ...goal,
          buildingBlocks: snap.docs
            .filter((b) => b.data().goalId === goal.id)
            .map((b) => ({
              id: b.id,
              ...b.data(),
              createdAt: b.data().createdAt?.toDate(),
              dueDate: b.data().dueDate?.toDate(),
            })),
        })),
      );
    });

    // Listen for comment collection changes
    const commentsQuery = query(collectionGroup(db, 'comments'), where('semesterId', '==', semId));
    const unsubComments = onSnapshot(commentsQuery, (snap) => {
      setGoals((prev) =>
        prev.map((goal) => ({
          ...goal,
          comments: snap.docs
            .filter((c) => c.data().goalId === goal.id)
            .map((c) => ({
              id: c.id,
              ...c.data(),
              createdAt: c.data().createdAt?.toDate(),
            })),
        })),
      );
    });

    return () => {
      unsubGoals();
      unsubBlocks();
      unsubComments();
    };
  }, [currentSemester?.id, user, loadingAuth]);

  const semesterStatuses = useMemo(() => {
    const statuses = ['Not Working On', 'Working On', 'Completed', 'Waiting', 'Stuck'];

    // Flatten all building blocks across every goal and non-empty building block text
    const allBlocks = goals
      .flatMap((g) => g.buildingBlocks || [])
      .filter((block) => block.text?.trim());

    return statuses.map((status) => {
      const configKey = status.toLowerCase().replace(/\s+/g, '');

      // Count goals with this status and non-empty text
      const goalCount = goals.filter((g) => g.status === status && g.text?.trim()).length;
      // Count building blocks with this status and non-empty text
      const blockCount = allBlocks.filter((b) => b.status === status).length;

      return {
        status: configKey,
        total: goalCount + blockCount,
        fill: chartConfig[configKey]?.color,
      };
    });
  }, [goals]);

  return (
    <RouteGuard>
      <SidebarProvider>
        <AppSidebar
          semesters={semesters}
          loadingSemesters={loading}
          currentSemester={currentSemester}
          onSelectSemester={setCurrentSemester}
        />
        <SidebarInset>
          <header className='bg-background sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 border-b px-4'>
            <SidebarTrigger className='-ml-1' />
            <Separator orientation='vertical' className='mr-2 h-4' />
            <div className='mx-auto flex w-full items-center justify-between'>
              <div className='flex flex-col items-center sm:flex-row'>
                {loading ? (
                  <div className='bg-muted h-5 w-40 animate-pulse rounded' />
                ) : currentSemester ? (
                  <>
                    <h1 className='text-base font-medium'>{currentSemester.semester}</h1>
                    <ChevronsRight className='mx-2 hidden size-4 sm:block' />
                    <p className='text-xs italic sm:text-sm'>
                      {currentSemester.start.toDate().toLocaleDateString()} –{' '}
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
            <SemesterOverview semesterData={semesterStatuses} />
            <GoalFocus />
            {goals.length
              ? Object.entries(
                  goals.reduce((acc, goal) => {
                    (acc[goal.userId] ||= []).push(goal);
                    return acc;
                  }, {}),
                ).map(([userId, userGoals]) => (
                  <Card key={userId}>
                    <CardHeader>
                      <CardTitle className='text-lg'>{userGoals[0].userName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <GoalTable
                        userId={userId}
                        userName={userGoals[0].userName}
                        goals={userGoals}
                        currentSemester={currentSemester}
                      />
                    </CardContent>
                  </Card>
                ))
              : !loading && (
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg'>{userDoc?.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <GoalTable
                        userId={userDoc?.id}
                        userName={userDoc?.name}
                        goals={[]}
                        currentSemester={currentSemester}
                      />
                    </CardContent>
                  </Card>
                )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </RouteGuard>
  );
}
