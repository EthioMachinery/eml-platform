"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Brain,
  BriefcaseBusiness,
  Building2,
  CalendarClock,
  CheckCircle2,
  CircleDollarSign,
  ClipboardList,
  FileSpreadsheet,
  HardHat,
  LineChart,
  MapPinned,
  ShieldCheck,
  Sparkles,
  Tractor,
  TrendingUp,
  Truck,
  Users,
  Wrench,
} from "lucide-react";

type ContractorProject = {
  id: number;

  company: string;

  projectTitle: string;

  region: string;

  budget: string;

  duration: string;

  machineryNeeded: string[];

  operatorsNeeded: number;

  status: string;

  aiScore: number;

  projectType: string;

  description: string;
};

export default function ContractorsPage() {
  const [search, setSearch] =
    useState("");

  const [projects, setProjects] =
    useState<
      ContractorProject[]
    >([]);

  useEffect(() => {
    loadProjects();
  }, []);

  function loadProjects() {
    const demoProjects: ContractorProject[] =
      [
        {
          id: 1,

          company:
            "Abay Construction PLC",

          projectTitle:
            "Highway Expansion Project",

          region:
            "Addis Ababa",

          budget:
            "18,000,000 ETB",

          duration:
            "14 Months",

          machineryNeeded:
            [
              "Excavator",
              "Bulldozer",
              "Dump Truck",
            ],

          operatorsNeeded: 18,

          status: "Open",

          aiScore: 96,

          projectType:
            "Road Construction",

          description:
            "Large-scale road expansion and infrastructure development project.",
        },

        {
          id: 2,

          company:
            "Blue Nile Engineering",

          projectTitle:
            "Industrial Park Development",

          region:
            "Bahir Dar",

          budget:
            "26,000,000 ETB",

          duration:
            "22 Months",

          machineryNeeded:
            [
              "Crane",
              "Loader",
              "Excavator",
            ],

          operatorsNeeded: 26,

          status:
            "Procurement",

          aiScore: 92,

          projectType:
            "Industrial Development",

          description:
            "Industrial zone infrastructure and heavy construction development.",
        },

        {
          id: 3,

          company:
            "Hawassa Mega Build",

          projectTitle:
            "Airport Logistics Expansion",

          region:
            "Hawassa",

          budget:
            "11,500,000 ETB",

          duration:
            "10 Months",

          machineryNeeded:
            [
              "Forklift",
              "Truck",
              "Crane",
            ],

          operatorsNeeded: 12,

          status: "Hiring",

          aiScore: 89,

          projectType:
            "Logistics Infrastructure",

          description:
            "Airport cargo and logistics infrastructure modernization.",
        },
      ];

    setProjects(
      demoProjects
    );
  }

  const filtered =
    useMemo(() => {
      return projects.filter(
        (project) => {
          const keyword =
            `${project.company} ${project.projectTitle} ${project.region} ${project.projectType}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [projects, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-orange-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-yellow-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-orange-500/10 border border-orange-500/20 text-orange-400 px-5 py-3 rounded-full font-black mb-8">

              <Building2 size={20} />

              TM CONTRACTOR MARKETPLACE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Industrial Project Ecosystem

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Connect contractors,
              machinery owners,
              operators,
              transport providers,
              financiers,
              and suppliers into one intelligent AI-driven ecosystem.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/sell"
                className="bg-orange-500 hover:bg-orange-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Publish Project

              </Link>

              <Link
                href="/fleet"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Fleet Marketplace

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Active Projects"
            value="4,820"
            icon={
              ClipboardList
            }
            color="orange"
          />

          <KPI
            title="Project Value"
            value="2.4B ETB"
            icon={
              CircleDollarSign
            }
            color="green"
          />

          <KPI
            title="AI Optimization"
            value="ACTIVE"
            icon={Brain}
            color="violet"
          />

          <KPI
            title="Verified Contractors"
            value="3,100+"
            icon={
              BadgeCheck
            }
            color="cyan"
          />

        </div>

      </section>

      {/* AI SECTION */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-orange-500/10 to-yellow-500/10 border border-orange-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-orange-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                AI CONTRACTOR ENGINE

              </div>

              <h2 className="text-4xl font-black mb-6">

                TM AI predicts project demand,
                machinery needs,
                workforce requirements,
                and procurement optimization.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                AI continuously analyzes construction activity,
                transport demand,
                machinery utilization,
                regional growth,
                and contractor productivity.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Project Accuracy"
                value="92%"
              />

              <MiniStat
                title="Budget Optimization"
                value="+38%"
              />

              <MiniStat
                title="Machinery Efficiency"
                value="+51%"
              />

              <MiniStat
                title="Hiring Speed"
                value="-63%"
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
            placeholder="Search contractors, projects, regions..."
            className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-5 outline-none"
          />

        </div>

      </section>

      {/* PROJECTS */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

          {filtered.map(
            (project) => (
              <div
                key={project.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-orange-500/30 transition"
              >

                {/* HEADER */}

                <div className="p-8 border-b border-zinc-800">

                  <div className="flex items-start justify-between gap-5">

                    <div>

                      <div className="text-2xl font-black">

                        {
                          project.projectTitle
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          project.company
                        }

                      </div>

                    </div>

                    <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-black">

                      AI:
                      {" "}
                      {
                        project.aiScore
                      }
                      %

                    </div>

                  </div>

                </div>

                {/* BODY */}

                <div className="p-8">

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={
                        MapPinned
                      }
                      label={
                        project.region
                      }
                    />

                    <Info
                      icon={
                        BriefcaseBusiness
                      }
                      label={
                        project.projectType
                      }
                    />

                    <Info
                      icon={
                        Banknote
                      }
                      label={
                        project.budget
                      }
                    />

                    <Info
                      icon={
                        CalendarClock
                      }
                      label={
                        project.duration
                      }
                    />

                    <Info
                      icon={Users}
                      label={`${project.operatorsNeeded} Operators Needed`}
                    />

                  </div>

                  {/* MACHINERY */}

                  <div className="mb-7">

                    <div className="flex items-center gap-3 text-zinc-400 mb-4">

                      <Tractor
                        size={18}
                      />

                      Machinery Needed

                    </div>

                    <div className="flex flex-wrap gap-3">

                      {project.machineryNeeded.map(
                        (
                          machine
                        ) => (
                          <div
                            key={
                              machine
                            }
                            className="bg-zinc-800 px-4 py-2 rounded-full text-sm"
                          >

                            {
                              machine
                            }

                          </div>
                        )
                      )}

                    </div>

                  </div>

                  {/* AI */}

                  <div className="bg-orange-500/10 border border-orange-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-orange-400 font-black mb-3">

                      <Brain size={18} />

                      AI Insight

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      High machinery and operator demand predicted.
                      Strong transport and procurement opportunities available.

                    </p>

                  </div>

                  {/* STATUS */}

                  <div className="flex items-center justify-between mb-8">

                    <div className="text-zinc-400">

                      Project Status

                    </div>

                    <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        project.status
                      }

                    </div>

                  </div>

                  {/* DESCRIPTION */}

                  <div className="mb-8 text-zinc-400 leading-8">

                    {
                      project.description
                    }

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-orange-500 hover:bg-orange-400 text-black font-black py-4 rounded-2xl transition">

                      Submit Proposal

                    </button>

                    <button className="w-16 h-16 rounded-2xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition">

                      <ArrowRight />

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
              icon={Truck}
              title="Transport Integration"
              text="Integrated heavy logistics and transport management."
            />

            <Service
              icon={ShieldCheck}
              title="Project Insurance"
              text="Enterprise project protection and machinery insurance."
            />

            <Service
              icon={
                FileSpreadsheet
              }
              title="Procurement AI"
              text="AI-driven procurement and supplier optimization."
            />

            <Service
              icon={LineChart}
              title="Project Analytics"
              text="Realtime project intelligence and forecasting."
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

                <div className="text-orange-400 font-black tracking-widest mb-4">

                  INDUSTRIAL ECOSYSTEM

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  Build Africa’s largest machinery and contractor intelligence network

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM connects projects,
                  contractors,
                  machinery fleets,
                  operators,
                  transport companies,
                  suppliers,
                  financiers,
                  and insurers into one ecosystem.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/operators"
                  className="bg-orange-500 hover:bg-orange-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Operator Marketplace

                </Link>

                <Link
                  href="/fleet"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Fleet Marketplace

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
    orange:
      "bg-orange-500/10 text-orange-400",

    green:
      "bg-green-500/10 text-green-400",

    violet:
      "bg-violet-500/10 text-violet-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",
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
    <div className="bg-black/40 border border-orange-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-orange-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-orange-500/10 flex items-center justify-center mb-6">

        <Icon className="text-orange-400" size={30} />

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