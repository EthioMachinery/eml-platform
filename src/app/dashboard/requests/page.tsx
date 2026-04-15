"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import MyRequests from "@/components/requests/MyRequests";

export default function RequestsPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) return <p className="p-6">Loading...</p>;

  return (
    <main className="p-6">
      <h1 className="text-xl font-bold mb-4">
        My Requests
      </h1>

      <MyRequests user={user} />
    </main>
  );
}