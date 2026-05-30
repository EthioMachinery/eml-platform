// src/lib/db/machinery/search.ts
// EML — Machinery Search Engine
//
// Powers the marketplace search with full-text search and composite filters.
// Utilises the composite index: (category, city, status, created_at DESC)
//
// Usage:
//   import { searchMachinery } from '@/lib/db/machinery/search';
//
//   const results = await searchMachinery({
//     query:    'excavator',
//     category: 'earthmoving',
//     city:     'Addis Ababa',
//     minPrice: 100000,
//     maxPrice: 5000000,
//   });

import { supabaseAdmin } from '@/lib/supabase/adminClient';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MachinerySearchParams {
  query?:      string;   // Full-text search on title + description
  category?:   string;   // e.g. 'earthmoving', 'lifting', 'concrete'
  city?:       string;   // Ethiopian city name
  type?:       string;   // Machine type e.g. 'excavator', 'crane'
  condition?:  string;   // 'new' | 'used' | 'refurbished'
  minPrice?:   number;   // Minimum price in ETB
  maxPrice?:   number;   // Maximum price in ETB
  minYear?:    number;   // Minimum manufacture year
  maxYear?:    number;   // Maximum manufacture year
  forSale?:    boolean;  // Filter for sale listings
  forRent?:    boolean;  // Filter for rent listings
  sortBy?:     'newest' | 'price_asc' | 'price_desc' | 'most_relevant';
  page?:       number;   // Page number (1-based)
  limit?:      number;   // Results per page (max 50)
}

export interface MachinerySearchResult {
  id:          string;
  title:       string;
  category:    string;
  type:        string | null;
  brand:       string | null;
  city:        string;
  region:      string | null;
  condition:   string | null;
  year:        number | null;
  price:       number;
  rent_price:  number | null;
  for_sale:    boolean;
  for_rent:    boolean;
  image_url:   string | null;
  created_at:  string;
  seller: {
    full_name:   string;
    trust_score: number | null;
    verified:    boolean;
  } | null;
}

export interface MachinerySearchResponse {
  data:    MachinerySearchResult[];
  total:   number;
  page:    number;
  limit:   number;
  pages:   number;
}

// ---------------------------------------------------------------------------
// searchMachinery
//
// Main search function. Combines full-text search with composite filters.
// Always filters to status = 'active' listings only.
// ---------------------------------------------------------------------------
export async function searchMachinery(
  params: MachinerySearchParams = {}
): Promise<MachinerySearchResponse> {

  const {
    query,
    category,
    city,
    type,
    condition,
    minPrice,
    maxPrice,
    minYear,
    maxYear,
    forSale,
    forRent,
    sortBy    = 'newest',
    page      = 1,
    limit     = 20,
  } = params;

  // Enforce pagination limits
  const safePage  = Math.max(1, page);
  const safeLimit = Math.min(50, Math.max(1, limit));
  const offset    = (safePage - 1) * safeLimit;

  // Build base query
  let dbQuery = supabaseAdmin
    .from('machinery')
    .select(
      `id, title, category, type, brand, city, region,
       condition, year, price, rent_price, for_sale, for_rent,
       image_url, created_at,
       seller:profiles!user_id (full_name, trust_score, verified)`,
      { count: 'exact' }
    )
    .eq('status', 'active');

  // --- Full-text search ---
  // Uses PostgreSQL full-text search on title and description
  if (query && query.trim().length > 0) {
    const sanitized = query.trim().replace(/[^a-zA-Z0-9\s\u1200-\u137F]/g, '');
    if (sanitized.length > 0) {
      dbQuery = dbQuery.textSearch('title', sanitized, {
        type:   'websearch',
        config: 'english',
      });
    }
  }

  // --- Composite filters ---
  if (category)  dbQuery = dbQuery.eq('category', category);
  if (city)      dbQuery = dbQuery.eq('city', city);
  if (type)      dbQuery = dbQuery.eq('type', type);
  if (condition) dbQuery = dbQuery.eq('condition', condition);
  if (minPrice !== undefined) dbQuery = dbQuery.gte('price', minPrice);
  if (maxPrice !== undefined) dbQuery = dbQuery.lte('price', maxPrice);
  if (minYear  !== undefined) dbQuery = dbQuery.gte('year', minYear);
  if (maxYear  !== undefined) dbQuery = dbQuery.lte('year', maxYear);
  if (forSale  !== undefined) dbQuery = dbQuery.eq('for_sale', forSale);
  if (forRent  !== undefined) dbQuery = dbQuery.eq('for_rent', forRent);

  // --- Sorting ---
  switch (sortBy) {
    case 'price_asc':
      dbQuery = dbQuery.order('price', { ascending: true });
      break;
    case 'price_desc':
      dbQuery = dbQuery.order('price', { ascending: false });
      break;
    case 'most_relevant':
      // Falls back to newest when no full-text query is provided
      dbQuery = dbQuery.order('created_at', { ascending: false });
      break;
    case 'newest':
    default:
      dbQuery = dbQuery.order('created_at', { ascending: false });
      break;
  }

  // --- Pagination ---
  dbQuery = dbQuery.range(offset, offset + safeLimit - 1);

  // --- Execute ---
  const { data, error, count } = await dbQuery;

  if (error) {
    throw new Error(`[EML] searchMachinery failed: ${error.message}`);
  }

  const total = count ?? 0;

  return {
    data:  (data ?? []) as unknown as MachinerySearchResult[],
    total,
    page:  safePage,
    limit: safeLimit,
    pages: Math.ceil(total / safeLimit),
  };
}

// ---------------------------------------------------------------------------
// getRelatedListings
//
// Returns up to 4 similar listings based on category and city.
// Used on the machinery detail page to show related machines.
// ---------------------------------------------------------------------------
export async function getRelatedListings(
  machineryId: string,
  category:    string,
  city:        string,
  limit:       number = 4
): Promise<MachinerySearchResult[]> {

  const { data, error } = await supabaseAdmin
    .from('machinery')
    .select(
      `id, title, category, type, brand, city, region,
       condition, year, price, rent_price, for_sale, for_rent,
       image_url, created_at,
       seller:profiles!user_id (full_name, trust_score, verified)`
    )
    .eq('status', 'active')
    .eq('category', category)
    .eq('city', city)
    .neq('id', machineryId)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`[EML] getRelatedListings failed: ${error.message}`);
    return [];
  }

  return (data ?? []) as unknown as MachinerySearchResult[];
}