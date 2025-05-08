"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect based on auth state
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/main');
      } else {
        router.replace('/login');
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  return (
    <div className="flex flex-col flex-grow h-full bg-white-light dark:bg-black-dark items-center justify-center">
      <div className="animate-spin inline-block size-12 border-3 border-current border-t-transparent text-green rounded-full" role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}