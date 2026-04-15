"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/lib/LanguageContext";

export default function BrowseRequests() {

  const { t } = useLanguage();

  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");

  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {

    const init = async () => {

      const { data: userData } = await supabase.auth.getUser();
      setUser(userData?.user || null);

      const { data } = await supabase
        .from("machine_requests")
        .select("*")
        .order("created_at", { ascending: false });

      setRequests(data || []);
      setLoading(false);
    };

    init();

  }, []);

  const filtered = requests.filter((r) => {
    return (
      (r.machine_type || "")
        .toLowerCase()
        .includes(search.toLowerCase()) &&
      (r.location || "")
        .toLowerCase()
        .includes(locationFilter.toLowerCase())
    );
  });

  // 🔐 REQUEST CONNECTION (NO PAYMENT)
  const requestConnection = async () => {

    if (!user) {
      alert(t.loginRequired);
      return;
    }

    setProcessing(true);

    const { error } = await supabase
      .from("contact_requests")
      .insert([
        {
          requester_id: user.id,
          request_id: selectedRequest.id,
          status: "pending",
        },
      ]);

    if (error) {
      console.error(error);
      alert("❌ Error sending request");
    } else {
      alert("✅ Request sent. Await admin approval.");
      setSelectedRequest(null);
    }

    setProcessing(false);
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        {t.loading}
      </main>
    );
  }

  return (

    <main className="min-h-screen bg-black text-white px-6 py-10">

      <h1 className="text-3xl text-yellow-400 mb-6 text-center">
        {t.browseRequestsTitle}
      </h1>

      {/* FILTER */}
      <div className="max-w-3xl mx-auto mb-10 bg-white p-4 rounded">

        <input
          placeholder={t.machineTypePlaceholder}
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
          className="w-full p-3 mb-3 text-black border rounded"
        />

        <input
          placeholder={t.location}
          value={locationFilter}
          onChange={(e)=>setLocationFilter(e.target.value)}
          className="w-full p-3 text-black border rounded"
        />

      </div>

      {/* LIST */}
      {filtered.length === 0 ? (

        <p className="text-center text-gray-400">
          {t.noRequests}
        </p>

      ) : (

        <div className="grid gap-6 max-w-3xl mx-auto">

          {filtered.map((r) => (

            <div key={r.id} className="bg-gray-900 p-5 rounded">

              <h2 className="text-xl text-yellow-400 mb-2">
                {r.machine_type}
              </h2>

              <p><b>{t.location}:</b> {r.location}</p>

              {r.budget && (
                <p><b>{t.budget}:</b> {r.budget}</p>
              )}

              {r.duration && (
                <p><b>{t.duration}:</b> {r.duration}</p>
              )}

              <p>
                <b>{t.operator}:</b>{" "}
                {r.operator_required ? t.yes : t.no}
              </p>

              <p className="text-sm text-gray-500 mt-3">
                {t.posted}: {new Date(r.created_at).toLocaleDateString()}
              </p>

              {/* 🔐 REQUEST CONNECTION */}
              <button
                onClick={() => setSelectedRequest(r)}
                className="mt-4 w-full bg-yellow-500 text-black py-2 rounded"
              >
                🔒 Request Connection
              </button>

            </div>

          ))}

        </div>

      )}

      {/* CONFIRM */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center">

          <div className="bg-white text-black p-6 rounded w-full max-w-md">

            <h2 className="text-xl font-bold mb-4">
              {selectedRequest.machine_type}
            </h2>

            <p className="mb-4">
              Admin will review and connect both parties.
            </p>

            <div className="flex gap-3">

              <button
                onClick={requestConnection}
                disabled={processing}
                className="flex-1 bg-yellow-500 py-2 rounded"
              >
                {processing ? t.loading : "Confirm"}
              </button>

              <button
                onClick={() => setSelectedRequest(null)}
                className="flex-1 bg-gray-300 py-2 rounded"
              >
                {t.cancel}
              </button>

            </div>

          </div>

        </div>
      )}

    </main>
  );
}