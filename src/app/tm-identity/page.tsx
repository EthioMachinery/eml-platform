"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Binary,
  Bot,
  Brain,
  Building2,
  CheckCircle2,
  CircuitBoard,
  Cpu,
  Database,
  Eye,
  FileKey2,
  Fingerprint,
  Globe2,
  IdCard,
  KeyRound,
  Layers3,
  Lock,
  Network,
  Orbit,
  Radar,
  Search,
  ServerCog,
  Shield,
  ShieldCheck,
  ShieldEllipsis,
  ShieldHalf,
  Sparkles,
  UserCog,
  Users,
  Wallet,
  Workflow,
  Zap,
} from "lucide-react";

type IdentityModule = {
  id: number;

  system: string;

  category: string;

  trust: number;

  status: string;

  scope: string;

  access: string;

  intelligence: string;
};

export default function TMIdentityPage() {
  const [systems, setSystems] =
    useState<IdentityModule[]>([]);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    loadSystems();
  }, []);

  function loadSystems() {
    const demo: IdentityModule[] =
      [
        {
          id: 1,

          system:
            "Industrial Identity Governance",

          category:
            "Enterprise Identity",

          trust: 99,

          status:
            "Operational",

          scope:
            "Global",

          access:
            "Role-Based Access",

          intelligence:
            "Managing sovereign industrial identities across governments, enterprises, contractors, and operators.",
        },

        {
          id: 2,

          system:
            "AI Agent Identity Network",

          category:
            "Machine Identity",

          trust: 98,

          status:
            "Live",

          scope:
            "Autonomous Systems",

          access:
            "AI Governance",

          intelligence:
            "Authenticating autonomous industrial AI agents and infrastructure orchestration systems.",
        },

        {
          id: 3,

          system:
            "Industrial Access Control Mesh",

          category:
            "Security Infrastructure",

          trust: 97,

          status:
            "Stable",

          scope:
            "Enterprise",

          access:
            "Multi-Layer Authorization",

          intelligence:
            "Providing secure access governance for procurement, ERP, telemetry, and infrastructure systems.",
        },

        {
          id: 4,

          system:
            "Sovereign Infrastructure Trust Layer",

          category:
            "Government Systems",

          trust: 99,

          status:
            "Secured",

          scope:
            "National Infrastructure",

          access:
            "Sovereign Trust Controls",

          intelligence:
            "Enabling sovereign governance, compliance, auditability, and industrial infrastructure trust.",
        },
      ];

    setSystems(demo);
  }

  const filtered =
    useMemo(() => {
      return systems.filter(
        (item) => {
          const keyword =
            `${item.system} ${item.category} ${item.scope}`
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

              <Fingerprint size={20} />

              TM IDENTITY

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Sovereign Industrial Identity Infrastructure

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Unified industrial identity and trust infrastructure governing enterprises,
              governments,
              AI agents,
              autonomous systems,
              cloud infrastructure,
              digital twins,
              industrial wallets,
              and operational intelligence ecosystems.

            </p>

            <div className="flex flex-wrap gap-5 mt-10">

              <Link
                href="/control-center"
                className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >

                Open Control Center

              </Link>

              <Link
                href="/developers"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >

                Developers Platform

              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KPI
            title="Verified Industrial Identities"
            value="2.4M"
            icon={BadgeCheck}
            color="emerald"
          />

          <KPI
            title="AI Identity Governance"
            value="ACTIVE"
            icon={Bot}
            color="green"
          />

          <KPI
            title="Security Infrastructure"
            value="99.99%"
            icon={ShieldCheck}
            color="cyan"
          />

          <KPI
            title="Sovereign Access Layer"
            value="GLOBAL"
            icon={Globe2}
            color="lime"
          />

        </div>

      </section>

      {/* CORE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="bg-gradient-to-r from-emerald-500/10 to-green-500/10 border border-emerald-500/20 rounded-[40px] p-10">

          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">

            <div className="max-w-4xl">

              <div className="flex items-center gap-3 text-emerald-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                INDUSTRIAL TRUST ARCHITECTURE

              </div>

              <h2 className="text-4xl font-black mb-6">

                The identity layer securing industrial intelligence ecosystems.

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                TM Identity governs access,
                authentication,
                machine identity,
                AI trust systems,
                sovereign industrial permissions,
                enterprise governance,
                operational authorization,
                and infrastructure-level security across the TM ecosystem.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniStat
                title="Identity Governance"
                value="LIVE"
              />

              <MiniStat
                title="AI Authentication"
                value="ACTIVE"
              />

              <MiniStat
                title="Enterprise Trust"
                value="VERIFIED"
              />

              <MiniStat
                title="Sovereign Security"
                value="SECURED"
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
              placeholder="Search identity systems..."
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

                  <ShieldCheck
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
                          item.system
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
                      icon={KeyRound}
                      label={`Access: ${item.access}`}
                    />

                    <Info
                      icon={Workflow}
                      label="Identity Infrastructure Active"
                    />

                  </div>

                  {/* INTELLIGENCE */}

                  <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-3xl p-5 mb-7">

                    <div className="flex items-center gap-3 text-emerald-400 font-black mb-3">

                      <Brain size={18} />

                      Trust Intelligence

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

                        Infrastructure Trust

                      </div>

                      <div className="font-black text-emerald-400">

                        {
                          item.trust
                        }
                        %

                      </div>

                    </div>

                    <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">

                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{
                          width:
                            `${item.trust}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* ACTIONS */}

                  <div className="flex gap-4">

                    <button className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-black font-black py-4 rounded-2xl transition">

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
              icon={Users}
              title="Enterprise Identity"
              text="Identity governance for governments, enterprises, contractors, and industrial operators."
            />

            <Service
              icon={Bot}
              title="Machine Identity"
              text="Authentication infrastructure for AI agents, IoT systems, and autonomous infrastructure."
            />

            <Service
              icon={Lock}
              title="Access Governance"
              text="Secure industrial permissions, authorization systems, and operational access control."
            />

            <Service
              icon={Shield}
              title="Sovereign Security"
              text="Infrastructure trust architecture for compliance, governance, and national-scale deployment."
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

                  INDUSTRIAL TRUST INFRASTRUCTURE

                </div>

                <h2 className="text-5xl font-black mb-6 leading-tight">

                  TM Identity secures the industrial intelligence ecosystem

                </h2>

                <p className="text-zinc-300 text-xl leading-9">

                  TM Identity establishes the sovereign trust layer enabling secure industrial operations,
                  AI governance,
                  enterprise identity,
                  machine authentication,
                  infrastructure authorization,
                  and ecosystem-scale operational security.

                </p>

              </div>

              <div className="flex flex-wrap gap-5">

                <Link
                  href="/control-center"
                  className="bg-emerald-500 hover:bg-emerald-400 text-black font-black px-8 py-5 rounded-2xl transition"
                >

                  Control Center

                </Link>

                <Link
                  href="/tm-cloud"
                  className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
                >

                  TM Cloud

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
    emerald:
      "bg-emerald-500/10 text-emerald-400",

    green:
      "bg-green-500/10 text-green-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

    lime:
      "bg-lime-500/10 text-lime-400",
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