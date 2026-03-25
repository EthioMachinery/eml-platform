export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-6 text-center">

      {/* Amharic Title */}
      <h1 className="text-3xl md:text-5xl font-bold text-yellow-400 mb-2">
        ኢትዮ ማሽነሪ አገናኝ
      </h1>

      {/* English Title */}
      <h2 className="text-xl md:text-2xl text-gray-300 mb-6">
        Ethio Machinery Link (EML)
      </h2>

      {/* Tagline */}
      <p className="max-w-xl text-gray-400 mb-10">
        Connect with machinery owners, renters, operators, mechanics, and service providers across Ethiopia — all in one platform.
      </p>

      {/* Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-md">

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl">
          Rent Machinery
        </button>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl">
          Buy Machinery
        </button>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl">
          Hire Operators
        </button>

        <button className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-3 rounded-xl">
          Get Services
        </button>

      </div>

      {/* Footer */}
      <p className="mt-12 text-gray-500 text-sm">
        Built for Ethiopia 🇪🇹 | Powered by EML
      </p>

    </main>
  );
}