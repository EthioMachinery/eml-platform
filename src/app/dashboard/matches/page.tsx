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
  status: string;
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

  async function expressInterest(listing: ListingItem) {
    if (!userId) return;

    const existing = leadForListing(listing.id);
    if (existing) return;

    const title = listing.title_en || listing.title || listing.title_am || "Untitled listing";

    let sellerPhone: string | null = null;
    if (listing.owner_id) {
      const { data: sellerProfile } = await supabase
        .from("profiles")
        .select("phone, phone_number")
        .eq("id", listing.owner_id)
        .maybeSingle();

      if (sellerProfile) {
        sellerPhone = sellerProfile.phone_number || sellerProfile.phone || null;
      }
    }

    const { data, error } = await supabase
      .from("leads")
      .insert([
        {
          machine_id: listing.id,
          buyer_id: userId,
          seller_id: listing.owner_id || null,
          seller_phone: sellerPhone,
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

  async function submitUnlockRequest() {
    if (!userId || !activeLead) return;

    if (!reference.trim()) {
      setSubmitError(isAm ? "\u12A5\u1263\u12AD\u12CE \u12E8\u12AD\u134D\u12EB \u121B\u1228\u130B\u1308\u132B \u1241\u1325\u122D \u12EB\u1235\u130D\u1261\u1362" : "Please enter a payment reference number.");
      return;
    }
    if (!receiptFile) {
      setSubmitError(isAm ? "\u12A5\u1263\u12AD\u12CE \u12E8\u12AD\u134D\u12EB \u12F0\u122D\u1230\u129D \u12ED\u1235\u1240\u1209\u1362" : "Please upload your payment receipt.");
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
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
        <p className="text-zinc-400">{isAm ? "\u1260\u1218\u132B\u1295 \u120B\u12ED..." : "Loading..."}</p>
      </main>
    );
  }

  if (!userId) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">
            {isAm ? "\u12A5\u1263\u12AD\u12CE \u12ED\u130D\u1261" : "Please sign in"}
          </h1>
          <p className="text-zinc-400 mb-6">
            {isAm
              ? "\u12E8\u130D\u1325\u121A\u12EB \u121B\u12D5\u12A8\u120D\u1295 \u1208\u1218\u1218\u120D\u12A8\u1275 \u12A5\uና \u12A8\u1308\u12A2\u12CE\u127D \u12A5\u1293 \u123B\u1326\u127D \u130B\u122D \u1208\u1218\u130B\u1290\u129B\u1275 \u12ED\u130D\u1261\u1362"
              : "Sign in to view the Match Center and connect with buyers and sellers."}
          </p>
          
            href="/login"
            className="inline-block bg-gradient-to-r from-green-400 to-blue-500 text-black px-8 py-3 rounded-xl font-bold"
          >
            {isAm ? "\u12ED\u130D\u1261" : "Sign In"}
          </a>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 via-cyan-500 to-blue-500 bg-clip-text text-transparent">
          {isAm ? "\u1265\u120D\u1205 \u130D\u1325\u121A\u12EB \u121B\u12D5\u12A8\u120D" : "Smart Match Center"}
        </h1>
        <p className="text-zinc-400 mb-10">
          {isAm
            ? "\u12E8\u1308\u12DA \u1325\u12EB\u1244\u12CE\u127D\u1295 \u12A5\uና \u1270\u1218\u1323\u1323\u129D \u121B\u123D\u290A\u122E\u127D\u1295 \u12ED\u121D\u120D\u12A8\u1271\u1362 \u12AD\u134D\u12EB \u12A8\u1270\u1228\u130B\u1308\u1320 \u1260\u128B\u120B \u12E8\u12A5\u12CD\u1242\u12EB \u1218\u1228\u127B \u12ED\u12A8\u134D\u1270\u120D\u1362"
            : "Browse buyer requests and matching machinery. Unlock contact details after a quick payment review."}
        </p>

        <section className="mb-14">
          <h2 className="text-3xl font-bold mb-6 text-green-400">
            {isAm ? "\u12EB\u1209 \u121B\u123D\u290A\u122E\u127D" : "Available Machinery"}
          </h2>

          {listings.length === 0 ? (
            <p className="text-zinc-500">{isAm ? "\u1260\u12A0\u1201\u኷ \u130A\u12DC \u121D\u295D\u121D \u12DD\u122D\u12DD\u122E\u127D \u12E8\u1209\u121D\u1362" : "No listings available right now."}</p>
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

        <section>
          <h2 className="text-3xl font-bold mb-6 text-yellow-400">
            {isAm ? "\u12E8\u130D\u12DA \u1325\u12EB\u1244\u12CE\u127D" : "Buyer Requests"}
          </h2>

          {requests.length === 0 ? (
            <p className="text-zinc-500">{isAm ? "\u1260\u12A0\u1201\u኷ \u130A\u12DC \u121D\u295D\u121D \u12E8\u130D\u12DA \u1325\u12EB\u1244\u12CE\u127D \u12E8\u1209\u121D\u1362" : "No buyer requests right now."}</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {requests.map((item) => (
                <div
                  key={item.id}
                  className="bg-zinc-900 p-6 rounded-3xl border border-zinc-800"
                >
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-zinc-400 mb-2">{"\u{1F4CD}"} {item.city}</p>
                  <p className="text-zinc-400">{"\u{1F4B0}"} {item.budget}</p>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

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
      <p className="text-zinc-400 mb-2">{"\u{1F4CD}"} {item.city || item.location}</p>
      {price ? <p className="text-zinc-400 mb-4">{"\u{1F4B0}"} {price} ETB</p> : null}

      {!lead && (
        <button
          onClick={onExpressInterest}
          className="w-full bg-blue-500 hover:bg-blue-600 py-3 rounded-xl font-bold"
        >
          {isAm ? "\u134D\u120B\u1308\u1275 \u12A0\u1208\u129D" : "I'm Interested"}
        </button>
      )}

      {lead && !unlock && (
        <button
          onClick={onUnlock}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-bold"
        >
          {"\u{1F512}"} {isAm ? "\u12A5\u12CD\u1242\u12EB \u12AD\u134D\u275A 100 \u1265\u122D" : "Unlock Contact — 100 ETB"}
        </button>
      )}

      {lead && unlock && unlock.status === "pending_review" && (
        <p className="text-center text-yellow-400 font-semibold py-3">
          {isAm ? "\u12AD\u134D\u12EB \u1260\u130D\u121D\u130D\u121B \u120B\u12ED..." : "Payment under review..."}
        </p>
      )}

      {lead && unlock && unlock.status === "rejected" && (
        <p className="text-center text-red-400 font-semibold py-3">
          {isAm ? "\u12AD\u134D\u12EB\u12CD \u12A0\u120D\u133D\u12F0\u1240\u121D\u1362 \u12F5\u130B\u134D\u295D \u12EB\u130D\u1295\u1362" : "Payment was not approved. Contact support."}
        </p>
      )}

      {lead && unlock && unlock.status === "approved" && (
        <>
          <p className="mb-3 text-green-400 font-bold">
            {"\u{1F4DE}"} {lead.seller_phone || "Contact pending — message support"}
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
          {isAm ? "\u12A5\u12CD\u1242\u12EB \u12AD\u134D\u1275" : "Unlock Contact"}
        </h2>
        <p className="text-zinc-400 mb-6">
          {lead.machine_title}
        </p>

        <div className="bg-zinc-800 rounded-2xl p-4 mb-6 text-sm text-zinc-300">
          <p className="mb-2 font-semibold text-white">
            {isAm ? "\u12F0\u1228\u1303 1\u1361 \u1260\u127A\u1209\u130D\u122B\u121D \u12EB\u130D\u1295" : "Step 1: Message us on Telegram"}
          </p>
          <p>
            {isAm
              ? "\u12E8\u12AD\u134D\u12EB \u12DE\u12F4\u12CE\u295D \u12DD\u122D\u12DD\u122D \u1218\u1228\u1303 \u1208\u121B\u130D\u1290\u275A \u1260\u127A\u1209\u130D\u122B\u121D " + ADMIN_PHONE + " \u120B\u12ED \u12EB\u130D\u1295\u1361 \u12A8\u12DB\u12EB \u12AD\u134D\u12EB\u12CD\u295D \u12ED\u120B\u1261\u1362"
              : "Contact us on Telegram at " + ADMIN_PHONE + " to get the payment details for your chosen method below, then send the payment."}
          </p>
        </div>

        <div className="mb-4">
          <label className="block text-sm text-zinc-400 mb-2">
            {isAm ? "\u12E8\u12AD\u134D\u12EB \u12DE\u12F4" : "Payment Method"}
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
              {isAm ? "\u1263\u295D\u12AD" : "Bank"}
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
            {isAm ? "\u12E8\u12AD\u134D\u12EB \u121B\u1228\u130B\u1308\u132B \u1241\u1325\u122D" : "Payment Reference Number"}
          </label>
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder={isAm ? "\u1208\u121D\u233D\u120C \u12A8\u12F0\u122D\u1230\u129D\u12CE \u120B\u12ED \u12EB\u1208\u12CD \u12E8\u130D\u1265\u12ED\u275A \u1218\u120D\u12EB \u1241\u1325\u122D" : "e.g. transaction ID from your receipt"}
            className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-zinc-400 mb-2">
            {isAm ? "\u12E8\u12AD\u134D\u12EB \u12F0\u122D\u1230\u129D \u12ED\u1235\u1240\u1209" : "Upload Payment Receipt"}
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
            {isAm ? "\u12ED\u1241\u122D" : "Cancel"}
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting}
            className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {submitting ? "..." : isAm ? "\u1208\u130D\u121D\u130D\u121B \u120B\u12AD" : "Submit for Review"}
          </button>
        </div>
      </div>
    </div>
  );
}
