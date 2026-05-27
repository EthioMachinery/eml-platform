"use client";

import { useMemo, useState } from "react";

type PlanKey =
  | "free"
  | "pro"
  | "gold"
  | "enterprise";

type BillingCycle =
  | "monthly"
  | "yearly";

export default function MembershipPage() {
  const [billing, setBilling] =
    useState<BillingCycle>(
      "monthly"
    );

  const [selected, setSelected] =
    useState<PlanKey>(
      "free"
    );

  const plans = useMemo(
    () => [
      {
        key: "free",
        name: "Free",
        monthly: 0,
        yearly: 0,
        badge:
          "Starter",
        popular: false,
        features: [
          "Basic listings",
          "Standard search visibility",
          "Limited messages",
          "Basic support",
        ],
      },
      {
        key: "pro",
        name: "Pro",
        monthly: 999,
        yearly: 9990,
        badge:
          "Growth",
        popular: true,
        features: [
          "Priority listings",
          "Unlimited messages",
          "Lead inbox tools",
          "Seller analytics",
          "Verified badge request",
        ],
      },
      {
        key: "gold",
        name: "Gold",
        monthly: 2499,
        yearly: 24990,
        badge:
          "Best Value",
        popular: false,
        features: [
          "Boosted listings",
          "Top search ranking",
          "Advanced analytics",
          "Priority support",
          "Contract tools",
          "Escrow discounts",
        ],
      },
      {
        key: "enterprise",
        name: "Enterprise",
        monthly: 9999,
        yearly: 99990,
        badge:
          "Scale",
        popular: false,
        features: [
          "Multi-user accounts",
          "Team controls",
          "Dedicated manager",
          "Custom reports",
          "API access",
          "White-glove onboarding",
        ],
      },
    ],
    []
  );

  const currency =
    "ETB";

  function priceOf(
    plan: any
  ) {
    return billing ===
      "monthly"
      ? plan.monthly
      : plan.yearly;
  }

  return (
    <main className="min-h-screen bg-black text-white px-6 py-10">
      <div className="max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-cyan-400 via-green-500 to-yellow-500 bg-clip-text text-transparent">
            Membership Revenue Pack
          </h1>

          <p className="text-zinc-400 text-xl">
            Recurring subscriptions for sellers,
            fleets and enterprise clients.
          </p>
        </div>

        {/* BILLING TOGGLE */}
        <div className="flex justify-center mb-10">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-2 flex gap-2">
            <button
              onClick={() =>
                setBilling(
                  "monthly"
                )
              }
              className={`px-5 py-2 rounded-xl font-bold ${
                billing ===
                "monthly"
                  ? "bg-green-600"
                  : "bg-zinc-800"
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() =>
                setBilling(
                  "yearly"
                )
              }
              className={`px-5 py-2 rounded-xl font-bold ${
                billing ===
                "yearly"
                  ? "bg-green-600"
                  : "bg-zinc-800"
              }`}
            >
              Yearly
            </button>
          </div>
        </div>

        {/* PLANS */}
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-5">

          {plans.map(
            (plan: any) => {
              const active =
                selected ===
                plan.key;

              return (
                <div
                  key={plan.key}
                  className={`rounded-3xl border p-6 ${
                    active
                      ? "bg-zinc-800 border-green-600"
                      : "bg-zinc-900 border-zinc-800"
                  }`}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-black">
                      {plan.name}
                    </h2>

                    <span className="text-xs px-3 py-1 rounded-full bg-zinc-700">
                      {plan.badge}
                    </span>
                  </div>

                  {plan.popular && (
                    <div className="mb-4 text-green-400 font-bold text-sm">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-5">
                    <span className="text-4xl font-black">
                      {priceOf(
                        plan
                      ).toLocaleString()}
                    </span>

                    <span className="text-zinc-400 ml-2">
                      {currency}/
                      {billing ===
                      "monthly"
                        ? "mo"
                        : "yr"}
                    </span>
                  </div>

                  <ul className="space-y-2 mb-6 text-zinc-300">
                    {plan.features.map(
                      (
                        f: string,
                        i:number
                      ) => (
                        <li
                          key={i}
                        >
                          ✓ {f}
                        </li>
                      )
                    )}
                  </ul>

                  <button
                    onClick={() =>
                      setSelected(
                        plan.key
                      )
                    }
                    className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-2xl font-bold"
                  >
                    {active
                      ? "Selected"
                      : "Choose Plan"}
                  </button>
                </div>
              );
            }
          )}

        </div>

        {/* FOOTER */}
        <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <p className="text-xl font-bold mb-2">
            Revenue Benefits
          </p>

          <p className="text-zinc-400">
            Predictable monthly recurring revenue,
            premium user upgrades, stronger retention,
            higher valuation multiples.
          </p>
        </div>

      </div>
    </main>
  );
}