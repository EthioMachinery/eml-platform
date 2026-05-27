export const machineryCategories = [
  {
    value: "Excavator",
    en: "Excavator",
    am: "ኤክስካቫተር",
  },
  {
    value: "Bulldozer",
    en: "ቡልዶዘር",
    am: "ቡልዶዘር",
  },
  {
    value: "Loader",
    en: "Loader",
    am: "ሎደር",
  },
  {
    value: "Backhoe Loader",
    en: "Backhoe Loader",
    am: "ባክሆ ሎደር",
  },
  {
    value: "Motor Grader",
    en: "Motor Grader",
    am: "ሞተር ግሬደር",
  },
  {
    value: "Dump Truck",
    en: "Dump Truck",
    am: "ዳምፕ ትራክ",
  },
  {
    value: "Concrete Mixer",
    en: "Concrete Mixer",
    am: "ኮንክሪት ሚክሰር",
  },
  {
    value: "Crane",
    en: "Crane",
    am: "ክሬን",
  },
  {
    value: "Forklift",
    en: "Forklift",
    am: "ፎርክሊፍት",
  },
  {
    value: "Roller",
    en: "Roller",
    am: "ሮለር",
  },
  {
    value: "Asphalt Paver",
    en: "Asphalt Paver",
    am: "አስፋልት ፔቨር",
  },
  {
    value: "Water Tanker",
    en: "Water Tanker",
    am: "ውሃ ታንከር",
  },
  {
    value: "Generator",
    en: "Generator",
    am: "ጀኔሬተር",
  },
  {
    value: "Compressor",
    en: "Compressor",
    am: "ኮምፕሬሰር",
  },
  {
    value: "Agricultural Machinery",
    en: "Agricultural Machinery",
    am: "የግብርና ማሽነሪ",
  },
  {
    value: "Other",
    en: "Other",
    am: "ሌላ",
  },
];

export const machineryConditions = [
  {
    value: "Brand New",
    en: "Brand New",
    am: "አዲስ",
  },
  {
    value: "Like New",
    en: "Like New",
    am: "እንደ አዲስ",
  },
  {
    value: "Excellent",
    en: "Excellent",
    am: "በጣም ጥሩ",
  },
  {
    value: "Very Good",
    en: "Very Good",
    am: "በጣም ጥሩ ሁኔታ",
  },
  {
    value: "Good",
    en: "Good",
    am: "ጥሩ",
  },
  {
    value: "Fair",
    en: "Fair",
    am: "መካከለኛ",
  },
  {
    value: "Needs Repair",
    en: "Needs Repair",
    am: "ጥገና ያስፈልጋል",
  },
  {
    value: "Refurbished",
    en: "Refurbished",
    am: "የታደሰ",
  },
  {
    value: "Used",
    en: "Used",
    am: "ያገለገለ",
  },
  {
    value: "For Parts",
    en: "For Parts",
    am: "ለመለዋወጫ",
  },
  {
    value: "Other",
    en: "Other",
    am: "ሌላ",
  },
];

export const rentalPeriods = [
  {
    value: "Hourly",
    en: "Hourly",
    am: "በሰዓት",
  },
  {
    value: "Daily",
    en: "Daily",
    am: "በቀን",
  },
  {
    value: "Weekly",
    en: "Weekly",
    am: "በሳምንት",
  },
  {
    value: "Monthly",
    en: "Monthly",
    am: "በወር",
  },
  {
    value: "Other",
    en: "Other",
    am: "ሌላ",
  },
];

export const fuelTypes = [
  {
    value: "Diesel",
    en: "Diesel",
    am: "ዲዝል",
  },
  {
    value: "Petrol",
    en: "Petrol",
    am: "ቤንዚን",
  },
  {
    value: "Electric",
    en: "Electric",
    am: "ኤሌክትሪክ",
  },
  {
    value: "Hybrid",
    en: "Hybrid",
    am: "ሀይብሪድ",
  },
  {
    value: "Other",
    en: "Other",
    am: "ሌላ",
  },
];

export const listingTypes = [
  {
    value: "Rental",
    en: "Rental",
    am: "ኪራይ",
  },
  {
    value: "Sale",
    en: "Sale",
    am: "ሽያጭ",
  },
];

export function getTranslatedOptions(
  options: any[],
  language: string
) {
  return options.map((option) => ({
    value: option.value,
    label:
      language === "am"
        ? option.am
        : option.en,
  }));
}