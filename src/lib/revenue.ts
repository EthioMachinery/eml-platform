import { supabase } from "@/lib/supabaseClient";

export async function createTransaction({
  buyerId,
  sellerId,
  machineryId,
  totalAmount,
  transactionType,
  paymentMethod,
}: {
  buyerId: string;
  sellerId: string;
  machineryId: string;
  totalAmount: number;
  transactionType:
    | "machinery_sale"
    | "machinery_rental"
    | "transport_booking"
    | "boosted_listing";

  paymentMethod: string;
}) {
  // =====================================
  // LOAD COMMISSION %
  // =====================================

  const { data: commission } =
    await supabase
      .from("commission_settings")
      .select("*")
      .eq(
        "category",
        transactionType
      )
      .single();

  const percent =
    commission?.commission_percent || 5;

  // =====================================
  // CALCULATE
  // =====================================

  const commissionAmount =
    (totalAmount * percent) / 100;

  const sellerAmount =
    totalAmount -
    commissionAmount;

  // =====================================
  // CREATE TRANSACTION
  // =====================================

  const { data, error } =
    await supabase
      .from("transactions")
      .insert({
        buyer_id: buyerId,
        seller_id: sellerId,
        machinery_id: machineryId,

        total_amount: totalAmount,

        commission_amount:
          commissionAmount,

        seller_amount:
          sellerAmount,

        transaction_type:
          transactionType,

        payment_method:
          paymentMethod,

        payment_status:
          "pending",
      })
      .select()
      .single();

  if (error) {
    console.error(error);

    return null;
  }

  // =====================================
  // STORE EML EARNING
  // =====================================

  await supabase
    .from("eml_earnings")
    .insert({
      transaction_id: data.id,

      category:
        transactionType,

      gross_amount:
        totalAmount,

      commission_percent:
        percent,

      commission_amount:
        commissionAmount,
    });

  // =====================================
  // CREATE NOTIFICATION
  // =====================================

  await supabase
    .from("notifications")
    .insert({
      user_id: sellerId,

      title:
        "New Transaction",

      content:
        "A new payment transaction was created.",

      type:
        transactionType,
    });

  return data;
}