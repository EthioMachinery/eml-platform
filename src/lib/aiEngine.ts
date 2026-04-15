export const AIEngine = {
  // =========================
  // SMART MATCHING
  // =========================
  matchMachines: (machines: any[], preference: any) => {
    return machines
      .map((m) => {
        let score = 0;

        if (preference.category && m.category === preference.category) score += 40;
        if (preference.location && m.location === preference.location) score += 30;
        if (preference.budget && m.price <= preference.budget) score += 30;

        return { ...m, score };
      })
      .sort((a, b) => b.score - a.score);
  },

  // =========================
  // TRENDING MACHINES
  // =========================
  trendingMachines: (machines: any[], deals: any[]) => {
    return machines
      .map((m) => {
        const demand = deals.filter((d) => d.machine_id === m.id).length;
        return { ...m, demand };
      })
      .sort((a, b) => b.demand - a.demand);
  },

  // =========================
  // BEST PRICE DETECTION
  // =========================
  bestDeals: (machines: any[]) => {
    const avgPrice =
      machines.reduce((sum, m) => sum + m.price, 0) / machines.length;

    return machines
      .filter((m) => m.price <= avgPrice)
      .sort((a, b) => a.price - b.price);
  },

  // =========================
  // LOCATION RECOMMENDATION
  // =========================
  byLocation: (machines: any[], location: string) => {
    return machines.filter((m) => m.location === location);
  },
};