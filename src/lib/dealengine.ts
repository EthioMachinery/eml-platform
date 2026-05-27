// =============================================
// FILE: src/lib/dealEngine.ts
// FULL ENTERPRISE EML DEAL ENGINE
// ETHIO MACHINERY LINK (EML)
// =============================================

import { supabase } from "@/lib/supabaseClient";

// =============================================
// TYPES
// =============================================

export type DealType =
  | "sale"
  | "rental"
  | "transport"
  | "operator"
  | "mechanic"
  | "insurance"
  | "financing"
  | "parts"
  | "service";

export type DealStatus =
  | "lead"
  | "negotiation"
  | "quoted"
  | "awaiting_payment"
  | "payment_review"
  | "paid"
  | "logistics_assigned"
  | "operator_assigned"
  | "in_transit"
  | "active"
  | "completed"
  | "cancelled"
  | "disputed";

export type PaymentMethod =
  | "telebirr"
  | "bank_transfer"
  | "mobile_banking"
  | "cash"
  | "manual";

export interface CreateDealInput {
  dealType: DealType;

  machineryId?: string;

  buyerId: string;

  sellerId: string;

  amount: number;

  commissionRate?: number;

  currency?: string;

  title?: string;

  description?: string;

  paymentMethod?: PaymentMethod;

  escrowEnabled?: boolean;

  transportRequired?: boolean;

  operatorRequired?: boolean;

  insuranceRequired?: boolean;

  financingRequired?: boolean;

  metadata?: any;
}

export interface UpdateDealStatusInput {
  dealId: string;

  status: DealStatus;

  note?: string;
}

// =============================================
// CONFIGURATION
// =============================================

export const DEAL_COMMISSION_RATES = {
  sale: 0.03,
  rental: 0.05,
  transport: 0.07,
  operator: 0.08,
  mechanic: 0.08,
  insurance: 0.1,
  financing: 0.12,
  parts: 0.06,
  service: 0.08,
};

// =============================================
// HELPERS
// =============================================

function generateDealCode() {
  return `EML-${Date.now()}-${Math.floor(
    Math.random() * 9999
  )}`;
}

function calculateCommission(
  amount: number,
  rate: number
) {
  return Number((amount * rate).toFixed(2));
}

// =============================================
// CREATE DEAL
// =============================================

export async function createDeal(
  input: CreateDealInput
) {
  try {
    const commissionRate =
      input.commissionRate ||
      DEAL_COMMISSION_RATES[input.dealType];

    const commissionAmount =
      calculateCommission(
        input.amount,
        commissionRate
      );

    const sellerReceives =
      input.amount -
      commissionAmount;

    const dealCode =
      generateDealCode();

    const { data, error } =
      await supabase
        .from("deals")
        .insert([
          {
            deal_code: dealCode,

            deal_type:
              input.dealType,

            machinery_id:
              input.machineryId ||

              null,

            buyer_id:
              input.buyerId,

            seller_id:
              input.sellerId,

            title:
              input.title ||

              "EML Deal",

            description:
              input.description ||

              "",

            amount:
              input.amount,

            currency:
              input.currency ||

              "ETB",

            commission_rate:
              commissionRate,

            commission_amount:
              commissionAmount,

            seller_receives:
              sellerReceives,

            payment_method:
              input.paymentMethod ||

              "manual",

            escrow_enabled:
              input.escrowEnabled ||

              false,

            transport_required:
              input.transportRequired ||

              false,

            operator_required:
              input.operatorRequired ||

              false,

            insurance_required:
              input.insuranceRequired ||

              false,

            financing_required:
              input.financingRequired ||

              false,

            status:
              "lead",

            metadata:
              input.metadata ||

              {},
          },
        ])
        .select()
        .single();

    if (error) {
      console.error(
        "CREATE DEAL ERROR:",
        error
      );

      return null;
    }

    // =============================================
    // CREATE REVENUE RECORD
    // =============================================

    await createRevenueRecord({
      dealId: data.id,

      amount:
        commissionAmount,

      source:
        input.dealType,

      payerId:
        input.sellerId,
    });

    // =============================================
    // CREATE WALLET RECORD
    // =============================================

    await createWalletRecord({
      userId:
        input.sellerId,

      amount:
        -commissionAmount,

      type:
        "commission",

      note: `EML Commission (${dealCode})`,
    });

    // =============================================
    // CREATE EVENT LOG
    // =============================================

    await logDealEvent({
      dealId: data.id,

      eventType:
        "deal_created",

      note: `Deal ${dealCode} created`,
    });

    return data;
  } catch (error) {
    console.error(
      "DEAL ENGINE ERROR:",
      error
    );

    return null;
  }
}

// =============================================
// UPDATE DEAL STATUS
// =============================================

