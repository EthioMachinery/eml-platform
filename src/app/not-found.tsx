"use client";

import Link from "next/link";

export default function ErrorPage({
  error,
  reset,
}: {
  error?: Error;
  reset?: () => void;
}) {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4">

      <div className="text-center max-w-2xl">

        <div className="text-red-500 text-6xl font-black mb-6">
          ERROR
        </div>

        <h1 className="text-4xl font-black mb-6">
          Something went wrong
        </h1>

        <p className="text-zinc-400 leading-8 mb-10">
          {error?.message || "An unexpected error occurred."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">

          <button
            onClick={() => reset?.()}
            className="h-14 px-8 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black transition"
          >
            Try Again
          </button>

          <Link
            href="/"
            className="h-14 px-8 rounded-2xl border border-zinc-700 hover:border-yellow-500 flex items-center font-black transition"
          >
            Go Home
          </Link>

        </div>

      </div>

    </main>
  );
}