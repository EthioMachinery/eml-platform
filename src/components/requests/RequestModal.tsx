"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

type Props = {
  onClose: () => void;
};

export default function RequestModal({ onClose }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRequest = async () => {
    if (!title || !description) return;

    setLoading(true);

    const { error } = await supabase.from("machine_requests").insert([
      {
        title,
        description,
      },
    ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 p-6 rounded-2xl w-[400px]"
      >
        <h2 className="text-xl font-bold mb-4">
          Create Request
        </h2>

        <input
          className="w-full p-2 mb-3 bg-zinc-800 rounded"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="w-full p-2 mb-3 bg-zinc-800 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div className="flex justify-between gap-2">
          <button
            onClick={onClose}
            className="bg-gray-600 px-4 py-2 rounded"
          >
            Cancel
          </button>

          <button
            onClick={submitRequest}
            disabled={loading}
            className="bg-green-600 px-4 py-2 rounded"
          >
            {loading ? "..." : "Submit"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}