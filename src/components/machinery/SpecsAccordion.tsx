"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  {
    title: "Performance Specs / አፈጻጸም",
    content: ["Engine Power: 250 HP", "Operating Weight: 20,000 kg"],
  },
  {
    title: "Dimensions / መጠኖች",
    content: ["Length: 8.5 m", "Width: 3 m", "Height: 3.2 m"],
  },
  {
    title: "Standard Equipment / መሳሪያዎች",
    content: ["Air Conditioning", "GPS System", "Hydraulic System"],
  },
];

export default function SpecsAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="space-y-3">

      {sections.map((sec, i) => (
        <div key={i} className="border border-gray-300 bg-white">

          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="w-full flex justify-between items-center px-4 py-3 font-semibold"
          >
            {sec.title}
            <ChevronDown size={18} />
          </button>

          <AnimatePresence>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="px-4 pb-4 text-sm text-gray-700 overflow-hidden"
              >
                {sec.content.map((item, idx) => (
                  <p key={idx}>• {item}</p>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      ))}

    </div>
  );
}