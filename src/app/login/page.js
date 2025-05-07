"use client"
import { useState } from "react";
import LoginForm from "@/components/forms/LoginForm";
import ForgotPassForm from "@/components/forms/ForgotPassForm";

export default function Login() {
    const [showForgot, setShowForgot] = useState(false);

    return (
        <div className="flex flex-col flex-grow h-full bg-white-light dark:bg-black-dark overflow-auto">
            <div className="flex-grow flex items-center justify-center p-4">
                {showForgot ? (
                    <ForgotPassForm onBack={() => setShowForgot(false)} />
                ) : (
                    <LoginForm onForgot={() => setShowForgot(true)} />
                )}
            </div>
        </div>
    );
}