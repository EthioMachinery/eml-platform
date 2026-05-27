import { Deal, EMLCore } from "@/core/emlCore";
import { MarketStream } from "@/core/marketStream";
import { DealCloser } from "@/core/dealCloser";

export const EMLKernel = {
  running: false,

  async start() {
    this.running = true;
    await MarketStream.init();
    return true;
  },

  async fetchDeals() {
    return [];
  },

  async evaluate(
    deals: Deal[]
  ) {
    const scored =
      deals.map((deal) =>
        EMLCore.ai.scoreDeal(
          deal
        )
      );

    return {
      totalDeals:
        deals.length,
      scored,
      active:
        this.running,
    };
  },

  async triggerFullScan(
    deals: Deal[]
  ) {
    const results = [];

    for (const deal of deals) {
      results.push(
        await DealCloser.process(
          deal
        )
      );
    }

    return results;
  },

  status() {
    return {
      running:
        this.running,
      timestamp:
        Date.now(),
    };
  },
};