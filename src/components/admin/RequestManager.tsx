"use client";

import { supabase } from "@/lib/supabaseClient";
import { useState } from "react";

type Request = {
  id: string;
  status: string;
};

export default function RequestManager({
  request,
}: {
  request: Request;
}) {
  const [status, setStatus] = useState(request.status);
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    setLoading(true);

    const { error } = await supabase
      .from("machine_requests")
      .update({ status: newStatus })
      .eq("id", request.id);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setStatus(newStatus);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-center">
      <div>
        <p className="text-white font-bold">
          Request ID: {request.id}
        </p>

        <p className="text-zinc-400">
          Status: {status}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          disabled={loading}
          onClick={() => updateStatus("approved")}
          className="bg-green-600 px-3 py-2 rounded-lg font-bold"
        >
          Approve
        </button>

        <button
          disabled={loading}
          onClick={() => updateStatus("rejected")}
          className="bg-red-600 px-3 py-2 rounded-lg font-bold"
        >
          Reject
        </button>
      </div>
    </div>
  );
}