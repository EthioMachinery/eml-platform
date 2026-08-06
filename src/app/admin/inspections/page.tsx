"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  listPendingInspectionPaymentReview,
  listInspectionsToSchedule,
  listScheduledInspections,
  listCompletedAwaitingPublish,
  reviewInspectionPayment,
  scheduleInspection,
  completeInspection,
  publishInspection,
  getInspectionRevenue,
  type Inspection,
  type InspectionResult,
} from "@/lib/inspectionEngine";

type EnrichedInspection = Inspection & {
  listing_title: string | null;
  requester_name: string | null;
  requester_phone: string | null;
};

type Tab = "review" | "schedule" | "scheduled" | "publish";

const TIER_LABELS: Record<string, string> = {
  basic: "Basic Verification",
  standard: "Standard Inspection",
  premium: "Premium Inspection",
};

function buildReportStoragePath(inspectionId: string, fileName: string): string {
  return `${inspectionId}/${Date.now()}-${fileName}`;
}

export default function AdminInspectionsPage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("review");

  const [reviewQueue, setReviewQueue] = useState<EnrichedInspection[]>([]);
  const [scheduleQueue, setScheduleQueue] = useState<EnrichedInspection[]>([]);
  const [scheduledQueue, setScheduledQueue] = useState<EnrichedInspection[]>([]);
  const [publishQueue, setPublishQueue] = useState<EnrichedInspection[]>([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const [actingOn, setActingOn] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [notesDraft, setNotesDraft] = useState<Record<string, string>>({});
  const [inspectorDraft, setInspectorDraft] = useState<Record<string, string>>({});
  const [dateDraft, setDateDraft] = useState<Record<string, string>>({});
  const [resultDraft, setResultDraft] = useState<Record<string, InspectionResult>>({});
  const [reportFile, setReportFile] = useState<Record<string, File | null>>({});

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    setActionError(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }
    setAdminId(user.id);

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .maybeSingle();

    const admin = !!profile && (profile.role === "ADMIN" || profile.role === "admin");
    setIsAdmin(admin);

    if (!admin) {
      setLoading(false);
      return;
    }

    await loadQueues();
    setLoading(false);
  }

  async function enrich(rows: Inspection[]): Promise<EnrichedInspection[]> {
    return Promise.all(
      rows.map(async (row) => {
        let listingTitle: string | null = null;
        let requesterName: string | null = null;
        let requesterPhone: string | null = null;

        if (row.listing_id) {
          const { data: listing } = await supabase
            .from("listings")
            .select("title_en, title_am, brand, model")
            .eq("id", row.listing_id)
            .maybeSingle();
          if (listing) {
            listingTitle = listing.title_en || listing.title_am || `${listing.brand ?? ""} ${listing.model ?? ""}`.trim();
          }
        }

        if (row.requested_by) {
          const { data: requester } = await supabase
            .from("profiles")
            .select("full_name, phone")
            .eq("id", row.requested_by)
            .maybeSingle();
          if (requester) {
            requesterName = requester.full_name;
            requesterPhone = requester.phone;
          }
        }

        return { ...row, listing_title: listingTitle, requester_name: requesterName, requester_phone: requesterPhone };
      })
    );
  }

  async function loadQueues() {
    const [review, schedule, scheduled, publish, revenue] = await Promise.all([
      listPendingInspectionPaymentReview(),
      listInspectionsToSchedule(),
      listScheduledInspections(),
      listCompletedAwaitingPublish(),
      getInspectionRevenue(),
    ]);

    const [er, es, esch, ep] = await Promise.all([enrich(review), enrich(schedule), enrich(scheduled), enrich(publish)]);

    setReviewQueue(er);
    setScheduleQueue(es);
    setScheduledQueue(esch);
    setPublishQueue(ep);
    setTotalRevenue(revenue);
  }

  async function handleReview(id: string, approve: boolean) {
    if (!adminId) return;
    setActingOn(id);
    setActionError(null);

    const { error } = await reviewInspectionPayment({
      inspectionId: id,
      adminId,
      approve,
      notes: notesDraft[id] || undefined,
    });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }
    await loadQueues();
    setActingOn(null);
  }

  async function handleSchedule(id: string) {
    const inspectorId = inspectorDraft[id];
    const scheduledAt = dateDraft[id];

    if (!inspectorId || !scheduledAt) {
      setActionError("Enter both an inspector user ID and a scheduled date/time.");
      return;
    }

    setActingOn(id);
    setActionError(null);

    const { error } = await scheduleInspection({
      inspectionId: id,
      inspectorId,
      scheduledAt: new Date(scheduledAt).toISOString(),
    });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }
    await loadQueues();
    setActingOn(null);
  }

  async function handleComplete(id: string) {
    const file = reportFile[id];
    const result = resultDraft[id];

    if (!file || !result) {
      setActionError("Choose a report file and select a result before completing.");
      return;
    }

    setActingOn(id);
    setActionError(null);

    const path = buildReportStoragePath(id, file.name);
    const { error: uploadError } = await supabase.storage.from("inspection-reports").upload(path, file);

    if (uploadError) {
      setActionError(`Report upload failed: ${uploadError.message}`);
      setActingOn(null);
      return;
    }

    const { data: urlData } = supabase.storage.from("inspection-reports").getPublicUrl(path);

    const { error } = await completeInspection({
      inspectionId: id,
      result,
      reportUrl: urlData.publicUrl,
      notes: notesDraft[id] || undefined,
    });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }
    await loadQueues();
    setActingOn(null);
  }

  async function handlePublish(id: string) {
    setActingOn(id);
    setActionError(null);

    const { error } = await publishInspection({ inspectionId: id });

    if (error) {
      setActionError(error);
      setActingOn(null);
      return;
    }
    await loadQueues();
    setActingOn(null);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Admin access required</h1>
          <p className="text-zinc-400">You don&apos;t have permission to view this page.</p>
        </div>
      </main>
    );
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "review", label: "Payment Review", count: reviewQueue.length },
    { key: "schedule", label: "To Schedule", count: scheduleQueue.length },
    { key: "scheduled", label: "Scheduled — Upload Report", count: scheduledQueue.length },
    { key: "publish", label: "Ready to Publish", count: publishQueue.length },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Verified Inspections
        </h1>
        <p className="text-zinc-400 mb-2">
          Payment review → schedule an inspector → upload the report → publish. Publishing books the
          inspection-fee revenue and applies the real &quot;Verified&quot; badge to the listing.
        </p>
        <p className="text-amber-400 text-sm mb-8">Total inspection-fee revenue booked: {totalRevenue.toLocaleString()} ETB</p>

        <div className="flex flex-wrap gap-3 mb-8">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={
                "px-4 py-2 rounded-xl font-semibold text-sm " +
                (tab === t.key ? "bg-amber-500 text-black" : "bg-zinc-900 text-zinc-400 border border-zinc-800")
              }
            >
              {t.label} ({t.count})
            </button>
          ))}
        </div>

        {actionError && <p className="text-red-400 mb-4">{actionError}</p>}

        {tab === "review" && (
          <div className="space-y-4">
            {reviewQueue.length === 0 ? (
              <p className="text-zinc-500">No inspection payments awaiting review.</p>
            ) : (
              reviewQueue.map((i) => (
                <div key={i.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex flex-wrap justify-between gap-4 mb-4">
                    <div>
                      <p className="text-lg font-bold">{i.listing_title || "Untitled listing"}</p>
                      <p className="text-zinc-400 text-sm">
                        Requested by: {i.requester_name || "Unknown"} {i.requester_phone ? `— ${i.requester_phone}` : ""}
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold h-fit bg-yellow-500 text-black">
                      {TIER_LABELS[i.tier]}
                    </span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-2 text-sm text-zinc-300 mb-4">
                    <p>Fee: {i.fee} {i.currency}</p>
                    <p>Method: {i.payment_method || "—"}</p>
                    <p>Reference: {i.payment_reference || "—"}</p>
                    <p>Submitted: {new Date(i.created_at).toLocaleString()}</p>
                  </div>
                  <textarea
                    placeholder="Optional admin notes..."
                    value={notesDraft[i.id] || ""}
                    onChange={(e) => setNotesDraft((p) => ({ ...p, [i.id]: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-white mb-4"
                    rows={2}
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleReview(i.id, true)}
                      disabled={actingOn === i.id}
                      className="bg-green-500 hover:bg-green-600 text-black px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                    >
                      Approve Payment
                    </button>
                    <button
                      onClick={() => handleReview(i.id, false)}
                      disabled={actingOn === i.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                    >
                      Reject Payment
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "schedule" && (
          <div className="space-y-4">
            {scheduleQueue.length === 0 ? (
              <p className="text-zinc-500">Nothing awaiting scheduling.</p>
            ) : (
              scheduleQueue.map((i) => (
                <div key={i.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <p className="text-lg font-bold mb-1">{i.listing_title || "Untitled listing"}</p>
                  <p className="text-zinc-400 text-sm mb-4">{TIER_LABELS[i.tier]} — payment approved {i.reviewed_at ? new Date(i.reviewed_at).toLocaleString() : ""}</p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Inspector User ID</label>
                      <input
                        type="text"
                        value={inspectorDraft[i.id] || ""}
                        onChange={(e) => setInspectorDraft((p) => ({ ...p, [i.id]: e.target.value }))}
                        placeholder="uuid"
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Scheduled Date/Time</label>
                      <input
                        type="datetime-local"
                        value={dateDraft[i.id] || ""}
                        onChange={(e) => setDateDraft((p) => ({ ...p, [i.id]: e.target.value }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => handleSchedule(i.id)}
                    disabled={actingOn === i.id}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                  >
                    Confirm Schedule
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "scheduled" && (
          <div className="space-y-4">
            {scheduledQueue.length === 0 ? (
              <p className="text-zinc-500">Nothing currently scheduled.</p>
            ) : (
              scheduledQueue.map((i) => (
                <div key={i.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <p className="text-lg font-bold mb-1">{i.listing_title || "Untitled listing"}</p>
                  <p className="text-zinc-400 text-sm mb-4">
                    {TIER_LABELS[i.tier]} — scheduled for {i.scheduled_at ? new Date(i.scheduled_at).toLocaleString() : "—"}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-3 mb-4">
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Result</label>
                      <select
                        value={resultDraft[i.id] || ""}
                        onChange={(e) => setResultDraft((p) => ({ ...p, [i.id]: e.target.value as InspectionResult }))}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                      >
                        <option value="">Select...</option>
                        <option value="passed">Passed</option>
                        <option value="passed_with_notes">Passed with notes</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Report File</label>
                      <input
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => setReportFile((p) => ({ ...p, [i.id]: e.target.files?.[0] || null }))}
                        className="w-full text-xs text-zinc-400"
                      />
                    </div>
                  </div>
                  <textarea
                    placeholder="Inspector notes..."
                    value={notesDraft[i.id] || ""}
                    onChange={(e) => setNotesDraft((p) => ({ ...p, [i.id]: e.target.value }))}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-sm text-white mb-4"
                    rows={2}
                  />
                  <button
                    onClick={() => handleComplete(i.id)}
                    disabled={actingOn === i.id}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                  >
                    Mark Completed
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "publish" && (
          <div className="space-y-4">
            {publishQueue.length === 0 ? (
              <p className="text-zinc-500">Nothing ready to publish.</p>
            ) : (
              publishQueue.map((i) => (
                <div key={i.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
                  <div className="flex flex-wrap justify-between gap-4 mb-4">
                    <div>
                      <p className="text-lg font-bold">{i.listing_title || "Untitled listing"}</p>
                      <p className="text-zinc-400 text-sm">{TIER_LABELS[i.tier]}</p>
                    </div>
                    <span
                      className={
                        "px-3 py-1 rounded-full text-xs font-bold h-fit " +
                        (i.result === "failed" ? "bg-red-500 text-white" : "bg-green-500 text-black")
                      }
                    >
                      {i.result === "passed" ? "Passed" : i.result === "passed_with_notes" ? "Passed with notes" : "Failed"}
                    </span>
                  </div>
                  {i.report_url && (
                    <a href={i.report_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline text-sm block mb-4">
                      View report
                    </a>
                  )}
                  <button
                    onClick={() => handlePublish(i.id)}
                    disabled={actingOn === i.id}
                    className="bg-amber-500 hover:bg-amber-600 text-black px-5 py-2 rounded-xl font-bold disabled:opacity-50"
                  >
                    Publish &amp; Book Revenue
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </main>
  );
}
