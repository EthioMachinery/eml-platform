"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-4 text-center">
        Ethio Machinery Link (EML)
      </h1>

      <p className="text-gray-400 mb-8 text-center max-w-xl">
        Ethiopia’s smart machinery marketplace. Connect owners, renters, and contractors easily.
      </p>

      <div className="flex gap-4">
        <Link
          href="/browse"
          className="bg-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
        >
          Browse Machines
        </Link>

        <Link
          href="/post-machinery"
          className="bg-green-600 px-6 py-3 rounded-lg font-semibold hover:bg-green-700"
        >
          Post Machinery
        </Link>
      </div>
    </main>
  );
}