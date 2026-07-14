export interface TranslationSchema {
  nav: {
    home: string;
    browse: string;
    postMachinery: string;
    postRequest: string;
    dashboard: string;
    escrow: string;
    admin: string;
    login: string;
    about: string;
    contact: string;
  };
  home: {
    badge: string;
    headline: string;
    subheadline: string;
  };
  carousel: {
    slide1: { title: string; desc: string; cta: string };
    slide2: { title: string; desc: string; cta: string };
    slide3: { title: string; desc: string; cta: string };
    prev: string;
    next: string;
    goToSlide: string;
  };
  categories: {
    excavator: string;
    loader: string;
    dozer: string;
    crane: string;
    grader: string;
    roller: string;
    dumpTruck: string;
    generator: string;
    backhoe: string;
  };
  actions: {
    search: string;
    rent: string;
    buy: string;
    sell: string;
    contactSeller: string;
    getQuote: string;
    submit: string;
    cancel: string;
    uploadImage: string;
    verifyPayment: string;
    other: string;
    filterAll: string;
    filterRent: string;
    filterBuy: string;
  };
  placeholders: {
    searchPlaceholder: string;
    selectCategory: string;
    selectLocation: string;
    selectModelYear: string;
    priceMin: string;
    priceMax: string;
    enterPhone: string;
    additionalDetails: string;
  };
  status: {
    available: string;
    rented: string;
    sold: string;
    pendingVerification: string;
    verified: string;
  };
  labels: {
    dailyRate: string;
    salePrice: string;
    location: string;
    owner: string;
    specification: string;
    condition: string;
    workingHours: string;
  };
  footer: {
    tagline: string;
    marketplace: string;
    company: string;
    aboutUs: string;
    contact: string;
    enterprise: string;
    upload: string;
    fleet: string;
    allRightsReserved: string;
  };
  dashboard: {
    title: string;
    loggedInAs: string;
    logout: string;
  };
  ecosystem: {
    title: string;
    subtitle: string;
    tagline: string;
    supplyTitle: string;
    demandTitle: string;
    revenueTitle: string;
    revenueSubtitle: string;
  };
  stakeholders: {
    owners: string;
    renters: string;
    contractors: string;
    miners: string;
    farmers: string;
    investors: string;
    operators: string;
    mechanics: string;
    transporters: string;
    insurers: string;
    parts: string;
    fuel: string;
    owners_desc: string;
    renters_desc: string;
    contractors_desc: string;
    miners_desc: string;
    farmers_desc: string;
    investors_desc: string;
    operators_desc: string;
    mechanics_desc: string;
    transporters_desc: string;
    insurers_desc: string;
    parts_desc: string;
    fuel_desc: string;
  };
  services: {
    escrow: string;
    jobs: string;
    tenders: string;
    logistics: string;
    spareParts: string;
    inspection: string;
  };
  jobs: {
    title: string;
    subtitle: string;
    filterTalent: string;
    keywordSearch: string;
    searchPlaceholder: string;
    experience: string;
    years: string;
    specialties: string;
    baseDailyRate: string;
    bookStaff: string;
    hydraulics: string;
    catEngines: string;
    lowbed: string;
    hauler: string;
  };
  tenders: {
    title: string;
    subtitle: string;
    allTenders: string;
    civilWorks: string;
    agriculture: string;
    mining: string;
    filterTenders: string;
    keywordSearch: string;
    searchPlaceholder: string;
    verifiedAgency: string;
    issuedBy: string;
    deploymentSite: string;
    submissionDeadline: string;
    estimatedBudget: string;
    registerToBid: string;
    noResults: string;
  };
}

export type SupportedLanguage = 'en' | 'am' | 'or' | 'ti' | 'so';
export type TranslationKey = string;