"use client";

import { useState } from "react";

export default function DealActions({
  machineId,
  providerId,
}: {
  machineId: string;
  providerId: string;
}) {
  const [loading, setLoading] = useState(false);

  const createDeal = async (type: string) => {
    setLoading(true);

    await fetch("/api/create-deal", {
      method: "POST",
      body: JSON.stringify({
        machine_id: machineId,
        requester_id: "CURRENT_USER_ID",
        provider_id: providerId,
        deal_type: type,
        price: 100000, // dynamic later
      }),
    });

    alert("Request sent. Waiting for admin approval.");
    setLoading(false);
  };

  return (
    <div className="space-y-3">

      <button
        onClick={() => createDeal("buy")}
        className="w-full bg-yellow-400 text-black py-2 font-bold rounded"
      >
        Buy Now
      </button>

      <button
        onClick={() => createDeal("rent")}
        className="w-full bg-black text-white py-2 rounded"
      >
        Rent Machine
      </button>

      <button
        onClick={() => createDeal("service")}
        className="w-full border py-2 rounded"
      >
        Request Service
      </button>

    </div>
  );
}