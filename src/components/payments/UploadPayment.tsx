"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function UploadPayment({ deal }: any) {
  const [file, setFile] = useState<any>(null);

  const upload = async () => {
    if (!file) return;

    const fileName = `${deal.id}-${Date.now()}`;

    await supabase.storage
      .from("payment-proofs")
      .upload(fileName, file);

    await supabase
      .from("deals")
      .update({ payment_status: "pending_verification" })
      .eq("id", deal.id);

    alert("Payment uploaded. Waiting admin approval.");
  };

  return (
    <div className="mt-3">

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0])}
      />

      <button
        onClick={upload}
        className="bg-yellow-400 px-3 py-1 mt-2"
      >
        Upload Payment Proof
      </button>

    </div>
  );
}