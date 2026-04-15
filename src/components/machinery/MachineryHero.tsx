"use client";

import { motion } from "framer-motion";
import { ChevronRight, ShieldCheck } from "lucide-react";

export default function MachineryHero({ machine }: any) {
  return (
    <section className="bg-[#111111] text-white">

      {/* BREADCRUMB */}
      <div className="px-6 py-3 text-sm text-gray-400 flex items-center gap-2">
        <span>Home</span>
        <ChevronRight size={16} />
        <span>Machinery</span>
        <ChevronRight size={16} />
        <span className="text-yellow-400">{machine.title}</span>
      </div>

      {/* HERO CONTENT */}
      <div className="grid md:grid-cols-2 gap-6 px-6 pb-10">

        {/* IMAGE */}
        <motion.img
          src={machine.image_url || "/placeholder.png"}
          className="w-full h-[300px] md:h-[450px] object-cover border border-gray-700"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.6 }}
        />

        {/* INFO */}
        <div className="flex flex-col justify-center">

          <h1 className="text-3xl md:text-4xl font-bold text-yellow-400">
            {machine.title}
          </h1>

          <p className="text-gray-400 mt-2">
            {machine.type} • {machine.model || "Model N/A"}
          </p>

          <p className="mt-4 text-lg">
            <span className="text-gray-400">Price:</span>{" "}
            <span className="text-yellow-400 font-semibold">
              {machine.price} ETB
            </span>
          </p>

          {/* TRUST BADGES */}
          <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-300">
            <span className="flex items-center gap-1">
              <ShieldCheck size={16} /> Verified
            </span>
            <span>✔ Insured</span>
            <span>✔ Admin Controlled</span>
          </div>

        </div>

      </div>

    </section>
  );
}