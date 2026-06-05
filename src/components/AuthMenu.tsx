"use client";

import { useState } from "react";

import Link from "next/link";

import {
  User,
  LayoutDashboard,
  LogOut,
  LogIn,
  UserPlus,
  ChevronDown,
  Loader2,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

import { useLanguage } from "@/context/LanguageContext";

export default function AuthMenu() {
  const router = useRouter();

  const {
    user,
    loading,
    signOutUser,
  } = useAuth();

  const { language } = useLanguage();

  // Local helper to translate dual-strings
  const t = (en, am) => {
    return language === "am" ? am : en;
  };

  const [open, setOpen] =
    useState(false);

  async function handleLogout() {
    try {
      await signOutUser();

      router.push("/");

      router.refresh();
    } catch (error) {
      console.error(
        "Logout error:",
        error
      );
    }
  }

  // =====================================
  // LOADING STATE
  // =====================================

  if (loading) {
    return (
      <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-white/10">
        <Loader2
          size={18}
          className="animate-spin"
        />
      </div>
    );
  }

  // =====================================
  // NOT LOGGED IN
  // =====================================

  if (!user) {
    return (
      <div className="flex items-center gap-3">

        <Link
          href="/login"
          className="hidden md:flex items-center gap-2 h-11 px-5 rounded-xl bg-white/10 hover:bg-white/20 font-bold transition"
        >
          <LogIn size={18} />

          {t(
            "Login",
            "ግባ"
          )}
        </Link>

        <Link
          href="/signup"
          className="flex items-center gap-2 h-11 px-5 rounded-xl bg-yellow-500 hover:bg-yellow-400 text-black font-black transition"
        >
          <UserPlus size={18} />

          {t(
            "Signup",
            "ተመዝገብ"
          )}
        </Link>

      </div>
    );
  }

  // =====================================
  // LOGGED IN
  // =====================================

  return (
    <div className="relative">

      <button
        onClick={() =>
          setOpen(!open)
        }
        className="flex items-center gap-2 h-11 px-4 rounded-xl bg-white/10 hover:bg-white/20 transition"
      >
        <User size={18} />

        <ChevronDown size={16} />
      </button>

      {open && (
        <div className="absolute right-0 top-14 w-64 rounded-2xl border border-zinc-800 bg-zinc-900 overflow-hidden shadow-2xl z-50">

          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-5 py-4 hover:bg-zinc-800 transition"
            onClick={() =>
              setOpen(false)
            }
          >
            <LayoutDashboard size={18} />

            {t(
              "Dashboard",
              "ዳሽቦርድ"
            )}
          </Link>

          <button
            onClick={
              handleLogout
            }
            className="w-full flex items-center gap-3 px-5 py-4 hover:bg-zinc-800 text-left transition text-red-400"
          >
            <LogOut size={18} />

            {t(
              "Logout",
              "ውጣ"
            )}
          </button>

        </div>
      )}

    </div>
  );
}