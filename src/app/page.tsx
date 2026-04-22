"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      
      <h1 className="text-4xl font-bold mb-4 text-center">
        Ethio Machinery Link (EML)
      </h1>

      <p className="text-gray-400 mb-8 text-center max-w-xl">
        Connect with machinery owners, renters, operators, and service providers across Ethiopia.
      </p>

      <div className="flex gap-4">
        <Link href="/browse">
          <button className="bg-yellow-500 text-black px-6 py-3 rounded-lg font-semibold">
            Browse Machines
          </button>
        </Link>

        <Link href="/dashboard">
          <button className="border border-gray-600 px-6 py-3 rounded-lg">
            Dashboard
          </button>
        </Link>
      </div>

    </div>
  );
}