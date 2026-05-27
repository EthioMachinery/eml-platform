export default function Loading() {
  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">

      <div className="text-center">

        <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-6" />

        <div className="text-2xl font-black text-yellow-400">
          Loading EML...
        </div>

      </div>

    </main>
  );
}