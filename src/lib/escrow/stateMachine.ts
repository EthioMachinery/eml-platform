export type EscrowStage =
  | 'awaiting_funding'
  | 'funded'
  | 'inspection_released'
  | 'logistics_released'
  | 'completed_payout'
  | 'refunded_to_buyer'
  | 'disputed_frozen';

export interface EscrowSplit {
  totalAmount: number;
  inspectionFee: number;
  logisticsFee: number;
  emlCommission: number;
  supplierPayout: number;
}

/**
 * Calculates the legal commission splits according to the EML Industrial Standard.
 * EML takes a standard 3% commission on sales/rentals.
 * Dynamic allocations are made for independent inspectors (1.5%) and transport dispatchers (2.5%).
 */
export function calculateEscrowSplits(
  totalAmount: number,
  includeInspection: boolean,
  includeLogistics: boolean
): EscrowSplit {
  const emlCommission = Math.round(totalAmount * 0.03); // EML 3% Platform Fee
  const inspectionFee = includeInspection ? Math.round(totalAmount * 0.015) : 0; // Inspector 1.5% Fee
  const logisticsFee = includeLogistics ? Math.round(totalAmount * 0.025) : 0; // Transporter 2.5% Deposit
  
  const supplierPayout = totalAmount - emlCommission - inspectionFee - logisticsFee;

  return {
    totalAmount,
    inspectionFee,
    logisticsFee,
    emlCommission,
    supplierPayout
  };
}

/**
 * Validates state transitions within the escrow lifecycle.
 * Prevents invalid double-withdrawals or premature payouts.
 */
export function getNextAvailableStages(current: EscrowStage): EscrowStage[] {
  switch (current) {
    case 'awaiting_funding':
      return ['funded', 'refunded_to_buyer'];
    case 'funded':
      return ['inspection_released', 'logistics_released', 'disputed_frozen', 'refunded_to_buyer'];
    case 'inspection_released':
      return ['logistics_released', 'completed_payout', 'disputed_frozen', 'refunded_to_buyer'];
    case 'logistics_released':
      return ['inspection_released', 'completed_payout', 'disputed_frozen', 'refunded_to_buyer'];
    case 'disputed_frozen':
      return ['completed_payout', 'refunded_to_buyer', 'funded'];
    case 'completed_payout':
    case 'refunded_to_buyer':
    default:
      return []; // Terminal states
  }
}