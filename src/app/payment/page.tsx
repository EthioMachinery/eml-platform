"use client";

import { useState } from "react";

import {
  CreditCard,
  Landmark,
  Smartphone,
  ShieldCheck,
} from "lucide-react";

import { useSearchParams } from "next/navigation";

import { createTransaction } from "@/lib/revenue";

import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export default function PaymentPage() {
  const { user } = useAuth();

  const { t } = useLanguage();

  const params =
    useSearchParams();

  const machineryId =
    params.get("machinery");

  const sellerId =
    params.get("seller");

  const amount =
    Number(
      params.get("amount")
    ) || 0;

  const type =
    params.get("type") ||
    "machinery_sale";

  const [method, setMethod] =
    useState("telebirr");

  const [loading, setLoading] =
    useState(false);

  async function payNow() {
    if (!user) return;

    setLoading(true);

    const tx =
      await createTransaction({
        buyerId: user.id,
        sellerId:
          sellerId || "",

        machineryId:
          machineryId || "",

        totalAmount: amount,

        transactionType:
          type as any,

        paymentMethod:
          method,
      });

    if (tx) {
      alert(
        "Transaction Created Successfully"
      );

      window.location.href =
        "/dashboard";
    }

    setLoading(false);
  }

  const methods = [
    {
      key: "telebirr",
      label: "Telebirr",
      icon: Smartphone,
    },

    {
      key: "bank_transfer",
      label: "Bank Transfer",
      icon: Landmark,
    },

    {
      key: "mobile_banking",
      label: "Mobile Banking",
      icon: CreditCard,
    },
  ];

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      <section className="max-w-3xl mx-auto px-4 py-16">

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

          <div className="flex items-center gap-4 mb-8">

            <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">

              <ShieldCheck className="text-yellow-400" />

            </div>

            <div>

              <div className="text-yellow-400 font-black tracking-widest">
                EML PAYMENT
              </div>

              <h1 className="text-4xl font-black">
                {t(
                  "Secure Checkout",
                  "ደህንነቱ የተጠበቀ ክፍያ"
                )}
              </h1>

            </div>

          </div>

          <div className="bg-zinc-950 rounded-3xl p-8 border border-zinc-800 mb-8">

            <div className="text-zinc-400 mb-2">
              {t(
                "Total Amount",
                "ጠቅላላ ክፍያ"
              )}
            </div>

            <div className="text-5xl font-black text-yellow-400">
              ETB {amount}
            </div>

          </div>

          <div className="space-y-4 mb-10">

            {methods.map((item) => {
              const Icon =
                item.icon;

              return (
                <button
                  key={item.key}
                  onClick={() =>
                    setMethod(
                      item.key
                    )
                  }
                  className={`w-full h-20 rounded-3xl border px-6 flex items-center justify-between transition ${
                    method ===
                    item.key
                      ? "border-yellow-400 bg-yellow-500/10"
                      : "border-zinc-800 bg-zinc-950"
                  }`}
                >

                  <div className="flex items-center gap-4">

                    <Icon
                      size={28}
                    />

                    <div className="font-black text-xl">
                      {item.label}
                    </div>

                  </div>

                  {method ===
                    item.key && (
                    <div className="w-5 h-5 rounded-full bg-yellow-400" />
                  )}

                </button>
              );
            })}

          </div>

          <button
            onClick={payNow}
            disabled={loading}
            className="w-full h-16 rounded-3xl bg-yellow-500 hover:bg-yellow-400 text-black font-black text-xl transition"
          >
            {loading
              ? t(
                  "Processing...",
                  "በሂደት ላይ..."
                )
              : t(
                  "Complete Payment",
                  "ክፍያውን ያጠናቅቁ"
                )}
          </button>

        </div>

      </section>

    </main>
  );
}