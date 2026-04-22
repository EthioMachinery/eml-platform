"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../lib/LanguageContext";

interface Request {
  id: string;
  machinery_type: string | null;
  location: string | null;
  budget_min: number | null;
  budget_max: number | null;
  status: string | null;
  created_at: string;
}

export default function BrowseRequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ SAFE LANGUAGE HANDLING (prevents build crash)
  const langContext = useLanguage();
  const lang = langContext?.lang || "en";

  useEffect(() => {
    fetchRequests();
  }, []);

  async function fetchRequests() {
    setLoading(true);

    const { data, error } = await supabase
      .from("contact_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching requests:", error);
    } else {
      setRequests(data || []);
    }

    setLoading(false);
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        {lang === "am" ? "በመጫን ላይ..." : "Loading..."}
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      <h1 className="text-2xl font-bold mb-6">
        {lang === "am" ? "የጥያቄዎች ዝርዝር" : "Browse Requests"}
      </h1>

      {requests.length === 0 ? (
        <p>
          {lang === "am"
            ? "ምንም ጥያቄዎች የሉም"
            : "No requests found."}
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-gray-900 border border-gray-700 p-4 rounded-lg"
            >
              <h2 className="text-lg font-semibold">
                {req.machinery_type || "Machinery Request"}
              </h2>

              <p className="text-sm text-gray-400">
                {lang === "am" ? "ቦታ" : "Location"}:{" "}
                {req.location || "-"}
              </p>

              <p className="text-sm text-gray-400">
                {lang === "am" ? "በጀት" : "Budget"}:{" "}
                {req.budget_min ?? 0} - {req.budget_max ?? 0} ETB
              </p>

              <p className="text-sm">
                {lang === "am" ? "ሁኔታ" : "Status"}:{" "}
                <span className="font-medium">
                  {req.status || "pending"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}