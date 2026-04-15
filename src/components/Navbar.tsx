"use client";

import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/lib/LanguageContext";
import NotificationBell from "@/components/NotificationBell";
import { signOut } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <header className="bg-black text-white px-6 py-4 flex items-center justify-between border-b border-gray-800">

      {/* ================= LOGO ================= */}
      <Link href="/">
        <div className="flex items-center gap-3 cursor-pointer">

          <Image
            src="/logo.png"
            alt="EML Logo"
            width={45}
            height={45}
          />

          <div>
            <p className="text-yellow-400 font-bold text-sm leading-tight">
              ኢትዮ ማሽነሪ አገናኝ
            </p>
            <p className="text-xs text-gray-300 leading-tight">
              Ethio Machinery Link
            </p>
          </div>

        </div>
      </Link>

      {/* ================= NAV LINKS ================= */}
      <nav className="hidden md:flex gap-6 text-sm font-medium">

        <Link href="/dashboard" className="hover:text-yellow-400">
          {t.dashboard}
        </Link>

        <Link href="/browse" className="hover:text-yellow-400">
          {t.browse}
        </Link>

        <Link href="/browse-requests" className="hover:text-yellow-400">
          {t.requests}
        </Link>

        <Link href="/admin/payments" className="hover:text-yellow-400">
          Admin Payments
        </Link>

        <Link href="/admin/revenue" className="hover:text-yellow-400">
          Revenue
        </Link>

      </nav>

      {/* ================= RIGHT SIDE ================= */}
      <div className="flex items-center gap-4">

        {/* 🔔 Notifications */}
        <NotificationBell />

        {/* 🌐 Language Switch */}
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as any)}
          className="bg-black border border-gray-600 px-2 py-1 rounded text-sm"
        >
          <option value="en">EN</option>
          <option value="am">አማ</option>
        </select>

        {/* 🔑 Auth Buttons */}
        <Link href="/login">
          <button className="bg-yellow-500 text-black px-4 py-1 rounded text-sm font-bold">
            Login
          </button>
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-500 px-3 py-1 rounded text-sm font-bold"
        >
          Logout
        </button>

      </div>

    </header>
  );
}