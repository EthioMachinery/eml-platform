"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  Landmark,
  Smartphone,
  CreditCard,
  Clock3,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Star,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

type TransactionItem = {
  id: string;
  transaction_type: string;
  status: string;
  payment_method: string;
  amount: number;
  note?: string;
  created_at: string;
};

export default function WalletPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings (strictly typed to prevent implicit 'any' warnings)
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadWallet() {
    setLoading(true);
    try {
      const { data } = await supabase
        .from("wallet_transactions")
        .select("*")
        .order("created_at", { ascending: false });

      setTransactions(data || []);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  useEffect(() => {
    loadWallet();
  }, []);

  const balance = useMemo(() => {
    let total = 0;
    transactions.forEach((tx) => {
      const amount = Number(tx.amount || 0);
      if (tx.transaction_type === "withdrawal" || tx.transaction_type === "commission") {
        total -= amount;
      } else {
        total += amount;
      }
    });
    return total;
  }, [transactions]);

  function paymentIcon(method: string) {
    switch (method) {
      case "telebirr":
        return Smartphone;
      case "bank_transfer":
        return Landmark;
      case "mobile_banking":
        return CreditCard;
      default:
        return Wallet;
    }
  }

  function statusBadge(status: string) {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "failed":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-32">

      {/* HERO */}
      <section className="border-b border-zinc-800 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent">
        <div className="max-w-7xl mx-auto px-4 py-14">
          <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-10">
            
            <div>
              <div className="text-yellow-400 font-black tracking-[0.25em] mb-4">
                ታማኝ ማሽነሪ
              </div>

              <h1 className="text-5xl font-black leading-tight mb-4">
                Trustworthy Machinery
              </h1>

              <div className="text-2xl font-black text-yellow-400 mb-6">
                {t(
                  "Wallet & Revenue Center",
                  "የቦርሳ እና የገቢ ማዕከል"
                )}
              </div>

              <p className="text-zinc-400 text-lg max-w-3xl leading-9">
                {t(
                  "Manage machinery transactions, commissions, withdrawals, Telebirr transfers, bank transfers and platform earnings securely inside the TM ecosystem.",
                  "የማሽነሪ ግብይቶችን፣ ኮሚሽኖችን፣ የገንዘብ ማውጫዎችን፣ ቴሌብር እና ባንክ ክፍያዎችን በTM ስርዓት ውስጥ በደህንነት ያስተዳድሩ።"
                )}
              </p>
            </div>

            <div className="w-full xl:w-[420px] bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 shadow-2xl shadow-yellow-500/10">
              <div className="flex items-center justify-between mb-6">
                <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
                  <Wallet className="text-yellow-400" size={30} />
                </div>

                <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                  <ShieldCheck size={18} />
                  {t("Secure Wallet", "ደህንነቱ የተጠበቀ")}
                </div>
              </div>

              <div className="text-zinc-400 mb-2">
                {t("Available Balance", "ያለ ቀሪ ገንዘብ")}
              </div>

              <div className="text-5xl font-black text-yellow-400 mb-8">
                ETB {balance.toLocaleString()}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Link
                  href="/payment"
                  className="h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center justify-center transition"
                >
                  {t("Pay", "ክፍያ")}
                </Link>

                <Link
                  href="/payments/manual"
                  className="h-14 rounded-2xl bg-zinc-800 hover:bg-zinc-700 font-bold flex items-center justify-center transition"
                >
                  {t("Withdraw", "ገንዘብ ማውጣት")}
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* QUICK STATS */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-zinc-400 mb-2">
              {t("Total Transactions", "ጠቅላላ ግብይቶች")}
            </div>
            <div className="text-4xl font-black">
              {transactions.length}
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-zinc-400 mb-2">
              {t("Commission Engine", "የየኮሚሽን ስርዓት")}
            </div>
            <div className="text-green-400 font-black text-2xl">
              ACTIVE
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-zinc-400 mb-2">
              {t("Escrow", "ኤስክሮው")}
            </div>
            <div className="text-yellow-400 font-black text-2xl">
              OPTIONAL
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <div className="text-zinc-400 mb-2">
              {t("Payment Methods", "የየክፍያ መንገዶች")}
            </div>
            <div className="text-2xl font-black">
              Telebirr + Bank
            </div>
          </div>
        </div>
      </section>

      {/* TRANSACTIONS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="text-yellow-400 font-black tracking-widest mb-3">
              {t("TRANSACTION CENTER", "የየግብይት ማዕከል")}
            </div>
            <h2 className="text-4xl font-black">
              {t("Wallet Transactions", "የቦርሳ ግብይቶች")}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-36 rounded-3xl bg-zinc-900 animate-pulse" />
            ))}
          </div>
        ) : transactions.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-16 text-center">
            <div className="w-24 h-24 mx-auto rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mb-8">
              <Wallet className="text-yellow-400" size={40} />
            </div>

            <h3 className="text-3xl font-black mb-5">
              {t("No Transactions Yet", "እስካሁን ግብይት የለም")}
            </h3>

            <p className="text-zinc-400 max-w-2xl mx-auto leading-8 mb-10">
              {t(
                "Start buying, renting or posting machinery to activate the TM financial ecosystem.",
                "የTM የፋይናንስ ስርዓትን ለማስጀመር ማሽነሪ ይግዙ፣ ይከራዩ ወይም ይለጥፉ።"
              )}
            </p>

            <Link
              href="/browse"
              className="inline-flex items-center gap-3 bg-yellow-500 hover:bg-yellow-400 text-black px-8 h-14 rounded-2xl font-black transition"
            >
              {t("Open Marketplace", "ገበያውን ይክፈቱ")}
              <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {transactions.map((tx) => {
              const Icon = paymentIcon(tx.payment_method);
              const incoming = tx.transaction_type !== "withdrawal" && tx.transaction_type !== "commission";

              return (
                <div
                  key={tx.id}
                  className="bg-zinc-900 border border-zinc-800 hover:border-yellow-500/30 rounded-[32px] p-8 transition"
                >
                  <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-8">
                    
                    <div className="flex items-start gap-5">
                      <div
                        className={`w-16 h-16 rounded-3xl flex items-center justify-center ${
                          incoming ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {incoming ? <ArrowDownLeft size={30} /> : <ArrowUpRight size={30} />}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <div className="text-2xl font-black">
                            {tx.transaction_type || "Transaction"}
                          </div>
                          <div className={`px-4 py-1 rounded-full border text-sm font-bold ${statusBadge(tx.status)}`}>
                            {tx.status}
                          </div>
                        </div>

                        <div className="text-zinc-400 leading-8 max-w-3xl">
                          {tx.note || t("TM Machinery Ecosystem Transaction", "የTM የማሽነሪ ስርዓት ግብይት")}
                        </div>

                        <div className="flex flex-wrap items-center gap-6 mt-5 text-sm text-zinc-500">
                          <div className="flex items-center gap-2">
                            <Clock3 size={16} />
                            {new Date(tx.created_at).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Icon size={16} />
                            {tx.payment_method || "Telebirr"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="xl:text-right">
                      <div className={`text-4xl font-black ${incoming ? "text-green-400" : "text-red-400"}`}>
                        {incoming ? "+" : "-"} ETB {Number(tx.amount || 0).toLocaleString()}
                      </div>

                      <div className="mt-4 flex xl:justify-end">
                        {tx.status === "completed" ? (
                          <div className="flex items-center gap-2 text-green-400 text-sm font-bold">
                            <CheckCircle2 size={18} />
                            {t("Completed", "ተጠናቋል")}
                          </div>
                        ) : tx.status === "pending" ? (
                          <div className="flex items-center gap-2 text-yellow-400 text-sm font-bold">
                            <Clock3 size={18} />
                            {t("Pending", "በሂደት ላይ")}
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-red-400 text-sm font-bold">
                            <AlertTriangle size={18} />
                            {t("Attention Needed", "ማስተካከያ ያስፈልጋል")}
                          </div>
                        )}
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

    </main>
  );
}