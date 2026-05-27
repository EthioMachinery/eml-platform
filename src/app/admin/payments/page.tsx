"use client";

import { useEffect, useState } from "react";

export default function AdminPaymentsPage() {
  const [items, setItems] = useState<any[]>([]);

  async function load() {
    const res = await fetch(
      "/api/manual-payments"
    );

    const data = await res.json();

    setItems(data.payments || []);
  }

  async function approve(id: string) {
    await fetch(
      "/api/manual-payments/approve",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({ id }),
      }
    );

    load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-bold mb-6">
          Payment Approvals
        </h1>

        <div className="space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white border rounded-xl p-5"
            >
              <div className="flex justify-between">
                <div>
                  <div className="font-semibold">
                    {item.payer_name}
                  </div>

                  <div className="text-sm text-gray-500">
                    Ref: {item.reference_no}
                  </div>

                  <div className="text-sm">
                    ETB {item.amount}
                  </div>
                </div>

                <button
                  onClick={() =>
                    approve(item.id)
                  }
                  className="bg-green-600 text-white px-4 py-2 rounded-lg"
                >
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}