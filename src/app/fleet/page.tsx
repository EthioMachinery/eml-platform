"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeDollarSign,
  Brain,
  CircleGauge,
  Fuel,
  HardHat,
  MapPinned,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Truck,
  Wallet,
  Wrench,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

type FleetMachine = {
  id: string;
  title: string;
  brand: string;
  model: string;
  category: string;
  price: number;
  location: string;
  image_url: string;
  condition: string;
  listing_type: string;
};

export default function FleetPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const [loading, setLoading] = useState(true);
  const [machines, setMachines] = useState<FleetMachine[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadFleet();
  }, []);

  async function loadFleet() {
    setLoading(true);

    try {
      const { data } = await supabase
        .from("machinery")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(40);

      setMachines(data || []);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  const filtered = useMemo(() => {
    return machines.filter((m) => {
      const keyword =
        `${m.title} ${m.brand} ${m.model} ${m.location} ${m.category}`.toLowerCase();
      return keyword.includes(search.toLowerCase());
    });
  }, [machines, search]);

  return (
    <main className="min-h-screen bg-black text-white">

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-yellow-500/10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-3 rounded-full font-black mb-8">
              <Truck size={20} />
              {t(
                "TM ENTERPRISE FLEET MARKETPLACE",
                "የTM የኢንተርፕራይዝ ፍሊት ገበያ"
              )}
            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              {t(
                "Fleet Intelligence Ecosystem",
                "የፍሊት ኢንተለጀንስ ስርዓት"
              )}
            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">
              {t(
                "Manage enterprise machinery fleets, operators, rentals, logistics, maintenance, contracts, and AI-powered utilization optimization.",
                "የኢንተርፕራይዝ ማሽነሪ ፍሊቶችን፣ ኦፕሬተሮችን፣ ኪራዮችን፣ ሎጂስቲክስን፣ ጥገናን፣ ኮንትራቶችን እና በAI የተደገፈ የአጠቃቀም ማሻሻያን ያስተዳድሩ።"
              )}
            </p>

            <div className="flex flex-wrap gap-5 mt-10">
              <Link
                href="/upload"
                className="bg-yellow-500 hover:bg-yellow-400 text-black font-black px-8 py-5 rounded-2xl transition"
              >
                {t(
                  "Add Fleet Machinery",
                  "የፍሊት ማሽነሪ ያክሉ"
                )}
              </Link>

              <Link
                href="/dashboard/crm"
                className="border border-zinc-700 hover:border-zinc-500 font-black px-8 py-5 rounded-2xl transition"
              >
                {t(
                  "Fleet CRM",
                  "የፍሊት CRM"
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* KPI */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <FleetStat
            title={t(
              "Active Fleet Machines",
              "ንቁ የፍሊት ማሽኖች"
            )}
            value={machines.length}
            icon={Truck}
            color="yellow"
          />

          <FleetStat
            title={t(
              "Fleet Utilization",
              "የፍሊት አጠቃቀም"
            )}
            value="84%"
            icon={CircleGauge}
            color="green"
          />

          <FleetStat
            title={t(
              "Monthly Revenue",
              "ወርሃዊ ገቢ"
            )}
            value="3.4M ETB"
            icon={BadgeDollarSign}
            color="cyan"
          />

          <FleetStat
            title={t(
              "AI Optimization",
              "AI ማሻሻያ"
            )}
            value={t("ACTIVE", "ንቁ")}
            icon={Brain}
            color="violet"
          />
        </div>
      </section>

      {/* AI ENGINE */}
      <section className="max-w-7xl mx-auto px-4 pb-12">
        <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[40px] p-10">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
            
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 text-cyan-400 font-black tracking-widest mb-5">
                <Sparkles size={22} />
                {t(
                  "AI FLEET INTELLIGENCE",
                  "AI የፍሊት ኢንተለጀንስ"
                )}
              </div>

              <h2 className="text-4xl font-black mb-6">
                {t(
                  "AI predicts machinery demand, rental opportunities, maintenance schedules, and fleet profitability.",
                  "AI የማሽነሪ ፍላጎትን፣ የኪራይ እድሎችን፣ የጥገና መርሃ ግብሮችን እና የፍሊት ትርፋማነትን ይተነብያል።"
                )}
              </h2>

              <p className="text-zinc-300 text-lg leading-8">
                {t(
                  "TM AI continuously analyzes fleet activity, operator performance, regional demand, transport efficiency, and machinery utilization.",
                  "TM AI የፍሊት እንቅስቃሴን፣ የኦፕሬተር አፈፃፀምን፣ የክልል ፍላጎትን፣ የትራንስፖርት ብቃትን እና የማሽነሪ አጠቃቀምን በቀጣይነት ይመረምራል።"
                )}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <MiniMetric
                label={t(
                  "Demand Growth",
                  "የፍላጎት እድገት"
                )}
                value="+42%"
              />

              <MiniMetric
                label={t(
                  "Fleet Profitability",
                  "የፍሊት ትርፋማነት"
                )}
                value="+68%"
              />

              <MiniMetric
                label={t(
                  "AI Accuracy",
                  "የAI ትክክለኛነት"
                )}
                value="91%"
              />

              <MiniMetric
                label={t(
                  "Maintenance Risk",
                  "የጥገና አደጋ"
                )}
                value={t("LOW", "ዝቅተኛ")}
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t(
              "Search fleets, machinery, contractors, regions...",
              "ፍሊቶችን፣ ማሽነሪዎችን፣ ኮንትራክተሮችን እና ክልሎችን ይፈልጉ..."
            )}
            className="w-full bg-black border border-zinc-800 rounded-2xl px-6 py-5 outline-none"
          />
        </div>
      </section>

      {/* MACHINES */}
      <section className="max-w-7xl mx-auto px-4 pb-24">
        {loading ? (
          <div className="text-center text-zinc-400 py-20 text-xl font-bold">
            {t(
              "Loading fleet data...",
              "የፍሊት መረጃ በመጫን ላይ..."
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filtered.map((machine) => (
              <div
                key={machine.id}
                className="bg-zinc-900 border border-zinc-800 rounded-[35px] overflow-hidden hover:border-yellow-500/30 transition"
              >
                {/* IMAGE */}
                <div className="h-[260px] bg-zinc-800 overflow-hidden">
                  {machine.image_url ? (
                    <img
                      src={machine.image_url}
                      alt={machine.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Truck size={70} className="text-zinc-600" />
                    </div>
                  )}
                </div>

                {/* BODY */}
                <div className="p-7">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <div className="text-2xl font-black">
                        {machine.title}
                      </div>

                      <div className="text-zinc-400 mt-2">
                        {machine.brand} {machine.model}
                      </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-black">
                      {t("FLEET", "ፍሊት")}
                    </div>
                  </div>

                  <div className="space-y-4 mb-7">
                    <InfoRow icon={MapPinned} label={machine.location} />
                    <InfoRow icon={Wrench} label={machine.category} />
                    <InfoRow icon={ShieldCheck} label={machine.condition} />
                    <InfoRow icon={Wallet} label={`${Number(machine.price || 0).toLocaleString()} ETB`} />
                  </div>

                  {/* AI */}
                  <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-3xl p-5 mb-7">
                    <div className="flex items-center gap-3 text-cyan-400 font-black mb-3">
                      <Brain size={18} />
                      {t(
                        "AI Fleet Insight",
                        "AI የፍሊት ትንታኔ"
                      )}
                    </div>

                    <p className="text-zinc-300 text-sm leading-7">
                      {t(
                        "High demand predicted for this machinery in construction and transport sectors.",
                        "ለዚህ ማሽነሪ በግንባታ እና ትራንስፖርት ዘርፍ ከፍተኛ ፍላጎት ተጠቅሷል።"
                      )}
                    </p>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-4">
                    <Link
                      href={`/machinery/${machine.id}`}
                      className="flex-1 bg-yellow-500 hover:bg-yellow-400 text-black font-black py-4 rounded-2xl transition text-center"
                    >
                      {t(
                        "View Machine",
                        "ማሽኑን ይመልከቱ"
                      )}
                    </Link>

                    <button className="w-16 h-16 rounded-2xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition">
                      <ArrowRight />
                    </button>
                  </div>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>

      {/* SERVICES */}
      <section className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            <EnterpriseCard
              icon={HardHat}
              title={t(
                "Operator Management",
                "የኦፕሬተር አስተዳደር"
              )}
              text={t(
                "Assign operators and manage workforce productivity.",
                "ኦፕሬተሮችን ይመድቡ እና የሰራተኞችን አፈፃፀም ያስተዳድሩ።"
              )}
            />

            <EnterpriseCard
              icon={Fuel}
              title={t(
                "Fuel Intelligence",
                "የነዳጅ ኢንተለጀንስ"
              )}
              text={t(
                "Track fuel consumption and operational efficiency.",
                "የነዳጅ ፍጆታን እና የስራ ብቃትን ይቆጣጠሩ።"
              )}
            />

            <EnterpriseCard
              icon={ShieldCheck}
              title={t(
                "Fleet Insurance",
                "የፍሊት ኢንሹራንስ"
              )}
              text={t(
                "Protect enterprise machinery fleets with integrated insurance.",
                "የኢንተርፕራይዝ ፍሊቶችን በተቀናጀ ኢንሹራንስ ይጠብቁ።"
              )}
            />

            <EnterpriseCard
              icon={Activity}
              title={t(
                "Maintenance AI",
                "AI የጥገና ስርዓት"
              )}
              text={t(
                "Predictive maintenance powered by TM AI.",
                "በTM AI የተደገፈ ቅድመ ጥገና ትንበያ።"
              )}
            />
          </div>
        </div>
      </section>

    </main>
  );
}

function FleetStat({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  const colors: any = {
    yellow: "bg-yellow-500/10 text-yellow-400",
    green: "bg-green-500/10 text-green-400",
    cyan: "bg-cyan-500/10 text-cyan-400",
    violet: "bg-violet-500/10 text-violet-400",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7">
      <div className="flex items-center justify-between mb-7">
        <div className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colors[color]}`}>
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

function MiniMetric({
  label,
  value,
}: any) {
  return (
    <div className="bg-black/40 border border-cyan-500/10 rounded-3xl p-5">
      <div className="text-zinc-400 text-sm mb-2">
        {label}
      </div>
      <div className="font-black text-xl">
        {value}
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
}: any) {
  return (
    <div className="flex items-center gap-3 text-zinc-300">
      <Icon size={18} className="text-yellow-400" />
      <span>{label}</span>
    </div>
  );
}

function EnterpriseCard({
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