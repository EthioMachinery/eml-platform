// 🔥 SMART MATCHING v3 ENGINE

// ✅ TYPE SYNONYMS (customize later)
const TYPE_MAP: Record<string, string[]> = {
  excavator: ["excavator", "digger", "cat"],
  bulldozer: ["bulldozer", "dozer"],
  loader: ["loader", "wheel loader"],
  grader: ["grader", "motor grader"],
};

// ✅ LOCATION GROUPS (Ethiopia-focused)
const LOCATION_GROUPS: Record<string, string[]> = {
  addis: ["addis", "addis ababa", "bishoftu", "adama"],
  oromia: ["adama", "bishoftu", "jimma"],
};

// 🔧 NORMALIZE TEXT SAFELY
const normalize = (text?: string) => {
  if (!text) return "";
  return text.toLowerCase().trim();
};

// 🔥 TYPE MATCH (SMART)
export const typeMatch = (machineType?: string, requestType?: string) => {
  const m = normalize(machineType);
  const r = normalize(requestType);

  if (!m || !r) return false;

  for (let key in TYPE_MAP) {
    const synonyms = TYPE_MAP[key];

    const mMatch = synonyms.some((s) => m.includes(s));
    const rMatch = synonyms.some((s) => r.includes(s));

    if (mMatch && rMatch) return true;
  }

  return m.includes(r) || r.includes(m);
};

// 🔥 LOCATION MATCH (SMART)
export const locationScore = (machineLoc?: string, requestLoc?: string) => {
  const m = normalize(machineLoc);
  const r = normalize(requestLoc);

  if (!m || !r) return 0;

  if (m === r) return 30;

  for (let group in LOCATION_GROUPS) {
    const cities = LOCATION_GROUPS[group];

    const mIn = cities.some((c) => m.includes(c));
    const rIn = cities.some((c) => r.includes(c));

    if (mIn && rIn) return 25; // same region
  }

  if (m.includes(r) || r.includes(m)) return 15;

  return 0;
};

// 🔥 MAIN MATCH FUNCTION
export const calculateMatchScore = (
  machine: any,
  request: any
) => {

  // ❌ TYPE MUST MATCH
  if (!typeMatch(machine.type, request.machine_type)) {
    return 0;
  }

  let score = 40; // base score

  // 📍 LOCATION
  score += locationScore(machine.location, request.location);

  // 💰 BUDGET
  if (machine.price && request.budget) {
    const price = parseFloat(machine.price);
    const budget = parseFloat(request.budget);

    if (!isNaN(price) && !isNaN(budget)) {
      if (price <= budget) score += 20;
      else if (price <= budget * 1.2) score += 10;
    }
  }

  // ⚙️ AVAILABILITY
  if (machine.availability === "available") {
    score += 15;
  }

  // 👷 OPERATOR MATCH
  if (
    machine.operator_included === request.operator_required
  ) {
    score += 10;
  }

  return score;
};