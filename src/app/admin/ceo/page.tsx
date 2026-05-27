"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { EMLCore, Deal } from "@/core/emlCore";
import LiveEventStream from "@/components/admin/LiveEventStream";

type RiskLevel = "SAFE" | "RISKY" | "DANGEROUS";

export default function CEOPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);

  const [market, setMarket] = useState<any>(null);
  const [topDeals, setTopDeals] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [riskReport, setRiskReport] = useState<any>(null);

  useEffect(() => {
    loadDeals();

    const channel = supabase
      .channel("ceo-live-deals")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "deals",
        },
        (payload) => {
          if (payload.new) {
            handleRealtimeUpdate(payload.new as Deal);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function loadDeals() {
    setLoading(true);

    const { data, error } = await supabase
      .from("deals")
      .select("*");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    const dealData = (data || []) as Deal[];

    setDeals(dealData);
    runAnalytics(dealData);

    setLoading(false);
  }

  function runAnalytics(list: Deal[]) {
    const marketPulse =
      EMLCore.ceo.marketPulse(list);

    const top =
      EMLCore.ceo.topDeals(list, 5);

    const opp =
      EMLCore.ceo.opportunities(list);

    const risk =
      EMLCore.ai.analyzeDeals(list);

    setMarket(marketPulse);
    setTopDeals(top);
    setOpportunities(opp);
    setRiskReport(risk);
  }

  function handleRealtimeUpdate(
    newDeal: Deal
  ) {
    setDeals((prev) => {
      const exists = prev.find(
        (item) => item.id === newDeal.id
      );

      const updated = exists
        ? prev.map((item) =>
            item.id === newDeal.id
              ? newDeal
              : item
          )
        : [newDeal, ...prev];

      runAnalytics(updated);

      return updated;
    });
  }

  function riskColor(
    risk: RiskLevel
  ) {
    if (risk === "SAFE")
      return "text-green-400";

    if (risk === "RISKY")
      return "text-yellow-400";

    return "text-red-500";
  }

  return (
    <main className="min-h-screen bg-black text-white p-6">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-cyan-400">
            CEO Command Center
          </h1>

          <p className="text-zinc-400">
            Live AI Intelligence &
            Deal Monitoring System
          </p>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* LIVE EVENTS */}
          <div className="md:col-span-2 bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-green-400">
              Live Event Stream
            </h2>

            <LiveEventStream />
          </div>

          {/* MARKET */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-blue-400">
              Market Pulse
            </h2>

            {market && (
              <div className="space-y-2 text-sm">
                <p>
                  Total Deals:{" "}
                  {market.totalDeals || 0}
                </p>

                <p>
                  Avg Price:{" "}
                  {Math.round(
                    market.avgPrice || 0
                  )}
                </p>
              </div>
            )}
          </div>

          {/* TOP DEALS */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-yellow-400">
              Top Deals
            </h2>

            <div className="space-y-2 text-sm">
              {topDeals.length === 0 && (
                <p className="text-zinc-500">
                  No deals yet
                </p>
              )}

              {topDeals.map((d) => (
                <div
                  key={d.id}
                  className="border-b border-zinc-800 pb-2"
                >
                  <p className="font-bold">
                    {d.title ||
                      "Untitled"}
                  </p>

                  <p className="text-zinc-400">
                    Score: {d.score}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* OPPORTUNITIES */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-purple-400">
              Opportunities
            </h2>

            <div className="space-y-2 text-sm">
              {opportunities.length === 0 && (
                <p className="text-zinc-500">
                  No opportunities yet
                </p>
              )}

              {opportunities.map((o) => (
                <div
                  key={o.id}
                  className="border-b border-zinc-800 pb-2"
                >
                  <p className="font-bold">
                    {o.title}
                  </p>

                  <p className="text-zinc-500">
                    {o.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RISK */}
          <div className="bg-zinc-900 p-4 rounded-xl border border-zinc-800">
            <h2 className="text-xl font-bold mb-4 text-red-400">
              Risk Report
            </h2>

            {riskReport && (
              <div className="space-y-2 text-sm">
                <p>
                  Total:{" "}
                  {riskReport.total || 0}
                </p>

                <p className={riskColor("RISKY")}>
                  Risky:{" "}
                  {riskReport.risky || 0}
                </p>

                <p className={riskColor("SAFE")}>
                  Safe:{" "}
                  {riskReport.safe || 0}
                </p>
              </div>
            )}
          </div>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="mt-6 text-zinc-400">
            Loading CEO
            Intelligence System...
          </div>
        )}

      </div>
    </main>
  );
}