import { supabase } from "@/lib/supabaseClient";
import { SupportedLanguage } from "@/translations/keys";

export interface LocalizedListing {
  id: string;
  brand: string;
  model: string;
  categoryToken: string;
  modelYear: number;
  serialNumber: string;
  title: string;       // Resolved localized title
  description: string; // Resolved localized description
  priceSale: number | null;
  priceRentalDaily: number | null;
  isRentalOnly: boolean;
  status: string;
  engineHours?: number;
  locationToken?: string;
  verified?: boolean;
  imageUrl: string | null; // Added to map uploaded photo URLs
  ownerPhone?: string;     // Gated attribute
  ownerName?: string;      // Gated attribute
}

/**
 * Fetches active listings from Supabase, checks the user's active subscription tier, 
 * and scrubs sensitive details for free accounts [4].
 */
export async function fetchLocalizedListings(
  lang: SupportedLanguage,
  filters?: {
    category?: string;
    location?: string;
    maxPrice?: number;
    intent?: 'all' | 'rent' | 'sale';
  }
): Promise<LocalizedListing[]> {
  try {
    // 1. Resolve current active user session to check monetization tiers [4]
    const { data: { user } } = await supabase.auth.getUser();
    let isPremiumUser = false;

    if (user) {
      const { data: subData } = await supabase
        .from('subscriptions')
        .select('tier, active')
        .eq('user_id', user.id)
        .eq('active', true)
        .maybeSingle();

      if (subData && subData.tier !== 'free') {
        isPremiumUser = true;
      }
    }

    let query = supabase
      .from('listings')
      .select(`
        id,
        brand,
        model,
        category_token,
        model_year,
        serial_number,
        title_am,
        title_en,
        description_am,
        description_en,
        localized_title,
        localized_description,
        price,
        price_sale,
        price_rental_daily,
        is_rental_only,
        status,
        image_url,
        owner:owner_id (
          full_name,
          phone_number
        )
      `);

    // Only display verified available assets in directory
    query = query.eq('status', 'verified_available');

    // Apply active sidebar filters
    if (filters?.category) {
      query = query.eq('category_token', filters.category);
    }
    if (filters?.location) {
      query = query.eq('location', filters.location);
    }
    if (filters?.intent === 'rent') {
      query = query.eq('is_rental_only', true);
    } else if (filters?.intent === 'sale') {
      query = query.eq('is_rental_only', false);
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    if (!data) return [];

    // Map columns dynamically according to selected language
    return data.map((item: any) => {
      let title = "No Title";
      if (item.localized_title && typeof item.localized_title === "object") {
        title = item.localized_title[lang] || item.localized_title['en'] || title;
      } else {
        title = lang === 'am' ? (item.title_am || item.title_en) : (item.title_en || item.title_am || title);
      }

      let description = "No Description";
      if (item.localized_description && typeof item.localized_description === "object") {
        description = item.localized_description[lang] || item.localized_description['en'] || description;
      } else {
        description = lang === 'am' ? (item.description_am || item.description_en) : (item.description_en || item.description_am || description);
      }

      // 2. Perform Role Gating: Hide direct seller details for free users [4]
      const ownerInfo = item.owner as any;
      const ownerName = isPremiumUser ? (ownerInfo?.full_name || "Supplier") : "Verified EML Supplier";
      const ownerPhone = isPremiumUser ? (ownerInfo?.phone_number || "Contact via EML") : "Upgrade to view phone";
      const serialNumber = isPremiumUser ? (item.serial_number || "N/A") : "Vetted & Hidden";

      return {
        id: item.id,
        brand: item.brand || "Unknown",
        model: item.model || "Unknown",
        categoryToken: item.category_token || "machinery",
        modelYear: item.model_year || 2020,
        serialNumber,
        title,
        description,
        priceSale: item.price_sale ? Number(item.price_sale) : (item.price ? Number(item.price) : null),
        priceRentalDaily: item.price_rental_daily ? Number(item.price_rental_daily) : null,
        isRentalOnly: item.is_rental_only || false,
        status: item.status,
        engineHours: 1200, // Placeholder mapping
        locationToken: item.location || "addis_ababa",
        verified: true,    // Default trust state
        imageUrl: item.image_url || null,
        ownerName,
        ownerPhone
      };
    });
  } catch (err) {
    console.error("Failed to fetch machinery listings from database:", err);
    return [];
  }
}