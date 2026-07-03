/**
 * TM INDUSTRIAL ESCROW ENGINE - V2.0
 * Standardized for Global Heavy Machinery Transactions.
 */

export type EscrowStage =
  | 'awaiting_funding'       // Buyer has not paid yet
  | 'funded'                 // Money in TM Vault
  | 'ai_verification'        // CEO Autopilot checking GPS/IoT/Documents
  | 'inspection_released'    // Inspector paid (1.5%)
  | 'logistics_released'     // Transporter paid (2.5%)
  | 'completed_payout'       // Supplier paid, Deal closed
  | 'refunded_to_buyer'      // Deal cancelled
  | 'disputed_frozen';       // Legal/Manual intervention required

export interface EscrowSplit {
  totalAmount: number;
  inspectionFee: number;
  logisticsFee: number;
  emlCommission: number;
  supplierPayout: number;
  currency: string;
}

/**
 * Calculates high-precision splits.
 * Uses a "Residual Balance" logic to ensure zero-loss accounting.
 */
export function calculateEscrowSplits(
  totalAmount: number,
  config: {
    salesRate: number;        // From commission_settings table
    inspectionRate: number;   // e.g., 1.5
    logisticsRate: number;    // e.g., 2.5
    includeInspection: boolean;
    includeLogistics: boolean;
  },
  currency: string = 'ETB'
): EscrowSplit {
  // 1. Calculate fees using floor math to prevent over-charging
  const emlCommission = Math.floor(totalAmount * (config.salesRate / 100));
  const inspectionFee = config.includeInspection 
    ? Math.floor(totalAmount * (config.inspectionRate / 100)) 
    : 0;
  const logisticsFee = config.includeLogistics 
    ? Math.floor(totalAmount * (config.logisticsRate / 100)) 
    : 0;
  
  // 2. Supplier gets the REMAINDER (Ensures total always adds up perfectly)
  const supplierPayout = totalAmount - (emlCommission + inspectionFee + logisticsFee);

  return {
    totalAmount,
    inspectionFee,
    logisticsFee,
    emlCommission,
    supplierPayout,
    currency
  };
}

/**
 * VALIDATION LOGIC
 * Only allows transitions that follow the TM Safe-Trade protocol.
 */
export function getNextAvailableStages(current: EscrowStage): EscrowStage[] {
  const transitions: Record<EscrowStage, EscrowStage[]> = {
    'awaiting_funding': ['funded', 'refunded_to_buyer'],
    
    'funded': [
      'ai_verification', 
      'inspection_released', 
      'disputed_frozen', 
      'refunded_to_buyer'
    ],

    'ai_verification': [
      'inspection_released', 
      'logistics_released', 
      'completed_payout', 
      'disputed_frozen'
    ],

    'inspection_released': [
      'logistics_released', 
      'completed_payout', 
      'disputed_frozen'
    ],

    'logistics_released': [
      'completed_payout', 
      'disputed_frozen'
    ],

    'disputed_frozen': [
      'completed_payout', 
      'refunded_to_buyer', 
      'funded'
    ],

    'completed_payout': [], // Terminal
    'refunded_to_buyer': [] // Terminal
  };

  return transitions[current] || [];
}

/**
 * SMART ACTION: Determine if the CEO Autopilot can auto-release funds.
 * In a Top-10 Ecosystem, logistics fees are released automatically when 
 * the machine's "Digital Twin" detects a change in GPS location.
 */
export function canAutoRelease(stage: EscrowStage, trustScore: number): boolean {
  if (stage === 'ai_verification' && trustScore > 85) {
    return true; // Auto-pilot release enabled for high-trust sellers
  }
  return false;
}