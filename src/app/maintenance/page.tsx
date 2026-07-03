"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  BarChart3,
  Brain,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Cog,
  Cpu,
  Gauge,
  HardHat,
  LineChart,
  PackageCheck,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Wrench,
} from "lucide-react";

type Machine = {
  id: number;

  machine: string;

  type: string;

  location: string;

  health: number;

  aiRisk: string;

  nextService: string;

  runtimeHours: number;

  predictedFailure: string;

  maintenanceCost: string;

  status: string;
};

export default function MaintenancePage() {
  const [machines, setMachines] =
    useState<Machine[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadMachines();
  }, []);

  function loadMachines() {
    const demoMachines: Machine[] =
      [
        {
          id: 1,

          machine:
            "CAT 320 Excavator",

          type:
            "Excavator",

          location:
            "Addis Ababa",

          health: 92,

          aiRisk:
            "Low",

          nextService:
            "3 Days",

          runtimeHours: 5120,

          predictedFailure:
            "Hydraulic Filter Wear",

          maintenanceCost:
            "18,500 ETB",

          status:
            "Operational",
        },

        {
          id: 2,

          machine:
            "Komatsu D85",

          type:
            "Bulldozer",

          location:
            "Bahir Dar",

          health: 71,

          aiRisk:
            "Medium",

          nextService:
            "1 Day",

          runtimeHours: 8120,

          predictedFailure:
            "Track System Stress",

          maintenanceCost:
            "94,000 ETB",

          status:
            "Needs Attention",
        },

        {
          id: 3,

          machine:
            "Shantui SD16",

          type:
            "Bulldozer",

          location:
            "Hawassa",

          health: 54,

          aiRisk:
            "High",

          nextService:
            "Immediate",

          runtimeHours: 11210,

          predictedFailure:
            "Engine Overheating Risk",

          maintenanceCost:
            "145,000 ETB",

          status:
            "Critical",
        },
      ];

    setMachines(
      demoMachines
    );
  }

  const filtered =
    useMemo(() => {
      return machines.filter(
        (machine) => {
          const keyword =
            `${machine.machine} ${machine.type} ${machine.location}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [machines, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-cyan-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">

              <Brain size={20} />

              TM AI MAINTENANCE ENGINE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Predictive Industrial Maintenance Intelligence

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Monitor fleet health,
              predict failures,
              optimize maintenance schedules,
              reduce downtime,
              forecast spare parts demand,
              and automate industrial servicing using AI.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/fleet"
                className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Fleet Management

              </Link>

              <Link
                href="/spare-parts"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Spare Parts

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Machines Monitored"
            value="48,200+"
            icon={Cpu}
            color="cyan"
          />

          <KPI
            title="Predicted Failures"
            value="12,840"
            icon={AlertTriangle}
            color="yellow"
          />

          <KPI
            title="Downtime Reduction"
            value="-41%"
            icon={TrendingUp}
            color="green"
          />

          <KPI
            title="AI Accuracy"
            value="96%"
            icon={Brain}
            color="violet"
          />

        </div>

      </section>

      {/* AI */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-cyan-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                AI MAINTENANCE PREDICTION

              </div>

              <h2 className="text-4xl font-black mb-6">

                TM AI predicts machine failures before they happen.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI analyzes machine runtime,
                operator behavior,
                servicing history,
                fleet usage,
                and spare parts wear to forecast breakdown risks and optimize maintenance.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Failure Detection"
                value="96%"
              />

              <MiniStat
                title="Downtime Reduction"
                value="-41%"
              />

              <MiniStat
                title="Cost Optimization"
                value="+38%"
              />

              <MiniStat
                title="Fleet Health AI"
                value="ACTIVE"
              />

            </div>

          </div>

        </div>

      </section>

      {/* SEARCH */}

      <section className="max-w-7xl mx-auto px-4 pb-10">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[35px] p-6">

          <input
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
            placeholder="Search machines, fleets, maintenance status..."
            className="w-full bg-black border border-zinc-800 rounded-2xl py-4 px-5 outline-none"
          />

        </div>

      </section>

      {/* MACHINES */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (machine) => (
              <div
                key={machine.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-cyan-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Truck
                    size={90}
                    className="text-cyan-400"
                  />

                </div>

                {/* BODY */}

                <div className="p-8">

                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div>

                      <div className="text-2xl font-black">

                        {
                          machine.machine
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          machine.type
                        }

                      </div>

                    </div>

                    <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm font-black">

                      Health:
                      {" "}
                      {
                        machine.health
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={Gauge}
                      label={`${machine.runtimeHours.toLocaleString()} Runtime Hours`}
                    />

                    <Info
                      icon={
                        CalendarClock
                      }
                      label={`Next Service: ${machine.nextService}`}
                    />

                    <Info
                      icon={
                        Activity
                      }
                      label={`Risk Level: ${machine.aiRisk}`}
                    />

                    <Info
                      icon={Clock3}
                      label={
                        machine.status
                      }
                    />

                  </div>

                  {/* FAILURE */}

                  <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-red-400 font-black mb-3">

                      <AlertTriangle size={18} />

                      Predicted Failure

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        machine.predictedFailure
                      }

                    </p>

                  </div>

                  {/* COST */}

                  <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-5 mb-7">

                    <div className="flex items-center justify-between">

                      <div className="text-zinc-400">

                        Estimated Maintenance Cost

                      </div>

                      <div className="text-cyan-400 font-black text-xl">

                        {
                          machine.maintenanceCost
                        }

                      </div>

                    </div>

                  </div>

                  {/* AI */}

                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-cyan-400 font-black mb-3">

                      <Brain size={18} />

                      AI Recommendation

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      Schedule preventive servicing and order predicted replacement parts before operational downtime occurs.

                    </p>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition">

                      Schedule Maintenance

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

      {/* SERVICES */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <Service
              icon={Wrench}
              title="Predictive Maintenance"
              text="AI predicts servicing needs before failures happen."
            />

            <Service
              icon={PackageCheck}
              title="Parts Forecasting"
              text="Forecast future spare parts demand automatically."
            />

            <Service
              icon={ShieldCheck}
              title="Fleet Protection"
              text="Reduce breakdowns and protect industrial operations."
            />

            <Service
              icon={BarChart3}
              title="Maintenance Analytics"
              text="Track operational efficiency and maintenance performance."
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

                <div className="text-cyan-400 font-black tracking-widest mb-4">

                  INDUSTRIAL INTELLIGENCE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build Africa’s smartest industrial maintenance ecosystem

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM transforms fleet operations using predictive AI,
                  maintenance intelligence,
                  spare parts forecasting,
                  and autonomous industrial optimization.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/fleet"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Fleet Management

                </Link>

                <Link
                  href="/suppliers"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Supplier Network

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
    cyan:
      "bg-cyan-500/10 text-cyan-400",

    yellow:
      "bg-yellow-500/10 text-yellow-400",

    green:
      "bg-green-500/10 text-green-400",

    violet:
      "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">

      <div className="flex items-center justify-between mb-7">

        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colors[color]}`}
        >

          <Icon size={30} />

        </div>

        <TrendingUp className="text-zinc-700" />

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
    <div className="bg-black/40 border border-cyan-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-cyan-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center mb-6">

        <Icon className="text-cyan-400" size={30} />

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