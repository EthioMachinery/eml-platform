"use client";

import Link from "next/link";

export default function LayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-black text-white">

      {/* HEADER */}
      <header className="border-b border-zinc-800">

        <div className="max-w-7xl mx-auto h-16 px-4 flex items-center justify-between">

          <Link
            href="/"
            className="font-black text-yellow-400"
          >
            EML
          </Link>

          <div className="flex items-center gap-4 text-sm">

            <Link href="/browse">
              Browse
            </Link>

            <Link href="/dashboard">
              Dashboard
            </Link>

            <Link href="/messages">
              Messages
            </Link>

          </div>

        </div>

      </header>

      {/* CONTENT */}
      <main>
        {children}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-zinc-800 mt-16">

        <div className="max-w-7xl mx-auto px-4 py-12">

          <div className="grid md:grid-cols-4 gap-10">

            {/* BRAND */}
            <div>

              <h2 className="font-black text-yellow-400 mb-4">
                ETHIO MACHINERY LINK
              </h2>

              <p className="text-zinc-400 text-sm leading-7">
                Ethiopia's machinery marketplace for buying,
                renting and selling heavy equipment.
              </p>

            </div>

            {/* MARKETPLACE */}
            <div>

              <h3 className="font-black mb-4">
                Marketplace
              </h3>

              <div className="space-y-3 text-zinc-400 text-sm">

                <Link
                  href="/browse"
                  className="block hover:text-white"
                >
                  Browse Machines
                </Link>

                <Link
                  href="/post-machinery"
                  className="block hover:text-white"
                >
                  Post Listing
                </Link>

                <Link
                  href="/dashboard"
                  className="block hover:text-white"
                >
                  Seller Dashboard
                </Link>

              </div>

            </div>

            {/* CITIES */}
            <div>

              <h3 className="font-black mb-4">
                Cities
              </h3>

              <div className="space-y-3 text-zinc-400 text-sm">

                <div>Addis Ababa</div>

                <div>Adama</div>

                <div>Hawassa</div>

              </div>

            </div>

            {/* COMPANY */}
            <div>

              <h3 className="font-black mb-4">
                Company
              </h3>

              <div className="space-y-3 text-zinc-400 text-sm">

                <Link
                  href="/dashboard"
                  className="block hover:text-white"
                >
                  Dashboard
                </Link>

                <Link
                  href="/messages"
                  className="block hover:text-white"
                >
                  Messages
                </Link>

                <Link
                  href="/notifications"
                  className="block hover:text-white"
                >
                  Notifications
                </Link>

              </div>

            </div>

          </div>

          {/* COPYRIGHT */}
          <div className="mt-10 pt-8 border-t border-zinc-800 text-center text-sm text-zinc-500">

            © {year} Ethio Machinery Link

          </div>

        </div>

      </footer>

    </div>
  );
}