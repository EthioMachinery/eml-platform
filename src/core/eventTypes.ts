export type EMLActivityType =
  | "DEAL_CREATED"
  | "DEAL_UPDATED"
  | "REQUEST_POSTED"
  | "LISTING_ADDED"
  | "PAYMENT_INITIATED"
  | "PAYMENT_COMPLETED"
  | "USER_REGISTERED"
  | "SYSTEM_ALERT";

export type EMLActivityEvent = {
  id: string;
  type: EMLActivityType;
  title: string;
  description?: string;
  userId?: string;
  entityId?: string;
  timestamp: string;
  metadata?: Record<string, any>;
};