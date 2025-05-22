"use client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import { useEffect } from "react";
import Spinner from "@/components/ui/spinner";

export default function Home() {
  const router = useRouter();
  const { user, loading } = useAuth();

  // Redirect based on auth state
  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace("/main");
      } else {
        router.replace("/login");
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking auth
  return <Spinner />;
}
