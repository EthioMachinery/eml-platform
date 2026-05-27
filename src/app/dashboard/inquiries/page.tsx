"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useLanguage } from "@/context/LanguageContext";

type Inquiry = {
  id: string;
  message: string;
  created_at: string;

  machinery: {
    id: string;
    title: string;
  };

  sender: {
    email: string;
  };
};

export default function DashboardInquiriesPage() {
  const { t } = useLanguage();

  const [inquiries, setInquiries] = useState<
    Inquiry[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  async function fetchInquiries() {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("inquiries")
      .select(`
        id,
        message,
        created_at,

        machinery:machinery_id (
          id,
          title
        ),

        sender:sender_id (
          email
        )
      `)
      .eq("owner_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(error);
    } else {
      setInquiries(
        (data as any) || []
      );
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">

      {/* HEADER */}

      <div className="border-b border-zinc-800 p-6 flex items-center justify-between">

        <div>
          <h1 className="text-4xl font-bold">
            {t(
              "Inquiry Dashboard",
              "የጥያቄዎች ዳሽቦርድ"
            )}
          </h1>

          <p className="text-zinc-400 mt-2">
            {t(
              "Manage customer inquiries for your machinery listings",
              "ለማሽኖችዎ የተላኩ ጥያቄዎችን ያስተዳድሩ"
            )}
          </p>
        </div>

        <LanguageSwitcher />

      </div>

      {/* CONTENT */}

      <div className="max-w-6xl mx-auto p-6">

        {loading ? (
          <div className="text-center py-20 text-zinc-400">
            {t(
              "Loading inquiries...",
              "ጥያቄዎች በመጫን ላይ..."
            )}
          </div>
        ) : inquiries.length === 0 ? (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-12 text-center">

            <h2 className="text-2xl font-bold mb-4">
              {t(
                "No inquiries yet",
                "እስካሁን ጥያቄ የለም"
              )}
            </h2>

            <p className="text-zinc-400">
              {t(
                "When customers contact you about your machinery, inquiries will appear here.",
                "ደንበኞች ስለ ማሽኖችዎ ሲጠይቁ ጥያቄዎች እዚህ ይታያሉ።"
              )}
            </p>

          </div>
        ) : (
          <div className="space-y-6">

            {inquiries.map((inquiry) => (
              <div
                key={inquiry.id}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6"
              >

                {/* TOP */}

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                  <div>

                    <h2 className="text-2xl font-bold">

                      <Link
                        href={`/machinery/${inquiry.machinery?.id}`}
                        className="hover:text-yellow-400 transition"
                      >
                        {
                          inquiry.machinery
                            ?.title
                        }
                      </Link>

                    </h2>

                    <p className="text-zinc-400 mt-1">

                      {t(
                        "Inquiry received on",
                        "ጥያቄ የተላከበት"
                      )}{" "}

                      {new Date(
                        inquiry.created_at
                      ).toLocaleString()}

                    </p>

                  </div>

                  <div className="bg-zinc-950 border border-zinc-700 rounded-xl px-4 py-3">

                    <p className="text-zinc-400 text-sm">
                      {t(
                        "Customer Email",
                        "የደንበኛ ኢሜይል"
                      )}
                    </p>

                    <p className="font-bold">
                      {
                        inquiry.sender
                          ?.email
                      }
                    </p>

                  </div>

                </div>

                {/* MESSAGE */}

                <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-xl p-5">

                  <p className="text-zinc-400 text-sm mb-3">
                    {t(
                      "Customer Message",
                      "የደንበኛ መልዕክት"
                    )}
                  </p>

                  <p className="text-zinc-200 whitespace-pre-line leading-relaxed">
                    {inquiry.message}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}