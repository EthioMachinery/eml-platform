import { supabase } from "@/lib/supabaseClient";
import { SupportedLanguage, LocalizedListing } from "@/types"; 

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
    const { data: { user } } = await supabase.auth.getUser();
    let isPremiumUser = false;

    if (user) {
      const { data: subData, error: subError } = await supabase
        .from('subscriptions')
        .select('tier, active')
        .eq('user_id', user.id)
        .eq('active', true)
        .maybeSingle();

      if (subError) {
        console.warn("Could not resolve subscription tier:", subError.message);
      } else if (subData && subData.tier !== 'free') {
        isPremiumUser = true;
      }
    }

    // Using a Left Join (|) to ensure listings appear even if owner_id is missing or unlinked
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
        location,
        owner:profiles!owner_id | (
          full_name,
          phone_number
        )
      `);

    query = query.eq('status', 'verified_available');

    if (filters?.category) query = query.eq('category_token', filters.category);
    if (filters?.location) query = query.eq('location', filters.location);
    if (filters?.maxPrice) query = query.lte('price_sale', filters.maxPrice);
    if (filters?.intent === 'rent') query = query.eq('is_rental_only', true);
    else if (filters?.intent === 'sale') query = query.eq('is_rental_only', false);

    const { data, error } = await query;

    if (error) {
      throw new Error(`Supabase query failed: ${error.message} (code: ${error.code})`);
    }

    if (!data) return [];

    return data.map((item: any) => {
      let title = "No Title";
      if (item.localized_title && typeof item.localized_title === "object") {
        title = item.localized_title[lang] || item.localized_title['en'] || title;
      } else {
        title = lang === 'am'
          ? (item.title_am || item.title_en || title)
          : (item.title_en || item.title_am || title);
      }

      let description = "No Description";
      if (item.localized_description && typeof item.localized_description === "object") {
        description = item.localized_description[lang] || item.localized_description['en'] || description;
      } else {
        description = lang === 'am'
          ? (item.description_am || item.description_en || description)
          : (item.description_en || item.description_am || description);
      }

      const ownerInfo = Array.isArray(item.owner) ? item.owner[0] : item.owner;
      
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
        engineHours: 1200,
        locationToken: item.location || "addis_ababa",
        verified: true,
        imageUrl: item.image_url || null,
        ownerName,
        ownerPhone
      };
    });
  } catch (err) {
    const message = err instanceof Error
      ? err.message
      : JSON.stringify(err, Object.getOwnPropertyNames(err));
    console.error("Failed to fetch machinery listings from database:", message);
    return [];
  }
}