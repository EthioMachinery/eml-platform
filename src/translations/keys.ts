export const translationKeys = [
  // NAVIGATION

  "dashboard",
  "browse",
  "upload",
  "fleet",
  "operators",
  "jobs",
  "mechanics",
  "transport",
  "finance",
  "insurance",
  "fuel",
  "enterprise",
  "notifications",
  "settings",
  "languages",

  // HERO

  "heroTitle",
  "heroSubtitle",
  "heroDescription",

  // CTA

  "findMachinery",
  "listMachinery",
  "openDashboard",

  // STATS

  "machineryListings",
  "industrialUsers",
  "trustEcosystem",
  "rentalListings",

  // TRUST

  "verifiedSellers",
  "secureTransactions",
  "industrialEcosystem",
  "bilingualPlatform",

  // ECOSYSTEM

  "ecosystem",
  "everythingIndustrialBusinessesNeed",
  "ecosystemDescription",

  "machineryMarketplace",
  "machineryMarketplaceDesc",

  "transportLogistics",
  "transportLogisticsDesc",

  "operatorsJobs",
  "operatorsJobsDesc",

  "mechanicsWorkshops",
  "mechanicsWorkshopsDesc",

  "spareParts",
  "sparePartsDesc",

  "financeInsurance",
  "financeInsuranceDesc",

  // COMMON

  "explore",
] as const;

export type TranslationKey =
  typeof translationKeys[number];