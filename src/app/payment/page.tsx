"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

const ADMIN_PHONE = "+251911404186";
const BANKS = ["CBE", "Awash", "Dashen", "Abyssinia", "Abbay"];

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const dealId = searchParams.get("deal") || "";
  const rawAmount = searchParams.get("amount") || "";
  const totalAmount = rawAmount ? Number(rawAmount) : null;

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [method, setMethod] = useState("Bank Transfer");
  const [bank, setBank] = useState(BANKS[0]);
  const [reference, setReference] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", { style: "decimal" });

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id || null);
      setLoading(false);
    });
  }, []);

  async function handleSubmit() {
    if (!userId) return;
    if (!reference.trim()) { setError("Please enter your payment reference number."); return; }
    if (!receiptFile) { setError("Please upload your payment receipt."); return; }

    setSubmitting(true);
    setError("");

    try {
      const fileExt = receiptFile.name.split(".").pop();
      const filePath = userId + "/payment-" + Date.now() + "." + fileExt;

      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(filePath, receiptFile);

      if (uploadError) { setError(uploadError.message); setSubmitting(false); return; }

      const { error: insertError } = await supabase.from("payments").insert([{
        user_id: userId,
        buyer_id: userId,
        listing_id: dealId || null,
        amount: totalAmount || 0,
        currency: "ETB",
        method,
        bank_name: method === "Bank Transfer" ? bank : null,
        reference: reference.trim(),
        receipt_url: filePath,
        status: "pending",
        note: "Manual payment submission" + (dealId ? " for deal " + dealId : ""),
      }]);

      if (insertError) { setError(insertError.message); setSubmitting(false); return; }

      setSuccess(true);
      setTimeout(() => router.push("/dashboard/deals"), 2500);
    } catch (err: any) {
      setError(err?.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (!userId) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
          <p className="text-zinc-400 mb-6">Sign in to submit a payment.</p>
          <a href="/login" className="inline-block bg-amber-500 hover:bg-amber-400 text-black px-8 py-3 rounded-xl font-bold">Sign In</a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        <div className="lg:col-span-2 space-y-6">
          <header className="space-y-2">
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
              Secure Billing
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              EML Payment Center
            </h1>
          </header>

          {success && (
            <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-bold">
              Payment submitted successfully! Redirecting to your deals...
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-6 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8">

            <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-300 text-sm leading-relaxed">
              <p className="font-bold mb-1">Step 1: Get payment details from EML</p>
              <p>Before transferring, message us on Telegram at <span className="font-mono font-bold">{ADMIN_PHONE}</span> to receive the correct bank account or mobile payment details for your chosen method.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Step 2: Payment Method</label>
              <div className="grid grid-cols-3 gap-2">
                {["Bank Transfer", "Telebirr", "Mobile Banking"].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMethod(m)}
                    className={"py-3 rounded-lg text-xs font-bold uppercase transition-all " + (method === m ? "bg-amber-500 text-white" : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white")}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {method === "Bank Transfer" && (
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Bank</label>
                <select
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  className="w-full h-12 px-4 rounded-lg border bg-zinc-950 text-white border-zinc-800 text-sm"
                >
                  {BANKS.map((b) => <option key={b} value={b}>{b}</option>)}
                </select>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Step 3: Payment Reference Number</label>
              <input
                type="text"
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="e.g. transaction ID from your receipt"
                className="w-full px-4 py-3 rounded-lg border bg-zinc-950 text-white border-zinc-800 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Step 4: Upload Payment Receipt *</label>
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                className="w-full text-sm text-zinc-300"
              />
              {receiptFile && (
                <p className="mt-2 text-green-400 text-xs font-bold">File selected: {receiptFile.name}</p>
              )}
            </div>

            <div className="pt-6 border-t border-zinc-900">
              <button
                onClick={handleSubmit}
                disabled={submitting || uploading || success}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold uppercase tracking-wider transition-all"
              >
                {submitting ? "Submitting..." : "Submit for Review"}
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6 h-fit">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-4">
              Billing Summary
            </h3>
            <div className="space-y-3 text-xs text-zinc-400">
              {dealId && (
                <div className="flex justify-between">
                  <span>Deal ID:</span>
                  <span className="font-mono text-zinc-200">{dealId.slice(0, 16)}...</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Method:</span>
                <span className="text-zinc-200">{method}{method === "Bank Transfer" ? " — " + bank : ""}</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-zinc-900 text-sm font-black text-white">
                <span>Total Due:</span>
                <span className="text-amber-500">
                  {totalAmount ? formatter.format(totalAmount) + " ETB" : "Contact EML"}
                </span>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-400 leading-relaxed">
              <p className="font-bold text-white mb-1">EML Admin Review</p>
              <p>All payments are manually verified by the EML team before your deal is confirmed. You will be notified once your payment is approved.</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
