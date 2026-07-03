const translations = {
  en: {
    // GENERAL
    loading: "Loading...",
    submit: "Submit",
    cancel: "Cancel",
    save: "Save Changes",
    yes: "Yes",
    no: "No",
    back: "Back",
    all: "All Assets",
    filter: "Filter Marketplace",
    search: "Search Machinery...",

    // NAV / HEADER
    dashboard: "Dashboard",
    browse: "Browse",
    requests: "Machine Requests",
    notifications: "Notifications",
    wallet: "Financial Ledger",
    ceoWarRoom: "CEO Command Center",
    adminPanel: "Admin Hub",

    // USER / AUTH
    loggedInAs: "Node Identity:",
    role: "Operational Role",
    notSelected: "Role Not Defined",
    logout: "De-authenticate",
    fullName: "Legal Full Name",
    email: "Industrial Email",
    phone: "Contact Line",
    company: "Organization Name",
    trustScore: "Ecosystem Trust Score",
    verifiedUser: "KYC Verified",
    bio: "Technical Background",
    yearsExperience: "Industry Tenure (Years)",

    // ROLES
    owner: "Machinery Fleet Owner",
    renter: "Heavy Equipment Renter",
    operatorRole: "Certified Heavy Operator",
    serviceProvider: "Maintenance Engineer",
    inspector: "Safety Auditor",
    logistics: "Logistics Coordinator",

    // BROWSE & SEARCH
    browseTitle: "Global Machinery Grid",
    boost: "Accelerate Listing",
    premium: "Elite Tier Asset",
    type: "Asset Classification",
    category: "Equipment Category",
    location: "Geographic Region",
    price: "Acquisition Cost",
    rentPrice: "Daily Rental Rate",
    expires: "Session Expiration",
    condition: "Technical Condition",
    year: "Year of Manufacture",
    verifiedListing: "TM Certified Asset",

    // INQUIRY FORM
    inquiry: {
      title: "Initialize Secure Inquiry",
      typeLabel: "Procurement Type",
      placeholderName: "Enter your legal name",
      placeholderMessage: "Describe your project scope and duration requirements...",
      placeholderOther: "please specify, mention, describe or other appropriate means of description",
      submit: "Transmit Message",
      success: "Inquiry Synced to Cloud. Seller Notified via Telegram.",
      error: "Transmission Error. Verify TM Node connection.",
      options: {
        purchase: "Direct Asset Purchase",
        rental: "Strategic Rental Lease",
        parts: "Component Procurement",
        maintenance: "Technical Service Request",
        operator: "Operator Deployment",
        other: "Other (Specify Below)"
      }
    },

    // PAYMENT & ESCROW
    paymentInstructions: "Secure Payout Protocols",
    submitPayment: "Commit Transaction",
    transactionPlaceholder: "Bank Ledger Reference ID",
    loginRequired: "Identity Verification Required",
    enterRef: "Reference ID must be strictly provided",
    successPayment: "Funds Secured. Awaiting AI Document Audit.",
    errorPayment: "Transaction Ledger Failure",
    escrowSecure: "Atomic Escrow Active",
    commission: "Network Service Fee",

    // REVIEWS
    reviews: {
      title: "Verified Feedback",
      write: "Rate the Transaction",
      placeholder: "Detail the machine condition and operator professionalism...",
      verified: "Verified Industrial Transaction",
      ratingLabel: "Performance Rating",
      submit: "Publish Feedback",
      success: "Feedback published to the Global Trust Ledger.",
      noReviews: "No verified historical data for this asset.",
      impact: "Reputation Momentum"
    },

    // DASHBOARD & ANALYTICS
    myMachinery: "Fleet Inventory",
    noMachines: "No assets found in local node",
    updateStatus: "Toggle Availability",
    available: "Available",
    rented: "Rented",
    sold: "Sold",
    maintenance: "Offline / Repair",
    revenue: "Network Revenue",
    deals: "Escrow Pipeline",
    findJobs: "Scan for Contracts",
    offerServices: "Broadcast Services",

    // ALERTS
    noNotifications: "Node Status: Nominal",
    machineMatch: "Match Potential Detected",
    matchFound: "Syncs with your active procurement request",
  },

  am: {
    // GENERAL
    loading: "በመጫን ላይ...",
    submit: "አስገባ",
    cancel: "ይቅር",
    save: "ለውጦችን መዝግብ",
    yes: "አዎ",
    no: "አይ",
    back: "ተመለስ",
    all: "ሁሉም",
    filter: "አጣራ",
    search: "ፈልግ...",

    // NAV
    dashboard: "ዳሽቦርድ",
    browse: "ገበያ",
    requests: "የማሽን ጥያቄዎች",
    notifications: "ማሳወቂያዎች",
    wallet: "የኔ ቦርሳ",
    ceoWarRoom: "ዋና መቆጣጠሪያ",
    adminPanel: "የአስተዳዳሪ ክፍል",

    // USER
    loggedInAs: "የገባው ተጠቃሚ:",
    role: "ሚና",
    notSelected: "አልተመረጠም",
    logout: "ውጣ",
    fullName: "ሙሉ ስም",
    email: "ኢሜይል",
    phone: "ስልክ ቁጥር",
    company: "የድርጅት ስም",
    trustScore: "የታማኝነት ነጥብ",
    verifiedUser: "የተረጋገጠ ተጠቃሚ",
    bio: "ስለ ተጠቃሚው",
    yearsExperience: "የስራ ልምድ (በዓመት)",

    // ROLES
    owner: "የማሽን ባለቤት",
    renter: "ተከራይ",
    operatorRole: "ኦፕሬተር",
    serviceProvider: "የጥገና ባለሙያ",
    inspector: "ቴክኒካል መርማሪ",
    logistics: "የትራንስፖርት አቅራቢ",

    // BROWSE
    browseTitle: "የማሽነሪ ገበያ",
    boost: "ፕሪሚየም አድርግ",
    premium: "ፕሪሚየም",
    type: "የማሽን አይነት",
    category: "ምድብ",
    location: "አካባቢ",
    price: "የሽያጭ ዋጋ",
    rentPrice: "የኪራይ ዋጋ",
    expires: "የሚያበቃበት ቀን",
    condition: "የማሽኑ ሁኔታ",
    year: "የተመረተበት ዓመት",
    verifiedListing: "የተረጋገጠ ማሽን",

    // INQUIRY FORM
    inquiry: {
      title: "ጥያቄ ይላኩ",
      typeLabel: "ምን አይነት ጥያቄ አለዎት?",
      placeholderName: "ሙሉ ስምዎን ያስገቡ",
      placeholderMessage: "የፍላጎትዎን ዝርዝር ወይም የፕሮጀክቱን ሁኔታ እዚህ ይግለጹ...",
      placeholderOther: "እባክዎን ይጥቀሱ፣ ይጥቀሱ፣ ይግለጹ ወይም በሌላ ተገቢ መግለጫ ያብራሩ",
      submit: "መልዕክት ላክ",
      success: "ጥያቄዎ በትክክል ተልኳል! ባለቤቱ በቴሌግራም ይደርሰዋል።",
      error: "ጥያቄውን ለመላክ አልተሳካም። እባክዎ ኢንተርኔትዎን ያረጋግጡ።",
      options: {
        purchase: "ለግዢ",
        rental: "ለኪራይ",
        parts: "መለዋወጫ ለመጠየቅ",
        maintenance: "ለጥገና አገልግሎት",
        operator: "ኦፕሬተር ለመቅጠር",
        other: "ሌላ (እባክዎ ከታች ይጥቀሱ)"
      }
    },

    // PAYMENT
    paymentInstructions: "የክፍያ መመሪያ",
    submitPayment: "ክፍያ አረጋግጥ",
    transactionPlaceholder: "የባንክ ማስተላለፊያ ቁጥር (Reference)",
    loginRequired: "ለመቀጠል እባክዎ ይግቡ",
    enterRef: "እባክዎ የክፍያ መለያ ቁጥሩን ያስገቡ",
    successPayment: "ማስረጃው ለምርመራ ቀርቧል",
    errorPayment: "ማስረጃውን መላክ አልተሳካም",
    escrowSecure: "አስተማማኝ ክፍያ",
    commission: "የአገልግሎት ክፍያ",

    // REVIEWS
    reviews: {
      title: "የተጠቃሚዎች ምስክርነት",
      write: "ልምድዎን ያጋሩ",
      placeholder: "ስለ ማሽኑ ሁኔታ እና ስለ ባለቤቱ አያያዝ ያብራሩ...",
      verified: "የተረጋገጠ ግዢ",
      ratingLabel: "አጠቃላይ ደረጃ",
      submit: "ምስክርነት አስገባ",
      success: "ምስክርነትዎ በታማኝነት መዝገብ ላይ ተመዝግቧል።",
      noReviews: "እስካሁን የተሰጠ ምስክርነት የለም።",
      impact: "በታማኝነት ነጥብ ላይ ያለው ተጽዕኖ"
    },

    // DASHBOARD
    myMachinery: "የኔ ማሽኖች",
    noMachines: "እስካሁን ምንም ማሽን አላስመዘገቡም",
    updateStatus: "ሁኔታውን ቀይር",
    available: "ዝግጁ",
    rented: "የተከራየ",
    sold: "የተሸጠ",
    maintenance: "ጥገና ላይ",
    revenue: "ጠቅላላ ገቢ",
    deals: "የተደረጉ ስምምነቶች",
    findJobs: "ስራ ፈልግ",
    offerServices: "አገልግሎት አቅርብ",

    // ALERTS
    noNotifications: "ምንም አዲስ ማሳወቂያ የለም",
    machineMatch: "አዲስ ማሽን ተገኝቷል",
    matchFound: "ከጥያቄዎ ጋር ይስማማል",
  },
};
export default translations;
