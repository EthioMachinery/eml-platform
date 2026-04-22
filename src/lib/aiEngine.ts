export class AIEngine {
  static rankMachines(machines: any[], filters: any) {
    return machines.sort((a, b) => {
      let scoreA = 0;
      let scoreB = 0;

      if (filters.category) {
        if (a.category === filters.category) scoreA += 5;
        if (b.category === filters.category) scoreB += 5;
      }

      if (filters.location) {
        if (a.location === filters.location) scoreA += 3;
        if (b.location === filters.location) scoreB += 3;
      }

      scoreA += 1 / (a.price || 1);
      scoreB += 1 / (b.price || 1);

      return scoreB - scoreA;
    });
  }
}