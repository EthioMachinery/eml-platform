"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

export default function BoostAdminDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [requests, setRequests] = useState<any[]>([]);

  useEffect(() => {
    loadSummary();
    loadRequests();
  }, []);

  async function loadSummary() {
    const { data } = await supabase
      .from("boost_revenue_summary")
      .select("*")
      .single();

    setSummary(data);
  }

  async function loadRequests() {
    const { data } = await supabase
      .from("boost_requests")
      .select("*")
      .order("created_at", { ascending: false });

    setRequests(data || []);
  }

  async function approve(id: string) {
    await supabase.rpc("approve_boost", { p_boost_id: id });
    alert("Approved");
    loadSummary();
    loadRequests();
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl mb-6">Boost Revenue Dashboard</h1>

      {summary && (
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-800 p-4 rounded">
            <p>Total Revenue</p>
            <h2>{summary.total_revenue || 0} ETB</h2>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <p>Pending Revenue</p>
            <h2>{summary.pending_revenue || 0} ETB</h2>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <p>Approved</p>
            <h2>{summary.total_approved}</h2>
          </div>

          <div className="bg-gray-800 p-4 rounded">
            <p>Pending</p>
            <h2>{summary.total_pending}</h2>
          </div>
        </div>
      )}

      <h2 className="text-xl mb-4">Boost Requests</h2>

      {requests.map((r) => (
        <div key={r.id} className="border p-3 mb-3 rounded bg-gray-900">
          <p>Amount: {r.amount} ETB</p>
          <p>Status: {r.status}</p>
          <p>Reference: {r.reference}</p>

          {r.payment_proof && (
            <a
              href={r.payment_proof}
              target="_blank"
              className="text-blue-400 underline"
            >
              View Proof
            </a>
          )}

          {r.status === "pending" && (
            <button
              onClick={() => approve(r.id)}
              className="bg-green-600 px-3 py-1 mt-2 rounded"
            >
              Approve
            </button>
          )}
        </div>
      ))}
    </div>
  );
}