"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Lock,
  Wallet,
  CheckCircle2,
  ArrowRight,
  Landmark,
  Clock3,
} from "lucide-react";

export default function EscrowPage() {
  const steps = [
    {
      icon: <Wallet size={22} />,
      title: "Buyer Deposits Payment",
      desc: "Funds are securely held while seller prepares machinery.",
    },
    {
      icon: <CheckCircle2 size={22} />,
      title: "Seller Delivers Machine",
      desc: "Inspection, handover or verified logistics delivery occurs.",
    },
    {
      icon: <ShieldCheck size={22} />,
      title: "Buyer Confirms",
      desc: "Once approved, payment is released to seller.",
    },
    {
      icon: <Landmark size={22} />,
      title: "EML Releases Funds",
      desc: "Fast payout with transaction record and trust guarantee.",
    },
  ];

  const benefits = [
    "Reduce fraud and fake buyers",
    "Increase confidence for large deals",
    "Faster closing of high-value transactions",
    "Safer nationwide machinery trade",
    "Commission revenue for EML",
    "Professional records for both parties",
  ];

  const plans = [
    {
      name: "Starter",
      fee: "2%",
      desc: "For deals under ETB 500K",
      color: "border-slate-200",
    },
    {
      name: "Business",
      fee: "1.5%",
      desc: "For deals ETB 500K+",
      color: "border-yellow-500",
    },
    {
      name: "Enterprise",
      fee: "Custom",
      desc: "Bulk / fleet / tenders",
      color: "border-emerald-500",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">

      {/* HERO */}
      <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-yellow-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-sm font-bold">
                🔒 Secure Transactions for Ethiopia
              </div>

              <h1 className="mt-6 text-5xl md:text-7xl font-black leading-tight">
                Payment
                <span className="block text-yellow-400">
                  Escrow V2
                </span>
              </h1>

              <p className="mt-6 text-lg text-white/80 leading-8 max-w-xl">
                Protect buyers and sellers with secure fund holding,
                verified delivery and trusted payout release.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/payments"
                  className="px-8 py-4 rounded-2xl bg-yellow-500 text-black font-black hover:bg-yellow-400"
                >
                  Start Escrow
                </Link>

                <Link
                  href="/browse"
                  className="px-8 py-4 rounded-2xl border border-white/20 font-bold"
                >
                  Browse Machines
                </Link>
              </div>
            </div>

            {/* Trust Card */}
            <div className="bg-white text-black rounded-3xl p-8 shadow-2xl">
              <div className="grid grid-cols-2 gap-5">

                <div className="rounded-2xl bg-slate-100 p-5">
                  <div className="text-3xl font-black text-yellow-700">
                    ETB 25M+
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Protected Transactions
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5">
                  <div className="text-3xl font-black text-emerald-700">
                    99%
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Secure Completion Rate
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5">
                  <div className="text-3xl font-black text-slate-900">
                    24h
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Release Speed
                  </p>
                </div>

                <div className="rounded-2xl bg-slate-100 p-5">
                  <div className="text-3xl font-black text-slate-900">
                    100%
                  </div>
                  <p className="text-sm text-slate-500 mt-2">
                    Recorded Deals
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-12">
          How Escrow Works
        </h2>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border p-7 shadow-sm hover:shadow-xl transition"
            >
              <div className="w-14 h-14 rounded-2xl bg-yellow-100 text-yellow-700 flex items-center justify-center">
                {step.icon}
              </div>

              <h3 className="text-xl font-black mt-5">
                {step.title}
              </h3>

              <p className="text-slate-500 mt-3 leading-7">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-white border-y">
        <div className="max-w-7xl mx-auto px-4 py-16 grid lg:grid-cols-2 gap-10">

          <div>
            <h2 className="text-4xl font-black">
              Why Buyers & Sellers Use Escrow
            </h2>

            <div className="mt-8 space-y-4">
              {benefits.map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-2xl border p-4"
                >
                  <CheckCircle2
                    size={20}
                    className="text-emerald-600 mt-1 shrink-0"
                  />

                  <span className="font-semibold">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 rounded-3xl border p-8">
            <h3 className="text-3xl font-black">
              Security Promise
            </h3>

            <div className="mt-6 space-y-5">

              <div className="flex gap-3">
                <Lock className="text-yellow-700 shrink-0 mt-1" />
                <p className="text-slate-600">
                  Funds held until delivery conditions are met.
                </p>
              </div>

              <div className="flex gap-3">
                <ShieldCheck className="text-yellow-700 shrink-0 mt-1" />
                <p className="text-slate-600">
                  Verified records for both parties.
                </p>
              </div>

              <div className="flex gap-3">
                <Clock3 className="text-yellow-700 shrink-0 mt-1" />
                <p className="text-slate-600">
                  Fast dispute review and payout workflow.
                </p>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* PRICING */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-4xl font-black text-center mb-12">
          Escrow Pricing
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan, i) => (
            <div
              key={i}
              className={`bg-white rounded-3xl border-2 ${plan.color} p-8 shadow-sm`}
            >
              <h3 className="text-2xl font-black">
                {plan.name}
              </h3>

              <div className="text-5xl font-black mt-5">
                {plan.fee}
              </div>

              <p className="text-slate-500 mt-4">
                {plan.desc}
              </p>

              <Link
                href="/payments"
                className="mt-8 inline-flex items-center gap-2 font-black text-yellow-700"
              >
                Choose Plan <ArrowRight size={18} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="rounded-3xl bg-gradient-to-r from-black to-yellow-700 text-white p-12 text-center">
          <h3 className="text-4xl md:text-5xl font-black">
            Close Bigger Deals with Confidence
          </h3>

          <p className="mt-4 text-white/80 max-w-2xl mx-auto">
            Use EML Escrow to protect machinery transactions and build trust nationwide.
          </p>

          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Link
              href="/payments"
              className="px-8 py-4 rounded-2xl bg-white text-black font-black"
            >
              Start Escrow
            </Link>

            <Link
              href="/premium"
              className="px-8 py-4 rounded-2xl border border-white/20 font-bold"
            >
              Premium Seller
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}