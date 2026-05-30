// src/app/api/machinery/route.ts
// EML — Machinery Listings API
// GET: Public browse with composite filters (no auth required)
// POST: Create a new listing (auth required — seller or admin only)

import { type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError, validateRequired } from '@/lib/api/response';
import { getSession, requireRole } from '@/lib/auth/getSession';

// ---------------------------------------------------------------------------
// GET /api/machinery
// Public endpoint — browse active listings with optional filters.
// Utilises composite index: (category, city, status, created_at DESC)
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const category  = searchParams.get('category');
    const city      = searchParams.get('city');
    const type      = searchParams.get('type');
    const condition = searchParams.get('condition');
    const minPrice  = searchParams.get('min_price');
    const maxPrice  = searchParams.get('max_price');
    const limit     = Math.min(parseInt(searchParams.get('limit') ?? '20'), 50);
    const page      = Math.max(parseInt(searchParams.get('page') ?? '1'), 1);
    const offset    = (page - 1) * limit;

    let query = supabaseAdmin
      .from('machinery')
      .select(`
        id, title, category, type, brand, city, region,
        condition, year, price, rent_price, for_sale, for_rent,
        description, image_url, status, created_at,
        profiles:user_id (full_name, phone, trust_score, verified)
      `, { count: 'exact' })
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (category)  query = query.eq('category', category);
    if (city)      query = query.eq('city', city);
    if (type)      query = query.eq('type', type);
    if (condition) query = query.eq('condition', condition);
    if (minPrice)  query = query.gte('price', parseInt(minPrice));
    if (maxPrice)  query = query.lte('price', parseInt(maxPrice));

    const { data, error, count } = await query;

    if (error) {
      return errorResponse(error.message, 500, 'DB_ERROR');
    }

    return successResponse(data, 200, {
      total: count ?? 0,
      page,
      limit,
      pages: Math.ceil((count ?? 0) / limit),
    });

  } catch (err) {
    return internalError(err, 'GET /api/machinery');
  }
}

// ---------------------------------------------------------------------------
// POST /api/machinery
// Auth required. Creates a new machinery listing for the authenticated seller.
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 1. Get authenticated user from session headers set by middleware
    const session = getSession(request);

    // 2. Only verified sellers and admins can post listings
    const denied = requireRole(session, ['verified_seller', 'admin']);
    if (denied) return errorResponse(denied, 403, 'FORBIDDEN');

    // 3. Parse and validate request body
    const body = await request.json();

    const validationError = validateRequired(body, ['title', 'category', 'city', 'price']);
    if (validationError) return validationError;

    const {
      title, category, type, brand, city, region,
      condition, year, price, rent_price,
      for_sale, for_rent, description, image_url,
    } = body;

    // 4. Price must be a positive integer (stored in ETB)
    if (typeof price !== 'number' || price <= 0) {
      return errorResponse('Price must be a positive number in ETB.', 400, 'VALIDATION_ERROR');
    }

    const now = new Date().toISOString();

    // 5. Insert the listing — user_id comes from the verified session, not the request body
    const { data: listing, error: insertError } = await supabaseAdmin
      .from('machinery')
      .insert({
        user_id:     session.userId,
        title,
        category,
        type:        type ?? null,
        brand:       brand ?? null,
        city,
        region:      region ?? null,
        condition:   condition ?? null,
        year:        year ?? null,
        price,
        rent_price:  rent_price ?? null,
        for_sale:    for_sale ?? true,
        for_rent:    for_rent ?? false,
        description: description ?? null,
        image_url:   image_url ?? null,
        status:      'active',
        created_at:  now,
      })
      .select('id, title, category, city, price, status, created_at')
      .single();

    if (insertError) {
      return errorResponse(insertError.message, 500, 'DB_ERROR');
    }

    // 6. Audit log
    await supabaseAdmin.from('eml_events').insert({
      event_name: 'MACHINERY_LISTING_CREATED',
      actor_id:   session.userId,
      severity:   'INFO',
      payload: {
        machinery_id: listing.id,
        title:        listing.title,
        category:     listing.category,
        city:         listing.city,
        price:        listing.price,
      },
      created_at: now,
    });

    return successResponse(listing, 201);

  } catch (err) {
    return internalError(err, 'POST /api/machinery');
  }
}