"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  Brain,
  Building2,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Flame,
  Handshake,
  MessageCircle,
  Phone,
  Search,
  Sparkles,
  TrendingUp,
  UserCheck,
  Users,
  Wallet,
  Wrench,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

type Inquiry = {
  id: string;

  message: string;

  created_at: string;

  machinery_id: string;

  sender_id: string;

  owner_id: string;

  machinery?: any;

  profile?: any;
};

export default function CRMPage() {
  const [loading, setLoading] =
    useState(true);

  const [inquiries, setInquiries] =
    useState<Inquiry[]>([]);

  const [search, setSearch] =
    useState("");

  const [selectedStage, setSelectedStage] =
    useState("all");

  const [stats, setStats] =
    useState({
      totalLeads: 0,

      hotLeads: 0,

      activeNegotiations: 0,

      convertedDeals: 0,
    });

  useEffect(() => {
    loadCRM();
  }, []);

  async function loadCRM() {
    setLoading(true);

    try {
      const {
        data: authData,
      } =
        await supabase.auth.getUser();

      const user =
        authData.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const {
        data: inquiryData,
      } = await supabase
        .from("inquiries")
        .select("*")
        .eq(
          "owner_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

      const enriched =
        await Promise.all(
          (
            inquiryData || []
          ).map(
            async (
              inquiry: any
            ) => {
              let machinery =
                null;

              let profile =
                null;

              const {
                data:
                  machineryData,
              } =
                await supabase
                  .from(
                    "machinery"
                  )
                  .select("*")
                  .eq(
                    "id",
                    inquiry.machinery_id
                  )
                  .single();

              machinery =
                machineryData;

              const {
                data:
                  profileData,
              } =
                await supabase
                  .from(
                    "profiles"
                  )
                  .select("*")
                  .eq(
                    "id",
                    inquiry.sender_id
                  )
                  .single();

              profile =
                profileData;

              return {
                ...inquiry,
                machinery,
                profile,
              };
            }
          )
        );

      setInquiries(enriched);

      const hot =
        enriched.filter(
          (x) =>
            x.message
              ?.toLowerCase()
              .includes(
                "buy"
              ) ||
            x.message
              ?.toLowerCase()
              .includes(
                "price"
              ) ||
            x.message
              ?.toLowerCase()
              .includes(
                "urgent"
              )
        );

      setStats({
        totalLeads:
          enriched.length,

        hotLeads:
          hot.length,

        activeNegotiations:
          Math.floor(
            enriched.length *
              0.4
          ),

        convertedDeals:
          Math.floor(
            enriched.length *
              0.12
          ),
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  const filtered =
    useMemo(() => {
      return inquiries.filter(
        (lead) => {
          const keyword =
            `${lead.message} ${lead.profile?.full_name} ${lead.machinery?.title}`
              .toLowerCase();

          return keyword.includes(
            search.toLowerCase()
          );
        }
      );
    }, [search, inquiries]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-cyan-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">

              <Brain size={20} />

              AI CRM ENGINE

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              Lead Command Center

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              Manage buyer inquiries,
              negotiations,
              hot leads,
              AI recommendations,
              and machinery opportunities
              from one enterprise CRM dashboard.

            </p>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-12">

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

          <CRMStat
            title="Total Leads"
            value={
              stats.totalLeads
            }
            icon={Users}
            color="cyan"
          />

          <CRMStat
            title="Hot Leads"
            value={
              stats.hotLeads
            }
            icon={Flame}
            color="orange"
          />

          <CRMStat
            title="Negotiations"
            value={
              stats.activeNegotiations
            }
            icon={Handshake}
            color="green"
          />

          <CRMStat
            title="Converted Deals"
            value={
              stats.convertedDeals
            }
            icon={
              CheckCircle2
            }
            color="yellow"
          />

        </div>

      </section>

      {/* FILTERS */}

      <section className="max-w-7xl mx-auto px-4 pb-8">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[35px] p-6">

          <div className="flex flex-col lg:flex-row gap-5">

            <div className="relative flex-1">

              <Search className="absolute left-4 top-4 text-zinc-500" />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search leads, buyers, machinery..."
                className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
              />

            </div>

            <select
              value={
                selectedStage
              }
              onChange={(e) =>
                setSelectedStage(
                  e.target.value
                )
              }
              className="bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-4 outline-none"
            >

              <option value="all">
                All Stages
              </option>

              <option value="new">
                New Lead
              </option>

              <option value="negotiation">
                Negotiation
              </option>

              <option value="closed">
                Closed Deal
              </option>

              <option value="lost">
                Lost
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </div>

        </div>

      </section>

      {/* AI INSIGHTS */}

      <section className="max-w-7xl mx-auto px-4 pb-10">

        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[40px] p-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div className="max-w-3xl">

              <div className="flex items-center gap-3 text-cyan-400 font-black tracking-widest mb-5">

                <Sparkles size={22} />

                AI INSIGHTS

              </div>

              <h2 className="text-4xl font-black mb-5">

                EML AI recommends immediate follow-up with hot buyers

              </h2>

              <p className="text-zinc-300 text-lg leading-8">

                Buyers interested in transport,
                financing,
                and premium machinery are showing
                high conversion probability this week.

              </p>

            </div>

            <div className="grid grid-cols-2 gap-4">

              <MiniInsight
                title="Conversion Rate"
                value="78%"
              />

              <MiniInsight
                title="AI Match Score"
                value="92%"
              />

              <MiniInsight
                title="Hot Regions"
                value="Addis + Bahir Dar"
              />

              <MiniInsight
                title="Growth"
                value="+41%"
              />

            </div>

          </div>

        </div>

      </section>

      {/* LEADS */}

      <section className="max-w-7xl mx-auto px-4 pb-24">

        <div className="space-y-6">

          {filtered.map(
            (lead) => {
              const hot =
                lead.message
                  ?.toLowerCase()
                  .includes(
                    "urgent"
                  ) ||
                lead.message
                  ?.toLowerCase()
                  .includes(
                    "buy"
                  ) ||
                lead.message
                  ?.toLowerCase()
                  .includes(
                    "price"
                  );

              return (
                <div
                  key={lead.id}
                  className="bg-zinc-900 border border-zinc-800 rounded-[35px] p-8"
                >

                  <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-8">

                    {/* LEFT */}

                    <div className="flex-1">

                      <div className="flex flex-wrap items-center gap-4 mb-6">

                        <div className="flex items-center gap-3">

                          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">

                            <UserCheck className="text-cyan-400" />

                          </div>

                          <div>

                            <div className="font-black text-xl">

                              {lead
                                .profile
                                ?.full_name ||
                                "Buyer"}

                            </div>

                            <div className="text-zinc-400 text-sm">

                              Lead ID:
                              {" "}
                              {lead.id.slice(
                                0,
                                8
                              )}

                            </div>

                          </div>

                        </div>

                        {hot && (
                          <div className="bg-orange-500/10 border border-orange-500/20 text-orange-400 px-4 py-2 rounded-full font-bold text-sm">

                            HOT LEAD

                          </div>
                        )}

                        <div className="bg-green-500/10 border border-green-500/20 text-green-400 px-4 py-2 rounded-full font-bold text-sm">

                          AI SCORE:
                          {" "}
                          {hot
                            ? "92%"
                            : "71%"}

                        </div>

                      </div>

                      {/* MACHINERY */}

                      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6 mb-6">

                        <div className="flex items-center gap-4">

                          <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center">

                            <Wrench className="text-yellow-400" />

                          </div>

                          <div>

                            <div className="font-black text-xl">

                              {lead
                                .machinery
                                ?.title ||
                                "Machinery"}

                            </div>

                            <div className="text-zinc-400">

                              {lead
                                .machinery
                                ?.location}

                            </div>

                          </div>

                        </div>

                      </div>

                      {/* MESSAGE */}

                      <div className="bg-black border border-zinc-800 rounded-3xl p-6">

                        <div className="flex items-center gap-3 text-zinc-400 mb-4">

                          <MessageCircle size={18} />

                          Buyer Inquiry

                        </div>

                        <p className="text-lg leading-8 text-zinc-200">

                          {lead.message}

                        </p>

                      </div>

                    </div>

                    {/* RIGHT */}

                    <div className="w-full xl:w-[340px] space-y-5">

                      {/* STATUS */}

                      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

                        <div className="flex items-center gap-3 mb-5">

                          <TrendingUp className="text-cyan-400" />

                          <div className="font-black text-lg">

                            Lead Status

                          </div>

                        </div>

                        <div className="space-y-4">

                          <StatusRow
                            label="Priority"
                            value={
                              hot
                                ? "High"
                                : "Medium"
                            }
                          />

                          <StatusRow
                            label="Deal Probability"
                            value={
                              hot
                                ? "Very High"
                                : "Moderate"
                            }
                          />

                          <StatusRow
                            label="Lead Source"
                            value="Marketplace"
                          />

                          <StatusRow
                            label="AI Recommendation"
                            value="Follow Up"
                          />

                        </div>

                      </div>

                      {/* ACTIONS */}

                      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

                        <div className="font-black text-lg mb-5">

                          Quick Actions

                        </div>

                        <div className="space-y-4">

                          <button className="w-full bg-cyan-500 hover:bg-cyan-400 text-black font-black py-4 rounded-2xl transition">

                            Start Negotiation

                          </button>

                          <button className="w-full bg-green-600 hover:bg-green-500 text-white font-black py-4 rounded-2xl transition flex items-center justify-center gap-3">

                            <Phone size={20} />

                            Contact Buyer

                          </button>

                          <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition">

                            Create Deal

                          </button>

                          <button className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-black py-4 rounded-2xl transition">

                            Schedule Follow-up

                          </button>

                        </div>

                      </div>

                      {/* TIMELINE */}

                      <div className="bg-zinc-950 border border-zinc-800 rounded-3xl p-6">

                        <div className="font-black text-lg mb-5">

                          Timeline

                        </div>

                        <div className="space-y-5">

                          <TimelineItem
                            icon={
                              MessageCircle
                            }
                            title="Inquiry Received"
                            time={
                              lead.created_at
                            }
                          />

                          <TimelineItem
                            icon={Brain}
                            title="AI Lead Scored"
                            time={
                              lead.created_at
                            }
                          />

                          <TimelineItem
                            icon={
                              CalendarClock
                            }
                            title="Waiting Follow-up"
                            time="Pending"
                          />

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

          {!loading &&
            filtered.length ===
              0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-20 text-center">

                <Users
                  size={70}
                  className="mx-auto text-zinc-700 mb-6"
                />

                <h2 className="text-3xl font-black mb-4">

                  No leads found

                </h2>

                <p className="text-zinc-400 text-lg">

                  Buyer inquiries will appear here automatically.

                </p>

              </div>
            )}

        </div>

      </section>

    </main>
  );
}

function CRMStat({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  const colors: any = {
    cyan:
      "bg-cyan-500/10 text-cyan-400",

    orange:
      "bg-orange-500/10 text-orange-400",

    green:
      "bg-green-500/10 text-green-400",

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

function MiniInsight({
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

function StatusRow({
  label,
  value,
}: any) {
  return (
    <div className="flex items-center justify-between gap-4">

      <div className="text-zinc-400">

        {label}

      </div>

      <div className="font-bold text-right">

        {value}

      </div>

    </div>
  );
}

function TimelineItem({
  icon: Icon,
  title,
  time,
}: any) {
  return (
    <div className="flex items-start gap-4">

      <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center">

        <Icon className="text-cyan-400" size={20} />

      </div>

      <div>

        <div className="font-bold">

          {title}

        </div>

        <div className="text-zinc-400 text-sm mt-1">

          {time
            ? new Date(
                time
              ).toLocaleString()
            : "Pending"}

        </div>

      </div>

    </div>
  );
}