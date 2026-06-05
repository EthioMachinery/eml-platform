import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize the backend database client using the service role key for full transactional write access
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

interface PaymentVerificationPayload {
  transactionRef: string;
  escrowId: string;
  paymentMethod: string;
  senderPhone: string;
  amountReceived: number;
}

export async function POST(req: NextRequest) {
  try {
    const payload = (await req.json()) as PaymentVerificationPayload;
    const { transactionRef, escrowId, paymentMethod, senderPhone, amountReceived } = payload;

    if (!transactionRef || !escrowId || !amountReceived) {
      return NextResponse.json(
        { error: "Missing required transactional parameters in request." },
        { status: 400 }
      );
    }

    // 1. Retrieve the corresponding escrow record from the database
    const { data: escrowRecord, error: escrowError } = await supabaseAdmin
      .from("escrows")
      .select(`
        id,
        listing_id,
        buyer_id,
        seller_id,
        total_amount,
        eml_commission_fee,
        current_stage
      `)
      .eq("id", escrowId)
      .single();

    if (escrowError || !escrowRecord) {
      return NextResponse.json(
        { error: "Corresponding escrow ledger not found." },
        { status: 404 }
      );
    }

    // 2. Verify that the received payment matches the expected total amount
    if (Number(amountReceived) < Number(escrowRecord.total_amount)) {
      return NextResponse.json(
        { 
          error: "Transaction Rejected: Insufficient funds received.", 
          expected: escrowRecord.total_amount, 
          received: amountReceived 
        },
        { status: 400 }
      );
    }

    // 3. Prevent duplicate funding transitions if the transaction has already cleared
    if (escrowRecord.current_stage !== "awaiting_funding") {
      return NextResponse.json(
        { error: "Transaction Rejected: This escrow account is already funded or complete." },
        { status: 400 }
      );
    }

    // 4. Update the Escrow Milestone Stage to 'funded'
    const { error: updateEscrowError } = await supabaseAdmin
      .from("escrows")
      .update({
        current_stage: "funded" as any,
        updated_at: new Date().toISOString()
      })
      .eq("id", escrowId);

    if (updateEscrowError) {
      throw updateEscrowError;
    }

    // 5. Update the equipment listing status to 'escrow_funded' to lock out other buyers
    const { error: updateListingError } = await supabaseAdmin
      .from("listings")
      .update({
        status: "escrow_funded" as any,
        updated_at: new Date().toISOString()
      })
      .eq("id", escrowRecord.listing_id);

    if (updateListingError) {
      throw updateListingError;
    }

    // 6. Log EML Platform Commissions directly into the revenue ledger (Autopilot Profit)
    const { error: logRevenueError } = await supabaseAdmin
      .from("revenue")
      .insert([
        {
          id: crypto.randomUUID(),
          transaction_id: escrowId,
          amount: Number(escrowRecord.eml_commission_fee),
          source: `escrow_commission_${paymentMethod}`,
          created_at: new Date().toISOString()
        }
      ]);

    if (logRevenueError) {
      // Log the error internally but do not crash the transaction response
      console.error("Critical warning: Failed to write commission ledger row:", logRevenueError);
    }

    return NextResponse.json({
      success: true,
      transactionId: escrowId,
      newEscrowStage: "funded",
      emlCommissionEarned: escrowRecord.eml_commission_fee,
      message: "Payment verified successfully. EML commission logged, and escrow account is funded."
    });

  } catch (err: any) {
    console.error("EML Automated Verification Exception:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error during transaction processing." },
      { status: 500 }
    );
  }
}