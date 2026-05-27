"use client";

import { useEffect, useMemo, useState } from "react";

import Link from "next/link";

import {
  ArrowRight,
  Banknote,
  Briefcase,
  CheckCircle2,
  Clock3,
  CreditCard,
  ShieldCheck,
  Truck,
  Wrench,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function DealsDashboardPage() {
  const { user } = useAuth();

  const { t } = useLanguage();

  const [loading, setLoading] =
    useState(true);

  const [deals, setDeals] =
    useState<any[]>([]);

  const [activeTab, setActiveTab] =
    useState("all");

  useEffect(() => {
    if (user?.id) {
      loadDeals();
    }
  }, [user]);

  async function loadDeals() {
    setLoading(true);

    const { data, error } =
      await supabase
        .from("enterprise_deals")
        .select("*")
        .or(
          `buyer_id.eq.${user?.id},seller_id.eq.${user?.id}`
        )
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      console.error(error);
    }

    setDeals(data || []);

    setLoading(false);
  }

  const filteredDeals =
    useMemo(() => {
      if (activeTab === "all")
        return deals;

      return deals.filter(
        (d) =>
          d.deal_status === activeTab
      );
    }, [deals, activeTab]);

  const totalRevenue =
    deals.reduce(
      (sum, d) =>
        sum +
        Number(d.total_amount || 0),
      0
    );

  const totalCommission =
    deals.reduce(
      (sum, d) =>
        sum +
        Number(
          d.eml_commission || 0
        ),
      0
    );

  const totalNet =
    deals.reduce(
      (sum, d) =>
        sum +
        Number(
          d.seller_net_amount || 0
        ),
      0
    );

  const tabs = [
    {
      key: "all",
      label: t(
        "All Deals",
        "ሁሉም ግብይቶች"
      ),
    },

    {
      key: "pending",
      label: t(
        "Pending",
        "በመጠባበቅ ላይ"
      ),
    },

    {
      key: "negotiation",
      label: t(
        "Negotiation",
        "ድርድር"
      ),
    },

    {
      key: "payment_pending",
      label: t(
        "Payment",
        "ክፍያ"
      ),
    },

    {
      key: "active",
      label: t(
        "Active",
        "በስራ ላይ"
      ),
    },

    {
      key: "completed",
      label: t(
        "Completed",
        "ተጠናቋል"
      ),
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-32">

      {/* HEADER */}

      <section className="border-b border-zinc-800 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent">

        <div className="max-w-7xl mx-auto px-4 py-10">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">

            <div>

              <div className="text-yellow-400 font-black tracking-[0.25em] uppercase mb-3">
                ኢትዮ ማሽነሪ አገናኝ
              </div>

              <div className="text-zinc-500 font-bold mb-4">
                ETHIO MACHINERY LINK — EML
              </div>

              <h1 className="text-5xl font-black leading-tight">
                {t(
                  "Enterprise Deals Command Center",
                  "የድርጅት ግብይት መቆጣጠሪያ ማዕከል"
                )}
              </h1>

              <p className="mt-5 text-zinc-400 text-lg leading-8 max-w-4xl">
                {t(
                  "Manage machinery sales, rentals, transport coordination, operators, payments, financing and secure transaction workflows inside one intelligent machinery ecosystem.",
                  "የማሽነሪ ሽያጭ፣ ኪራይ፣ ትራንስፖርት፣ ኦፕሬተሮች፣ ክፍያ፣ ፋይናንስ እና ደህንነቱ የተጠበቀ የግብይት ሂደቶችን በአንድ ዘመናዊ ስርዓት ያስተዳድሩ።"
                )}
              </p>

            </div>

            <div className="flex flex-wrap gap-4">

              <Link
                href="/browse"
                className="h-14 px-7 rounded-2xl bg-yellow-500 hover:bg-yellow-400 transition flex items-center font-black text-black"
              >
                {t(
                  "Browse Machinery",
                  "ማሽነሪ ይመልከቱ"
                )}
              </Link>

              <Link
                href="/upload"
                className="h-14 px-7 rounded-2xl border border-zinc-700 hover:border-yellow-500 transition flex items-center font-bold"
              >
                {t(
                  "Post Machinery",
                  "ማሽነሪ ይለጥፉ"
                )}
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* KPI */}

      <section className="max-w-7xl mx-auto px-4 py-10">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <KpiCard
            title={t(
              "Total Deals",
              "ጠቅላላ ግብይቶች"
            )}
            value={deals.length}
            icon={Briefcase}
          />

          <KpiCard
            title={t(
              "Gross Revenue",
              "ጠቅላላ ገቢ"
            )}
            value={`ETB ${totalRevenue.toLocaleString()}`}
            icon={Banknote}
          />

          <KpiCard
            title={t(
              "EML Commission",
              "የEML ኮሚሽን"
            )}
            value={`ETB ${totalCommission.toLocaleString()}`}
            icon={ShieldCheck}
          />

          <KpiCard
            title={t(
              "Seller Net",
              "የሻጭ የተጣራ ገቢ"
            )}
            value={`ETB ${totalNet.toLocaleString()}`}
            icon={CheckCircle2}
          />

        </div>

      </section>

      {/* FILTERS */}

      <section className="max-w-7xl mx-auto px-4 mb-10">

        <div className="flex gap-3 overflow-x-auto pb-2">

          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() =>
                setActiveTab(tab.key)
              }
              className={`px-6 h-12 rounded-2xl whitespace-nowrap font-bold transition ${
                activeTab === tab.key
                  ? "bg-yellow-500 text-black"
                  : "bg-zinc-900 border border-zinc-800 text-zinc-300"
              }`}
            >
              {tab.label}
            </button>
          ))}

        </div>

      </section>

      {/* DEALS */}

      <section className="max-w-7xl mx-auto px-4">

        {loading ? (

          <div className="text-center py-20 text-zinc-500">
            {t(
              "Loading enterprise deals...",
              "የድርጅት ግብይቶች በመጫን ላይ..."
            )}
          </div>

        ) : filteredDeals.length ===
          0 ? (

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-16 text-center">

            <div className="text-4xl mb-5">
              🚜
            </div>

            <h2 className="text-3xl font-black mb-4">
              {t(
                "No Deals Yet",
                "እስካሁን ግብይት የለም"
              )}
            </h2>

            <p className="text-zinc-400 max-w-2xl mx-auto leading-8">
              {t(
                "Start building your machinery business ecosystem by buying, selling, renting or transporting machinery.",
                "ማሽነሪ በመሸጥ፣ በመግዛት፣ በማከራየት ወይም በማጓጓዝ የንግድ ስርዓትዎን ይጀምሩ።"
              )}
            </p>

          </div>

        ) : (

          <div className="space-y-7">

            {filteredDeals.map(
              (deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                />
              )
            )}

          </div>

        )}

      </section>

    </main>
  );
}

