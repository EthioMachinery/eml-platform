// src/lib/finance/commission.ts
// TM — Commission Calculation Engine
//
// Reads commission rules from public.commission_settings and calculates
// the exact breakdown for any deal. All amounts are in ETB (Ethiopian Birr).
// Amounts are stored as integers (cents equivalent) — no floating point.
//
// Usage:
//   import { calculateCommission, getCommissionRate } from '@/lib/finance/commission';
//
//   const breakdown = await calculateCommission(500000, 'PURCHASE');
//   console.log(breakdown.commission_amount); // e.g. 12500
//   console.log(breakdown.seller_receives);   // e.g. 487500

import { supabaseAdmin } from '@/lib/supabase/adminClient';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type DealType = 'PURCHASE' | 'RENTAL' | 'LEASE';

export interface CommissionBreakdown {
  gross_amount:       number;   // Full deal value in ETB
  commission_rate:    number;   // Percentage applied (e.g. 2.5)
  commission_amount:  number;   // ETB earned by TM (always rounded up)
  seller_receives:    number;   // ETB paid out to seller
  currency:           string;   // Always 'ETB'
}

// ---------------------------------------------------------------------------
// Default rates — used only if commission_settings table has no matching row
// ---------------------------------------------------------------------------
const DEFAULT_RATES: Record<DealType, number> = {
  PURCHASE: 2.50,
  RENTAL:   5.00,
  LEASE:    3.50,
};

// ---------------------------------------------------------------------------
// getCommissionRate
//
// Looks up the commission rate for a given deal type from the database.
// Falls back to the hardcoded default if no setting is found.
//
// @param dealType - 'PURCHASE' | 'RENTAL' | 'LEASE'
// @returns        - The commission percentage as a number (e.g. 2.5)
// ---------------------------------------------------------------------------
export async function getCommissionRate(dealType: DealType): Promise<number> {
  const { data, error } = await supabaseAdmin
    .from('commission_settings')
    .select('rate')
    .eq('deal_type', dealType)
    .single();

  if (error || !data) {
    console.warn(
      `[TM] commission_settings: no rate found for deal_type "${dealType}". ` +
      `Using default: ${DEFAULT_RATES[dealType]}%`
    );
    return DEFAULT_RATES[dealType];
  }

  return data.rate;
}

// ---------------------------------------------------------------------------
// calculateCommission
//
// Computes the full financial breakdown for a deal.
// Commission is always rounded UP (ceiling) to favour the platform.
//
// @param grossAmount - Total deal value in ETB (must be a positive integer)
// @param dealType    - Type of deal
// @param currency    - Currency code (default 'ETB')
// @returns           - CommissionBreakdown object
// ---------------------------------------------------------------------------
export async function calculateCommission(
  grossAmount: number,
  dealType: DealType = 'PURCHASE',
  currency: string = 'ETB'
): Promise<CommissionBreakdown> {
  if (grossAmount <= 0) {
    throw new Error('gross_amount must be a positive number.');
  }

  const rate              = await getCommissionRate(dealType);
  const commission_amount = Math.ceil((grossAmount * rate) / 100);
  const seller_receives   = grossAmount - commission_amount;

  return {
    gross_amount:      grossAmount,
    commission_rate:   rate,
    commission_amount,
    seller_receives,
    currency,
  };
}

// ---------------------------------------------------------------------------
// calculateCommissionSync
//
// Synchronous version using a known rate — use this when you already
// have the rate and do not need a database lookup.
//
// @param grossAmount - Total deal value in ETB
// @param rate        - Commission percentage (e.g. 2.5)
// @param currency    - Currency code (default 'ETB')
// @returns           - CommissionBreakdown object
// ---------------------------------------------------------------------------
export function calculateCommissionSync(
  grossAmount: number,
  rate: number,
  currency: string = 'ETB'
): CommissionBreakdown {
  if (grossAmount <= 0) {
    throw new Error('gross_amount must be a positive number.');
  }

  const commission_amount = Math.ceil((grossAmount * rate) / 100);
  const seller_receives   = grossAmount - commission_amount;

  return {
    gross_amount:      grossAmount,
    commission_rate:   rate,
    commission_amount,
    seller_receives,
    currency,
  };
}

// ---------------------------------------------------------------------------
// formatETB
//
// Formats an ETB integer amount into a readable string.
// Example: 487500 → "ETB 487,500"
// ---------------------------------------------------------------------------
export function formatETB(amount: number): string {
  return `ETB ${amount.toLocaleString('en-ET')}`;
}