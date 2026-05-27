import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL;

    const serviceKey =
      process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (
      !supabaseUrl ||
      !serviceKey
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing Supabase environment variables",
        },
        { status: 500 }
      );
    }

    const supabase =
      createClient(
        supabaseUrl,
        serviceKey
      );

    /* LOAD DATA */
    const {
      data: listings,
    } = await supabase
      .from("machinery")
      .select("*");

    const {
      data: requests,
    } = await supabase
      .from(
        "machinery_requests"
      )
      .select("*");

    const {
      data: premium,
    } = await supabase
      .from(
        "premium_users"
      )
      .select("*")
      .eq(
        "status",
        "approved"
      );

    let created = 0;

    /* REQUESTS -> LISTINGS MATCH */
    for (const req of requests || []) {
      for (const item of listings || []) {
        let score = 0;

        if (
          req.type === item.type
        )
          score += 60;

        if (
          req.location ===
          item.location
        )
          score += 30;

        if (
          req.sale_or_rental ===
          item.sale_or_rental
        )
          score += 10;

        if (score >= 70) {
          const title =
            "New Match Found";

          const body =
            `${item.title} matches your request`;

          const {
            data: exists,
          } = await supabase
            .from(
              "notifications"
            )
            .select("id")
            .eq(
              "user_id",
              req.owner_id
            )
            .eq(
              "title",
              title
            )
            .eq(
              "body",
              body
            )
            .maybeSingle();

          if (!exists) {
            await supabase
              .from(
                "notifications"
              )
              .insert([
                {
                  user_id:
                    req.owner_id,
                  title,
                  body,
                  read: false,
                },
              ]);

            created++;
          }
        }
      }
    }

    /* PREMIUM REMINDER */
    for (const p of premium || []) {
      const title =
        "Premium Reminder";

      const body =
        "Your premium plan is active. Renew before expiry.";

      const {
        data: exists,
      } = await supabase
        .from(
          "notifications"
        )
        .select("id")
        .eq(
          "user_id",
          p.user_id
        )
        .eq(
          "title",
          title
        )
        .maybeSingle();

      if (!exists) {
        await supabase
          .from(
            "notifications"
          )
          .insert([
            {
              user_id:
                p.user_id,
              title,
              body,
              read: false,
            },
          ]);

        created++;
      }
    }

    return NextResponse.json({
      success: true,
      notifications_created:
        created,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error:
          error.message ||
          "Server error",
      },
      { status: 500 }
    );
  }
}