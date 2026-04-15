"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function Upgrade() {

  const [machines, setMachines] = useState<any[]>([]);
  const [selectedMachine, setSelectedMachine] = useState("");
  const [transactionRef, setTransactionRef] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {

    const fetchMachines = async () => {
      const { data } = await supabase
        .from("machinery")
        .select("*");

      setMachines(data || []);
    };

    fetchMachines();

  }, []);

  const handleUpgrade = async () => {

    if (!selectedMachine || !transactionRef) {
      setMessage("Please select machine and enter transaction reference");
      return;
    }

    const { data: userData } = await supabase.auth.getUser();

    await supabase.from("premium_requests").insert([
      {
        user_id: userData.user?.id,
        machine_id: selectedMachine,
        payment_method: "manual",
        transaction_ref: transactionRef
      }
    ]);

    setMessage("Upgrade request submitted! Await admin approval.");
    setSelectedMachine("");
    setTransactionRef("");
  };

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">

      <h1 className="text-3xl text-yellow-400 mb-6 text-center">
        Upgrade to Premium
      </h1>

      <div className="max-w-md mx-auto bg-gray-900 p-6 rounded">

        <p className="mb-4 text-gray-300">
          Pay via Telebirr or Bank and submit transaction reference.
        </p>

        <select
          value={selectedMachine}
          onChange={(e)=>setSelectedMachine(e.target.value)}
          className="w-full p-3 mb-3 text-black rounded"
        >
          <option value="">Select Machine</option>
          {machines.map((m)=>(
            <option key={m.id} value={m.id}>
              {m.title}
            </option>
          ))}
        </select>

        <input
          placeholder="Transaction Reference"
          value={transactionRef}
          onChange={(e)=>setTransactionRef(e.target.value)}
          className="w-full p-3 mb-3 text-black rounded"
        />

        <button
          onClick={handleUpgrade}
          className="w-full bg-yellow-500 text-black py-3 rounded"
        >
          Submit Request
        </button>

        {message && (
          <p className="mt-4 text-center">{message}</p>
        )}

      </div>

    </main>
  );
}