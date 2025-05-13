"use client"
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "@/components/forms/LoginForm";
import ForgotPassForm from "@/components/forms/ForgotPassForm";
import { withPublicRoute } from "@/components/auth/ProtectedRoute";

function Login() {
    const [showForgot, setShowForgot] = useState(false);

    useEffect(() => {
        document.title = "Cana Goals | Login";
    }, []);

    return (
        <div className="flex flex-col flex-grow h-full bg-white-light dark:bg-black-dark overflow-auto">
            <div className="flex-grow flex items-center justify-center p-4">
                <div className="w-full overflow-hidden">
                    <AnimatePresence mode="wait">
                        {showForgot ? (
                            <motion.div
                                key="forgot"
                                initial={{ opacity: 0, x: 100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 100 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex justify-center"
                            >
                                <ForgotPassForm onBack={() => setShowForgot(false)} />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="login"
                                initial={{ opacity: 0, x: -100 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -100 }}
                                transition={{ duration: 0.3 }}
                                className="w-full flex justify-center"
                            >
                                <LoginForm onForgot={() => setShowForgot(true)} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}

export default withPublicRoute(Login);