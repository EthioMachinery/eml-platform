import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { basePrice = 0 } = body;

    // Simple safe pricing logic (no external dependency)
    const suggestedPrice = Math.round(basePrice * 1.1);

    return NextResponse.json({
      success: true,
      suggestedPrice,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Pricing failed" },
      { status: 500 }
    );
  }
}