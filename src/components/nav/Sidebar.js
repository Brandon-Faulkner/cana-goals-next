"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import { useTheme } from "next-themes";
import { useAuth } from "@/contexts/AuthProvider";
import { AnimatePresence, motion } from "framer-motion";
import Button from "../actions/Button";
import { FaBars, FaXmark, FaRightFromBracket, FaSun, FaMoon, FaGear, FaPenToSquare, FaGlobe, FaCalendarPlus } from "react-icons/fa6";

import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function Sidebar() {
    const router = useRouter();
    const { user, loading } = useAuth();
    const { theme, setTheme } = useTheme();
    const [menuOpened, setMenuOpened] = useState(false);

    const toggleTheme = () => {
        setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const signOutUser = () => {
        signOut(auth).then(() => {
            router.replace('/login');
        }).catch((error) => {
            toast.error("Error signing out: " + error.message);
        })
    }

    return (
        <div>
            <button
                aria-label={menuOpened ? "Close menu" : "Open menu"}
                onClick={() => setMenuOpened(!menuOpened)}
                className="bg-green hover:bg-green-alt transition-colors px-2.5 py-1.5 text-lg rounded-md shadow-lg cursor-pointer z-20 relative" >
                {menuOpened ? <FaXmark className="text-white" /> : <FaBars className="text-white" />}
            </button>

            <AnimatePresence>
                {menuOpened && (
                    <>
                        <motion.div
                            className="inset-0 fixed bg-menu-light dark:bg-menu"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setMenuOpened(!menuOpened)}
                        />

                        <motion.aside
                            className="fixed top-0 right-0 pt-16 w-52 bg-white-light dark:bg-black-light rounded-bl-lg shadow-2xl"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
                        >
                            <nav className="flex-grow flex flex-col space-y-2 p-2.5">
                                {user && <Button label={"Sign Out"} type={"button"} Icon={FaRightFromBracket} variant="red" onClick={signOutUser}/>}
                                <Button
                                    label={theme === 'dark' ? "Light Mode" : "Dark Mode"}
                                    type={"button"}
                                    Icon={theme === 'dark' ? FaSun : FaMoon}
                                    variant="default"
                                    onClick={toggleTheme}
                                />
                                {user && (
                                    <>
                                        <Button label={"Settings"} type={"button"} Icon={FaGear} variant="default" />
                                        <Button label={"What's New"} type={"button"} Icon={FaPenToSquare} variant="default" />
                                        <Button label={"Goal Language"} type={"button"} Icon={FaGlobe} variant="default" />
                                        <Button label={"Add Semester"} type={"button"} Icon={FaCalendarPlus} variant="default" />
                                    </>
                                )}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}