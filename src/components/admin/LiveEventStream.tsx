"use client";

import { useEffect, useState } from "react";
import { useLiveEvents } from "@/hooks/useLiveEvents";
import { EMLActivityEvent } from "@/core/eventTypes";

export default function LiveEventStream() {
  const events = useLiveEvents();
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    setConnected(true);
  }, []);

  const getColor = (type: string) => {
    switch (type) {
      case "DEAL_CREATED":
        return "text-green-600";
      case "REQUEST_POSTED":
        return "text-blue-600";
      case "PAYMENT_COMPLETED":
        return "text-emerald-600";
      case "SYSTEM_ALERT":
        return "text-red-600";
      default:
        return "text-gray-700";
    }
  };

  return (
    <div className="w-full bg-white border rounded-lg p-4 shadow-sm">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">
          Live EML Activity Stream
        </h2>

        <span
          className={`text-xs px-2 py-1 rounded-full ${
            connected
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {connected ? "LIVE" : "OFFLINE"}
        </span>
      </div>

      {/* STREAM */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {events.length === 0 && (
          <p className="text-sm text-gray-500">
            No activity yet...
          </p>
        )}

        {events.map((event: EMLActivityEvent) => (
          <div
            key={event.id}
            className="p-3 border rounded-md hover:bg-gray-50 transition"
          >
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${getColor(event.type)}`}>
                {event.type}
              </span>

              <span className="text-xs text-gray-400">
                {new Date(event.timestamp).toLocaleTimeString()}
              </span>
            </div>

            <div className="mt-1 text-sm font-semibold">
              {event.title}
            </div>

            {event.description && (
              <div className="text-xs text-gray-500 mt-1">
                {event.description}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}