import { TMActivityEvent } from "./eventTypes";
import { TMCore } from "./tmCore";

export type AutomationAction =
  | "SCORE_DEAL"
  | "FLAG_RISK"
  | "TRIGGER_MATCHING"
  | "UPDATE_TRUST"
  | "SEND_ALERT";

export class AutomationEngine {
  static async process(event: TMActivityEvent) {
    switch (event.type) {
      case "DEAL_CREATED":
        return this.handleDealCreated(event);

      case "REQUEST_POSTED":
        return this.handleRequestPosted(event);

      case "PAYMENT_COMPLETED":
        return this.handlePayment(event);

      default:
        return null;
    }
  }

  static handleDealCreated(event: TMActivityEvent) {
    const deal = {
      id: event.entityId || "",
      price: event.metadata?.price || 0,
    };

    const analysis = TMCore.ai.scoreDeal(deal);

    console.log("[AUTOMATION] Deal analysis:", analysis);

    if (analysis.risk === "DANGEROUS") {
      return this.trigger("FLAG_RISK", event);
    }

    return this.trigger("SCORE_DEAL", event);
  }

  static handleRequestPosted(event: TMActivityEvent) {
    console.log("[AUTOMATION] Matching request...");

    return this.trigger("TRIGGER_MATCHING", event);
  }

  static handlePayment(event: TMActivityEvent) {
    console.log("[AUTOMATION] Updating trust score...");

    return this.trigger("UPDATE_TRUST", event);
  }

  static trigger(action: AutomationAction, event: TMActivityEvent) {
    console.log("[ACTION TRIGGERED]", action);

    return {
      action,
      eventId: event.id,
      status: "processed",
    };
  }
}