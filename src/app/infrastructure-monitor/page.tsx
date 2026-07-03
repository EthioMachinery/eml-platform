"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  Building2,
  CheckCircle2,
  Cpu,
  Fuel,
  Gauge,
  Globe2,
  HardHat,
  LineChart,
  LocateFixed,
  MapPinned,
  Radar,
  Search,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  TimerReset,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";

type MonitorItem = {
  id: number;

  asset: string;

  category: string;

  location: string;

  status: string;

  uptime: number;

  fuel: string;

  aiInsight: string;

  utilization: string;
};

export default function InfrastructureMonitorPage() {
  const [systems, setSystems] =
    useState<MonitorItem[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadSystems();
  }, []);

  function loadSystems() {
    const demo: MonitorItem[] =
      [
        {
          id: 1,

          asset:
            "Addis Expressway Package 04",

          category:
            "Infrastructure Project",

          location:
            "Addis Ababa",

          status:
            "Operational",

          uptime: 98,

          fuel: "Normal",

          utilization:
            "94%",

          aiInsight:
            "Project activity remains stable with high contractor efficiency.",
        },

        {
          id: 2,

          asset:
            "Komatsu D85 Fleet",

          category:
            "Machinery Fleet",

          location:
            "Bahir Dar",

          status:
            "Monitoring",

          uptime: 92,

          fuel: "Moderate",

          utilization:
            "88%",

          aiInsight:
            "Fuel consumption increased 8% over expected operational baseline.",
        },

        {
          id: 3,

          asset:
            "PanAfrica Transport Logistics",

          category:
            "Transport Network",

          location:
            "Hawassa",

          status:
            "Optimized",

          uptime: 97,

          fuel: "Efficient",

          utilization:
            "96%",

          aiInsight:
            "AI routing optimization reduced idle transport time significantly.",
        },

        {
          id: 4,

          asset:
            "Hydraulic Excavator Group A",

          category:
            "Heavy Equipment",

          location:
            "Dire Dawa",

          status:
            "Alert",

          uptime: 81,

          fuel: "High",

          utilization:
            "73%",

          aiInsight:
            "Predictive maintenance recommended within next operational cycle.",
        },
      ];

    setSystems(demo);
  }

  const filtered =
    useMemo(() => {
      return systems.filter(
        (item) => {
          const keyword =
            `${item.asset} ${item.category} ${item.location}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [systems, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-emerald-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-5 py-3 rounded-full font-black mb-8">

              <Radar size={20} />

              TM INFRASTRUCTURE MONITOR

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Real-Time Infrastructure Intelligence

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Monitor infrastructure projects,
              heavy machinery,
              fleet logistics,
              fuel analytics,
              operational uptime,
              predictive maintenance,
              contractor activity,
              and industrial performance in real time.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/fleet"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Fleet Intelligence

              </Link>

              <Link
                href="/maintenance"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Maintenance AI

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Live Assets"
            value="12,480"
            icon={Gauge}
            color="green"
          />

          <KPI
            title="Operational Uptime"
            value="97%"
            icon={Activity}
            color="emerald"
          />

          <KPI
            title="Predictive AI"
            value="ACTIVE"
            icon={Brain}
            color="cyan"
          />

          <KPI
            title="Infrastructure Alerts"
            value="24 LIVE"
            icon={ShieldAlert}
            color="yellow"
          />

        </div>

      </section>

      {/* AI MONITOR */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-emerald-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                AUTONOMOUS MONITORING AI

              </div>

              <h2 className="text-4xl font-black mb-6">

                AI continuously monitors industrial operations across the ecosystem.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                Infrastructure AI analyzes fleet movement,
                fuel efficiency,
                machine uptime,
                operational anomalies,
                maintenance cycles,
                contractor performance,
                and infrastructure utilization patterns in real time.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Live Monitoring"
                value="24/7"
              />

              <MiniStat
                title="Machine Telemetry"
                value="CONNECTED"
              />

              <MiniStat
                title="AI Prediction"
                value="ACTIVE"
              />

              <MiniStat
                title="Infrastructure Risk"
                value="LOW"
              />

            </div>

          </div>

        </div>

      </section>

      {/* SEARCH */}

      <section className="max-w-7xl mx-auto px-4 pb-10">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[35px] p-6">

          <div className="relative">

            <Search className="absolute left-4 top-4 text-zinc-500" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search infrastructure systems..."
              className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
            />

          </div>

        </div>

      </section>

      {/* GRID */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (item) => (
              <div
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-emerald-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-emerald-500/10 to-green-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Radar
                    size={90}
                    className="text-emerald-400"
                  />

                </div>

                {/* BODY */}

                <div className="p-8">

                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div>

                      <div className="text-2xl font-black">

                        {
                          item.asset
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          item.category
                        }

                      </div>

                    </div>

                    <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.uptime
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={MapPinned}
                      label={`Location: ${item.location}`}
                    />

                    <Info
                      icon={Fuel}
                      label={`Fuel Status: ${item.fuel}`}
                    />

                    <Info
                      icon={Activity}
                      label={`Utilization: ${item.utilization}`}
                    />

                    <Info
                      icon={ShieldCheck}
                      label={`Status: ${item.status}`}
                    />

                  </div>

                  {/* AI */}

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-emerald-400 font-black mb-3">

                      <Brain size={18} />

                      Monitoring AI Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.aiInsight
                      }

                    </p>

                  </div>

                  {/* UPTIME */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Operational Health

                      </div>

                      <div className="font-black text-emerald-400">

                        {
                          item.uptime
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width:
                            `${item.uptime}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition">

                      View Telemetry

                    </button>

                    <button className="w-16 h-16 rounded-2xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition">

                      <LineChart />

                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>

      </section>

      {/* CAPABILITIES */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <Service
              icon={Truck}
              title="Fleet Telemetry"
              text="Monitor heavy transport systems and logistics operations in real time."
            />

            <Service
              icon={Wrench}
              title="Predictive Maintenance"
              text="AI predicts operational failures before downtime occurs."
            />

            <Service
              icon={Fuel}
              title="Fuel Intelligence"
              text="Track fuel usage anomalies and optimize operational efficiency."
            />

            <Service
              icon={Building2}
              title="Infrastructure Monitoring"
              text="Observe live project execution and industrial infrastructure activity."
            />

          </div>

        </div>

      </section>

      {/* FOOTER */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-12">

            <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

              <div className="max-w-4xl">

                <div className="text-emerald-400 font-black tracking-widest mb-4">

                  LIVE INDUSTRIAL INTELLIGENCE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Real-time operational visibility for industrial ecosystems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM Infrastructure Monitor provides live operational intelligence for fleets,
                  machinery,
                  infrastructure projects,
                  logistics systems,
                  and enterprise operations using AI-powered telemetry analytics.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/ai-command"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  AI Command Center

                </Link>

                <Link
                  href="/fleet"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Fleet Intelligence

                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function KPI({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  const colors: any = {
    green:
      "bg-green-500/10 text-green-400",

    emerald:
      "bg-emerald-500/10 text-emerald-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

    yellow:
      "bg-yellow-500/10 text-yellow-400",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">

      <div className="flex items-center justify-between mb-7">

        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colors[color]}`}
        >

          <Icon size={30} />

        </div>

        <Zap className="text-zinc-700" />

      </div>

      <div className="text-zinc-400 text-sm mb-3">

        {title}

      </div>

      <div className="text-4xl font-black">

        {value}

      </div>

    </div>
  );
}

function MiniStat({
  title,
  value,
}: any) {
  return (
    <div className="bg-black/40 border border-emerald-500/10 rounded-3xl p-5">

      <div className="text-zinc-400 text-sm mb-2">

        {title}

      </div>

      <div className="font-black text-xl">

        {value}

      </div>

    </div>
  );
}

function Info({
  icon: Icon,
  label,
}: any) {
  return (
    <div className="flex items-center gap-3 text-zinc-300">

      <Icon size={18} className="text-emerald-400" />

      <span>{label}</span>

    </div>
  );
}

function Service({
  icon: Icon,
  title,
  text,
}: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[35px] p-8">

      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 flex items-center justify-center mb-6">

        <Icon className="text-emerald-400" size={30} />

      </div>

      <h3 className="text-2xl font-black mb-4">

        {title}

      </h3>

      <p className="text-zinc-400 leading-8">

        {text}

      </p>

    </div>
  );
}