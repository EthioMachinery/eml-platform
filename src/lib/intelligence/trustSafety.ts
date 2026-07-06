export type TrustRiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type MachineryListingInput = {
  title?: unknown;
  category?: unknown;
  brand?: unknown;
  city?: unknown;
  condition?: unknown;
  year?: unknown;
  price?: unknown;
  rentPrice?: unknown;
  forSale?: unknown;
  forRent?: unknown;
  description?: unknown;
  imageUrl?: unknown;
};

export type TrustSafetyDecision = {
  trustScore: number;
  riskLevel: TrustRiskLevel;
  reviewRequired: boolean;
  signals: string[];
  recommendations: string[];
};

export function sanitizeText(value: unknown, maxLength = 240): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

export function toFiniteNumber(value: unknown): number | null {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function clampScore(score: number) {
  return Math.max(0, Math.min(100, Math.round(score)));
}

function riskFromScore(score: number): TrustRiskLevel {
  if (score < 35) return "CRITICAL";
  if (score < 55) return "HIGH";
  if (score < 75) return "MEDIUM";
  return "LOW";
}

export function analyzeMachineryListing(input: MachineryListingInput): TrustSafetyDecision {
  const currentYear = new Date().getFullYear();
  const title = sanitizeText(input.title, 160);
  const category = sanitizeText(input.category, 80);
  const brand = sanitizeText(input.brand, 80);
  const city = sanitizeText(input.city, 80);
  const condition = sanitizeText(input.condition, 80);
  const description = sanitizeText(input.description, 1800);
  const imageUrl = sanitizeText(input.imageUrl, 600);
  const year = toFiniteNumber(input.year);
  const price = toFiniteNumber(input.price);
  const rentPrice = toFiniteNumber(input.rentPrice);
  const forSale = input.forSale !== false;
  const forRent = input.forRent === true;

  let score = 86;
  const signals: string[] = ["SESSION_BOUND_SELLER_ID"];
  const recommendations: string[] = [];

  if (title.length < 6) {
    score -= 18;
    signals.push("TITLE_TOO_SHORT");
    recommendations.push("Add a specific machine title with brand, model, and capacity.");
  }

  if (!category) {
    score -= 18;
    signals.push("CATEGORY_MISSING");
    recommendations.push("Choose a machine category so buyers can compare it correctly.");
  }

  if (!city) {
    score -= 12;
    signals.push("LOCATION_MISSING");
    recommendations.push("Add city or region for logistics and inspection planning.");
  }

  if (!brand) {
    score -= 8;
    signals.push("BRAND_MISSING");
  }

  if (year !== null && (year < 1970 || year > currentYear + 1)) {
    score -= 18;
    signals.push("YEAR_OUT_OF_RANGE");
    recommendations.push("Verify the production year before publishing.");
  }

  if (forSale && (price === null || price <= 0)) {
    score -= 30;
    signals.push("SALE_PRICE_INVALID");
    recommendations.push("Set a positive sale price in ETB.");
  }

  if (forRent && (rentPrice === null || rentPrice <= 0)) {
    score -= 18;
    signals.push("RENT_PRICE_INVALID");
    recommendations.push("Set a positive daily rental price in ETB.");
  }

  if (price !== null && price > 10_000_000 && !imageUrl) {
    score -= 16;
    signals.push("HIGH_VALUE_WITHOUT_IMAGE");
    recommendations.push("Upload clear inspection photos for high-value listings.");
  }

  if (price !== null && price > 0 && price < 50_000 && category.toLowerCase().includes("excavator")) {
    score -= 32;
    signals.push("ANOMALY_LOW_EXCAVATOR_PRICE");
    recommendations.push("Review price accuracy before marketplace exposure.");
  }

  if (description.length > 0 && description.length < 30) {
    score -= 6;
    signals.push("DESCRIPTION_TOO_LIGHT");
  }

  if (!condition) {
    score -= 6;
    signals.push("CONDITION_MISSING");
  }

  const trustScore = clampScore(score);
  const riskLevel = riskFromScore(trustScore);

  return {
    trustScore,
    riskLevel,
    reviewRequired: riskLevel === "HIGH" || riskLevel === "CRITICAL",
    signals,
    recommendations,
  };
}

export function detectImageMime(buffer: Buffer): "image/jpeg" | "image/png" | "image/webp" | null {
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return "image/png";
  }

  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

export function extensionForMime(mimeType: "image/jpeg" | "image/png" | "image/webp") {
  if (mimeType === "image/jpeg") return "jpg";
  if (mimeType === "image/png") return "png";
  return "webp";
}

export type VerificationDocumentMime =
  | "application/pdf"
  | "image/jpeg"
  | "image/png"
  | "image/webp";

export function detectVerificationDocumentMime(buffer: Buffer): VerificationDocumentMime | null {
  if (buffer.length >= 5 && buffer.toString("ascii", 0, 5) === "%PDF-") {
    return "application/pdf";
  }

  return detectImageMime(buffer);
}

export function extensionForVerificationDocument(mimeType: VerificationDocumentMime) {
  if (mimeType === "application/pdf") return "pdf";
  return extensionForMime(mimeType);
}

export function analyzeVerificationDocument(input: {
  fileName: string;
  declaredMime: string;
  detectedMime: VerificationDocumentMime | null;
  size: number;
}): TrustSafetyDecision {
  let score = 94;
  const signals = ["SERVER_SIDE_KYC_STORAGE_WRITE", "SESSION_BOUND_PROFILE_UPDATE"];
  const recommendations: string[] = [];

  if (!input.detectedMime) {
    score -= 80;
    signals.push("DOCUMENT_MAGIC_BYTES_UNRECOGNIZED");
    recommendations.push("Upload a valid PDF, JPEG, PNG, or WebP document.");
  }

  if (input.detectedMime && input.detectedMime !== input.declaredMime) {
    score -= 35;
    signals.push("DOCUMENT_MIME_MISMATCH");
    recommendations.push("Re-export the document so its content matches its file type.");
  }

  if (input.size > 10 * 1024 * 1024) {
    score -= 60;
    signals.push("DOCUMENT_TOO_LARGE");
    recommendations.push("Compress the verification document below 10MB.");
  }

  if (!/\.(pdf|jpe?g|png|webp)$/i.test(input.fileName)) {
    score -= 8;
    signals.push("DOCUMENT_EXTENSION_NORMALIZED");
  }

  const trustScore = clampScore(score);
  const riskLevel = riskFromScore(trustScore);

  return {
    trustScore,
    riskLevel,
    reviewRequired: true,
    signals,
    recommendations,
  };
}

export function analyzeImageUpload(input: {
  fileName: string;
  declaredMime: string;
  detectedMime: string | null;
  size: number;
}): TrustSafetyDecision {
  let score = 92;
  const signals = ["SERVER_SIDE_STORAGE_WRITE"];
  const recommendations: string[] = [];

  if (!input.detectedMime) {
    score -= 70;
    signals.push("MAGIC_BYTES_UNRECOGNIZED");
    recommendations.push("Upload a valid JPEG, PNG, or WebP image.");
  }

  if (input.detectedMime && input.detectedMime !== input.declaredMime) {
    score -= 40;
    signals.push("MIME_MISMATCH");
    recommendations.push("Re-export the image so its content matches the declared file type.");
  }

  if (input.size > 5 * 1024 * 1024) {
    score -= 50;
    signals.push("FILE_TOO_LARGE");
    recommendations.push("Compress the image below 5MB.");
  }

  if (!/\.(jpe?g|png|webp)$/i.test(input.fileName)) {
    score -= 8;
    signals.push("EXTENSION_NORMALIZED");
  }

  const trustScore = clampScore(score);
  const riskLevel = riskFromScore(trustScore);

  return {
    trustScore,
    riskLevel,
    reviewRequired: riskLevel === "HIGH" || riskLevel === "CRITICAL",
    signals,
    recommendations,
  };
}
