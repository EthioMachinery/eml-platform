"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/lib/LanguageContext";
import { DealEngine } from "@/lib/dealEngine";
import { AutomationEngine } from "@/lib/automationEngine";

export default function MachineryDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { t } = useLanguage();

  const [machine, setMachine] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    setUser(auth.user);

    const { data: machineData, error } = await supabase
      .from("machines")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
    }

    setMachine(machineData);
    setLoading(false);
  };

  // =========================
  // CREATE DEAL (SMART FLOW)
  // =========================
  const createDeal = async () => {
    if (!user) {
      alert("Please login first");
      router.push("/login");
      return;
    }

    if (!machine) return;

    // Prevent self-deal
    if (user.id === machine.owner_id) {
      alert("You cannot request your own machine");
      return;
    }

    const commission = DealEngine.calculateCommission(machine.price || 0);

    const { data, error } = await supabase
      .from("deals")
      .insert({
        requester_id: user.id,
        provider_id: machine.owner_id,
        machine_id: machine.id,
        price: machine.price,
        commission: commission,
        status: "requested",
        payment_status: "unpaid",
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      alert("Error creating deal");
      return;
    }

    // =========================
    // AUTOMATION TRIGGERS
    // =========================
    await AutomationEngine.onDealCreated(data);
    await AutomationEngine.autoApprove(data);
    await AutomationEngine.fraudCheck(data);

    alert("Request sent successfully");
    router.push("/dashboard");
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (!machine) {
    return <div className="p-6">Machine not found</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="md:col-span-2 space-y-6">

          {/* IMAGE */}
          <div className="bg-white p-4 rounded shadow">
            <img
              src={machine.image_url || "/placeholder.jpg"}
              alt={machine.name}
              className="w-full h-[350px] object-cover rounded"
            />
          </div>

          {/* INFO */}
          <div className="bg-white p-6 rounded shadow space-y-3">

            <h1 className="text-2xl font-bold">
              {machine.name}
            </h1>

            <p className="text-gray-600">
              {machine.description}
            </p>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <p><b>Category:</b> {machine.category}</p>
              <p><b>Condition:</b> {machine.condition}</p>
              <p><b>Location:</b> {machine.location}</p>
              <p><b>Price:</b> {machine.price} ETB</p>

            </div>

          </div>

          {/* TECH SPECS */}
          <div className="bg-white p-6 rounded shadow">

            <h2 className="text-lg font-bold mb-4">
              Technical Specifications
            </h2>

            <div className="grid grid-cols-2 gap-4 text-sm">

              <p><b>Engine:</b> {machine.engine || "N/A"}</p>
              <p><b>Power:</b> {machine.power || "N/A"}</p>
              <p><b>Weight:</b> {machine.weight || "N/A"}</p>
              <p><b>Year:</b> {machine.year || "N/A"}</p>

            </div>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-4">

          {/* ACTIONS */}
          <div className="bg-white p-6 rounded shadow space-y-4">

            <h2 className="text-lg font-bold">
              Quick Actions
            </h2>

            <button
              onClick={createDeal}
              className="w-full bg-yellow-500 text-black py-3 rounded font-bold"
            >
              Request Quote
            </button>

            <button
              onClick={createDeal}
              className="w-full bg-black text-white py-3 rounded font-bold"
            >
              Rent Now
            </button>

            <button
              onClick={createDeal}
              className="w-full bg-gray-800 text-white py-3 rounded font-bold"
            >
              Book Maintenance
            </button>

          </div>

          {/* OWNER */}
          <div className="bg-white p-6 rounded shadow text-sm">

            <h3 className="font-bold mb-2">Owner Info</h3>

            <p>User ID: {machine.owner_id}</p>

          </div>

        </div>

      </div>

    </div>
  );
}