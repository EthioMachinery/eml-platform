"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslate } from "@/hooks/useTranslate";
import { useLanguage } from "@/context/LanguageContext";
import { supabase } from "@/lib/supabaseClient";

// Localized payment-specific terminology
const localPaymentTranslations: Record<string, Record<string, string>> = {
  "payment_title": {
    en: "TM Sourcing Payment Center",
    am: "የ TM ክፍያ ማስተናገጃ ማዕከል",
    om: "Kafaltii TM Sourcing Center",
    ti: "መእከቢ ክፍሊት TM"
  },
  "high_ticket_alert": {
    en: "High-Ticket Transfer: Transactions exceeding daily mobile wallet limits must be processed via Manual Bank Transfer (RTGS/CBE). Please upload your deposit slip below.",
    am: "ማሳሰቢያ፡ የቀን የክፍያ ገደብን የሚያልፉ ከፍተኛ ግብይቶች በባንክ ማስተላለፊያ (CBE/Dashen) መከናወን አለባቸው። እባክዎ የከፈሉበትን ደረሰኝ ከታች ያስገቡ።",
    om: "Daldala guddaa kaffaltii bilbilaa ol ta'e Baankii kanaan kaffalama. Waraqaa kaffaltii asitti fe'aa.",
    ti: "ማተሓሳሰቢ፡ ዓቐን ክፍሊት ዝሓለፉ ዓበይቲ ግብይታት ብባንኪ ክሳለጡ ኣለዎም። እባክኹም ደረሰኝ ክፍሊትኩም ኣብዚ የእትዉ።"
  },
  "upload_slip": { en: "Upload Deposit Slip (Image)", am: "የክፍያ ደረሰኝ ምስል ያስገቡ", om: "Waraqaa Kafaltii Fe'i", ti: "ደረሰኝ ክፍሊት ኣእትው" },
  "bank_details": { en: "TM Official Corporate Bank Accounts", am: "የ TM ይፋዊ የባንክ አካውንቶች", om: "Herrega Baankii TM", ti: "ናይ TM ወግዓዊ ሕሳብ ባንኪ" },
  "instant_pay": { en: "Pay via Telebirr / CBE Birr", am: "በቴሌብር / በሲቢኢ ብር ይክፈሉ", om: "Telebirr ykn CBE Birr kaffali", ti: "ብቴሌብር / ሲቢኢ ብር ክፈሉ" },
  "verify_status": { en: "Submit for Verification", am: "ለማረጋገጫ አስገባ", om: "Mirkanneessaaf Ergi", ti: "ንምርግጋጽ ኣእትው" }
};

