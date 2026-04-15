"use client";

import { motion } from "framer-motion";

export default function PrimaryButton({ children, onClick }: any) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="bg-yellow-400 text-black py-3 px-5 font-semibold w-full"
    >
      {children}
    </motion.button>
  );
}