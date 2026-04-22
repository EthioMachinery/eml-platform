"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/LanguageContext";

export default function MachineryDetailPage() {
  const { id } = useParams();
  const { lang } = useLanguage();

  const [machine, setMachine] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (id) fetchMachine();
  }, [id]);

  async function fetchMachine() {
    setLoading(true);

    const { data, error } = await supabase
      .from("machinery")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Fetch error:", error);
    } else {
      setMachine(data);
    }

    setLoading(false);
  }

  async function createDeal() {
    setCreating(true);
    setMessage("");

    // 1. Get logged-in user
    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage(lang === "am" ? "እባክዎ ይግቡ" : "Please login first");
      setCreating(false);
      return;
    }

    // 2. Validate machine
    if (!machine) {
      setMessage(lang === "am" ? "ማሽን አልተገኘም" : "Machine not found");
      setCreating(false);
      return;
    }

    const price = Number(machine.price_value || 0);
    const commissionRate = 0.1;

    // 3. Insert into deals (ALIGNED WITH YOUR DB)
    const { error } = await supabase.from("deals").insert([
      {
        machine_id: machine.id,
        requester_id: user.id,
        owner_id: machine.user_id || null,

        agreed_price: price,
        commission_rate: commissionRate,
        commission_amount: price * commissionRate,

        deal_status: "pending",
        payment_status: "unpaid",
      },
    ]);

    if (error) {
      console.error("Deal error:", error);
      setMessage(lang === "am" ? "ስህተት ተፈጥሯል" : "Error creating deal");
    } else {
      setMessage(
        lang === "am"
          ? "ግብይት ተጀምሯል"
          : "Deal successfully initiated"
      );
    }

    setCreating(false);
  }

  if (loading) {
    return (
      <div className="p-6 text-white">
        {lang === "am" ? "በመጫን ላይ..." : "Loading..."}
      </div>
    );
  }

  if (!machine) {
    return (
      <div className="p-6 text-white">
        {lang === "am" ? "አልተገኘም" : "Not found"}
      </div>
    );
  }

  return (
    <div className="p-6 text-white max-w-4xl mx-auto">
      {/* IMAGE */}
      {machine.image_url && (
        <img
          src={machine.image_url}
          alt="machine"
          className="w-full h-80 object-cover rounded-xl mb-6"
        />
      )}

      {/* TITLE */}
      <h1 className="text-3xl font-bold mb-2">
        {machine.title || "Machinery"}
      </h1>

      {/* PRICE */}
      <p className="text-xl font-bold text-yellow-400 mb-2">
        {machine.price_value ?? machine.price ?? 0} ETB
      </p>

      {/* LOCATION */}
      <p className="text-gray-400 mb-4">
        📍 {machine.location || "Unknown"}
      </p>

      {/* TRUST SECTION */}
      <div className="bg-gray-900 p-4 rounded-lg mb-6">
        <p>
          {lang === "am" ? "ኮንታክት" : "Contact"}:{" "}
          {machine.contact || "N/A"}
        </p>

        <p className="text-green-400 mt-2">
          ✔{" "}
          {lang === "am"
            ? "የተረጋገጠ ሻጭ (soon)"
            : "Verified seller (soon)"}
        </p>
      </div>

      {/* DETAILS */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>Type: {machine.type || "-"}</div>
        <div>Condition: {machine.condition || "-"}</div>
        <div>Year: {machine.year || "-"}</div>
        <div>Status: {machine.availability || "-"}</div>
      </div>

      {/* CTA */}
      <button
        onClick={createDeal}
        disabled={creating}
        className="w-full bg-yellow-500 text-black p-3 rounded-xl font-bold text-lg hover:opacity-90 disabled:opacity-50"
      >
        {creating
          ? lang === "am"
            ? "በመስራት ላይ..."
            : "Processing..."
          : lang === "am"
          ? "ግብይት ጀምር"
          : "Request Deal"}
      </button>

      {/* MESSAGE */}
      {message && (
        <p className="mt-4 text-center text-green-400">{message}</p>
      )}
    </div>
  );
}