export default function PaymentPage() {
  const { t } = useTranslate();
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Retrieve parameters from router (e.g. ?amount=8500&deal=123)
  const dealId = searchParams.get("deal") || "manual-sourcing";
  const rawAmount = searchParams.get("amount") || "6800000"; // Default Caterpillar price
  const totalAmount = Number(rawAmount);

  // States
  const [paymentMethod, setPaymentMethod] = useState<"bank" | "mobile">("bank");
  const [selectedBank, setSelectedBank] = useState("cbe");
  const [refNumber, setRefNumber] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadedSlipUrl, setUploadedSlipUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Determine if total is high-ticket (above 100k ETB daily wallet limits)
  const isHighTicket = totalAmount > 100000;

  // Auto-select correct payment method based on transaction size
  useEffect(() => {
    if (isHighTicket) {
      setPaymentMethod("bank");
    } else {
      setPaymentMethod("mobile");
    }
  }, [isHighTicket]);

  const getLocalText = (key: string) => {
    return localPaymentTranslations[key]?.[language] || localPaymentTranslations[key]["en"];
  };

  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setUploading(true);
    setError("");

    // Validate size limit of 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds the maximum allowed limit of 5MB.");
      setUploading(false);
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      // Re-using our structural dynamic photo uploader (stores slip inside Supabase storage bucket)
      const response = await fetch("/api/upload/machinery-image", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload transaction proof.");
      }

      setUploadedSlipUrl(result.imageUrl);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    if (paymentMethod === "bank" && !uploadedSlipUrl) {
      setError("Please upload your bank deposit slip image to verify your transaction.");
      setSubmitting(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      const finalUserId = user?.id || "00000000-0000-0000-0000-000000000000";

      // Insert record into public.payment_proofs (or public.payments)
      const { error: insertError } = await supabase.from("payments").insert([
        {
          id: crypto.randomUUID(),
          deal_id: dealId,
          user_id: finalUserId,
          amount: totalAmount,
          payment_method: paymentMethod === "bank" ? `bank_${selectedBank}` : "telebirr_cbebirr",
          reference_number: refNumber || null,
          image_url: uploadedSlipUrl || null,
          status: "pending" // Pending manual admin audit
        }
      ]);

      if (insertError) throw insertError;

      setSuccess("Payment details submitted successfully! TM finance audit has been triggered.");
      
      setTimeout(() => {
        router.push("/dashboard/deals");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "An error occurred while uploading your payment details.");
    } finally {
      setSubmitting(false);
    }
  };

  const formatter = new Intl.NumberFormat("en-US", { style: "decimal" });

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-payment-center">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Section: Payment Settings */}
        <div className="lg:col-span-2 space-y-6">
          <header className="space-y-2">
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
              💳 Secure Billing
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              {getLocalText("payment_title")}
            </h1>
          </header>

          {error && (
            <div className="p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
              {error}
            </div>
          )}

          {success && (
            <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-green-400 text-xs">
              {success}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handlePaymentSubmit} className="space-y-6 bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8">
            
            {/* Payment Method Switcher (Only allowed if under 100k) */}
            <div className="space-y-2">
              <span className="block text-xs font-bold text-zinc-500 uppercase tracking-widest">
                Payment Channel Selection
              </span>
              <div className="grid grid-cols-2 gap-2 bg-zinc-900 p-1.5 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => !isHighTicket && setPaymentMethod("mobile")}
                  disabled={isHighTicket}
                  className={`py-3 rounded-lg text-xs font-bold uppercase transition-all ${
                    paymentMethod === "mobile"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300 disabled:opacity-30 disabled:cursor-not-allowed"
                  }`}
                >
                  {getLocalText("instant_pay")}
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("bank")}
                  className={`py-3 rounded-lg text-xs font-bold uppercase transition-all ${
                    paymentMethod === "bank"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Manual Bank Wire
                </button>
              </div>
            </div>

            {/* HIGH TICKET WARNING */}
            {isHighTicket && (
              <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-amber-400 text-xs leading-relaxed flex gap-3">
                <span className="text-lg">⚠️</span>
                <span>{getLocalText("high_ticket_alert")}</span>
              </div>
            )}

            {/* CHANNEL A: MANUAL BANK TRANSFER DETAILS */}
            {paymentMethod === "bank" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Select Target TM Account
                  </label>
                  <select
                    value={selectedBank}
                    onChange={(e) => setSelectedBank(e.target.value)}
                    className="w-full h-12 px-4 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  >
                    <option value="cbe" className="bg-zinc-950 text-white">Commercial Bank of Ethiopia (CBE)</option>
                    <option value="awash" className="bg-zinc-950 text-white">Awash Bank</option>
                    <option value="dashen" className="bg-zinc-950 text-white">Dashen Bank</option>
                  </select>
                </div>

                {/* Bank account details card */}
                <div className="bg-zinc-900/60 border border-zinc-900 rounded-xl p-5 space-y-3 text-xs">
                  <span className="block font-bold text-zinc-500 uppercase tracking-widest">{getLocalText("bank_details")}</span>
                  {selectedBank === "cbe" && (
                    <div className="space-y-1">
                      <p className="font-bold text-zinc-300">Commercial Bank of Ethiopia (CBE)</p>
                      <p className="text-amber-500 font-mono text-sm font-black">1000349283928</p>
                    </div>
                  )}
                  {selectedBank === "awash" && (
                    <div className="space-y-1">
                      <p className="font-bold text-zinc-300">Awash Bank (TM Escrow Account)</p>
                      <p className="text-amber-500 font-mono text-sm font-black">01320492839800</p>
                    </div>
                  )}
                  {selectedBank === "dashen" && (
                    <div className="space-y-1">
                      <p className="font-bold text-zinc-300">Dashen Bank (TM Corporate)</p>
                      <p className="text-amber-500 font-mono text-sm font-black">5092839201928</p>
                    </div>
                  )}
                </div>

                {/* Ref Number Input */}
                <div>
                  <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Reference / Transaction Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={refNumber}
                    onChange={(e) => setRefNumber(e.target.value)}
                    placeholder="e.g. FT2615309..."
                    className="w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 text-xs"
                  />
                </div>

                {/* File Uploader for Slip */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    {getLocalText("upload_slip")} *
                  </label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-zinc-800 border-dashed rounded-lg cursor-pointer bg-black hover:bg-zinc-900/40 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
                        <span className="text-2xl mb-1">📸</span>
                        <p className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                          {uploading ? "Uploading Slip..." : "Click to Upload Slip Image"}
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlipUpload}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {uploadedSlipUrl && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold text-center">
                      ✓ Deposit Slip uploaded successfully!
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* CHANNEL B: INSTANT DIGITAL WALLET CHECKOUT */}
            {paymentMethod === "mobile" && (
              <div className="bg-zinc-900/30 border border-zinc-900 p-6 rounded-xl space-y-4 text-center">
                <span className="text-4xl block">📱</span>
                <h4 className="text-sm font-bold text-white">Chapa Unified Checkout API</h4>
                <p className="text-xs text-zinc-400 max-w-sm mx-auto leading-relaxed">
                  Upon clicking submit, you will be redirected securely to Chapa payment portal to pay with **Telebirr**, **CBE Birr**, or local cards.
                </p>
              </div>
            )}

            {/* Submit Button */}
            <div className="pt-6 border-t border-zinc-900">
              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
              >
                {submitting ? "Submitting Request..." : getLocalText("verify_status")}
              </button>
            </div>

          </form>
        </div>

        {/* Right Section: Bill Summary */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6 h-fit">
            <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-4">
              Billing Summary
            </h3>
            
            <div className="space-y-3 text-xs text-zinc-400">
              <div className="flex justify-between">
                <span>Ecosystem Deal ID:</span>
                <span className="font-mono text-zinc-200">{dealId.slice(0, 18)}...</span>
              </div>
              <div className="flex justify-between">
                <span>Verification Scope:</span>
                <span className="text-zinc-200">High-Trust Sourcing</span>
              </div>
              <div className="flex justify-between pt-4 border-t border-zinc-900 text-sm font-black text-white">
                <span>Total Due:</span>
                <span className="text-amber-500">{formatter.format(totalAmount)} ETB</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}