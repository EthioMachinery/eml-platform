export type { SupportedLanguage } from "@/translations/keys";

export interface LocalizedListing {
  id: string;
  brand: string;
  model: string;
  categoryToken: string;
  modelYear: number;
  serialNumber: string;
  title: string;
  description: string;
  priceSale: number | null;
  priceRentalDaily: number | null;
  isRentalOnly: boolean;
  status: string;
  engineHours: number;
  locationToken: string;
  verified: boolean;
  imageUrl: string | null;
  ownerId: string | null;
  ownerName: string;
  ownerPhone: string;
}
