import { logEvent } from "@/core/logEvent";
import { NextResponse } from "next/server";
import { MatchingEngine } from "@/core/matchingEngine";

export async function POST(req: Request) {
  const body = await req.json();

  const request = body.request;
  const candidates = body.candidates || [];

  const matches = MatchingEngine.run(request, candidates);

  return NextResponse.json({
    success: true,
    matches,
  });
}
