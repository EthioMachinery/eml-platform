"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function PremiumPage() {

  const [machineId, setMachineId] = useState("");
  const [method, setMethod] = useState("telebirr");
  const [txRef, setTxRef] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async () => {

    if (!machineId || !txRef) {
      setMessage("Please fill all fields");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage("Login required");
      return;
    }

    const { error } = await supabase.from("premium_requests").insert([
      {
        user_id: user.id,
        machine_id: machineId,
        payment_method: method,
        transaction_ref: txRef,
        status: "pending",
      },
    ]);

    if (error) {
      console.error(error);
      setMessage("Error submitting request");
    } else {
      setMessage("Payment submitted! Waiting for approval.");
      setMachineId("");
      setTxRef("");
    }

  };

  return (
    <main className="min-h-screen flex flex-col items-center bg-black text-white px-6 py-10">

      <h1 className="text-3xl text-yellow-400 mb-6">
        Boost Your Machine 🚀
      </h1>

      <div className="max-w-md w-full bg-gray-900 p-6 rounded">

        {/* PAYMENT INSTRUCTIONS */}
        <div className="mb-6 text-sm text-gray-300">
          <p><b>Payment Options:</b></p>
          <p>📱 Telebirr: 09XXXXXXXX</p>
          <p>🏦 CBE: 1000XXXXXXX</p>
        </div>

        <input
          placeholder="Machine ID"
          value={machineId}
          onChange={(e)=>setMachineId(e.target.value)}
          className="w-full p-3 mb-3 rounded text-black"
        />

        <select
          value={method}
          onChange={(e)=>setMethod(e.target.value)}
          className="w-full p-3 mb-3 rounded text-black"
        >
          <option value="telebirr">Telebirr</option>
          <option value="cbe">CBE</option>
          <option value="bank">Bank Transfer</option>
        </select>

        <input
          placeholder="Transaction Reference"
          value={txRef}
          onChange={(e)=>setTxRef(e.target.value)}
          className="w-full p-3 mb-3 rounded text-black"
        />

        <button
          onClick={handleSubmit}
          className="w-full py-3 bg-yellow-500 text-black rounded"
        >
          Submit Payment
        </button>

        {message && (
          <p className="mt-4 text-center">{message}</p>
        )}

      </div>

    </main>
  );
}