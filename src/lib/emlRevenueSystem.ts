export type RevenueType =
  | "machinery_sale"
  | "machinery_rental"
  | "transport_service"
  | "operator_hiring"
  | "mechanic_service"
  | "spare_parts"
  | "insurance_referral"
  | "financing_referral"
  | "premium_listing"
  | "boost_listing"
  | "subscription"
  | "verification"
  | "advertisement"
  | "lead_generation"
  | "fleet_management"
  | "ai_matching"
  | "other";

export interface RevenueRule {
  type: RevenueType;

  label_en: string;

  label_am: string;

  commissionPercentage: number;

  minimumFee: number;

  maximumFee?: number;

  fixedFee?: number;

  escrowOptional: boolean;

  platformSharePercentage: number;
}

export const EML_REVENUE_RULES: RevenueRule[] =
  [
    {
      type: "machinery_sale",

      label_en: "Machinery Sale",

      label_am: "የማሽነሪ ሽያጭ",

      commissionPercentage: 3,

      minimumFee: 2500,

      escrowOptional: true,

      platformSharePercentage: 100,
    },

    {
      type: "machinery_rental",

      label_en: "Machinery Rental",

      label_am: "የማሽነሪ ኪራይ",

      commissionPercentage: 5,

      minimumFee: 500,

      escrowOptional: true,

      platformSharePercentage: 100,
    },

    {
      type: "transport_service",

      label_en: "Transport Service",

      label_am: "የትራንስፖርት አገልግሎት",

      commissionPercentage: 7,

      minimumFee: 300,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "operator_hiring",

      label_en: "Operator Hiring",

      label_am: "የኦፕሬተር ቅጥር",

      commissionPercentage: 8,

      minimumFee: 200,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "mechanic_service",

      label_en: "Mechanic Service",

      label_am: "የመካኒክ አገልግሎት",

      commissionPercentage: 6,

      minimumFee: 200,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "spare_parts",

      label_en: "Spare Parts",

      label_am: "መለዋወጫ እቃዎች",

      commissionPercentage: 4,

      minimumFee: 100,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "insurance_referral",

      label_en: "Insurance Referral",

      label_am: "የኢንሹራንስ ሪፈራል",

      commissionPercentage: 10,

      minimumFee: 500,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "financing_referral",

      label_en: "Financing Referral",

      label_am: "የፋይናንስ ሪፈራል",

      commissionPercentage: 12,

      minimumFee: 1000,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "premium_listing",

      label_en: "Premium Listing",

      label_am: "ፕሪሚየም ዝርዝር",

      commissionPercentage: 0,

      fixedFee: 3500,

      minimumFee: 3500,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "boost_listing",

      label_en: "Boost Listing",

      label_am: "ዝርዝር ማሳደጊያ",

      commissionPercentage: 0,

      fixedFee: 1500,

      minimumFee: 1500,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "subscription",

      label_en: "Subscription",

      label_am: "የደንበኝነት ምዝገባ",

      commissionPercentage: 0,

      fixedFee: 2500,

      minimumFee: 2500,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "verification",

      label_en: "Verification",

      label_am: "ማረጋገጫ",

      commissionPercentage: 0,

      fixedFee: 1000,

      minimumFee: 1000,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "advertisement",

      label_en: "Advertisement",

      label_am: "ማስታወቂያ",

      commissionPercentage: 0,

      fixedFee: 5000,

      minimumFee: 5000,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "lead_generation",

      label_en: "Lead Generation",

      label_am: "የደንበኛ ማግኛ",

      commissionPercentage: 15,

      minimumFee: 250,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "fleet_management",

      label_en: "Fleet Management",

      label_am: "ፍሊት አስተዳደር",

      commissionPercentage: 0,

      fixedFee: 10000,

      minimumFee: 10000,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "ai_matching",

      label_en: "AI Matching",

      label_am: "AI ማጣመር",

      commissionPercentage: 5,

      minimumFee: 500,

      escrowOptional: false,

      platformSharePercentage: 100,
    },

    {
      type: "other",

      label_en: "Other Revenue",

      label_am: "ሌላ ገቢ",

      commissionPercentage: 5,

      minimumFee: 100,

      escrowOptional: false,

      platformSharePercentage: 100,
    },
  ];

export function getRevenueRule(
  type: RevenueType
) {
  return EML_REVENUE_RULES.find(
    (item) => item.type === type
  );
}

export function calculateEMLRevenue({
  type,
  amount,
}: {
  type: RevenueType;

  amount: number;
}) {
  const rule =
    getRevenueRule(type);

  if (!rule) {
    return {
      commission: 0,

      sellerReceives:
        amount,

      platformRevenue: 0,
    };
  }

  let commission = 0;

  if (rule.fixedFee) {
    commission =
      rule.fixedFee;
  } else {
    commission =
      (amount *
        rule.commissionPercentage) /
      100;
  }

  if (
    commission <
    rule.minimumFee
  ) {
    commission =
      rule.minimumFee;
  }

  if (
    rule.maximumFee &&
    commission >
      rule.maximumFee
  ) {
    commission =
      rule.maximumFee;
  }

  const sellerReceives =
    amount - commission;

  return {
    commission,

    sellerReceives,

    platformRevenue:
      commission,
  };
}

export function formatRevenueLabel(
  type: RevenueType,

  language: "en" | "am"
) {
  const rule =
    getRevenueRule(type);

  if (!rule)
    return language === "am"
      ? "ሌላ"
      : "Other";

  return language === "am"
    ? rule.label_am
    : rule.label_en;
}

export function isEscrowOptional(
  type: RevenueType
) {
  const rule =
    getRevenueRule(type);

  return (
    rule?.escrowOptional ||
    false
  );
}