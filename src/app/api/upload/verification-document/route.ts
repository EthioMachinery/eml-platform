import { type NextRequest } from "next/server";

import { supabaseAdmin } from "@/lib/supabase/adminClient";
import { errorResponse, internalError, successResponse } from "@/lib/api/response";
import { getSession, requireAuthenticated } from "@/lib/auth/getSession";
import {
  analyzeVerificationDocument,
  detectVerificationDocumentMime,
  extensionForVerificationDocument,
} from "@/lib/intelligence/trustSafety";

export const runtime = "nodejs";

const MAX_DOCUMENT_SIZE = 10 * 1024 * 1024;
const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function POST(request: NextRequest) {
  try {
    const session = getSession(request);
    const authError = requireAuthenticated(session);
    if (authError) return errorResponse(authError, 401, "UNAUTHORIZED");

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return errorResponse("No verification document provided.", 400, "VALIDATION_ERROR");
    }

    if (file.size > MAX_DOCUMENT_SIZE) {
      return errorResponse("Verification document exceeds the 10MB limit.", 400, "VALIDATION_ERROR");
    }

    if (!ALLOWED_DOCUMENT_TYPES.includes(file.type)) {
      return errorResponse(
        "Invalid document format. Upload PDF, JPEG, PNG, or WebP.",
        400,
        "VALIDATION_ERROR",
      );
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());
    const detectedMime = detectVerificationDocumentMime(fileBuffer);
    const safety = analyzeVerificationDocument({
      fileName: file.name,
      declaredMime: file.type,
      detectedMime,
      size: file.size,
    });

    if (!detectedMime || safety.riskLevel === "CRITICAL") {
      return errorResponse(
        safety.recommendations[0] || "The verification document failed TM safety checks.",
        400,
        "VALIDATION_ERROR",
      );
    }

    const documentId = crypto.randomUUID();
    const extension = extensionForVerificationDocument(detectedMime);
    const filePath = `${session.userId}/seller-verification/${documentId}.${extension}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from("documents")
      .upload(filePath, fileBuffer, {
        cacheControl: "31536000",
        contentType: detectedMime,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    const { data: profile, error: profileReadError } = await supabaseAdmin
      .from("profiles")
      .select("trust_score")
      .eq("id", session.userId)
      .maybeSingle();

    if (profileReadError) throw profileReadError;

    const currentTrustScore = Number(profile?.trust_score ?? 50);
    const nextTrustScore = Math.max(currentTrustScore, 70);

    const { data: updatedProfile, error: profileUpdateError } = await supabaseAdmin
      .from("profiles")
      .update({
        verification_status: "pending_review",
        license_url: filePath,
        trust_score: nextTrustScore,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.userId)
      .select("id, verification_status, trust_score, license_url")
      .maybeSingle();

    if (profileUpdateError) throw profileUpdateError;

    if (!updatedProfile) {
      return errorResponse("Seller profile not found.", 404, "NOT_FOUND");
    }

    await supabaseAdmin.from("eml_events").insert({
      event_name: "KYC_DOCUMENT_UPLOADED",
      severity: safety.riskLevel === "HIGH" || safety.reviewRequired ? "WARN" : "INFO",
      actor_id: session.userId,
      payload: {
        file_path: filePath,
        file_type: detectedMime,
        trust_score: safety.trustScore,
        risk_level: safety.riskLevel,
        signals: safety.signals,
      },
      created_at: new Date().toISOString(),
    });

    return successResponse(
      {
        filePath,
        profile: updatedProfile,
        trust: safety,
      },
      201,
      {
        reviewRequired: true,
        riskLevel: safety.riskLevel,
        trustScore: safety.trustScore,
      },
    );
  } catch (err) {
    return internalError(err, "POST /api/upload/verification-document");
  }
}
