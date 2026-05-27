export type MatchRequest = {
  id: string;
  category: string;
  location: string;
  budget?: number;
  durationDays?: number;
};

export type MatchCandidate = {
  id: string;
  title: string;
  category: string;
  location: string;
  price?: number;
  verified?: boolean;
};

export type MatchResult = {
  candidate: MatchCandidate;
  score: number;
  reasons: string[];
};

export class MatchingEngine {
  static run(
    request: MatchRequest,
    candidates: MatchCandidate[]
  ): MatchResult[] {
    const results = candidates.map((candidate) => {
      let score = 0;
      const reasons: string[] = [];

      // CATEGORY MATCH
      if (
        candidate.category.toLowerCase() ===
        request.category.toLowerCase()
      ) {
        score += 50;
        reasons.push("Category match");
      }

      // LOCATION MATCH
      if (
        candidate.location.toLowerCase() ===
        request.location.toLowerCase()
      ) {
        score += 30;
        reasons.push("Same location");
      }

      // PRICE FIT
      if (
        request.budget &&
        candidate.price &&
        candidate.price <= request.budget
      ) {
        score += 15;
        reasons.push("Within budget");
      }

      // VERIFIED BONUS
      if (candidate.verified) {
        score += 10;
        reasons.push("Verified provider");
      }

      return {
        candidate,
        score,
        reasons,
      };
    });

    return results.sort((a, b) => b.score - a.score).slice(0, 10);
  }
}