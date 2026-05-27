export interface EMLCategory {
  id: string;

  name_en: string;

  name_am: string;

  icon: string;

  color: string;

  type:
    | "marketplace"
    | "service"
    | "finance"
    | "transport"
    | "jobs"
    | "support";

  children?: {
    id: string;

    name_en: string;

    name_am: string;
  }[];
}

export const EML_CATEGORIES: EMLCategory[] = [
  {
    id: "excavators",

    name_en: "Excavators",

    name_am: "ኤክስካቫተሮች",

    icon: "🚜",

    color: "from-yellow-500 to-orange-500",

    type: "marketplace",

    children: [
      {
        id: "crawler_excavator",

        name_en: "Crawler Excavator",

        name_am: "ተንቀሳቃሽ ኤክስካቫተር",
      },

      {
        id: "mini_excavator",

        name_en: "Mini Excavator",

        name_am: "ሚኒ ኤክስካቫተር",
      },
    ],
  },

  {
    id: "loaders",

    name_en: "Loaders",

    name_am: "ሎደሮች",

    icon: "🏗️",

    color: "from-amber-500 to-yellow-500",

    type: "marketplace",
  },

  {
    id: "bulldozers",

    name_en: "Bulldozers",

    name_am: "ቡልዶዘሮች",

    icon: "🚧",

    color: "from-orange-500 to-red-500",

    type: "marketplace",
  },

  {
    id: "cranes",

    name_en: "Cranes",

    name_am: "ክሬኖች",

    icon: "🏢",

    color: "from-blue-500 to-cyan-500",

    type: "marketplace",
  },

  {
    id: "trucks",

    name_en: "Trucks",

    name_am: "ትራኮች",

    icon: "🚛",

    color: "from-green-500 to-emerald-500",

    type: "marketplace",
  },

  {
    id: "rentals",

    name_en: "Machinery Rentals",

    name_am: "የማሽነሪ ኪራይ",

    icon: "📦",

    color: "from-purple-500 to-pink-500",

    type: "marketplace",
  },

  {
    id: "transport",

    name_en: "Heavy Transport",

    name_am: "ከባድ ትራንስፖርት",

    icon: "🚚",

    color: "from-cyan-500 to-blue-500",

    type: "transport",
  },

  {
    id: "lowbed",

    name_en: "Lowbed Transport",

    name_am: "ሎውቤድ ትራንስፖርት",

    icon: "🚛",

    color: "from-indigo-500 to-blue-500",

    type: "transport",
  },

  {
    id: "mechanics",

    name_en: "Mechanics & Repair",

    name_am: "መካኒኮች እና ጥገና",

    icon: "🔧",

    color: "from-zinc-500 to-zinc-700",

    type: "service",
  },

  {
    id: "spare_parts",

    name_en: "Spare Parts",

    name_am: "መለዋወጫ እቃዎች",

    icon: "⚙️",

    color: "from-slate-500 to-zinc-700",

    type: "service",
  },

  {
    id: "operators",

    name_en: "Operators",

    name_am: "ኦፕሬተሮች",

    icon: "👷",

    color: "from-teal-500 to-cyan-500",

    type: "jobs",
  },

  {
    id: "drivers",

    name_en: "Drivers",

    name_am: "ሾፌሮች",

    icon: "🚘",

    color: "from-blue-500 to-indigo-500",

    type: "jobs",
  },

  {
    id: "insurance",

    name_en: "Insurance",

    name_am: "ኢንሹራንስ",

    icon: "🛡️",

    color: "from-emerald-500 to-green-500",

    type: "finance",
  },

  {
    id: "financing",

    name_en: "Financing",

    name_am: "ፋይናንስ",

    icon: "💰",

    color: "from-lime-500 to-green-500",

    type: "finance",
  },

  {
    id: "leasing",

    name_en: "Leasing",

    name_am: "ሊዝ",

    icon: "🏦",

    color: "from-yellow-500 to-lime-500",

    type: "finance",
  },

  {
    id: "fleet_management",

    name_en: "Fleet Management",

    name_am: "ፍሊት አስተዳደር",

    icon: "📊",

    color: "from-fuchsia-500 to-purple-500",

    type: "support",
  },

  {
    id: "ai_matching",

    name_en: "AI Smart Matching",

    name_am: "AI ስማርት ማጣመር",

    icon: "🤖",

    color: "from-cyan-400 to-blue-600",

    type: "support",
  },

  {
    id: "other",

    name_en: "Other",

    name_am: "ሌላ",

    icon: "➕",

    color: "from-zinc-500 to-zinc-700",

    type: "support",
  },
];

export function getCategoryById(id: string) {
  return EML_CATEGORIES.find(
    (item) => item.id === id
  );
}