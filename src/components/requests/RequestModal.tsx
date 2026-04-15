"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function RequestModal({ machine, user, onClose }: any) {
  const [type, setType] = useState("rent");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRequest = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("machine_requests").insert([
      {
        requester_id: user.id,
        owner_id: machine.user_id,
        machine_id: machine.id,
        request_type: type,
        message,
        status: "pending",
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error submitting request");
    } else {
      alert("Request submitted (Admin will review)");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 w-full max-w-md"
      >

        <h2 className="font-bold text-lg mb-4">
          Request Service
        </h2>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 mb-3"
        >
          <option value="rent">Rent</option>
          <option value="quote">Quote</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <textarea
          placeholder="Describe your need..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 mb-4"
        />

        <button
          onClick={submitRequest}
          className="bg-yellow-400 w-full py-2 font-semibold"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

      </motion.div>
    </div>
  );
}"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

export default function RequestModal({ machine, user, onClose }: any) {
  const [type, setType] = useState("rent");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const submitRequest = async () => {
    if (!user) {
      alert("Login required");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("machine_requests").insert([
      {
        requester_id: user.id,
        owner_id: machine.user_id,
        machine_id: machine.id,
        request_type: type,
        message,
        status: "pending",
      },
    ]);

    setLoading(false);

    if (error) {
      alert("Error submitting request");
    } else {
      alert("Request submitted (Admin will review)");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="bg-white p-6 w-full max-w-md"
      >

        <h2 className="font-bold text-lg mb-4">
          Request Service
        </h2>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border p-2 mb-3"
        >
          <option value="rent">Rent</option>
          <option value="quote">Quote</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <textarea
          placeholder="Describe your need..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 mb-4"
        />

        <button
          onClick={submitRequest}
          className="bg-yellow-400 w-full py-2 font-semibold"
        >
          {loading ? "Submitting..." : "Submit Request"}
        </button>

      </motion.div>
    </div>
  );
}