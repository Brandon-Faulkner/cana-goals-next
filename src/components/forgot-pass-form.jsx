"use client";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { SendHorizonal } from "lucide-react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/lib/firebase";

export function ForgotPassForm({ className }) {
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email
        if (!email) {
            toast.error("Missing email address.");
            return;
        }

        // Show toast with progress
        await toast.promise(
            sendPasswordResetEmail(auth, email),
            {
                loading: 'Sending reset link...',
                success: 'If this account exists, you will have received a link.',
                error: 'Failed to send reset email. Please check the email address.',
            }
        )
    };

    return (
        <div className={cn("flex flex-col gap-6", className)}>
            <Card>
                <CardHeader className="text-center">
                    <CardTitle className="text-xl text-primary">Forgot Password</CardTitle>
                    <CardDescription>
                        Enter your Cana Church email address to reset your password.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid gap-6">
                        <div className="grid gap-3">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="email@canachurch.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">
                            <SendHorizonal />
                            Send Reset Link
                        </Button>
                        <Link href={"./login"}
                            className="m-auto text-sm underline-offset-4 hover:underline">
                            Back to Login
                        </Link>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
