"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function FounderLoginPage() {
  const [phone, setPhone] =
    useState("+251911404186");

  const [otp, setOtp] =
    useState("");

  const [step, setStep] =
    useState<"phone" | "otp">(
      "phone"
    );

  async function sendCode() {
    await supabase.auth.signInWithOtp({
      phone,
    });

    setStep("otp");
  }

  async function verifyCode() {
    const { error } =
      await supabase.auth.verifyOtp({
        phone,
        token: otp,
        type: "sms",
      });

    if (!error) {
      window.location.href =
        "/admin";
    } else {
      alert("Invalid code");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="bg-white border rounded-xl p-8 max-w-md w-full">

        <h1 className="text-2xl font-bold mb-6 text-center">
          Founder Secure Login
        </h1>

        {step === "phone" && (
          <div className="space-y-4">

            <input
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="border rounded-lg px-4 py-3 w-full"
            />

            <button
              onClick={sendCode}
              className="bg-slate-900 text-white w-full py-3 rounded-lg"
            >
              Send OTP
            </button>

          </div>
        )}

        {step === "otp" && (
          <div className="space-y-4">

            <input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) =>
                setOtp(
                  e.target.value
                )
              }
              className="border rounded-lg px-4 py-3 w-full"
            />

            <button
              onClick={verifyCode}
              className="bg-green-600 text-white w-full py-3 rounded-lg"
            >
              Verify & Enter
            </button>

          </div>
        )}

      </div>
    </main>
  );
}