function KpiCard({
  title,
  value,
  icon: Icon,
}: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">

      <div className="flex items-center justify-between mb-5">

        <div className="text-zinc-400 font-semibold">
          {title}
        </div>

        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 text-yellow-400 flex items-center justify-center">
          <Icon size={26} />
        </div>

      </div>

      <div className="text-3xl font-black">
        {value}
      </div>

    </div>
  );
}

function DealCard({
  deal,
}: {
  deal: any;
}) {
  const statusColors: any = {
    pending:
      "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",

    negotiation:
      "bg-blue-500/10 text-blue-400 border-blue-500/20",

    payment_pending:
      "bg-orange-500/10 text-orange-400 border-orange-500/20",

    active:
      "bg-green-500/10 text-green-400 border-green-500/20",

    completed:
      "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",

    cancelled:
      "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

      <div className="p-7 border-b border-zinc-800">

        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">

          <div>

            <div className="flex flex-wrap items-center gap-3 mb-4">

              <div
                className={`px-4 py-2 rounded-full border text-sm font-black ${
                  statusColors[
                    deal.deal_status
                  ] ||
                  "bg-zinc-800 text-zinc-300"
                }`}
              >
                {deal.deal_status}
              </div>

              <div className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-full text-sm font-bold">
                {deal.deal_type}
              </div>

            </div>

            <h2 className="text-3xl font-black mb-4">
              {deal.machinery_title ||
                "Enterprise Machinery Deal"}
            </h2>

            <div className="flex flex-wrap gap-5 text-zinc-400">

              <div className="flex items-center gap-2">
                <Banknote size={18} />
                ETB{" "}
                {Number(
                  deal.total_amount || 0
                ).toLocaleString()}
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck size={18} />
                Commission: ETB{" "}
                {Number(
                  deal.eml_commission ||
                    0
                ).toLocaleString()}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={18} />
                {new Date(
                  deal.created_at
                ).toLocaleDateString()}
              </div>

            </div>

          </div>

          <div className="flex flex-wrap gap-3">

            <Link
              href={`/payment?deal=${deal.id}`}
              className="h-12 px-5 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center gap-2"
            >
              <CreditCard size={18} />

              Payment
            </Link>

            <Link
              href="/logistics"
              className="h-12 px-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 font-bold flex items-center gap-2"
            >
              <Truck size={18} />

              Logistics
            </Link>

            <Link
              href="/services"
              className="h-12 px-5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 font-bold flex items-center gap-2"
            >
              <Wrench size={18} />

              Services
            </Link>

          </div>

        </div>

      </div>

      {/* BODY */}

      <div className="p-7">

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">

          <MiniInfo
            title="Seller Net"
            value={`ETB ${Number(
              deal.seller_net_amount ||
                0
            ).toLocaleString()}`}
          />

          <MiniInfo
            title="Payment Method"
            value={
              deal.payment_method ||
              "Telebirr"
            }
          />

          <MiniInfo
            title="Escrow"
            value={
              deal.escrow_enabled
                ? "Optional Enabled"
                : "Direct Payment"
            }
          />

          <MiniInfo
            title="Transport"
            value={
              deal.transport_required
                ? "Required"
                : "Not Required"
            }
          />

        </div>

        {/* WORKFLOW */}

        <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4">

          <WorkflowStep
            title="Deal"
            active
          />

          <WorkflowStep
            title="Payment"
            active={
              deal.payment_status ===
              "paid"
            }
          />

          <WorkflowStep
            title="Logistics"
            active={
              deal.transport_status ===
              "assigned"
            }
          />

          <WorkflowStep
            title="Completed"
            active={
              deal.deal_status ===
              "completed"
            }
          />

        </div>

      </div>

    </div>
  );
}

function MiniInfo({
  title,
  value,
}: any) {
  return (
    <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5">

      <div className="text-zinc-500 text-sm mb-2">
        {title}
      </div>

      <div className="font-black text-lg">
        {value}
      </div>

    </div>
  );
}

function WorkflowStep({
  title,
  active,
}: any) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        active
          ? "bg-green-500/10 border-green-500/20 text-green-400"
          : "bg-zinc-950 border-zinc-800 text-zinc-500"
      }`}
    >
      <div className="flex items-center justify-between">

        <div className="font-bold">
          {title}
        </div>

        <ArrowRight size={18} />

      </div>

    </div>
  );
}