"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

type Tab = "dashboard" | "listings" | "users" | "requests" | "payments" | "escrow" | "fraud" | "audit";

type Listing = {
  id: string; brand: string; model: string; status: string;
  category_token: string; location: string; created_at: string;
  title_en: string; price_sale: number; price_rental_daily: number;
  is_rental_only: boolean; owner_id: string;
};

type User = {
  id: string; full_name: string; email: string; phone: string;
  role: string; is_admin: boolean; is_premium: boolean;
  created_at: string; suspended?: boolean;
};

type Request = {
  id: string; title: string; category: string; city: string;
  budget: number; status: string; created_at: string; user_id: string;
};

type Payment = {
  id: string; payer_name: string; amount: number; reference_no: string;
  status: string; created_at: string; method?: string;
};

type EscrowRecord = {
  id: string; amount: number; status: string; created_at: string;
  buyer_id: string; seller_id: string; listing_id: string;
};

type AuditLog = {
  id: string; action: string; target_type: string; target_id: string;
  reason: string; admin_id: string; admin_email: string; created_at: string;
};

type Stats = {
  totalUsers: number; pendingListings: number; activeListings: number;
  pendingPayments: number; openRequests: number; escrowFunds: number;
  suspendedUsers: number; rejectedListings: number;
};

function Badge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    verified_available: "bg-green-500/20 text-green-400 border-green-500/30",
    active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    rejected: "bg-red-500/20 text-red-400 border-red-500/30",
    suspended: "bg-red-900/40 text-red-300 border-red-700/30",
    approved: "bg-green-500/20 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    funded: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    released: "bg-green-500/20 text-green-400 border-green-500/30",
    open: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    escrow_funded: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    closed: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
    refunded: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${colors[status] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

function ConfirmModal({ action, onConfirm, onCancel }: {
  action: string; onConfirm: (reason: string) => void; onCancel: () => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full">
        <h3 className="text-white font-black text-lg mb-2">Confirm: {action}</h3>
        <p className="text-zinc-400 text-sm mb-4">This action is permanent and will be logged in the audit trail.</p>
        <textarea
          value={reason}
          onChange={e => setReason(e.target.value)}
          placeholder="Reason for this action (required)..."
          className="w-full bg-black border border-zinc-700 rounded-xl px-4 py-3 text-white text-sm mb-4 min-h-[80px] resize-none outline-none focus:border-amber-500"
        />
        <div className="flex gap-3">
          <button
            onClick={() => reason.trim() && onConfirm(reason)}
            disabled={!reason.trim()}
            className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-black rounded-xl text-sm transition-all"
          >
            Confirm
          </button>
          <button onClick={onCancel} className="flex-1 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl text-sm transition-all">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminControlCenter() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("dashboard");
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, pendingListings: 0, activeListings: 0,
    pendingPayments: 0, openRequests: 0, escrowFunds: 0,
    suspendedUsers: 0, rejectedListings: 0,
  });
  const [listings, setListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [escrows, setEscrows] = useState<EscrowRecord[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [confirm, setConfirm] = useState<{ action: string; onConfirm: (r: string) => void } | null>(null);
  const [adminId, setAdminId] = useState("");
  const [adminEmail, setAdminEmail] = useState("");

  useEffect(() => {
    async function checkAuth() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/founder-login"); return; }
      const { data } = await supabase.from("users").select("is_admin").eq("id", user.id).maybeSingle();
      if (!data?.is_admin) { router.push("/"); return; }
      setAdminId(user.id);
      setAdminEmail(user.email || "");
      setAuthorized(true);
      setChecking(false);
    }
    checkAuth();
  }, [router]);

  const logAction = useCallback(async (action: string, targetType: string, targetId: string, reason: string) => {
    await supabase.from("admin_audit_log").insert([{
      action, target_type: targetType, target_id: targetId,
      reason, admin_id: adminId, admin_email: adminEmail
    }]);
  }, [adminId, adminEmail]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const loadStats = useCallback(async () => {
    const [
      { count: totalUsers },
      { count: pendingListings },
      { count: activeListings },
      { count: suspendedUsers },
      { count: rejectedListings },
      { count: openRequests },
      { count: pendingPayments },
    ] = await Promise.all([
      supabase.from("users").select("*", { count: "exact", head: true }),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "pending_review"),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "verified_available"),
      supabase.from("users").select("*", { count: "exact", head: true }).eq("suspended", true),
      supabase.from("listings").select("*", { count: "exact", head: true }).eq("status", "rejected"),
      supabase.from("requests").select("*", { count: "exact", head: true }).eq("status", "active"),
      supabase.from("payments").select("*", { count: "exact", head: true }).eq("status", "pending"),
    ]);
    const { data: escrowData } = await supabase.from("escrow").select("amount").eq("status", "funded");
    const escrowFunds = escrowData?.reduce((sum, e) => sum + Number(e.amount), 0) || 0;
    setStats({
      totalUsers: totalUsers || 0, pendingListings: pendingListings || 0,
      activeListings: activeListings || 0, suspendedUsers: suspendedUsers || 0,
      rejectedListings: rejectedListings || 0, openRequests: openRequests || 0,
      pendingPayments: pendingPayments || 0, escrowFunds,
    });
  }, []);

  const loadListings = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("listings").select("*").order("created_at", { ascending: false }).limit(100);
    setListings(data || []);
    setLoading(false);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("users").select("*").order("created_at", { ascending: false }).limit(100);
    setUsers(data || []);
    setLoading(false);
  }, []);

  const loadRequests = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("requests").select("*").order("created_at", { ascending: false }).limit(100);
    setRequests(data || []);
    setLoading(false);
  }, []);

  const loadPayments = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("payments").select("*").order("created_at", { ascending: false }).limit(100);
    setPayments(data || []);
    setLoading(false);
  }, []);

  const loadEscrows = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("escrow").select("*").order("created_at", { ascending: false }).limit(100);
    setEscrows(data || []);
    setLoading(false);
  }, []);

  const loadAuditLogs = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(200);
    setAuditLogs(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!authorized) return;
    loadStats();
    if (tab === "listings") loadListings();
    if (tab === "users") loadUsers();
    if (tab === "requests") loadRequests();
    if (tab === "payments") loadPayments();
    if (tab === "escrow") loadEscrows();
    if (tab === "audit") loadAuditLogs();
  }, [authorized, tab, loadStats, loadListings, loadUsers, loadRequests, loadPayments, loadEscrows, loadAuditLogs]);

  const listingAction = (action: string, id: string, status: string) => {
    setConfirm({
      action: `${action} listing`,
      onConfirm: async (reason) => {
        await supabase.from("listings").update({ status }).eq("id", id);
        await logAction(action, "listing", id, reason);
        showToast(`Listing ${action} successfully`);
        setConfirm(null);
        loadListings();
        loadStats();
      }
    });
  };

  const deleteListing = (id: string) => {
    setConfirm({
      action: "DELETE listing permanently",
      onConfirm: async (reason) => {
        await supabase.from("listings").delete().eq("id", id);
        await logAction("DELETE", "listing", id, reason);
        showToast("Listing permanently deleted");
        setConfirm(null);
        loadListings();
        loadStats();
      }
    });
  };

  const suspendUser = (id: string) => {
    setConfirm({
      action: "SUSPEND user",
      onConfirm: async (reason) => {
        await supabase.from("users").update({ suspended: true, role: "suspended" }).eq("id", id);
        await logAction("SUSPEND", "user", id, reason);
        showToast("User suspended");
        setConfirm(null);
        loadUsers();
        loadStats();
      }
    });
  };

  const reinstateUser = async (id: string) => {
    await supabase.from("users").update({ suspended: false }).eq("id", id);
    await logAction("REINSTATE", "user", id, "Admin reinstated user");
    showToast("User reinstated");
    loadUsers();
  };

  const deleteUser = (id: string) => {
    setConfirm({
      action: "DELETE user permanently",
      onConfirm: async (reason) => {
        await supabase.from("users").delete().eq("id", id);
        await logAction("DELETE_USER", "user", id, reason);
        showToast("User permanently deleted");
        setConfirm(null);
        loadUsers();
        loadStats();
      }
    });
  };

  const makeAdmin = async (id: string) => {
    await supabase.from("users").update({ is_admin: true }).eq("id", id);
    await logAction("PROMOTE_ADMIN", "user", id, "Promoted to admin by founder");
    showToast("User promoted to admin");
    loadUsers();
  };

  const revokeAdmin = (id: string) => {
    setConfirm({
      action: "REVOKE admin access",
      onConfirm: async (reason) => {
        await supabase.from("users").update({ is_admin: false }).eq("id", id);
        await logAction("REVOKE_ADMIN", "user", id, reason);
        showToast("Admin access revoked");
        setConfirm(null);
        loadUsers();
      }
    });
  };

  const requestAction = (action: string, id: string, status: string) => {
    setConfirm({
      action: `${action} request`,
      onConfirm: async (reason) => {
        await supabase.from("requests").update({ status }).eq("id", id);
        await logAction(action, "request", id, reason);
        showToast(`Request ${action}`);
        setConfirm(null);
        loadRequests();
      }
    });
  };

  const approvePayment = (id: string) => {
    setConfirm({
      action: "APPROVE payment",
      onConfirm: async (reason) => {
        await supabase.from("payments").update({ status: "approved" }).eq("id", id);
        await logAction("APPROVE_PAYMENT", "payment", id, reason);
        showToast("Payment approved");
        setConfirm(null);
        loadPayments();
        loadStats();
      }
    });
  };

  const rejectPayment = (id: string) => {
    setConfirm({
      action: "REJECT payment",
      onConfirm: async (reason) => {
        await supabase.from("payments").update({ status: "rejected" }).eq("id", id);
        await logAction("REJECT_PAYMENT", "payment", id, reason);
        showToast("Payment rejected");
        setConfirm(null);
        loadPayments();
      }
    });
  };

  const releaseEscrow = (id: string) => {
    setConfirm({
      action: "RELEASE escrow funds to seller",
      onConfirm: async (reason) => {
        await supabase.from("escrow").update({ status: "released" }).eq("id", id);
        await logAction("RELEASE_ESCROW", "escrow", id, reason);
        showToast("Escrow released to seller");
        setConfirm(null);
        loadEscrows();
        loadStats();
      }
    });
  };

  const refundEscrow = (id: string) => {
    setConfirm({
      action: "REFUND escrow to buyer",
      onConfirm: async (reason) => {
        await supabase.from("escrow").update({ status: "refunded" }).eq("id", id);
        await logAction("REFUND_ESCROW", "escrow", id, reason);
        showToast("Escrow refunded to buyer");
        setConfirm(null);
        loadEscrows();
      }
    });
  };

  const tabs: { id: Tab; label: string; icon: string; alert?: number }[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "listings", label: "Listings", icon: "🏗", alert: stats.pendingListings },
    { id: "users", label: "Users", icon: "👥" },
    { id: "requests", label: "Requests", icon: "📋", alert: stats.openRequests },
    { id: "payments", label: "Payments", icon: "💳", alert: stats.pendingPayments },
    { id: "escrow", label: "Escrow", icon: "🔒" },
    { id: "fraud", label: "Fraud Control", icon: "🚨" },
    { id: "audit", label: "Audit Log", icon: "📜" },
  ];

  if (checking) return <div className="min-h-screen bg-black flex items-center justify-center text-white">Verifying access...</div>;
  if (!authorized) return null;

  return (
    <div className="min-h-screen bg-black text-white">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-xl font-bold shadow-2xl">
          ✓ {toast}
        </div>
      )}
      {confirm && (
        <ConfirmModal
          action={confirm.action}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div className="border-b border-zinc-900 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="EML" className="w-8 h-8 rounded-full" />
          <div>
            <p className="text-xs text-amber-500 font-black uppercase tracking-widest">EML Super Admin</p>
            <p className="text-white font-black text-lg leading-none">Control Center</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-500">Zero Tolerance Policy Active</span>
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
      </div>

      <div className="flex">
        <aside className="w-56 border-r border-zinc-900 min-h-screen p-4 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  tab === t.id ? "bg-amber-500 text-white" : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                }`}
              >
                <span className="flex items-center gap-2">{t.icon} {t.label}</span>
                {t.alert ? <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">{t.alert}</span> : null}
              </button>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-6 overflow-auto">
          {tab === "dashboard" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-white">System Overview</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Users", value: stats.totalUsers, color: "text-blue-400" },
                  { label: "Pending Listings", value: stats.pendingListings, color: "text-yellow-400" },
                  { label: "Active Listings", value: stats.activeListings, color: "text-green-400" },
                  { label: "Pending Payments", value: stats.pendingPayments, color: "text-amber-400" },
                  { label: "Open Requests", value: stats.openRequests, color: "text-cyan-400" },
                  { label: "Escrow (ETB)", value: stats.escrowFunds.toLocaleString(), color: "text-purple-400" },
                  { label: "Suspended Users", value: stats.suspendedUsers, color: "text-red-400" },
                  { label: "Rejected Listings", value: stats.rejectedListings, color: "text-red-300" },
                ].map(s => (
                  <div key={s.label} className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
                    <p className="text-zinc-500 text-xs uppercase font-bold">{s.label}</p>
                    <p className={`text-3xl font-black mt-1 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div className="bg-zinc-950 border border-red-900/30 rounded-xl p-5">
                <h3 className="text-red-400 font-black text-sm uppercase tracking-wider mb-3">🚨 Zero Tolerance Policy</h3>
                <ul className="text-zinc-400 text-sm space-y-1.5">
                  <li>• All listings require admin approval before going live</li>
                  <li>• User registrations are monitored for fraud signals</li>
                  <li>• All escrow transactions require admin release</li>
                  <li>• Every admin action is permanently logged with reason</li>
                  <li>• Suspicious accounts are auto-flagged for review</li>
                  <li>• Fake listings are permanently deleted, not just hidden</li>
                </ul>
              </div>
            </div>
          )}

          {tab === "listings" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">Machinery Listings</h2>
                <span className="text-zinc-500 text-sm">{listings.length} total</span>
              </div>
              {loading ? <p className="text-zinc-500">Loading...</p> : listings.map(l => (
                <div key={l.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-white">{l.brand} {l.model}</h4>
                        <Badge status={l.status} />
                      </div>
                      <p className="text-zinc-500 text-xs">{l.title_en || "No title"} • {l.category_token} • {l.location || "No location"}</p>
                      <p className="text-zinc-600 text-xs mt-1">ID: {l.id} • {new Date(l.created_at).toLocaleDateString()}</p>
                      <p className="text-amber-400 text-xs mt-1 font-bold">
                        {l.is_rental_only ? `ETB ${l.price_rental_daily?.toLocaleString()}/day` : `ETB ${l.price_sale?.toLocaleString()}`}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      <button onClick={() => listingAction("APPROVE", l.id, "verified_available")} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-lg">✓ Approve</button>
                      <button onClick={() => listingAction("REJECT", l.id, "rejected")} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-lg">✗ Reject</button>
                      <button onClick={() => listingAction("SUSPEND", l.id, "suspended")} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-lg">⏸ Suspend</button>
                      <button onClick={() => listingAction("PENDING", l.id, "pending_review")} className="px-3 py-1.5 bg-yellow-600 hover:bg-yellow-700 text-white text-xs font-black rounded-lg">⏳ Pending</button>
                      <button onClick={() => deleteListing(l.id)} className="px-3 py-1.5 bg-zinc-800 hover:bg-red-900 text-red-400 text-xs font-black rounded-lg border border-red-900/30">🗑 Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "users" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-black">User Management</h2>
                <span className="text-zinc-500 text-sm">{users.length} total</span>
              </div>
              {loading ? <p className="text-zinc-500">Loading...</p> : users.map(u => (
                <div key={u.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-white">{u.full_name || "Unknown"}</h4>
                        {u.is_admin && <span className="text-[10px] bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded-full font-black">ADMIN</span>}
                        {u.suspended && <Badge status="suspended" />}
                        {u.is_premium && <span className="text-[10px] bg-purple-500/20 text-purple-400 border border-purple-500/30 px-2 py-0.5 rounded-full font-black">PREMIUM</span>}
                      </div>
                      <p className="text-zinc-500 text-xs">{u.email} • {u.phone}</p>
                      <p className="text-zinc-600 text-xs mt-1">Role: {u.role} • Joined: {new Date(u.created_at).toLocaleDateString()}</p>
                      <p className="text-zinc-700 text-xs">ID: {u.id}</p>
                    </div>
                    <div className="flex flex-wrap gap-2 flex-shrink-0">
                      {!u.suspended
                        ? <button onClick={() => suspendUser(u.id)} className="px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white text-xs font-black rounded-lg">⏸ Suspend</button>
                        : <button onClick={() => reinstateUser(u.id)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-lg">↩ Reinstate</button>
                      }
                      {!u.is_admin
                        ? <button onClick={() => makeAdmin(u.id)} className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-black rounded-lg">⭐ Make Admin</button>
                        : <button onClick={() => revokeAdmin(u.id)} className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-black rounded-lg">✗ Revoke Admin</button>
                      }
                      <button onClick={() => deleteUser(u.id)} className="px-3 py-1.5 bg-zinc-800 hover:bg-red-900 text-red-400 text-xs font-black rounded-lg border border-red-900/30">🗑 Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "requests" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Sourcing Requests</h2>
              {loading ? <p className="text-zinc-500">Loading...</p> : requests.map(r => (
                <div key={r.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-white">{r.title}</h4>
                        <Badge status={r.status} />
                      </div>
                      <p className="text-zinc-500 text-xs">{r.category} • {r.city} • Budget: ETB {r.budget?.toLocaleString()}</p>
                      <p className="text-zinc-600 text-xs mt-1">{new Date(r.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => requestAction("APPROVE", r.id, "approved")} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-lg">✓ Approve</button>
                      <button onClick={() => requestAction("FLAG as FRAUD", r.id, "rejected")} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-lg">🚨 Fraud</button>
                      <button onClick={() => requestAction("CLOSE", r.id, "closed")} className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-white text-xs font-black rounded-lg">✗ Close</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "payments" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Payment Approvals</h2>
              {loading ? <p className="text-zinc-500">Loading...</p> : payments.length === 0 ? (
                <p className="text-zinc-500 text-sm">No payments found.</p>
              ) : payments.map(p => (
                <div key={p.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-white">{p.payer_name || "Unknown Payer"}</h4>
                        <Badge status={p.status} />
                      </div>
                      <p className="text-zinc-500 text-xs">Ref: {p.reference_no} • ETB {p.amount?.toLocaleString()} • {p.method || "Manual"}</p>
                      <p className="text-zinc-600 text-xs mt-1">{new Date(p.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button onClick={() => approvePayment(p.id)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-lg">✓ Approve</button>
                      <button onClick={() => rejectPayment(p.id)} className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-lg">✗ Reject</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "escrow" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Escrow Management</h2>
              <div className="bg-zinc-950 border border-purple-900/30 rounded-xl p-4">
                <p className="text-purple-400 text-sm font-black">⚠️ Only release funds after confirming on-site inspection is complete and both parties confirm delivery.</p>
              </div>
              {loading ? <p className="text-zinc-500">Loading...</p> : escrows.length === 0 ? (
                <p className="text-zinc-500 text-sm">No escrow records found.</p>
              ) : escrows.map(e => (
                <div key={e.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-black text-white">ETB {e.amount?.toLocaleString()}</h4>
                        <Badge status={e.status} />
                      </div>
                      <p className="text-zinc-500 text-xs">Listing: {e.listing_id}</p>
                      <p className="text-zinc-600 text-xs mt-1">{new Date(e.created_at).toLocaleDateString()}</p>
                    </div>
                    {e.status === "funded" && (
                      <div className="flex gap-2 flex-shrink-0">
                        <button onClick={() => releaseEscrow(e.id)} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-black rounded-lg">✓ Release to Seller</button>
                        <button onClick={() => refundEscrow(e.id)} className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-black rounded-lg">↩ Refund Buyer</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {tab === "fraud" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black text-red-400">🚨 Fraud Control Center</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-zinc-950 border border-red-900/30 rounded-xl p-5">
                  <h3 className="font-black text-white mb-3">Auto-Flag Triggers</h3>
                  <ul className="text-zinc-400 text-sm space-y-2">
                    <li className="flex items-center gap-2"><span className="text-red-400">●</span> Multiple listings from same IP within 1 hour</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">●</span> Price below 50% of market average</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">●</span> Duplicate phone numbers across accounts</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">●</span> Payment reference reused more than once</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">●</span> Account created and listing posted within 5 minutes</li>
                    <li className="flex items-center gap-2"><span className="text-red-400">●</span> No profile photo or unverified email</li>
                  </ul>
                </div>
                <div className="bg-zinc-950 border border-amber-900/30 rounded-xl p-5">
                  <h3 className="font-black text-white mb-3">Zero Tolerance Rules</h3>
                  <ul className="text-zinc-400 text-sm space-y-2">
                    <li className="flex items-center gap-2"><span className="text-amber-400">●</span> Fake listings → permanent deletion + account ban</li>
                    <li className="flex items-center gap-2"><span className="text-amber-400">●</span> Payment fraud → account deletion + report to CBE</li>
                    <li className="flex items-center gap-2"><span className="text-amber-400">●</span> Identity fraud → immediate suspension pending review</li>
                    <li className="flex items-center gap-2"><span className="text-amber-400">●</span> Repeat offenders → permanent IP block</li>
                    <li className="flex items-center gap-2"><span className="text-amber-400">●</span> Escrow manipulation → legal referral</li>
                  </ul>
                </div>
              </div>
              <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                <h3 className="font-black text-white mb-4">Quick Fraud Actions</h3>
                <div className="grid md:grid-cols-3 gap-3">
                  <button onClick={() => setTab("listings")} className="py-3 bg-red-900/30 border border-red-900/50 text-red-400 rounded-xl text-sm font-black hover:bg-red-900/50 transition-all">🗑 Review & Delete Fake Listings</button>
                  <button onClick={() => setTab("users")} className="py-3 bg-orange-900/30 border border-orange-900/50 text-orange-400 rounded-xl text-sm font-black hover:bg-orange-900/50 transition-all">⏸ Suspend Suspicious Users</button>
                  <button onClick={() => setTab("payments")} className="py-3 bg-yellow-900/30 border border-yellow-900/50 text-yellow-400 rounded-xl text-sm font-black hover:bg-yellow-900/50 transition-all">✗ Reject Fraudulent Payments</button>
                </div>
              </div>
            </div>
          )}

          {tab === "audit" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black">Audit Log</h2>
              <p className="text-zinc-500 text-sm">Every admin action is permanently recorded here.</p>
              {loading ? <p className="text-zinc-500">Loading...</p> : auditLogs.length === 0 ? (
                <p className="text-zinc-500 text-sm">No audit logs yet.</p>
              ) : auditLogs.map(log => (
                <div key={log.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-amber-500 font-black text-sm">{log.action}</span>
                        <span className="text-zinc-600 text-xs">on {log.target_type}</span>
                      </div>
                      <p className="text-zinc-400 text-xs">Reason: {log.reason}</p>
                      <p className="text-zinc-600 text-xs mt-1">By: {log.admin_email} • Target: {log.target_id}</p>
                    </div>
                    <p className="text-zinc-600 text-xs flex-shrink-0">{new Date(log.created_at).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}