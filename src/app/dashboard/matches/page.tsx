"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { getLang, Lang } from "@/lib/i18n";

type ListingItem = {
  id: string;
  title: string;
  title_en?: string;
  title_am?: string;
  price?: number;
  price_sale?: number;
  city?: string;
  location?: string;
  owner_id?: string;
};

type RequestItem = {
  id: string;
  title: string;
  budget?: string;
  budget_value?: number;
  city?: string;
  user_id?: string;
  contact?: string;
};

type LeadRow = {
  id: string;
  machine_id: string | null;
  buyer_id: string;
  seller_id: string | null;
  seller_phone: string | null;
  machine_title: string | null;
  status: string;
};

type UnlockRow = {
  id: string;
  lead_id: string;
  status: string; // pending_review | approved | rejected
};

const BANKS = ["CBE", "Abyssinia", "Abbay", "Dashen", "Awash", "Other"];
const ADMIN_PHONE = "+251911404186";

export default function MatchCenterPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [listings, setListings] = useState<ListingItem[]>([]);
  const [requests, setRequests] = useState<RequestItem[]>([]);

  const [myLeads, setMyLeads] = useState<LeadRow[]>([]);
  const [myUnlocks, setMyUnlocks] = useState<UnlockRow[]>([]);

  // Unlock panel state
  const [activeLead, setActiveLead] = useState<LeadRow | null>(null);
  const [method, setMethod] = useState("Telebirr");
  const [bank, setBank] = useState(BANKS[0]);
  const [reference, setReference] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setLang(getLang());
    init();
  }, []);

  async function init() {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setUserId(null);
      setLoading(false);
      return;
    }

    setUserId(user.id);
    await Promise.all([loadListings(), loadRequests(), loadMyLeads(user.id), loadMyUnlocks(user.id)]);
    setLoading(false);
  }

  async function loadListings() {
    const { data } = await supabase
      .from("listings")
      .select("id, title, title_en, title_am, price, price_sale, city, location, owner_id")
      .eq("status", "verified_available")
      .order("created_at", { ascending: false })
      .limit(12);

    setListings(data || []);
  }

  async function loadRequests() {
    const { data } = await supabase
      .from("requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(12);

    setRequests(data || []);
  }

  async function loadMyLeads(uid: string) {
    const { data } = await supabase
      .from("leads")
      .select("id, machine_id, buyer_id, seller_id, seller_phone, machine_title, status")
      .eq("buyer_id", uid);

    setMyLeads(data || []);
  }

  async function loadMyUnlocks(uid: string) {
    const { data } = await supabase
      .from("lead_unlocks")
      .select("id, lead_id, status")
      .eq("buyer_id", uid);

    setMyUnlocks(data || []);
  }

  function leadForListing(listingId: string) {
    return myLeads.find((l) => l.machine_id === listingId) || null;
  }

  function unlockForLead(leadId: string) {
    return myUnlocks.find((u) => u.lead_id === leadId) || null;
  }

  // Step 1: buyer expresses interest, creates (or reuses) a lead
  async function expressInterest(listing: ListingItem) {
    if (!userId) return;

    const existing = leadForListing(listing.id);
    if (existing) return; // already have a lead for this listing

    const title = listing.title_en || listing.title || listing.title_am || "Untitled listing";

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          machine_id: listing.id,
          buyer_id: userId,
          seller_id: listing.owner_id || null,
          machine_title: title,
          status: "open",
        },
      ])
      .select()
      .single();

    if (!error && data) {
      setMyLeads([...myLeads, data]);
    }
  }

  function openUnlockPanel(lead: LeadRow) {
    setActiveLead(lead);
    setMethod("Telebirr");
    setBank(BANKS[0]);
    setReference("");
    setReceiptFile(null);
    setSubmitError(null);
  }

  function closeUnlockPanel() {
    setActiveLead(null);
  }

  // Step 2: buyer submits payment reference + receipt for admin review
  async function submitUnlockRequest() {
    if (!userId || !activeLead) return;

    if (!reference.trim()) {
      setSubmitError(isAm ? "እባክዎ የክፍያ ማረጋገጫ ቁጥር ያስገቡ።" : "Please enter a payment reference number.");
      return;
    }
    if (!receiptFile) {
      setSubmitError(isAm ? "እባክዎ የክፍያ ደረሰኝ ይስቀሉ።" : "Please upload your payment receipt.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      // Upload receipt to storage, scoped under the buyer's own folder
      const fileExt = receiptFile.name.split(".").pop();
      const filePath = userId + "/" + activeLead.id + "-" + Date.now() + "." + fileExt;

      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(filePath, receiptFile);

      if (uploadError) {
        setSubmitError(uploadError.message);
        setSubmitting(false);
        return;
      }

      // Create the payment record
      const { data: payment, error: paymentError } = await supabase
        .from("payments")
        .insert([
          {
            user_id: userId,
            buyer_id: userId,
            seller_id: activeLead.seller_id,
            listing_id: activeLead.machine_id,
            amount: 100,
            currency: "ETB",
            method,
            bank_name: method === "Bank Transfer" ? bank : null,
            reference: reference.trim(),
            receipt_url: filePath,
            status: "pending",
            note: "Lead unlock: " + (activeLead.machine_title || activeLead.id),
          },
        ])
        .select()
        .single();

      if (paymentError || !payment) {
        setSubmitError(paymentError?.message || "Could not record payment.");
        setSubmitting(false);
        return;
      }

      // Create the unlock request, pending admin review
      const { data: unlock, error: unlockError } = await supabase
        .from("lead_unlocks")
        .insert([
          {
            lead_id: activeLead.id,
            buyer_id: userId,
            payment_id: payment.id,
            status: "pending_review",
          },
        ])
        .select()
        .single();

      if (unlockError || !unlock) {
        setSubmitError(unlockError?.message || "Could not submit unlock request.");
        setSubmitting(false);
        return;
      }

      setMyUnlocks([...myUnlocks, unlock]);
      setSubmitting(false);
      setActiveLead(null);
    } catch (err: any) {
      setSubmitError(err?.message || "Something went wrong.");
      setSubmitting(false);
    }
  }

  const isAm = lang === "am";

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-zinc-400">{isAm ? "በመጫን ላይ..." : "Loading..."}</p>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            {isAm ? "እባክዎ ይግቡ" : "Please sign in"}
          </h1>
          <p className="text-zinc-400 mb-6">
            {isAm
              ? "የግጥሚያ ማዕከልን ለመመልከት እና ከገዢዎች እና ሻጮች ጋር ለመገናኘት ይግቡ።"
              : "Sign in to view the Match Center and connect with buyers and sellers."}
          </p>
          
            href="/login"
            className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-black px-8 py-3 rounded-xl font-bold"
          >
            {isAm ? "ይግቡ" : "Sign In"}
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
          {isAm ? "ብልህ ግጥሚያ ማዕከል" : "Smart Match Center"}
        </h1>
        <p className="text-zinc-400 mb-10">
          {isAm
            ? "የገዢ ጥያቄዎችን እና ተመጣጣኝ ማሽነሪዎችን ይመልከቱ። ክፍያ ከተረጋገጠ በኋላ የእውቂያ መረጃ ይከፈታል።"
            : "Browse buyer requests and matching machinery. Unlock contact details after a quick payment review."}
        </p>

        {/* MACHINERY LISTINGS */}
        <section className="mb-14">
          <h2 className="text-3xl font-bold mb-6 text-green-400">
            {isAm ? "ያሉ ማሽነሪዎች" : "Available Machinery"}
          </h2>

          {listings.length === 0 ? (
            <p className="text-zinc-500">{isAm ? "በአሁኑ ጊዜ ምንም ዝርዝሮች የሉም።" : "No listings available right now."}</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {listings.map((item) => {
                const lead = leadForListing(item.id);
                const unlock = lead ? unlockForLead(lead.id) : null;
                return (
                  <ListingCard
                    key={item.id}
                    item={item}
                    lead={lead}
                    unlock={unlock}
                    isAm={isAm}
                    onExpressInterest={() => expressInterest(item)}
                    onUnlock={() => lead && openUnlockPanel(lead)}
                  />
                );
              })}
            </div>
          )}
        </section>

        {/* BUYER REQUESTS */}
        <section>
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">
            {isAm ? "የገዢ ጥያቄዎች" : "Buyer Requests"}
          </h2>

          {requests.length === 0 ? (
            <p className="text-zinc-500">{isAm ? "በአሁኑ ጊዜ ምንም የገዢ ጥያቄዎች የሉም።" : "No buyer requests right now."}</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {requests.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800"
                >
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-zinc-400 mb-2">📍 {item.city}</p>
                  <p className="text-zinc-400">💰 {item.budget}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* UNLOCK PANEL MODAL */}
      {activeLead && (
        <UnlockPanel
          lead={activeLead}
          isAm={isAm}
          method={method}
          setMethod={setMethod}
          bank={bank}
          setBank={setBank}
          reference={reference}
          setReference={setReference}
          receiptFile={receiptFile}
          setReceiptFile={setReceiptFile}
          submitting={submitting}
          submitError={submitError}
          onSubmit={submitUnlockRequest}
          onClose={closeUnlockPanel}
        />
      )}
    </main>
  );
}

function ListingCard({
  item,
  lead,
  unlock,
  isAm,
  onExpressInterest,
  onUnlock,
}: {
  item: ListingItem;
  lead: LeadRow | null;
  unlock: UnlockRow | null;
  isAm: boolean;
  onExpressInterest: () => void;
  onUnlock: () => void;
}) {
  const title = item.title_en || item.title || item.title_am || "Untitled";
  const price = item.price_sale || item.price;

  return (
    <div className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800">
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-zinc-400 mb-2">📍 {item.city || item.location}</p>
      {price ? <p className="text-zinc-400 mb-4">💰 {price} ETB</p> : null}

      {!lead && (
        <button
          onClick={onExpressInterest}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-bold"
        >
          {isAm ? "ፍላጎት አለኝ" : "I'm Interested"}
        </button>
      )}

      {lead && !unlock && (
        <button
          onClick={onUnlock}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-bold"
        >
          🔒 {isAm ? "እውቂያ ክፈት — 100 ብር" : "Unlock Contact — 100 ETB"}
        </button>
      )}

      {lead && unlock && unlock.status === "pending_review" && (
        <p className="text-center text-yellow-400 font-semibold py-3">
          {isAm ? "ክፍያ በግምገማ ላይ..." : "Payment under review..."}
        </p>
      )}

      {lead && unlock && unlock.status === "rejected" && (
        <p className="text-center text-red-400 font-semibold py-3">
          {isAm ? "ክፍያው አልጸደቀም። ድጋፍን ያግኙ።" : "Payment was not approved. Contact support."}
        </p>
      )}

      {lead && unlock && unlock.status === "approved" && (
        <>
          <p className="mb-3 text-green-400 font-bold">
            📞 {lead.seller_phone || "Contact pending — message support"}
          </p>
          {lead.seller_phone && (
            
              href={"https://wa.me/" + lead.seller_phone.replace(/[^0-9]/g, "")}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center bg-green-500 hover:bg-green-600 py-3 rounded-xl font-bold"
            >
              WhatsApp
            </a>
          )}
        </>
      )}
    </div>
  );
}

function UnlockPanel({
  lead,
  isAm,
  method,
  setMethod,
  bank,
  setBank,
  reference,
  setReference,
  receiptFile,
  setReceiptFile,
  submitting,
  submitError,
  onSubmit,
  onClose,
}: {
  lead: LeadRow;
  isAm: boolean;
  method: string;
  setMethod: (v: string) => void;
  bank: string;
  setBank: (v: string) => void;
  reference: string;
  setReference: (v: string) => void;
  receiptFile: File | null;
  setReceiptFile: (f: File | null) => void;
  submitting: boolean;
  submitError: string | null;
  onSubmit: () => void;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center px-4 z-50">
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl max-w-lg w-full p-8 max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-2">
          {isAm ? "እውቂያ ክፈት" : "Unlock Contact"}
        </h2>
        <p className="text-zinc-400 mb-6">
          {lead.machine_title}
        </p>

        <div className="bg-zinc-800 rounded-2xl p-4 mb-6 text-sm text-zinc-300">
          <p className="mb-2 font-semibold text-white">
            {isAm ? "ደረጃ 1፡ በቴሌግራም ያግኙን" : "Step 1: Message us on Telegram"}
          </p>
          <p>
            {isAm
              ? "የክፍያ ዘዴዎን ዝርዝር መረጃ ለማግኘት በቴሌግራም " + ADMIN_PHONE + " ላይ ያግኙን፣ ከዚያ ክፍያውን ይላኩ።"
              : "Contact us on Telegram at " + ADMIN_PHONE + " to get the payment details for your chosen method below, then send the payment."}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-zinc-400 mb-2">
            {isAm ? "የክፍያ ዘዴ" : "Payment Method"}
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
          >
            <option value="Telebirr">Telebirr</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Mobile Banking">Mobile Banking</option>
          </select>
        </div>

        {method === "Bank Transfer" && (
          <div className="mb-4">
            <label className="block text-sm text-zinc-400 mb-2">
              {isAm ? "ባንክ" : "Bank"}
            </label>
            <select
              value={bank}
              onChange={(e) => setBank(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
            >
              {BANKS.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm text-zinc-400 mb-2">
            {isAm ? "የክፍያ ማረጋገጫ ቁጥር" : "Payment Reference Number"}
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder={isAm ? "ለምሳሌ ከደረሰኝዎ ላይ ያለው የግብይት መለያ ቁጥር" : "e.g. transaction ID from your receipt"}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-zinc-400 mb-2">
            {isAm ? "የክፍያ ደረሰኝ ይስቀሉ" : "Upload Payment Receipt"}
          </label>
          <input
            type="file"
            accept="image/*,.pdf"
            onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
            className="w-full text-sm text-zinc-300"
          />
        </div>

        {submitError && (
          <p className="text-red-400 text-sm mb-4">{submitError}</p>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={submitting}
            className="flex-1 bg-zinc-800 hover:bg-zinc-700 py-3 rounded-xl font-bold"
          >
            {isAm ? "ይቅር" : "Cancel"}
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black px-5 py-2 rounded-xl font-bold disabled:opacity-50"
          >
            {submitting ? "..." : isAm ? "ለግምገማ ላክ" : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
}