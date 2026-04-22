"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-6">
      
      <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">
        Ethio Machinery Link (EML)
      </h1>

      <p className="text-gray-400 text-center max-w-xl mb-8">
        Ethiopia’s digital marketplace for machinery rental, sales, and services.
        Connect with trusted owners, operators, and contractors nationwide.
      </p>

      <div className="flex gap-4">
        <Link href="/browse">
          <button className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold">
            Browse Machines
          </button>
        </Link>

        <Link href="/login">
          <button className="border border-gray-600 px-6 py-3 rounded-lg hover:bg-gray-800">
            Login
          </button>
        </Link>
      </div>

    </main>
  );
}