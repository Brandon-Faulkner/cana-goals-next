import RouteGuard from "@/components/auth/RouteGuard";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { ChevronsRight, CircleCheck } from "lucide-react";
import { SemesterOverview } from "@/components/semester-overview";
import { GoalFocus } from "@/components/goal-focus";
import { GoalTable } from "@/components/tables/goal-table";

export const metadata = {
    title: "Cana Goals | Dashboard"
}

const sampleGoals = [
    {
        id: "goal1",
        userId: "userA",
        userName: "Brandon",
        goal: "Finish frontend design",
        dueDate: new Date("2025-03-15"),
        status: "Working On",
        createdAt: new Date("2025-01-10"),
        buildingBlocks: [
            {
                id: "block1",
                goal: "Design login form",
                dueDate: new Date("2025-02-01"),
                status: "Completed",
            },
            {
                id: "block2",
                goal: "Style dashboard",
                dueDate: new Date("2025-03-01"),
                status: "Working On",
            },
        ],
        comments: [
            {
                id: "comment1",
                userId: "userB",
                userName: "Alex",
                content: "Looking clean so far!",
                timestamp: new Date("2025-01-15"),
            },
        ],
    }
];


export default function Page() {
    return (
        <RouteGuard>
            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="bg-background sticky top-0 flex h-16 shrink-0 items-center gap-2 border-b px-4">
                        <SidebarTrigger className="-ml-1" />
                        <Separator orientation="vertical" className="mr-2 h-4" />
                        <div className="w-full mx-auto flex items-center justify-between">
                            <div className="flex flex-col items-center sm:flex-row">
                                <h1 className="text-base font-medium">2025 Spring 100</h1>
                                <ChevronsRight className="hidden sm:block mx-2 size-4" />
                                <p className="text-xs italic sm:text-sm">1/13/25 &nbsp;-&nbsp; 4/23/25</p>
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
                        {sampleGoals.map(goal => (
                            <Card key={goal.userId}>
                                <CardHeader>
                                    <CardTitle>{goal.userName}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <GoalTable 
                                        userID={goal.userId}
                                        userName={goal.userName}
                                        initialGoals={[goal]}
                                    />
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </RouteGuard>
    );
}