"use client";

import Link from "next/link";

import {
  useEnterpriseTranslation,
} from "@/hooks/useEnterpriseTranslation";

export default function Footer() {
  const { t } =
    useEnterpriseTranslation();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">

      <div className="max-w-7xl mx-auto px-4 py-20">

        <div className="grid lg:grid-cols-4 gap-12">

          {/* BRAND */}

          <div className="lg:col-span-2">

            <div className="flex items-center gap-3 mb-6">

              <div className="w-12 h-12 rounded-2xl bg-yellow-500 text-black flex items-center justify-center font-black text-xl">
                E
              </div>

              <div>
                <div className="font-black text-xl">
                  EML
                </div>

                <div className="text-sm text-zinc-400">
                  Ethio Machinery Link
                </div>
              </div>

            </div>

            <p className="text-zinc-400 leading-8 max-w-2xl">

              {t(
                "footerDescription"
              )}

            </p>

          </div>

          {/* MARKETPLACE */}

          <div>

            <h3 className="font-black text-lg mb-6">
              {t(
                "marketplace"
              )}
            </h3>

            <div className="flex flex-col gap-4 text-zinc-400">

              <Link
                href="/browse"
                className="hover:text-yellow-400 transition"
              >
                {t(
                  "browse"
                )}
              </Link>

              <Link
                href="/upload"
                className="hover:text-yellow-400 transition"
              >
                {t(
                  "upload"
                )}
              </Link>

              <Link
                href="/fleet"
                className="hover:text-yellow-400 transition"
              >
                {t(
                  "fleet"
                )}
              </Link>

            </div>

          </div>

          {/* COMPANY */}

          <div>

            <h3 className="font-black text-lg mb-6">
              {t(
                "company"
              )}
            </h3>

            <div className="flex flex-col gap-4 text-zinc-400">

              <Link
                href="/about"
                className="hover:text-yellow-400 transition"
              >
                {t(
                  "about"
                )}
              </Link>

              <Link
                href="/contact"
                className="hover:text-yellow-400 transition"
              >
                {t(
                  "contact"
                )}
              </Link>

              <Link
                href="/enterprise"
                className="hover:text-yellow-400 transition"
              >
                {t(
                  "enterprise"
                )}
              </Link>

            </div>

          </div>

        </div>

        <div className="border-t border-zinc-800 mt-16 pt-8 text-center text-zinc-500 text-sm">

          © 2026 EML — Ethio Machinery Link

        </div>

      </div>

    </footer>
  );
}