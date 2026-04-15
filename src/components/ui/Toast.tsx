"use client";

import { motion } from "framer-motion";

export default function Toast({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="fixed bottom-5 right-5 bg-black text-white px-4 py-2 border border-yellow-400 z-50"
    >
      {message}
    </motion.div>
  );
}