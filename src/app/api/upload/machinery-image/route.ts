import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Initialize dedicated admin client to handle programmatic storage operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || "" // Uses the service-role key for backend storage write access
);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided in the payload." },
        { status: 400 }
      );
    }

    // 1. Validate File Size (Enforce maximum of 5MB to preserve CDN bandwidth)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "Image size exceeds the maximum allowed limit of 5MB." },
        { status: 400 }
      );
    }

    // 2. Validate MIME Type (Accept only standard image formats)
    const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file format. Only JPEG, PNG, and WEBP images are supported." },
        { status: 400 }
      );
    }

    // Convert file object to arrayBuffer for backend upload
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Generate unique name to prevent cache collision in public storage
    const fileExtension = file.name.split(".").pop();
    const uniqueFileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `listings/${uniqueFileName}`;

    // 3. Upload to Supabase Storage Bucket
    const { data, error } = await supabaseAdmin.storage
      .from("machinery-images")
      .upload(filePath, fileBuffer, {
        contentType: file.type,
        upsert: true
      });

    if (error) {
      throw error;
    }

    // 4. Retrieve Public URL for frontend image rendering
    const { data: publicUrlData } = supabaseAdmin.storage
      .from("machinery-images")
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      imageUrl: publicUrlData.publicUrl,
      fileName: uniqueFileName
    });

  } catch (err: any) {
    console.error("Image Upload Processing Failure:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error during upload processing." },
      { status: 500 }
    );
  }
}
