// src/lib/api/response.ts
// TM — Unified API Response Envelope
//
// Every /api/* route handler must return responses through these helpers.
// This guarantees a consistent shape that the frontend can always rely on:
//
//   Success: { success: true,  data: T,      meta?: object }
//   Error:   { success: false, error: string, code?: string }
//
// Usage:
//   import { successResponse, errorResponse } from '@/lib/api/response';
//
//   return successResponse({ id: deal.id }, 201);
//   return errorResponse('Deal not found', 404, 'NOT_FOUND');

import { NextResponse } from 'next/server';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ApiSuccessBody<T = unknown> {
  success: true;
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiErrorBody {
  success: false;
  error: string;
  code?: string;
}

export type ApiResponseBody<T = unknown> = ApiSuccessBody<T> | ApiErrorBody;

// ---------------------------------------------------------------------------
// Standard error codes used across all TM routes
// ---------------------------------------------------------------------------
export const TM_ERROR_CODES = {
  UNAUTHORIZED:        'UNAUTHORIZED',        // 401 — no session
  FORBIDDEN:           'FORBIDDEN',           // 403 — wrong role
  NOT_FOUND:           'NOT_FOUND',           // 404
  VALIDATION_ERROR:    'VALIDATION_ERROR',    // 400 — missing or invalid fields
  CONFLICT:            'CONFLICT',            // 409 — duplicate / already exists
  INTERNAL_ERROR:      'INTERNAL_ERROR',      // 500 — unexpected server error
  DB_ERROR:            'DB_ERROR',            // 500 — Supabase query failed
  STATE_ERROR:         'STATE_ERROR',         // 409 — invalid state transition
} as const;

export type TMErrorCode = typeof TM_ERROR_CODES[keyof typeof TM_ERROR_CODES];

// ---------------------------------------------------------------------------
// Success Response
// ---------------------------------------------------------------------------

/**
 * Returns a standardised success JSON response.
 *
 * @param data    - The payload to return.
 * @param status  - HTTP status code (default 200).
 * @param meta    - Optional metadata (pagination, counts, etc.).
 */
export function successResponse<T>(
  data: T,
  status: number = 200,
  meta?: Record<string, unknown>
): NextResponse<ApiSuccessBody<T>> {
  const body: ApiSuccessBody<T> = { success: true, data };
  if (meta) body.meta = meta;
  return NextResponse.json(body, { status });
}

// ---------------------------------------------------------------------------
// Error Response
// ---------------------------------------------------------------------------

/**
 * Returns a standardised error JSON response.
 *
 * @param message - Human-readable error description.
 * @param status  - HTTP status code (default 500).
 * @param code    - Machine-readable error code from TM_ERROR_CODES.
 */
export function errorResponse(
  message: string,
  status: number = 500,
  code?: TMErrorCode | string
): NextResponse<ApiErrorBody> {
  const body: ApiErrorBody = { success: false, error: message };
  if (code) body.code = code;
  return NextResponse.json(body, { status });
}

// ---------------------------------------------------------------------------
// Validation Helper
// ---------------------------------------------------------------------------

/**
 * Checks that all required fields are present and non-empty in a request body.
 * Returns a 400 error response if any are missing, or null if all present.
 *
 * Usage:
 *   const missing = validateRequired(body, ['deal_id', 'amount', 'verified_by']);
 *   if (missing) return missing;
 */
export function validateRequired(
  body: Record<string, unknown>,
  fields: string[]
): NextResponse<ApiErrorBody> | null {
  const missing = fields.filter(
    (f) => body[f] === undefined || body[f] === null || body[f] === ''
  );
  if (missing.length > 0) {
    return errorResponse(
      `Missing required fields: ${missing.join(', ')}`,
      400,
      TM_ERROR_CODES.VALIDATION_ERROR
    );
  }
  return null;
}

// ---------------------------------------------------------------------------
// Internal Error Handler
// ---------------------------------------------------------------------------

/**
 * Wraps an unknown caught error into a standardised 500 response.
 * Logs the error server-side with context for debugging.
 *
 * Usage:
 *   } catch (err) {
 *     return internalError(err, 'POST /api/deals');
 *   }
 */
export function internalError(
  err: unknown,
  context: string
): NextResponse<ApiErrorBody> {
  const message = err instanceof Error ? err.message : 'Unexpected server error.';
  console.error(`[TM] ${context} — Unhandled error:`, message);
  return errorResponse(message, 500, TM_ERROR_CODES.INTERNAL_ERROR);
}