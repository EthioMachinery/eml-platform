"use client";

import { Wrench, Truck, FileText } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="bg-[#111111] p-5 rounded border border-gray-700 sticky top-6">

      <h2 className="text-yellow-400 font-bold mb-4">
        Actions / እርምጃዎች
      </h2>

      <div className="flex flex-col gap-3">

        <button className="bg-yellow-400 text-black py-3 font-semibold flex items-center justify-center gap-2">
          <FileText size={18} />
          Request Quote / ዋጋ ጠይቅ
        </button>

        <button className="bg-yellow-400 text-black py-3 font-semibold flex items-center justify-center gap-2">
          <Truck size={18} />
          Rent Now / ኪራይ
        </button>

        <button className="bg-yellow-400 text-black py-3 font-semibold flex items-center justify-center gap-2">
          <Wrench size={18} />
          Maintenance / ጥገና
        </button>

      </div>

    </div>
  );
}