"use client";

import { useEffect, useState } from "react";

import {
  Activity,
  BadgeDollarSign,
  Brain,
  Building2,
  CheckCircle2,
  Globe2,
  ShieldAlert,
  Sparkles,
  Truck,
  Users,
  Wallet,
  Wrench,
  ArrowUpRight,
  TrendingUp,
  CircleDollarSign,
  BriefcaseBusiness,
  BarChart3,
  ShieldCheck,
  Bot,
  Radio,
} from "lucide-react";

import Link from "next/link";

import { supabase } from "@/lib/supabaseClient";

export default function AdminAnalyticsPage() {
  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      totalRevenue: 0,

      activeDeals: 0,

      machineryListings: 0,

      smartMatches: 0,

      transportRequests: 0,

      insuranceRequests: 0,

      financingRequests: 0,

      activeUsers: 0,

      premiumUsers: 0,

      contracts: 0,

      inquiries: 0,

      notifications: 0,
    });

  useEffect(() => {
    loadAnalytics();
  }, []);

  async function loadAnalytics() {
    setLoading(true);

    try {
      const [
        walletTx,
        deals,
        machinery,
        matches,
        transport,
        insurance,
        financing,
        profiles,
        premium,
        contracts,
        inquiries,
        notifications,
      ] = await Promise.all([
        supabase
          .from(
            "wallet_transactions"
          )
          .select("*"),

        supabase
          .from("deals")
          .select("*"),

        supabase
          .from("machinery")
          .select("*"),

        supabase
          .from(
            "smart_matches"
          )
          .select("*"),

        supabase
          .from(
            "transport_requests"
          )
          .select("*"),

        supabase
          .from(
            "insurance_requests"
          )
          .select("*"),

        supabase
          .from(
            "financing_requests"
          )
          .select("*"),

        supabase
          .from("profiles")
          .select("*"),

        supabase
          .from(
            "premium_subscriptions"
          )
          .select("*"),

        supabase
          .from("contracts")
          .select("*"),

        supabase
          .from("inquiries")
          .select("*"),

        supabase
          .from(
            "notifications"
          )
          .select("*"),
      ]);

      const revenue =
        (
          walletTx.data || []
        ).reduce(
          (
            acc: number,
            tx: any
          ) =>
            acc +
            Number(
              tx.amount || 0
            ),
          0
        );

      setStats({
        totalRevenue:
          revenue,

        activeDeals:
          deals.data
            ?.length || 0,

        machineryListings:
          machinery.data
            ?.length || 0,

        smartMatches:
          matches.data
            ?.length || 0,

        transportRequests:
          transport.data
            ?.length || 0,

        insuranceRequests:
          insurance.data
            ?.length || 0,

        financingRequests:
          financing.data
            ?.length || 0,

        activeUsers:
          profiles.data
            ?.length || 0,

        premiumUsers:
          premium.data
            ?.length || 0,

        contracts:
          contracts.data
            ?.length || 0,

        inquiries:
          inquiries.data
            ?.length || 0,

        notifications:
          notifications.data
            ?.length || 0,
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-cyan-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">

              <Bot size={20} />

              TM ENTERPRISE INTELLIGENCE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Analytics Command Center

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Realtime marketplace intelligence,
              AI performance analytics,
              revenue monitoring,
              logistics activity,
              and enterprise operational KPIs.

            </p>

          </div>

        </div>

      </section>

      {/* LIVE STATUS */}

      <section className="max-w-7xl mx-auto px-4 pt-10">

        <div className="bg-green-500/10 border border-green-500/20 rounded-3xl px-6 py-5 flex items-center justify-between">

          <div className="flex items-center gap-3 text-green-400 font-black">

            <Radio size={20} />

            SYSTEM STATUS:
            OPERATIONAL

          </div>

          <div className="text-zinc-400 text-sm">

            Realtime AI marketplace intelligence active

          </div>

        </div>

      </section>

      {/* KPI GRID */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <AnalyticsCard
            title="Total Revenue"
            value={`${stats.totalRevenue.toLocaleString()} ETB`}
            icon={
              BadgeDollarSign
            }
            color="green"
          />

          <AnalyticsCard
            title="Active Deals"
            value={
              stats.activeDeals
            }
            icon={
              BriefcaseBusiness
            }
            color="yellow"
          />

          <AnalyticsCard
            title="Machinery Listings"
            value={
              stats.machineryListings
            }
            icon={Wrench}
            color="cyan"
          />

          <AnalyticsCard
            title="Smart Matches"
            value={
              stats.smartMatches
            }
            icon={Brain}
            color="violet"
          />

          <AnalyticsCard
            title="Transport Requests"
            value={
              stats.transportRequests
            }
            icon={Truck}
            color="orange"
          />

          <AnalyticsCard
            title="Insurance Requests"
            value={
              stats.insuranceRequests
            }
            icon={
              ShieldCheck
            }
            color="blue"
          />

          <AnalyticsCard
            title="Financing Requests"
            value={
              stats.financingRequests
            }
            icon={Wallet}
            color="green"
          />

          <AnalyticsCard
            title="Platform Users"
            value={
              stats.activeUsers
            }
            icon={Users}
            color="cyan"
          />

          <AnalyticsCard
            title="Premium Members"
            value={
              stats.premiumUsers
            }
            icon={Sparkles}
            color="yellow"
          />

          <AnalyticsCard
            title="Contracts"
            value={
              stats.contracts
            }
            icon={
              CheckCircle2
            }
            color="green"
          />

          <AnalyticsCard
            title="Inquiries"
            value={
              stats.inquiries
            }
            icon={Activity}
            color="orange"
          />

          <AnalyticsCard
            title="Notifications"
            value={
              stats.notifications
            }
            icon={Globe2}
            color="violet"
          />

        </div>

      </section>

      {/* AI INTELLIGENCE */}

      <section className="max-w-7xl mx-auto px-4 pb-12">

        <div className="grid lg:grid-cols-2 gap-8">

          {/* LEFT */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10">

            <div className="flex items-center justify-between mb-10">

              <div>

                <div className="text-cyan-400 font-black tracking-widest mb-3">

                  AI INTELLIGENCE

                </div>

                <h2 className="text-3xl font-black">

                  Marketplace Performance

                </h2>

              </div>

              <div className="w-20 h-20 rounded-3xl bg-cyan-500/10 flex items-center justify-center">

                <Brain className="text-cyan-400" size={40} />

              </div>

            </div>

            <div className="space-y-6">

              <MetricBar
                label="AI Match Accuracy"
                value={92}
                color="bg-cyan-500"
              />

              <MetricBar
                label="Deal Conversion"
                value={78}
                color="bg-green-500"
              />

              <MetricBar
                label="Transport Efficiency"
                value={84}
                color="bg-orange-500"
              />

              <MetricBar
                label="Marketplace Health"
                value={96}
                color="bg-violet-500"
              />

              <MetricBar
                label="Premium Growth"
                value={67}
                color="bg-yellow-500"
              />

            </div>

          </div>

          {/* RIGHT */}

          <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10">

            <div className="flex items-center justify-between mb-10">

              <div>

                <div className="text-green-400 font-black tracking-widest mb-3">

                  BUSINESS GROWTH

                </div>

                <h2 className="text-3xl font-black">

                  Enterprise Expansion

                </h2>

              </div>

              <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center">

                <TrendingUp className="text-green-400" size={40} />

              </div>

            </div>

            <div className="grid grid-cols-2 gap-5">

              <InsightCard
                title="Marketplace Growth"
                value="+42%"
                icon={
                  ArrowUpRight
                }
              />

              <InsightCard
                title="Monthly Revenue"
                value="+68%"
                icon={
                  CircleDollarSign
                }
              />

              <InsightCard
                title="Enterprise Clients"
                value="148"
                icon={Building2}
              />

              <InsightCard
                title="AI Automation"
                value="ACTIVE"
                icon={Bot}
              />

            </div>

          </div>

        </div>

      </section>

      {/* EXECUTIVE LINKS */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10">

          <div className="flex items-center justify-between mb-10">

            <div>

              <div className="text-yellow-400 font-black tracking-widest mb-3">

                EXECUTIVE OPERATIONS

              </div>

              <h2 className="text-3xl font-black">

                Enterprise Control Modules

              </h2>

            </div>

            <BarChart3
              size={42}
              className="text-yellow-400"
            />

          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

            <ExecutiveLink
              href="/admin/autopilot"
              title="AI Autopilot"
              icon={Bot}
            />

            <ExecutiveLink
              href="/admin/deals"
              title="Deal Operations"
              icon={
                BriefcaseBusiness
              }
            />

            <ExecutiveLink
              href="/wallet"
              title="Wallet Intelligence"
              icon={Wallet}
            />

            <ExecutiveLink
              href="/transport"
              title="Transport Hub"
              icon={Truck}
            />

            <ExecutiveLink
              href="/insurance"
              title="Insurance Hub"
              icon={
                ShieldCheck
              }
            />

            <ExecutiveLink
              href="/financing"
              title="Financing Hub"
              icon={
                BadgeDollarSign
              }
            />

            <ExecutiveLink
              href="/contracts"
              title="Contracts"
              icon={
                CheckCircle2
              }
            />

            <ExecutiveLink
              href="/smart-match"
              title="AI Matching"
              icon={Brain}
            />

          </div>

        </div>

      </section>

      {/* RISK ENGINE */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="bg-red-500/10 border border-red-500/20 rounded-[40px] p-10">

            <div className="flex items-center justify-between flex-wrap gap-6">

              <div className="max-w-3xl">

                <div className="text-red-400 font-black tracking-widest mb-4">

                  RISK ENGINE

                </div>

                <h2 className="text-4xl font-black mb-5">

                  Fraud & Marketplace Security

                </h2>

                <p className="text-zinc-300 text-lg leading-8">

                  AI continuously monitors suspicious activity,
                  duplicate listings,
                  fraudulent behavior,
                  payment anomalies,
                  and abnormal marketplace events.

                </p>

              </div>

              <div className="w-28 h-28 rounded-[32px] bg-red-500/10 flex items-center justify-center">

                <ShieldAlert
                  size={60}
                  className="text-red-400"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function AnalyticsCard({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  const colors: any = {
    green:
      "bg-green-500/10 text-green-400",

    yellow:
      "bg-yellow-500/10 text-yellow-400",

    cyan:
      "bg-cyan-500/10 text-cyan-400",

    violet:
      "bg-violet-500/10 text-violet-400",

    orange:
      "bg-orange-500/10 text-orange-400",

    blue:
      "bg-blue-500/10 text-blue-400",
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

function MetricBar({
  label,
  value,
  color,
}: any) {
  return (
    <div>

      <div className="flex items-center justify-between mb-3">

        <div className="font-bold">
          {label}
        </div>

        <div className="text-zinc-400">
          {value}%
        </div>

      </div>

      <div className="h-4 rounded-full bg-zinc-800 overflow-hidden">

        <div
          className={`${color} h-full rounded-full`}
          style={{
            width: `${value}%`,
          }}
        />

      </div>

    </div>
  );
}

function InsightCard({
  title,
  value,
  icon: Icon,
}: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

      <div className="flex items-center justify-between mb-5">

        <Icon className="text-green-400" />

        <TrendingUp className="text-zinc-700" />

      </div>

      <div className="text-zinc-400 text-sm mb-2">
        {title}
      </div>

      <div className="text-3xl font-black">
        {value}
      </div>

    </div>
  );
}

function ExecutiveLink({
  href,
  title,
  icon: Icon,
}: any) {
  return (
    <Link
      href={href}
      className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 hover:border-cyan-500/40 hover:bg-cyan-500/5 transition group"
    >

      <div className="flex items-center justify-between mb-6">

        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">

          <Icon size={26} />

        </div>

        <ArrowUpRight className="text-zinc-600 group-hover:text-cyan-400 transition" />

      </div>

      <div className="text-xl font-black">
        {title}
      </div>

    </Link>
  );
}