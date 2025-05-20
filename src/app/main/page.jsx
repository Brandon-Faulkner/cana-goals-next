"use client";
import { useEffect, useState } from "react";
import RouteGuard from "@/components/auth/RouteGuard";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger, } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronsRight, CircleCheck } from "lucide-react";
import { SemesterOverview } from "@/components/semester-overview";
import { GoalFocus } from "@/components/goal-focus";
import { GoalTable } from "@/components/tables/goal-table";
import { useSemesters } from "@/hooks/use-semesters";
import { db } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthProvider";

export default function Page() {
    const { user, userDoc, loading: loadingAuth } = useAuth();
    const { semesters, loading, currentSemester, setCurrentSemester } = useSemesters();
    const [goals, setGoals] = useState([]);

    useEffect(() => {
        document.title = "Cana Goals | Dashboard";
    }, []);

    useEffect(() => {
        if (!currentSemester?.id) return;

        const unsubscribe = onSnapshot(
            collection(db, "semesters", currentSemester.id, "goals"),
            (snapshot) => {
                const fetched = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setGoals(fetched);
            }
        );

        return () => unsubscribe();
    }, [currentSemester?.id]);

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
                    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <div className="w-full mx-auto flex items-center justify-between">
                            <div className="flex flex-col items-center sm:flex-row">
                                {loading ? (
                                    <div className="h-5 w-40 bg-muted animate-pulse rounded" />
                                ) : currentSemester ? (
                                    <>
                                        <h1 className="text-base font-medium">{currentSemester.semester}</h1>
                                        <ChevronsRight className="hidden sm:block mx-2 size-4" />
                                        <p className="text-xs italic sm:text-sm">
                                            {currentSemester.start.toDate().toLocaleDateString()} –{" "}
                                            {currentSemester.end.toDate().toLocaleDateString()}
                                        </p>
                                    </>
                                ) : (
                                    <h1 className="text-base font-medium">No current semester</h1>
                                )}
                            </div>
                            <div className='flex items-center gap-4'>
                                <div className='flex items-center gap-2'>
                                    <CircleCheck className='text-primary' />
                                    <span className='text-black dark:text-white max-xs:hidden'>Up to Date</span>
                                </div>
                            </div>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 p-4">
                        <SemesterOverview />
                        <GoalFocus />
                        {goals.length === 0 && !loading ? (
                            <Card>
                                <CardHeader>
                                    <CardTitle>{userDoc.name}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <GoalTable
                                        userID={userDoc.id}
                                        userName={userDoc.name}
                                        goals={[]}
                                    />
                                </CardContent>
                            </Card>
                        ) : (
                            Object.entries(
                                goals.reduce((acc, goal) => {
                                    if (!acc[goal.userId]) acc[goal.userId] = [];
                                    acc[goal.userId].push(goal);
                                    return acc;
                                }, {})
                            ).map(([userId, userGoals]) => (
                                <Card key={userId}>
                                    <CardHeader>
                                        <CardTitle>{userGoals[0].userName}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <GoalTable
                                            userID={userId}
                                            userName={userGoals[0].userName}
                                            goals={userGoals}
                                        />
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </RouteGuard>
    );
}