"use client";

import React from "react";
import { useTranslate } from "@/hooks/useTranslate";

export default function DashboardPage() {
  const { t } = useTranslate();

  // Temporary local mock user session (linked easily to dynamic Auth providers like Supabase later)
  const mockUser = {
    email: "operator@ethiomachinery.com",
    role: "Verified Supplier"
  };

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-dashboard-page">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Localized Page Header */}
        <header className="border-b border-zinc-900 pb-5">
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            {t("dashboard.title")}
          </h1>
        </header>

        {/* Dashboard Dynamic Card */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 sm:p-8 max-w-lg shadow-sm">
          <div className="space-y-6">
            
            {/* Session Info */}
            <div className="space-y-1">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest block">
                {t("dashboard.loggedInAs")}
              </span>
              <p className="text-lg font-bold text-zinc-200">
                {mockUser.email}
              </p>
            </div>

            {/* Account Role Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500/10 text-amber-500 text-xs font-bold uppercase tracking-wider border border-amber-500/20">
              🛡️ {mockUser.role}
            </div>

            {/* Action Buttons Container */}
            <div className="pt-4 border-t border-zinc-900">
              <button
                type="button"
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm"
                onClick={() => alert("Mock Logout initiated")}
              >
                {t("dashboard.logout")}
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}