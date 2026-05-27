"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { Loader2 } from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const {
    user,
    loading,
  } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">

        <div className="flex items-center gap-3 text-yellow-400 text-xl font-bold">

          <Loader2 className="animate-spin" />

          Loading...

        </div>

      </main>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}