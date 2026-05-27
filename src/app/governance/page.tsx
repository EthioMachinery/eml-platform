"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  Binary,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  ClipboardCheck,
  Database,
  FileSearch,
  Fingerprint,
  Globe2,
  Gavel,
  Landmark,
  Layers3,
  Network,
  Orbit,
  Radar,
  Scale,
  Search,
  Shield,
  ShieldCheck,
  Sparkles,
  UserCog,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

type GovernanceNode = {
  id: number;

  framework: string;

  category: string;

  status: string;

  scope: string;

  trust: number;

  compliance: string;

  intelligence: string;
};

export default function GovernancePage() {
  const [frameworks, setFrameworks] =
    useState<GovernanceNode[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadFrameworks();
  }, []);

  function loadFrameworks() {
    const demo: GovernanceNode[] =
      [
        {
          id: 1,

          framework:
            "AI Governance Orchestration",

          category:
            "Autonomous Systems",

          status:
            "Operational",

          scope:
            "AI Agents + Infrastructure",

          trust: 99,

          compliance:
            "AI Oversight",

          intelligence:
            "Managing autonomous AI governance, permissions, accountability, and industrial orchestration controls.",
        },

        {
          id: 2,

          framework:
            "Enterprise Compliance Grid",

          category:
            "Enterprise Governance",

          status:
            "Live",

          scope:
            "Global Enterprises",

          trust: 98,

          compliance:
            "Audit + Compliance",

          intelligence:
            "Providing procurement governance, operational compliance, and industrial audit infrastructure.",
        },

        {
          id: 3,

          framework:
            "Sovereign Infrastructure Policy Layer",

          category:
            "Government Governance",

          status:
            "Stable",

          scope:
            "National Infrastructure",

          trust: 99,

          compliance:
            "Policy Enforcement",

          intelligence:
            "Coordinating transport policies, infrastructure governance, and sovereign industrial controls.",
        },

        {
          id: 4,

          framework:
            "Industrial Data Sovereignty Network",

          category:
            "Data Governance",

          status:
            "Secured",

          scope:
            "Cross-Border Infrastructure",

          trust: 97,

          compliance:
            "Data Rights Governance",

          intelligence:
            "Managing industrial data permissions, sovereignty enforcement, and ecosystem-wide governance controls.",
        },
      ];

    setFrameworks(demo);
  }

  const filtered =
    useMemo(() => {
      return frameworks.filter(
        (item) => {
          const keyword =
            `${item.framework} ${item.category} ${item.scope}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [frameworks, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-red-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-24">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-red-500/10 border border-red-500/20 text-red-400 px-5 py-3 rounded-full font-black mb-8">

              <Scale size={20} />

              EML GOVERNANCE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Sovereign Industrial Governance Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Industrial governance infrastructure orchestrating AI oversight,
              sovereign policies,
              enterprise compliance,
              operational auditability,
              infrastructure governance,
              ecosystem trust,
              and industrial intelligence regulation at scale.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/eml-identity"
                className="bg-red-500 hover:bg-red-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Identity Governance

              </Link>

              <Link
                href="/control-center"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Control Center

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Governance Policies"
            value="24.8K"
            icon={ClipboardCheck}
            color="red"
          />

          <KPI
            title="AI Oversight"
            value="ACTIVE"
            icon={Bot}
            color="orange"
          />

          <KPI
            title="Compliance Systems"
            value="99.99%"
            icon={ShieldCheck}
            color="green"
          />

          <KPI
            title="Sovereign Governance"
            value="GLOBAL"
            icon={Globe2}
            color="amber"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-red-500/10 to-orange-500/10 border border-red-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-red-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                INDUSTRIAL GOVERNANCE ORCHESTRATION

              </div>

              <h2 className="text-4xl font-black mb-6">

                The trust and policy layer securing industrial civilization systems.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                EML Governance orchestrates ecosystem-wide industrial policies,
                AI governance,
                enterprise compliance,
                sovereign infrastructure controls,
                operational accountability,
                and intelligence system regulation.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="AI Oversight"
                value="LIVE"
              />

              <MiniStat
                title="Compliance Grid"
                value="ACTIVE"
              />

              <MiniStat
                title="Infrastructure Governance"
                value="SECURED"
              />

              <MiniStat
                title="Policy Systems"
                value="GLOBAL"
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
              placeholder="Search governance systems..."
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
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-red-500/30 transition"
              >

                {/* TOP */}

                <div className="h-56 bg-gradient-to-br from-red-500/10 to-orange-500/10 border-b border-zinc-800 flex items-center justify-center">

                  <Gavel
                    size={90}
                    className="text-red-400"
                  />

                </div>

                {/* BODY */}

                <div className="p-8">

                  <div className="flex items-start justify-between gap-4 mb-6">

                    <div>

                      <div className="text-2xl font-black">

                        {
                          item.framework
                        }

                      </div>

                      <div className="text-zinc-400 mt-2">

                        {
                          item.category
                        }

                      </div>

                    </div>

                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-full text-sm font-black">

                      {
                        item.trust
                      }
                      %

                    </div>

                  </div>

                  {/* META */}

                  <div className="space-y-4 mb-7">

                    <Info
                      icon={Globe2}
                      label={`Scope: ${item.scope}`}
                    />

                    <Info
                      icon={Activity}
                      label={`Status: ${item.status}`}
                    />

                    <Info
                      icon={BadgeCheck}
                      label={`Compliance: ${item.compliance}`}
                    />

                    <Info
                      icon={Workflow}
                      label="Governance Infrastructure Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-red-400 font-black mb-3">

                      <Brain size={18} />

                      Governance Intelligence

                    </div>

                    <p className="text-zinc-300 text-sm leading-7">

                      {
                        item.intelligence
                      }

                    </p>

                  </div>

                  {/* TRUST */}

                  <div className="mb-8">

                    <div className="flex items-center justify-between mb-3">

                      <div className="text-zinc-400">

                        Governance Confidence

                      </div>

                      <div className="font-black text-red-400">

                        {
                          item.trust
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{
                          width:
                            `${item.trust}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-red-500 hover:bg-red-400 text-black font-black py-4 rounded-2xl transition">

                      Open Governance

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

      {/* CAPABILITIES */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <Service
              icon={Bot}
              title="AI Governance"
              text="Govern autonomous AI systems, industrial agents, and machine decision orchestration."
            />

            <Service
              icon={Building2}
              title="Enterprise Compliance"
              text="Enable procurement compliance, operational controls, and audit infrastructure."
            />

            <Service
              icon={Landmark}
              title="Sovereign Governance"
              text="Coordinate national infrastructure policies and industrial ecosystem regulations."
            />

            <Service
              icon={Database}
              title="Data Sovereignty"
              text="Manage industrial data governance, permissions, rights, and compliance systems."
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

                <div className="text-red-400 font-black tracking-widest mb-4">

                  INDUSTRIAL GOVERNANCE INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  EML Governance secures industrial civilization systems

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  EML Governance transforms EML into a governable industrial intelligence civilization —
                  enabling sovereign trust,
                  AI accountability,
                  operational oversight,
                  ecosystem compliance,
                  and infrastructure-scale governance orchestration.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/eml-identity"
                  className="bg-red-500 hover:bg-red-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  EML Identity

                </Link>

                <Link
                  href="/data-exchange"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  Data Exchange

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
    red:
      "bg-red-500/10 text-red-400",

    orange:
      "bg-orange-500/10 text-orange-400",

    green:
      "bg-green-500/10 text-green-400",

    amber:
      "bg-amber-500/10 text-amber-400",
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
    <div className="bg-black/40 border border-red-500/10 rounded-3xl p-5">

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

      <Icon size={18} className="text-red-400" />

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

      <div className="w-16 h-16 rounded-3xl bg-red-500/10 flex items-center justify-center mb-6">

        <Icon className="text-red-400" size={30} />

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