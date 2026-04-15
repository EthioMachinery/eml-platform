"use client";

import { useState } from "react";
import { AutoPilot } from "@/lib/autoPilot";

export default function AutoPilotPage() {
  const [running, setRunning] = useState(false);
  const [message, setMessage] = useState("");

  const runAutoPilot = async () => {
    setRunning(true);
    setMessage("Running AI Autopilot...");

    await AutoPilot.run();

    setMessage("✅ Autopilot completed successfully");
    setRunning(false);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-6">

      <div className="max-w-3xl mx-auto bg-white p-6 rounded shadow space-y-4">

        <h1 className="text-2xl font-bold">
          Autonomous Marketplace Control
        </h1>

        <p className="text-gray-600 text-sm">
          AI will optimize pricing, promotions, and demand automatically.
        </p>

        <button
          onClick={runAutoPilot}
          disabled={running}
          className="bg-black text-white px-6 py-3 rounded"
        >
          {running ? "Running..." : "Run Autopilot"}
        </button>

        {message && (
          <p className="text-green-600">{message}</p>
        )}

      </div>

    </div>
  );
}