// src/app/api/upload/machinery-image/route.ts
// EML — Machinery Image Upload Handler
//
// Accepts up to 12 images per listing.
// Validates file type and size before uploading to Supabase Storage.
// Returns the public URL of the uploaded image.
//
// Usage:
//   POST /api/upload/machinery-image
//   Content-Type: multipart/form-data
//   Body: { file: <image file>, machinery_id: <uuid> }

import { type NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/adminClient';
import { successResponse, errorResponse, internalError } from '@/lib/api/response';
import { getSession } from '@/lib/auth/getSession';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const ALLOWED_TYPES   = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES  = 5 * 1024 * 1024;   // 5MB per image
const MAX_IMAGES      = 12;                 // Maximum images per listing
const STORAGE_BUCKET  = 'machinery-images'; // Must exist in Supabase Storage

// ---------------------------------------------------------------------------
// POST /api/upload/machinery-image
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest) {
  try {
    // 1. Get authenticated session
    const session = getSession(request);

    // 2. Parse multipart form data
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return errorResponse('Invalid form data. Send as multipart/form-data.', 400, 'VALIDATION_ERROR');
    }

    const file         = formData.get('file') as File | null;
    const machinery_id = formData.get('machinery_id') as string | null;

    // 3. Validate inputs
    if (!file) {
      return errorResponse('Missing required field: file.', 400, 'VALIDATION_ERROR');
    }
    if (!machinery_id) {
      return errorResponse('Missing required field: machinery_id.', 400, 'VALIDATION_ERROR');
    }

    // 4. Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return errorResponse(
        `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, WebP.`,
        400,
        'VALIDATION_ERROR'
      );
    }

    // 5. Validate file size
    if (file.size > MAX_SIZE_BYTES) {
      return errorResponse(
        `File too large: ${(file.size / 1024 / 1024).toFixed(1)}MB. Maximum allowed: 5MB.`,
        400,
        'VALIDATION_ERROR'
      );
    }

    // 6. Confirm the machinery listing belongs to the authenticated user
    const { data: listing, error: listingError } = await supabaseAdmin
      .from('machinery')
      .select('id, user_id')
      .eq('id', machinery_id)
      .single();

    if (listingError || !listing) {
      return errorResponse('Machinery listing not found.', 404, 'NOT_FOUND');
    }

    if (listing.user_id !== session.userId && session.role !== 'admin') {
      return errorResponse(
        'You do not have permission to upload images for this listing.',
        403,
        'FORBIDDEN'
      );
    }

    // 7. Check existing image count for this listing
    const { data: existingImages } = await supabaseAdmin
      .storage
      .from(STORAGE_BUCKET)
      .list(`${machinery_id}`);

    if (existingImages && existingImages.length >= MAX_IMAGES) {
      return errorResponse(
        `Maximum of ${MAX_IMAGES} images allowed per listing. Please delete an existing image first.`,
        409,
        'CONFLICT'
      );
    }

    // 8. Build a unique file path inside the bucket
    // Structure: machinery_id/timestamp-randomstring.ext
    const extension  = file.type === 'image/jpeg' ? 'jpg'
                     : file.type === 'image/png'  ? 'png'
                     : 'webp';
    const fileName   = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const filePath   = `${machinery_id}/${fileName}`;

    // 9. Convert File to ArrayBuffer for upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer  = new Uint8Array(arrayBuffer);

    // 10. Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin
      .storage
      .from(STORAGE_BUCKET)
      .upload(filePath, fileBuffer, {
        contentType:  file.type,
        cacheControl: '31536000',  // Cache for 1 year — images are immutable
        upsert:       false,
      });

    if (uploadError) {
      return errorResponse(
        `Upload failed: ${uploadError.message}`,
        500,
        'INTERNAL_ERROR'
      );
    }

    // 11. Get the public URL
    const { data: urlData } = supabaseAdmin
      .storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    // 12. Audit log
    await supabaseAdmin.from('eml_events').insert({
      event_name: 'MACHINERY_IMAGE_UPLOADED',
      actor_id:   session.userId,
      severity:   'INFO',
      payload: {
        machinery_id,
        file_path: filePath,
        file_size: file.size,
        file_type: file.type,
      },
      created_at: new Date().toISOString(),
    });

    return successResponse({
      url:         publicUrl,
      file_path:   filePath,
      machinery_id,
    }, 201);

  } catch (err) {
    return internalError(err, 'POST /api/upload/machinery-image');
  }
}