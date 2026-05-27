import { supabase } from "./supabaseClient";

/* =========================================================
   EML ENTERPRISE TRANSACTION ENGINE
   ኢትዮ ማሽነሪ አገናኝ
========================================================= */

export type TransactionType =
  | "machinery_sale"
  | "machinery_rental"
  | "transport_service"
  | "operator_service"
  | "mechanic_service"
  | "insurance"
  | "financing"
  | "parts_purchase"
  | "subscription"
  | "premium_listing"
  | "featured_listing"
  | "verification"
  | "advertisement"
  | "other";

export type TransactionStatus =
  | "pending"
  | "quoted"
  | "negotiating"
  | "awaiting_payment"
  | "payment_submitted"
  | "payment_verified"
  | "escrow_locked"
  | "in_progress"
  | "delivered"
  | "completed"
  | "released"
  | "cancelled"
  | "refunded"
  | "disputed";

export type PaymentMethod =
  | "telebirr"
  | "bank_transfer"
  | "mobile_banking"
  | "cash"
  | "wallet"
  | "other";

export interface CreateTransactionPayload {
  buyerId: string;

  sellerId: string;

  machineryId?: string;

  serviceId?: string;

  requestId?: string;

  totalAmount: number;

  transactionType: TransactionType;

  paymentMethod: PaymentMethod;

  notes?: string;

  metadata?: any;
}

/* =========================================================
   COMMISSION ENGINE
========================================================= */

export function calculateCommission(
  amount: number,
  type: TransactionType
) {
  let rate = 0;

  switch (type) {
    case "machinery_sale":
      rate = 0.03;
      break;

    case "machinery_rental":
      rate = 0.05;
      break;

    case "transport_service":
      rate = 0.08;
      break;

    case "operator_service":
      rate = 0.07;
      break;

    case "mechanic_service":
      rate = 0.07;
      break;

    case "insurance":
      rate = 0.1;
      break;

    case "financing":
      rate = 0.12;
      break;

    case "parts_purchase":
      rate = 0.06;
      break;

    case "premium_listing":
      rate = 0.15;
      break;

    default:
      rate = 0.05;
  }

  const commission = amount * rate;

  const sellerReceives =
    amount - commission;

  return {
    rate,
    commission,
    sellerReceives,
  };
}

/* =========================================================
   CREATE TRANSACTION
========================================================= */

export async function createTransaction(
  payload: CreateTransactionPayload
) {
  try {
    const commissionData =
      calculateCommission(
        payload.totalAmount,
        payload.transactionType
      );

    const { data, error } =
      await supabase
        .from("transactions")
        .insert({
          buyer_id: payload.buyerId,

          seller_id:
            payload.sellerId,

          machinery_id:
            payload.machineryId,

          service_id:
            payload.serviceId,

          request_id:
            payload.requestId,

          total_amount:
            payload.totalAmount,

          commission_amount:
            commissionData.commission,

          seller_receives:
            commissionData.sellerReceives,

          transaction_type:
            payload.transactionType,

          payment_method:
            payload.paymentMethod,

          status: "pending",

          notes: payload.notes,

          metadata:
            payload.metadata || {},
        })
        .select()
        .single();

    if (error) {
      console.error(error);

      return null;
    }

    /* CREATE REVENUE RECORD */

    await supabase
      .from("revenue")
      .insert({
        transaction_id:
          data.id,

        amount:
          commissionData.commission,

        source:
          payload.transactionType,
      });

    return data;
  } catch (err) {
    console.error(err);

    return null;
  }
}

/* =========================================================
   UPDATE TRANSACTION STATUS
========================================================= */

export async function updateTransactionStatus(
  transactionId: string,
  status: TransactionStatus
) {
  const { data, error } =
    await supabase
      .from("transactions")
      .update({
        status,
      })
      .eq("id", transactionId)
      .select()
      .single();

  if (error) {
    console.error(error);

    return null;
  }

  return data;
}

/* =========================================================
   VERIFY PAYMENT
========================================================= */

export async function verifyPayment(
  transactionId: string
) {
  return await updateTransactionStatus(
    transactionId,
    "payment_verified"
  );
}

/* =========================================================
   LOCK ESCROW
========================================================= */

export async function lockEscrow(
  transactionId: string
) {
  return await updateTransactionStatus(
    transactionId,
    "escrow_locked"
  );
}

/* =========================================================
   RELEASE PAYMENT
========================================================= */

export async function releasePayment(
  transactionId: string
) {
  return await updateTransactionStatus(
    transactionId,
    "released"
  );
}

/* =========================================================
   CANCEL TRANSACTION
========================================================= */

export async function cancelTransaction(
  transactionId: string
) {
  return await updateTransactionStatus(
    transactionId,
    "cancelled"
  );
}

/* =========================================================
   CREATE NOTIFICATION
========================================================= */

export async function createNotification({
  userId,
  title,
  content,
  type = "general",
  link = "",
}: {
  userId: string;

  title: string;

  content: string;

  type?: string;

  link?: string;
}) {
  await supabase
    .from("notifications")
    .insert({
      user_id: userId,

      title,

      content,

      type,

      link,
    });
}