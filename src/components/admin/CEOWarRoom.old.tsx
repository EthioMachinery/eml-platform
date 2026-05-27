"use client";

import { useEffect, useState } from "react";
import { EMLKernel } from "@/core/emlKernel";
import { WorkerCluster } from "@/core/workerCluster";
import { Observability } from "@/core/observability";

export default function CEOWarRoom() {
  const [status, setStatus] =
    useState<any>(null);

  useEffect(() => {
    boot();
  }, []);

  async function boot() {
    await EMLKernel.start();

    const kernel =
      EMLKernel.status();

    const workers =
      WorkerCluster?.status
        ? WorkerCluster.status()
        : {};

    const metrics =
      await Observability.stream(5);

    setStatus({
      kernel,
      workers,
      metrics,
    });
  }

  return (
    <div className="bg-black text-white rounded-xl p-6 border border-zinc-800">
      <h2 className="text-2xl font-bold text-red-400 mb-4">
        CEO War Room
      </h2>

      {!status && (
        <p>Loading...</p>
      )}

      {status && (
        <div className="space-y-3 text-sm">

          <p>
            Kernel Running:{" "}
            {status.kernel?.running
              ? "Yes"
              : "No"}
          </p>

          <p>
            Worker Cluster:
            Online
          </p>

          <p>
            Recent Logs:{" "}
            {status.metrics
              ?.length || 0}
          </p>

        </div>
      )}
    </div>
  );
}