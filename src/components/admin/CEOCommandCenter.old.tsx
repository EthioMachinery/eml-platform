"use client";

import { useEffect, useState } from "react";
import { EMLKernel } from "@/core/emlKernel";
import { MarketStream } from "@/core/marketStream";
import { Deal } from "@/core/emlCore";

export default function CEOControlCenter() {
  const [deals, setDeals] =
    useState<Deal[]>([]);

  const [stats, setStats] =
    useState<any>(null);

  useEffect(() => {
    loadData();

    return () => {
      if (MarketStream.stop) {
        MarketStream.stop();
      }
    };
  }, []);

  async function loadData() {
    const sampleDeals: Deal[] = [];

    setDeals(sampleDeals);

    await MarketStream.init();

    await EMLKernel.start();

    const kernel =
      EMLKernel.status();

    setStats({
      kernel,
    });
  }

  return (
    <div className="bg-white rounded-xl border p-6">
      <h2 className="text-2xl font-bold mb-4">
        CEO Control Center
      </h2>

      {!stats && <p>Loading...</p>}

      {stats && (
        <div className="space-y-3 text-sm">

          <p>
            Deals Loaded:{" "}
            {deals.length}
          </p>

          <p>
            Market Stream: Active
          </p>

          <p>
            Kernel Running:{" "}
            {stats.kernel?.running
              ? "Yes"
              : "No"}
          </p>

        </div>
      )}
    </div>
  );
}