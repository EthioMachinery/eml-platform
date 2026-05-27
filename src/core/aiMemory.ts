type LearningEvent = {
  dealId: string;
  risk: string;
  score: number;
  outcome?: "SUCCESS" | "FAILED" | "UNKNOWN";
};

let memory: LearningEvent[] = [];

/**
 * Simple in-memory learning system (can later move to DB)
 */
export const AIMemory = {
  add(event: LearningEvent) {
    memory.push(event);

    // keep last 500 events only
    if (memory.length > 500) {
      memory = memory.slice(-500);
    }
  },

  getAll() {
    return memory;
  },

  /**
   * Learn from success/failure patterns
   */
  getRiskAdjustment() {
    const successDeals = memory.filter(
      (m) => m.outcome === "SUCCESS"
    );

    const failedDeals = memory.filter(
      (m) => m.outcome === "FAILED"
    );

    const successRate =
      successDeals.length /
      (successDeals.length + failedDeals.length || 1);

    return {
      successRate,
      adjustmentFactor:
        successRate > 0.7
          ? -0.1
          : successRate < 0.4
          ? 0.2
          : 0,
    };
  },
};