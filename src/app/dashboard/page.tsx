"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { DealEngine } from "@/lib/dealengine";
import { useLanguage } from "@/lib/LanguageContext";

export default function DashboardPage() {
  const { t } = useLanguage();

  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // =========================
  // INIT
  // =========================
  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);

    const { data: auth } = await supabase.auth.getUser();
    const currentUser = auth.user;

    if (!currentUser) {
      setLoading(false);
      return;
    }

    setUser(currentUser);

    // Fetch profile
    const { data: profileData } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", currentUser.id)
      .single();

    setProfile(profileData);

    // Fetch deals (buyer + provider)
    const { data: dealsData } = await supabase
      .from("deals")
      .select("*")
      .or(`requester_id.eq.${currentUser.id},provider_id.eq.${currentUser.id}`)
      .order("created_at", { ascending: false });

    setDeals(dealsData || []);
    setLoading(false);
  };

  const refresh = () => init();

  // =========================
  // ROLE CHECKS
  // =========================
  const isAdmin =
    profile?.role === "admin" || profile?.role === "super_admin";

  const isSuperAdmin = profile?.role === "super_admin";

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <div className="p-6">Loading dashboard...</div>;
  }

  if (!user) {
    return <div className="p-6">Please login</div>;
  }

  // =========================
  // UI
  // =========================
  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">
            {t.dashboard || "Dashboard"}
          </h1>
          <p className="text-gray-600 text-sm">
            Manage your deals, payments, and activity
          </p>
        </div>

        {/* DEAL LIST */}
        <div className="space-y-4">

          {deals.length === 0 && (
            <div className="bg-white p-6 rounded shadow text-center">
              No deals yet
            </div>
          )}

          {deals.map((deal) => {
            const isRequester = deal.requester_id === user.id;
            const isProvider = deal.provider_id === user.id;

            return (
              <div
                key={deal.id}
                className="bg-white p-5 rounded shadow border border-gray-200"
              >

                {/* TOP */}
                <div className="flex justify-between items-center mb-3">
                  <h2 className="font-bold text-lg">
                    Deal #{deal.id.slice(0, 6)}
                  </h2>

                  <span className="text-xs px-2 py-1 rounded bg-gray-200">
                    {deal.status}
                  </span>
                </div>

                {/* INFO */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-4">

                  <p><b>Price:</b> {deal.price} ETB</p>
                  <p><b>Commission:</b> {deal.commission} ETB</p>
                  <p><b>Payment:</b> {deal.payment_status}</p>
                  <p><b>Machine:</b> {deal.machine_id}</p>

                </div>

                {/* ACTIONS */}
                <div className="flex flex-wrap gap-2">

                  {/* PROVIDER ACTION */}
                  {isProvider && deal.status === "requested" && (
                    <>
                      <button
                        onClick={async () => {
                          await DealEngine.approveDeal(deal.id);
                          refresh();
                        }}
                        className="bg-blue-500 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>

                      <button
                        onClick={async () => {
                          await DealEngine.rejectDeal(deal.id);
                          refresh();
                        }}
                        className="bg-yellow-500 px-3 py-1 rounded"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* USER PAYMENT */}
                  {isRequester &&
                    deal.status === "approved" &&
                    deal.payment_status === "pending" && (
                      <button
                        onClick={() =>
                          (window.location.href = `/payment/${deal.id}`)
                        }
                        className="bg-black text-white px-3 py-1 rounded"
                      >
                        Pay Now
                      </button>
                    )}

                  {/* ADMIN VERIFY */}
                  {isAdmin &&
                    deal.payment_status === "submitted" && (
                      <button
                        onClick={async () => {
                          await DealEngine.verifyPayment(deal.id);
                          refresh();
                        }}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Verify Payment
                      </button>
                    )}

                  {/* SUPER ADMIN DELETE */}
                  {isSuperAdmin && (
                    <button
                      onClick={async () => {
                        await supabase
                          .from("deals")
                          .delete()
                          .eq("id", deal.id);
                        refresh();
                      }}
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  )}

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}