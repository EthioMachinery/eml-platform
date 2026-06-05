import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { createClient } from "@supabase/supabase-js";

// Initialize Gemini SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function POST(req: NextRequest) {
  try {
    const { queryText, activeLanguage } = await req.json();

    if (!queryText) {
      return NextResponse.json({ error: "Missing matching query text." }, { status: 400 });
    }

    // 1. Pull active verified listings directly from Supabase
    const { data: listings } = await supabaseAdmin
      .from("listings")
      .select("id, brand, model, category_token, price, location, model_year")
      .eq("status", "verified_available");

    const databaseContext = JSON.stringify(listings || []);

    // 2. Build the system routing and translation prompt (strictly configured on 'or' standard)
    const systemPrompt = `
      You are the EML AI Matchmaking Engine. Your task is to match the user's heavy machinery request with the available assets in the database.
      Your response must be returned in the selected language: "${activeLanguage}".
      
      User Request: "${queryText}"
      Database Listings: ${databaseContext}

      System Constraints:
      - Match using category, capacity, and geographical proximity (e.g. Debre Berhan is near Addis Ababa).
      - Output a structured list of matching candidates with their IDs, matching scores (0-100%), and a localized explanation of why they fit the request.
      - Return the result cleanly using markdown. Keep it concise.
    `;

    // 3. Initiate Gemini Response Streaming to prevent Vercel serverless timeouts [1]
    const responseStream = await ai.models.generateContentStream({
      model: "gemini-2.5-flash",
      contents: [
        { role: "user", parts: [{ text: systemPrompt }] }
      ]
    });

    // 4. Create a streaming response for the browser
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of responseStream) {
          const text = chunk.text;
          if (text) {
            controller.enqueue(encoder.encode(text));
          }
        }
        controller.close();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      }
    });

  } catch (err: any) {
    console.error("AI Matchmaker Error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error during matchmaking." },
      { status: 500 }
    );
  }
}