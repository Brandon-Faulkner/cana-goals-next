"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/auth-provider";
import Spinner from "@/components/ui/spinner";

export default function RouteGuard({ children, mode = "protected" }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (mode === "protected" && !user) {
        router.replace("/login");
      }
      if (mode === "public" && user) {
        router.replace("/main");
      }
    }
  }, [user, loading, mode, router]);

  if (loading || (mode === "protected" && !user) || (mode === "public" && user)) {
    return <Spinner />;
  }

  return children;
}
