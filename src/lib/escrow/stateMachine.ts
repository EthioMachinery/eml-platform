// src/lib/escrow/stateMachine.ts
// EML — Escrow State Machine
//
// Controls every valid state transition in a deal's lifecycle.
// No deal can skip a state or move backwards.
// Every transition is validated here before any database write occurs.
//
// Usage:
//   import { canTransition, transition, DEAL_STATES } from '@/lib/escrow/stateMachine';
//
//   const allowed = canTransition('pending', 'awaiting_payment');  // true
//   const allowed = canTransition('pending', 'completed');          // false

// ---------------------------------------------------------------------------
// Deal States
// ---------------------------------------------------------------------------

export const DEAL_STATES = {
  PENDING:             'pending',             // Deal created, awaiting buyer action
  AWAITING_PAYMENT:    'awaiting_payment',    // Seller confirmed, buyer must pay
  PAYMENT_SUBMITTED:   'payment_submitted',   // Buyer submitted bank reference
  PAYMENT_VERIFIED:    'payment_verified',    // Admin confirmed payment received
  INSPECTION_PERIOD:   'inspection_period',   // Buyer inspecting machinery (optional)
  RELEASED:            'released',            // Escrow released to seller
  COMPLETED:           'completed',           // Deal fully closed
  DISPUTED:            'disputed',            // Either party raised a dispute
  REFUNDED:            'refunded',            // Payment returned to buyer
  CANCELLED:           'cancelled',           // Deal cancelled before payment
} as const;

export type DealState = typeof DEAL_STATES[keyof typeof DEAL_STATES];

// ---------------------------------------------------------------------------
// Valid Transitions Map
// Defines exactly which states each state can move to.
// Any transition not listed here is illegal and will be rejected.
// ---------------------------------------------------------------------------

const VALID_TRANSITIONS: Record<DealState, DealState[]> = {
  pending: [
    DEAL_STATES.AWAITING_PAYMENT,   // Seller accepts the deal
    DEAL_STATES.CANCELLED,          // Either party cancels before payment
  ],
  awaiting_payment: [
    DEAL_STATES.PAYMENT_SUBMITTED,  // Buyer submits bank reference
    DEAL_STATES.CANCELLED,          // Cancelled before payment submitted
  ],
  payment_submitted: [
    DEAL_STATES.PAYMENT_VERIFIED,   // Admin verifies the payment
    DEAL_STATES.AWAITING_PAYMENT,   // Admin rejects the reference — buyer must resubmit
    DEAL_STATES.DISPUTED,           // Dispute raised during verification
  ],
  payment_verified: [
    DEAL_STATES.INSPECTION_PERIOD,  // Move to inspection (optional)
    DEAL_STATES.RELEASED,           // Skip inspection, release escrow directly
    DEAL_STATES.DISPUTED,           // Dispute raised after payment confirmed
  ],
  inspection_period: [
    DEAL_STATES.RELEASED,           // Buyer satisfied, release escrow
    DEAL_STATES.DISPUTED,           // Buyer raises dispute during inspection
  ],
  released: [
    DEAL_STATES.COMPLETED,          // Final close after release
  ],
  completed: [],                    // Terminal state — no further transitions
  disputed: [
    DEAL_STATES.RELEASED,           // Dispute resolved in seller's favour
    DEAL_STATES.REFUNDED,           // Dispute resolved in buyer's favour
  ],
  refunded: [],                     // Terminal state — no further transitions
  cancelled: [],                    // Terminal state — no further transitions
};

// ---------------------------------------------------------------------------
// canTransition
//
// Returns true if moving from `current` to `next` is a valid transition.
//
// @param current - The deal's current state.
// @param next    - The proposed next state.
// ---------------------------------------------------------------------------
export function canTransition(current: DealState, next: DealState): boolean {
  const allowed = VALID_TRANSITIONS[current];
  if (!allowed) return false;
  return allowed.includes(next);
}

// ---------------------------------------------------------------------------
// transition
//
// Validates and returns the new state, or throws a descriptive error.
// Use this in route handlers before writing to the database.
//
// @param current - The deal's current state from the database.
// @param next    - The requested next state.
// @returns       - The new state if valid.
// @throws        - Error with a clear message if the transition is illegal.
//
// Usage:
//   try {
//     const newState = transition(deal.status, 'payment_verified');
//   } catch (err) {
//     return errorResponse(err.message, 409, 'STATE_ERROR');
//   }
// ---------------------------------------------------------------------------
export function transition(current: DealState, next: DealState): DealState {
  if (!canTransition(current, next)) {
    throw new Error(
      `Invalid state transition: "${current}" → "${next}". ` +
      `Allowed from "${current}": ${VALID_TRANSITIONS[current]?.join(', ') || 'none (terminal state)'}.`
    );
  }
  return next;
}

// ---------------------------------------------------------------------------
// isTerminal
//
// Returns true if the deal is in a final state and cannot be changed.
// ---------------------------------------------------------------------------
export function isTerminal(state: DealState): boolean {
  return VALID_TRANSITIONS[state]?.length === 0;
}

// ---------------------------------------------------------------------------
// getNextStates
//
// Returns all valid next states from the current state.
// Useful for building UI buttons or admin action menus.
// ---------------------------------------------------------------------------
export function getNextStates(current: DealState): DealState[] {
  return VALID_TRANSITIONS[current] ?? [];
}

// ---------------------------------------------------------------------------
// State Labels (for UI display)
// ---------------------------------------------------------------------------
export const DEAL_STATE_LABELS: Record<DealState, string> = {
  pending:            'Pending',
  awaiting_payment:   'Awaiting Payment',
  payment_submitted:  'Payment Submitted',
  payment_verified:   'Payment Verified',
  inspection_period:  'Under Inspection',
  released:           'Escrow Released',
  completed:          'Completed',
  disputed:           'Disputed',
  refunded:           'Refunded',
  cancelled:          'Cancelled',
};