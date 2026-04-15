"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function MyRequests({ user }: any) {
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase
        .from("machine_requests")
        .select("*")
        .eq("requester_id", user.id);

      setRequests(data || []);
    };

    if (user) fetch();
  }, [user]);

  return (
    <div className="space-y-4">

      {requests.map((r) => (
        <div key={r.id} className="border p-4 bg-white">

          <p><b>Type:</b> {r.request_type}</p>
          <p><b>Status:</b> {r.status}</p>
          <p className="text-sm text-gray-500">{r.message}</p>

        </div>
      ))}

    </div>
  );
}