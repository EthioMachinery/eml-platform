import { supabase } from "./supabaseClient";
import { AutomationEngine } from "./automationEngine";

export const DealEngine = {
  // =========================
  // APPROVE DEAL
  // =========================
  approveDeal: async (deal: any) => {
    const { error } = await supabase
      .from("deals")
      .update({
        status: "approved",
        payment_status: "pending",
        approved_at: new Date().toISOString(),
      })
      .eq("id", deal.id);

    if (!error) {
      await AutomationEngine.onDealApproved(deal);
    }
  },

  // =========================
  // REJECT DEAL
  // =========================
  rejectDeal: async (deal: any) => {
    await supabase
      .from("deals")
      .update({
        status: "rejected",
      })
      .eq("id", deal.id);
  },

  // =========================
  // SUBMIT PAYMENT
  // =========================
  submitPayment: async (deal: any, reference: string) => {
    const { error } = await supabase
      .from("deals")
      .update({
        payment_status: "submitted",
        payment_reference: reference,
        paid_at: new Date().toISOString(),
      })
      .eq("id", deal.id);

    if (!error) {
      await AutomationEngine.onPaymentSubmitted(deal);
    }
  },

  // =========================
  // VERIFY PAYMENT
  // =========================
  verifyPayment: async (deal: any) => {
    const { error } = await supabase
      .from("deals")
      .update({
        payment_status: "verified",
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", deal.id);

    if (!error) {
      await AutomationEngine.onPaymentVerified(deal);
    }
  },

  // =========================
  // COMMISSION
  // =========================
  calculateCommission: (price: number) => {
    const rate = 0.1;
    return price * rate;
  },
};