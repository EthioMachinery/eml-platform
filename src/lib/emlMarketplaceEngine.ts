import {
  EML_CATEGORIES,
} from "@/lib/emlCategories";

export type EMLRole =
  | "buyer"
  | "seller"
  | "renter"
  | "operator"
  | "mechanic"
  | "transporter"
  | "insurer"
  | "financier"
  | "parts_provider"
  | "contractor"
  | "government"
  | "ngo"
  | "admin"
  | "other";

export interface MarketplaceProfile {
  id: string;

  role: EMLRole;

  name: string;

  city?: string;

  region?: string;

  categories?: string[];

  verified?: boolean;

  rating?: number;

  active?: boolean;
}

export interface MarketplaceRequest {
  id: string;

  type:
    | "buy"
    | "rent"
    | "transport"
    | "repair"
    | "hire"
    | "finance"
    | "insurance";

  category: string;

  title: string;

  city?: string;

  region?: string;

  budget?: number;

  urgency?:
    | "low"
    | "medium"
    | "high";

  verifiedOnly?: boolean;
}

export interface MarketplaceMatch {
  profileId: string;

  score: number;

  reasons: string[];
}

export function normalizeText(
  value?: string
) {
  return (
    value || ""
  )
    .toLowerCase()
    .trim();
}

export function calculateMatchScore({
  request,
  profile,
}: {
  request: MarketplaceRequest;

  profile: MarketplaceProfile;
}) {
  let score = 0;

  const reasons: string[] =
    [];

  if (
    profile.categories?.includes(
      request.category
    )
  ) {
    score += 40;

    reasons.push(
      "Category match"
    );
  }

  if (
    normalizeText(
      profile.city
    ) ===
    normalizeText(
      request.city
    )
  ) {
    score += 25;

    reasons.push(
      "Same city"
    );
  }

  if (
    normalizeText(
      profile.region
    ) ===
    normalizeText(
      request.region
    )
  ) {
    score += 15;

    reasons.push(
      "Same region"
    );
  }

  if (profile.verified) {
    score += 10;

    reasons.push(
      "Verified provider"
    );
  }

  if (
    profile.rating &&
    profile.rating >= 4
  ) {
    score += 10;

    reasons.push(
      "Highly rated"
    );
  }

  return {
    score,

    reasons,
  };
}

export function generateMarketplaceMatches({
  request,
  profiles,
}: {
  request: MarketplaceRequest;

  profiles: MarketplaceProfile[];
}) {
  const matches: MarketplaceMatch[] =
    [];

  profiles.forEach(
    (profile) => {
      const result =
        calculateMatchScore({
          request,

          profile,
        });

      if (
        result.score >= 25
      ) {
        matches.push({
          profileId:
            profile.id,

          score:
            result.score,

          reasons:
            result.reasons,
        });
      }
    }
  );

  return matches.sort(
    (a, b) =>
      b.score - a.score
  );
}

export function getRoleLabel(
  role: EMLRole,

  language:
    | "en"
    | "am"
) {
  const labels = {
    buyer: {
      en: "Buyer",

      am: "ገዥ",
    },

    seller: {
      en: "Seller",

      am: "ሻጭ",
    },

    renter: {
      en: "Renter",

      am: "ተከራይ",
    },

    operator: {
      en: "Operator",

      am: "ኦፕሬተር",
    },

    mechanic: {
      en: "Mechanic",

      am: "መካኒክ",
    },

    transporter: {
      en: "Transporter",

      am: "አጓጓዥ",
    },

    insurer: {
      en: "Insurer",

      am: "ኢንሹራንስ",
    },

    financier: {
      en: "Financier",

      am: "ፋይናንስ",
    },

    parts_provider: {
      en: "Parts Provider",

      am: "መለዋወጫ አቅራቢ",
    },

    contractor: {
      en: "Contractor",

      am: "ኮንትራክተር",
    },

    government: {
      en: "Government",

      am: "መንግስት",
    },

    ngo: {
      en: "NGO",

      am: "ድርጅት",
    },

    admin: {
      en: "Administrator",

      am: "አስተዳዳሪ",
    },

    other: {
      en: "Other",

      am: "ሌላ",
    },
  };

  return labels[role][
    language
  ];
}

export function getAllMarketplaceCategories() {
  return EML_CATEGORIES;
}

export function getMarketplaceStats() {
  return {
    totalCategories:
      EML_CATEGORIES.length,

    ecosystemCoverage:
      [
        "Marketplace",
        "Transport",
        "Finance",
        "Insurance",
        "Jobs",
        "Repair",
        "Spare Parts",
        "AI Matching",
        "Fleet Management",
      ],

    supportedCountries: [
      "Ethiopia",
    ],

    languages: [
      "Amharic",
      "English",
    ],
  };
}

export function generateSmartSuggestions(
  search: string
) {
  const normalized =
    normalizeText(search);

  return EML_CATEGORIES.filter(
    (item) =>
      normalizeText(
        item.name_en
      ).includes(
        normalized
      ) ||
      normalizeText(
        item.name_am
      ).includes(
        normalized
      )
  ).slice(0, 8);
}

export function shouldTriggerTransport(
  category: string
) {
  const transportHeavy =
    [
      "excavators",
      "bulldozers",
      "cranes",
      "loaders",
      "trucks",
    ];

  return transportHeavy.includes(
    category
  );
}

export function shouldTriggerInsurance(
  amount: number
) {
  return amount >= 3000000;
}

export function shouldTriggerFinancing(
  amount: number
) {
  return amount >= 5000000;
}

export function shouldTriggerEscrow(
  amount: number
) {
  return amount >= 7000000;
}