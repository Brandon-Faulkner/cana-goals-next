import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

export function GoalFocus() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Goal Focus</CardTitle>
                <CardDescription>The main focus of our goals for the current semester.</CardDescription>
            </CardHeader>
            <CardContent>
                <Textarea placeholder="Enter the current semesters goal focus."></Textarea>
            </CardContent>
        </Card>
    )
}