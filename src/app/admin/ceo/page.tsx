"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AICEO } from "@/lib/aiCEO";

export default function CEOPage() {
  const [deals, setDeals] = useState<any[]>([]);
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [revenueInsight, setRevenueInsight] = useState("");
  const [conversionInsight, setConversionInsight] = useState("");
  const [riskInsight, setRiskInsight] = useState("");
  const [growthInsight, setGrowthInsight] = useState("");

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const { data: dealsData } = await supabase.from("deals").select("*");
    const { data: machinesData } = await supabase.from("machines").select("*");

    const d = dealsData || [];
    const m = machinesData || [];

    setDeals(d);
    setMachines(m);

    // AI CEO Analysis
    setRevenueInsight(AICEO.analyzeRevenue(d));
    setConversionInsight(AICEO.analyzeConversion(d));
    setRiskInsight(AICEO.analyzeRisk(d));
    setGrowthInsight(AICEO.growthStrategy(m, d));

    setLoading(false);
  };

  if (loading) {
    return <div className="p-6">AI analyzing...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      <div className="max-w-6xl mx-auto space-y-6">

        <h1 className="text-2xl font-bold">
          AI CEO Command Center
        </h1>

        {/* INSIGHTS */}
        <div className="grid md:grid-cols-2 gap-6">

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Revenue Insight</h2>
            <p>{revenueInsight}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Conversion Insight</h2>
            <p>{conversionInsight}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Risk Analysis</h2>
            <p>{riskInsight}</p>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="font-bold mb-2">Growth Strategy</h2>
            <p>{growthInsight}</p>
          </div>

        </div>

      </div>

    </div>
  );
}