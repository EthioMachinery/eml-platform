import { supabase } from "./supabaseClient";
import { AIEngine } from "./aiEngine";

export const AutomationEngine = {
  // =========================
  // NOTIFICATION CREATOR
  // =========================
  notify: async (userId: string, message: string) => {
    return await supabase.from("notifications").insert({
      user_id: userId,
      message,
    });
  },

  // =========================
  // GET ADMINS
  // =========================
  getAdmins: async () => {
    const { data } = await supabase
      .from("profiles")
      .select("id")
      .in("role", ["admin", "super_admin"]);

    return data || [];
  },

  // =========================
  // ON DEAL CREATED
  // =========================
  onDealCreated: async (deal: any) => {
    if (!deal?.provider_id) return;

    await AutomationEngine.notify(
      deal.provider_id,
      "📩 New deal request received"
    );
  },

  // =========================
  // ON DEAL APPROVED
  // =========================
  onDealApproved: async (deal: any) => {
    if (!deal?.requester_id) return;

    await AutomationEngine.notify(
      deal.requester_id,
      "✅ Your deal has been approved. Please proceed to payment."
    );
  },

  // =========================
  // ON PAYMENT SUBMITTED
  // =========================
  onPaymentSubmitted: async (deal: any) => {
    if (!deal) return;

    // Notify provider
    if (deal.provider_id) {
      await AutomationEngine.notify(
        deal.provider_id,
        "💰 Payment submitted by user"
      );
    }

    // Notify admins
    const admins = await AutomationEngine.getAdmins();

    for (const admin of admins) {
      await AutomationEngine.notify(
        admin.id,
        "🔍 Payment needs verification"
      );
    }
  },

  // =========================
  // ON PAYMENT VERIFIED
  // =========================
  onPaymentVerified: async (deal: any) => {
    if (!deal) return;

    if (deal.requester_id) {
      await AutomationEngine.notify(
        deal.requester_id,
        "🎉 Payment verified. Deal completed."
      );
    }

    if (deal.provider_id) {
      await AutomationEngine.notify(
        deal.provider_id,
        "🎉 Payment verified. Deal completed."
      );
    }
  },

  // =========================
  // AUTO APPROVAL
  // =========================
  autoApprove: async (deal: any) => {
    if (!deal) return;

    const risk = AIEngine.detectFraud(deal);

    if (risk === "SAFE" && deal.price && deal.price < 500000) {
      const { error } = await supabase
        .from("deals")
        .update({
          status: "approved",
          approved_at: new Date().toISOString(),
        })
        .eq("id", deal.id);

      if (!error) {
        await AutomationEngine.onDealApproved(deal);
      }
    }
  },

  // =========================
  // FRAUD CHECK
  // =========================
  fraudCheck: async (deal: any) => {
    if (!deal) return;

    const risk = AIEngine.detectFraud(deal);

    if (risk === "HIGH RISK") {
      const admins = await AutomationEngine.getAdmins();

      for (const admin of admins) {
        await AutomationEngine.notify(
          admin.id,
          "🚨 High-risk deal detected"
        );
      }
    }
  },
};