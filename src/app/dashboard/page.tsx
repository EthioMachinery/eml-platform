"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import LogoutButton from "@/components/LogoutButton";

export default function DashboardPage() {
  const router = useRouter();

  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      console.log("DASHBOARD USER:", user);

      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");
      setLoading(false);
    }

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="p-10 text-xl">
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        Dashboard
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6 max-w-xl border">
        <p className="text-gray-600 mb-2">
          Logged in as:
        </p>

        <p className="text-xl font-semibold">
          {userEmail}
        </p>

        <LogoutButton />
      </div>
    </div>
  );
}