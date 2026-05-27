"use client";

import Link from "next/link";

import { Menu } from "lucide-react";

import {
  NAVIGATION,
} from "@/constants/navigation";

import LanguageSwitcher
  from "@/components/LanguageSwitcher";

import {
  useEnterpriseTranslation,
} from "@/hooks/useEnterpriseTranslation";

export default function Navbar() {
  const { t } =
    useEnterpriseTranslation();

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur-xl">

      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">

        {/* LOGO */}

        <Link
          href="/"
          className="flex items-center gap-3"
        >
          <div className="w-11 h-11 rounded-2xl bg-yellow-500 text-black flex items-center justify-center font-black text-lg">
            E
          </div>

          <div className="leading-tight">
            <div className="font-black text-lg">
              EML
            </div>

            <div className="text-xs text-zinc-400">
              Ethiopia Machinery Link
            </div>
          </div>
        </Link>

        {/* DESKTOP NAV */}

        <nav className="hidden xl:flex items-center gap-2">

          {NAVIGATION.map(
            (item) => {
              const Icon =
                item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all duration-200 font-semibold"
                >
                  <Icon size={17} />

                  <span>
                    {t(
                      item.key
                    )}
                  </span>
                </Link>
              );
            }
          )}

        </nav>

        {/* RIGHT */}

        <div className="flex items-center gap-4">

          <LanguageSwitcher />

          <button className="xl:hidden w-11 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 flex items-center justify-center transition">
            <Menu size={22} />
          </button>

        </div>

      </div>

    </header>
  );
}