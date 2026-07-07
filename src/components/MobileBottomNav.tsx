"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function MobileBottomNav() {
  const pathname = usePathname();

  const items = [
    {
      href: "/",
      icon: "🏠",
      label: "Home",
    },
    {
      href: "/browse",
      icon: "🔍",
      label: "Browse",
    },
    {
      href: "/post-machinery",
      icon: "➕",
      label: "Post",
    },
    {
      href: "/messages",
      icon: "💬",
      label: "Inbox",
    },
    {
      href: "/dashboard",
      icon: "👤",
      label: "Account",
    },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 bg-black/95 backdrop-blur-xl shadow-2xl">
      <div className="grid grid-cols-5">
        {items.map((item) => {
          const active =
            pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-3 text-xs font-semibold transition ${
                active
                  ? "text-blue-700"
                  : "text-gray-500"
              }`}
            >
              <span className="text-xl">
                {item.icon}
              </span>

              <span className="mt-1">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}