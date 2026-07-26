"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import {
  recordCompletedDeal,
  listCommissionRates,
  updateCommissionRate,
  getTotalRevenue,
  type DealCategory,
} from "@/lib/opportunityEngine";

const CATEGORY_LABELS: Record<DealCategory, string> = {
  machinery_sale: "Machinery Sale",
  machinery_rental: "Machinery Rental",
  transport_booking: "Transport Booking",
};

export default function AdminDealRevenuePage() {
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  const [rates, setRates] = useState<{ category: DealCategory; commission_percent: number }[]>([]);
  const [rateDrafts, setRateDrafts] = useState<Record<string, string>>({});
  const [rateSaving, setRateSaving] = useState<string | null>(null);
  const [rateError, setRateError] = useState<string | null>(null);

  const [totals, setTotals] = useState({ commission: 0, unlockFees: 0, total: 0 });

  // Record-a-deal form state
  const [category, setCategory] = useState<DealCategory>("machinery_sale");
  const [buyerId, setBuyerId] = useState("");
  const [sellerId, setSellerId] = useState("");
  const [machineryId, setMachineryId] = useState("");
  const [grossAmount, setGrossAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [previewCommission, setPreviewCommission] = useState<number | null>(null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    computePreview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, grossAmount, rates]);

  async function init() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsAdmin(false);
      setLoading(false);
      return;
    }

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

    await Promise.all([loadRates(), loadTotals()]);
    setLoading(false);
  }

  async function loadRates() {
    const data = await listCommissionRates();
    setRates(data);
    const drafts: Record<string, string> = {};
    data.forEach((r) => {
      drafts[r.category] = String(r.commission_percent);
    });
    setRateDrafts(drafts);
  }

  async function loadTotals() {
    const data = await getTotalRevenue();
    setTotals(data);
  }

  function computePreview() {
    const rate = rates.find((r) => r.category === category)?.commission_percent;
    const gross = Number(grossAmount);
    if (!rate || !gross || gross <= 0) {
      setPreviewCommission(null);
      return;
    }
    setPreviewCommission(Math.round(((gross * rate) / 100) * 100) / 100);
  }

  async function handleSaveRate(cat: DealCategory) {
    setRateSaving(cat);
    setRateError(null);

    const value = Number(rateDrafts[cat]);
    if (isNaN(value)) {
      setRateError("Enter a valid number.");
      setRateSaving(null);
      return;
    }

    const { error } = await updateCommissionRate(cat, value);
    if (error) {
      setRateError(error);
      setRateSaving(null);
      return;
    }

    await loadRates();
    setRateSaving(null);
  }

  async function handleSubmitDeal(e: React.FormEvent) {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const gross = Number(grossAmount);
    if (!gross || gross <= 0) {
      setFormError("Enter a valid gross deal amount.");
      return;
    }

    setSubmitting(true);

    const { dealId, commissionAmount, error } = await recordCompletedDeal({
      category,
      buyerId: buyerId.trim() || null,
      sellerId: sellerId.trim() || null,
      machineryId: machineryId.trim() || null,
      grossAmount: gross,
      notes: notes.trim() || undefined,
    });

    if (error && !dealId) {
      setFormError(error);
      setSubmitting(false);
      return;
    }

    setFormSuccess(
      `Deal recorded${dealId ? ` (${dealId})` : ""}. Commission booked: ${commissionAmount ?? "—"} ETB.${
        error ? ` Note: ${error}` : ""
      }`
    );
    setBuyerId("");
    setSellerId("");
    setMachineryId("");
    setGrossAmount("");
    setNotes("");
    setSubmitting(false);
    await loadTotals();
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

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text text-transparent">
          Deal Revenue &amp; Commission
        </h1>
        <p className="text-zinc-400 mb-8">
          Primary revenue: commission on completed sales/rentals. Secondary revenue: the ETB 500 unlock fee
          (booked automatically when contact is released in Opportunity Unlocks).
        </p>

        {/* TOTALS */}
        <div className="grid sm:grid-cols-3 gap-4 mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Commission Revenue</p>
            <p className="text-2xl font-black text-amber-400">{totals.commission.toLocaleString()} ETB</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Unlock Fee Revenue</p>
            <p className="text-2xl font-black text-blue-400">{totals.unlockFees.toLocaleString()} ETB</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <p className="text-zinc-400 text-xs uppercase font-bold mb-1">Total Revenue</p>
            <p className="text-2xl font-black text-white">{totals.total.toLocaleString()} ETB</p>
          </div>
        </div>

        {/* COMMISSION RATES */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">
          <h2 className="text-xl font-bold mb-4">Commission Rates</h2>
          {rateError && <p className="text-red-400 mb-3 text-sm">{rateError}</p>}
          <div className="space-y-3">
            {rates.map((r) => (
              <div key={r.category} className="flex items-center gap-3">
                <span className="w-48 text-sm text-zinc-300">{CATEGORY_LABELS[r.category]}</span>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="100"
                  value={rateDrafts[r.category] ?? ""}
                  onChange={(e) => setRateDrafts((prev) => ({ ...prev, [r.category]: e.target.value }))}
                  className="w-24 bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-1.5 text-sm text-white"
                />
                <span className="text-zinc-500 text-sm">%</span>
                <button
                  onClick={() => handleSaveRate(r.category)}
                  disabled={rateSaving === r.category}
                  className="ml-2 bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-1.5 rounded-lg text-sm font-semibold disabled:opacity-50"
                >
                  {rateSaving === r.category ? "Saving..." : "Save"}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* RECORD A DEAL */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4">Record a Completed Deal</h2>
          {formError && <p className="text-red-400 mb-3 text-sm">{formError}</p>}
          {formSuccess && <p className="text-green-400 mb-3 text-sm">{formSuccess}</p>}

          <form onSubmit={handleSubmitDeal} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DealCategory)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
              >
                {(Object.keys(CATEGORY_LABELS) as DealCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Buyer User ID</label>
                <input
                  type="text"
                  value={buyerId}
                  onChange={(e) => setBuyerId(e.target.value)}
                  placeholder="uuid (optional)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Seller User ID</label>
                <input
                  type="text"
                  value={sellerId}
                  onChange={(e) => setSellerId(e.target.value)}
                  placeholder="uuid (optional)"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Listing / Machinery ID</label>
              <input
                type="text"
                value={machineryId}
                onChange={(e) => setMachineryId(e.target.value)}
                placeholder="uuid (optional)"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                Gross Deal Amount (ETB)
              </label>
              <input
                type="number"
                min="0"
                value={grossAmount}
                onChange={(e) => setGrossAmount(e.target.value)}
                placeholder="e.g. 350000"
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                required
              />
              {previewCommission !== null && (
                <p className="text-xs text-amber-400 mt-1">
                  Estimated commission: {previewCommission.toLocaleString()} ETB
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="bg-amber-500 hover:bg-amber-600 text-black px-6 py-2.5 rounded-xl font-bold disabled:opacity-50"
            >
              {submitting ? "Recording..." : "Record Deal"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