export async function updateDealStatus(
  input: UpdateDealStatusInput
) {
  try {
    const { data, error } =
      await supabase
        .from("deals")
        .update({
          status:
            input.status,

          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          input.dealId
        )
        .select()
        .single();

    if (error) {
      console.error(
        "UPDATE STATUS ERROR:",
        error
      );

      return null;
    }

    // =============================================
    // LOG EVENT
    // =============================================

    await logDealEvent({
      dealId:
        input.dealId,

      eventType:
        "status_changed",

      note:
        input.note ||
        `Status updated to ${input.status}`,
    });

    return data;
  } catch (error) {
    console.error(
      "STATUS UPDATE FAILED:",
      error
    );

    return null;
  }
}

// =============================================
// GET DEALS
// =============================================

export async function getDeals(
  userId?: string
) {
  try {
    let query =
      supabase
        .from("deals")
        .select("*")
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

    if (userId) {
      query = query.or(
        `buyer_id.eq.${userId},seller_id.eq.${userId}`
      );
    }

    const { data, error } =
      await query;

    if (error) {
      console.error(
        "GET DEALS ERROR:",
        error
      );

      return [];
    }

    return data || [];
  } catch (error) {
    console.error(
      "GET DEALS FAILED:",
      error
    );

    return [];
  }
}

// =============================================
// GET SINGLE DEAL
// =============================================

export async function getDeal(
  dealId: string
) {
  try {
    const { data, error } =
      await supabase
        .from("deals")
        .select("*")
        .eq("id", dealId)
        .single();

    if (error) {
      console.error(
        "GET DEAL ERROR:",
        error
      );

      return null;
    }

    return data;
  } catch (error) {
    console.error(
      "GET DEAL FAILED:",
      error
    );

    return null;
  }
}

// =============================================
// DEAL EVENTS
// =============================================

export async function logDealEvent({
  dealId,
  eventType,
  note,
}: {
  dealId: string;

  eventType: string;

  note?: string;
}) {
  try {
    await supabase
      .from("deal_events")
      .insert([
        {
          deal_id: dealId,

          event_type:
            eventType,

          note:
            note || "",
        },
      ]);
  } catch (error) {
    console.error(
      "LOG EVENT ERROR:",
      error
    );
  }
}

// =============================================
// REVENUE RECORD
// =============================================

export async function createRevenueRecord({
  dealId,
  amount,
  source,
  payerId,
}: {
  dealId: string;

  amount: number;

  source: string;

  payerId: string;
}) {
  try {
    await supabase
      .from("revenue_records")
      .insert([
        {
          deal_id: dealId,

          amount,

          source,

          payer_id:
            payerId,

          status:
            "pending",
        },
      ]);
  } catch (error) {
    console.error(
      "REVENUE RECORD ERROR:",
      error
    );
  }
}

// =============================================
// WALLET RECORD
// =============================================

export async function createWalletRecord({
  userId,
  amount,
  type,
  note,
}: {
  userId: string;

  amount: number;

  type: string;

  note?: string;
}) {
  try {
    await supabase
      .from(
        "wallet_transactions"
      )
      .insert([
        {
          user_id:
            userId,

          amount,

          type,

          note:
            note || "",

          status:
            "completed",
        },
      ]);
  } catch (error) {
    console.error(
      "WALLET RECORD ERROR:",
      error
    );
  }
}

// =============================================
// SMART WORKFLOW HELPERS
// =============================================

export function requiresTransport(
  deal: any
) {
  return (
    deal.transport_required ===
    true
  );
}

export function requiresOperator(
  deal: any
) {
  return (
    deal.operator_required ===
    true
  );
}

export function requiresInsurance(
  deal: any
) {
  return (
    deal.insurance_required ===
    true
  );
}

export function requiresFinancing(
  deal: any
) {
  return (
    deal.financing_required ===
    true
  );
}

export function isEscrowEnabled(
  deal: any
) {
  return (
    deal.escrow_enabled ===
    true
  );
}

// =============================================
// DEAL ANALYTICS
// =============================================

export async function getDealAnalytics() {
  try {
    const { data, error } =
      await supabase
        .from("deals")
        .select("*");

    if (error || !data) {
      return null;
    }

    const totalDeals =
      data.length;

    const totalVolume =
      data.reduce(
        (sum, d) =>
          sum +
          Number(
            d.amount || 0
          ),
        0
      );

    const totalRevenue =
      data.reduce(
        (sum, d) =>
          sum +
          Number(
            d.commission_amount ||
              0
          ),
        0
      );

    return {
      totalDeals,

      totalVolume,

      totalRevenue,
    };
  } catch (error) {
    console.error(
      "ANALYTICS ERROR:",
      error
    );

    return null;
  }
}

// =============================================
// OPTIONAL ETHIOPIAN ESCROW
// =============================================

export async function enableEscrow(
  dealId: string
) {
  return updateDealEscrow(
    dealId,
    true
  );
}

export async function disableEscrow(
  dealId: string
) {
  return updateDealEscrow(
    dealId,
    false
  );
}

async function updateDealEscrow(
  dealId: string,
  enabled: boolean
) {
  try {
    const { data, error } =
      await supabase
        .from("deals")
        .update({
          escrow_enabled:
            enabled,
        })
        .eq("id", dealId)
        .select()
        .single();

    if (error) {
      console.error(
        "ESCROW UPDATE ERROR:",
        error
      );

      return null;
    }

    return data;
  } catch (error) {
    console.error(
      "ESCROW FAILED:",
      error
    );

    return null;
  }
}