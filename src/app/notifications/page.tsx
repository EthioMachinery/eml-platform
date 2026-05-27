"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import {
  Bell,
  Brain,
  Truck,
  Wallet,
  ShieldCheck,
  BriefcaseBusiness,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Clock3,
  ArrowUpRight,
  Radio,
  Bot,
  BadgeDollarSign,
  Building2,
  Star,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/context/LanguageContext";

type NotificationItem = {
  id: string;
  title: string;
  title_am?: string;
  message: string;
  message_am?: string;
  type: string;
  created_at?: string;
  read?: boolean;
  action_url?: string;
};

export default function NotificationsPage() {
  const { t } = useLanguage();

  const [notifications, setNotifications] =
    useState<NotificationItem[]>(
      []
    );

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState({
      total: 0,
      unread: 0,
      aiAlerts: 0,
      finance: 0,
      logistics: 0,
    });

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    setLoading(true);

    try {
      const { data } =
        await supabase
          .from("notifications")
          .select("*")
          .order(
            "created_at",
            {
              ascending:
                false,
            }
          )
          .limit(50);

      const fallbackData: NotificationItem[] =
        [
          {
            id: "1",

            title:
              "New AI Match Found",

            title_am:
              "አዲስ AI ማገናኛ ተገኝቷል",

            message:
              "A verified excavator supplier matches your latest request.",

            message_am:
              "የተረጋገጠ ኤክስካቫተር አቅራቢ ከጥያቄዎ ጋር ተዛማጅ ሆኗል።",

            type: "match",

            created_at:
              new Date().toISOString(),

            read: false,

            action_url:
              "/smart-match",
          },

          {
            id: "2",

            title:
              "Transport Available",

            title_am:
              "መጓጓዣ ተገኝቷል",

            message:
              "Lowbed truck available for Addis Ababa → Bahir Dar route.",

            message_am:
              "ከአዲስ አበባ ወደ ባህር ዳር የሚሄድ ሎቤድ መኪና ተገኝቷል።",

            type: "transport",

            created_at:
              new Date().toISOString(),

            read: false,

            action_url:
              "/transport",
          },

          {
            id: "3",

            title:
              "Financing Pre-Approved",

            title_am:
              "ፋይናንስ ቅድመ ማጽደቅ",

            message:
              "Your machinery financing request has been pre-approved.",

            message_am:
              "የማሽነሪ ፋይናንስ ጥያቄዎ በቅድሚያ ጸድቋል።",

            type: "finance",

            created_at:
              new Date().toISOString(),

            read: true,

            action_url:
              "/financing",
          },

          {
            id: "4",

            title:
              "Insurance Offer Ready",

            title_am:
              "የመድን ቅናሽ ዝግጁ ነው",

            message:
              "AI generated machinery insurance quotation available.",

            message_am:
              "AI የፈጠረው የማሽነሪ መድን ዋጋ ተዘጋጅቷል።",

            type: "insurance",

            created_at:
              new Date().toISOString(),

            read: true,

            action_url:
              "/insurance",
          },
        ];

      const finalData =
        data &&
        data.length > 0
          ? data
          : fallbackData;

      setNotifications(
        finalData
      );

      setStats({
        total:
          finalData.length,

        unread:
          finalData.filter(
            (n: any) =>
              !n.read
          ).length,

        aiAlerts:
          finalData.filter(
            (n: any) =>
              n.type ===
              "match"
          ).length,

        finance:
          finalData.filter(
            (n: any) =>
              n.type ===
              "finance"
          ).length,

        logistics:
          finalData.filter(
            (n: any) =>
              n.type ===
              "transport"
          ).length,
      });
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  function getIcon(
    type: string
  ) {
    switch (type) {
      case "match":
        return Sparkles;

      case "transport":
        return Truck;

      case "finance":
        return Wallet;

      case "insurance":
        return ShieldCheck;

      case "deal":
        return BriefcaseBusiness;

      case "contract":
        return FileText;

      default:
        return Bell;
    }
  }

  function getColor(
    type: string
  ) {
    switch (type) {
      case "match":
        return "text-cyan-400 bg-cyan-500/10";

      case "transport":
        return "text-orange-400 bg-orange-500/10";

      case "finance":
        return "text-green-400 bg-green-500/10";

      case "insurance":
        return "text-violet-400 bg-violet-500/10";

      case "deal":
        return "text-yellow-400 bg-yellow-500/10";

      default:
        return "text-zinc-400 bg-zinc-700";
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* HERO */}

      <section className="relative overflow-hidden border-b border-cyan-500/10">

        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/5 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 py-20">

          <div className="max-w-5xl">

            <div className="inline-flex items-center gap-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 px-5 py-3 rounded-full font-black mb-8">

              <Bot size={20} />

              {t(
                "EML Live Intelligence",
                "የEML የቀጥታ AI ማሳወቂያ"
              )}

            </div>

            <h1 className="text-5xl md:text-7xl font-black leading-tight">

              {t(
                "Enterprise Notifications",
                "የድርጅት ማሳወቂያዎች"
              )}

            </h1>

            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">

              {t(
                "Realtime AI-powered notifications across machinery, transport, financing, insurance and contracts.",
                "በማሽነሪ፣ በመጓጓዣ፣ በፋይናንስ፣ በመድን እና በኮንትራቶች ላይ የAI የቀጥታ ማሳወቂያዎች።"
              )}

            </p>

          </div>

        </div>

      </section>

      {/* STATS */}

      <section className="max-w-7xl mx-auto px-4 py-14">

        <div className="grid md:grid-cols-2 xl:grid-cols-5 gap-6">

          <StatCard
            title={t(
              "Total",
              "ጠቅላላ"
            )}
            value={
              stats.total
            }
            icon={Bell}
            color="cyan"
          />

          <StatCard
            title={t(
              "Unread",
              "ያልተነበቡ"
            )}
            value={
              stats.unread
            }
            icon={
              AlertTriangle
            }
            color="orange"
          />

          <StatCard
            title={t(
              "AI Alerts",
              "AI ማሳወቂያዎች"
            )}
            value={
              stats.aiAlerts
            }
            icon={Brain}
            color="violet"
          />

          <StatCard
            title={t(
              "Financing",
              "ፋይናንስ"
            )}
            value={
              stats.finance
            }
            icon={Wallet}
            color="green"
          />

          <StatCard
            title={t(
              "Transport",
              "መጓጓዣ"
            )}
            value={
              stats.logistics
            }
            icon={Truck}
            color="yellow"
          />

        </div>

      </section>

      {/* LIST */}

      <section className="max-w-7xl mx-auto px-4 pb-20">

        <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] overflow-hidden">

          <div className="p-8 border-b border-zinc-800 flex items-center justify-between">

            <div>

              <div className="text-cyan-400 font-black tracking-widest mb-2">

                {t(
                  "LIVE FEED",
                  "የቀጥታ ማሳወቂያ"
                )}

              </div>

              <h2 className="text-3xl font-black">

                {t(
                  "Realtime Enterprise Events",
                  "የቀጥታ የድርጅት ክስተቶች"
                )}

              </h2>

            </div>

            <div className="bg-green-500/10 text-green-400 px-5 py-3 rounded-full text-sm font-black flex items-center gap-2">

              <Radio size={16} />

              LIVE

            </div>

          </div>

          {loading ? (
            <div className="p-10 text-center text-zinc-400">

              {t(
                "Loading notifications...",
                "ማሳወቂያዎች በመጫን ላይ..."
              )}

            </div>
          ) : (
            <div className="divide-y divide-zinc-800">

              {notifications.map(
                (
                  notification
                ) => {
                  const Icon =
                    getIcon(
                      notification.type
                    );

                  return (
                    <Link
                      key={
                        notification.id
                      }
                      href={
                        notification.action_url ||
                        "#"
                      }
                      className="block hover:bg-zinc-800/40 transition"
                    >

                      <div className="p-8 flex flex-col lg:flex-row gap-6 lg:items-center lg:justify-between">

                        <div className="flex gap-5">

                          <div
                            className={`w-16 h-16 rounded-3xl flex items-center justify-center ${getColor(
                              notification.type
                            )}`}
                          >
                            <Icon />
                          </div>

                          <div>

                            <div className="flex flex-wrap items-center gap-3 mb-3">

                              <h3 className="text-2xl font-black">

                                {t(
                                  notification.title,
                                  notification.title_am ||
                                    notification.title
                                )}

                              </h3>

                              {!notification.read && (
                                <div className="bg-cyan-500 text-black text-xs px-3 py-1 rounded-full font-black">

                                  NEW

                                </div>
                              )}

                            </div>

                            <p className="text-zinc-400 leading-8 max-w-3xl">

                              {t(
                                notification.message,
                                notification.message_am ||
                                  notification.message
                              )}

                            </p>

                            <div className="mt-4 text-sm text-zinc-500 flex items-center gap-2">

                              <Clock3 size={16} />

                              {new Date(
                                notification.created_at ||
                                  ""
                              ).toLocaleString()}

                            </div>

                          </div>

                        </div>

                        <div className="flex items-center gap-3 text-cyan-400 font-black">

                          {t(
                            "Open",
                            "ክፈት"
                          )}

                          <ArrowUpRight size={20} />

                        </div>

                      </div>

                    </Link>
                  );
                }
              )}

            </div>
          )}

        </div>

      </section>

      {/* ENTERPRISE AI */}

      <section className="border-t border-zinc-800">

        <div className="max-w-7xl mx-auto px-4 py-20">

          <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-[40px] p-10">

            <div className="flex flex-col md:flex-row gap-10 md:items-center md:justify-between">

              <div className="max-w-3xl">

                <div className="text-cyan-400 font-black tracking-widest mb-4">

                  {t(
                    "AI AUTOMATION",
                    "AI አውቶሜሽን"
                  )}

                </div>

                <h2 className="text-4xl font-black mb-6">

                  {t(
                    "Autonomous Event Intelligence",
                    "ራስ ሰር የAI ማሳወቂያ ስርዓት"
                  )}

                </h2>

                <p className="text-zinc-300 text-lg leading-8">

                  {t(
                    "EML continuously monitors marketplace activity and automatically delivers intelligent notifications to users.",
                    "EML የገበያ እንቅስቃሴዎችን በቀጥታ በመከታተል የAI ማሳወቂያዎችን ያቀርባል።"
                  )}

                </p>

              </div>

              <div className="w-28 h-28 rounded-[32px] bg-green-500/20 flex items-center justify-center">

                <CheckCircle2
                  size={60}
                  className="text-green-400"
                />

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  color,
}: any) {
  const colorMap: any = {
    cyan: "text-cyan-400 bg-cyan-500/10",

    orange:
      "text-orange-400 bg-orange-500/10",

    violet:
      "text-violet-400 bg-violet-500/10",

    green:
      "text-green-400 bg-green-500/10",

    yellow:
      "text-yellow-400 bg-yellow-500/10",
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

      <div className="flex items-center justify-between mb-6">

        <div
          className={`w-16 h-16 rounded-3xl flex items-center justify-center ${colorMap[color]}`}
        >
          <Icon />
        </div>

        <Star className="text-zinc-600" />

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