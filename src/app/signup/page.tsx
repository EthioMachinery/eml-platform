"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  User,
  Loader2,
  UserPlus,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

export default function SignupPage() {
  const router = useRouter();
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
        },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(
      t(
        "Account created successfully. You can now login.",
        "መለያው በትክክል ተፈጥሯል። አሁን መግባት ይችላሉ።"
      )
    );

    setLoading(false);

    setTimeout(() => {
      router.push("/login");
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

        {/* HEADER */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-yellow-500/10 text-yellow-400 mb-6">
            <UserPlus size={36} />
          </div>

          <h1 className="text-4xl font-black mb-4">
            {t(
              "Create Account",
              "መለያ ይፍጠሩ"
            )}
          </h1>

          <p className="text-zinc-400 leading-7">
            {t(
              "Join Ethiopia's machinery marketplace.",
              "የኢትዮጵያ የማሽነሪ ገበያን ይቀላቀሉ።"
            )}
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 px-4 py-4 text-sm">
            {error}
          </div>
        )}

        {/* SUCCESS */}
        {success && (
          <div className="mb-6 rounded-2xl border border-green-500/30 bg-green-500/10 text-green-400 px-4 py-4 text-sm">
            {success}
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSignup} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="block text-sm font-bold mb-3">
              {t(
                "Full Name",
                "ሙሉ ስም"
              )}
            </label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t(
                  "Enter your full name",
                  "ሙሉ ስምዎን ያስገቡ"
                )}
                className="w-full h-14 rounded-2xl bg-black border border-zinc-700 pl-12 pr-4 outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold mb-3">
              {t(
                "Email Address",
                "ኢሜይል አድራሻ"
              )}
            </label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t(
                  "Enter your email",
                  "ኢሜይልዎን ያስገቡ"
                )}
                className="w-full h-14 rounded-2xl bg-black border border-zinc-700 pl-12 pr-4 outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <label className="block text-sm font-bold mb-3">
              {t(
                "Password",
                "የይለፍ ቃል"
              )}
            </label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500"
              />

              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t(
                  "Create password",
                  "የይለፍ ቃል ይፍጠሩ"
                )}
                className="w-full h-14 rounded-2xl bg-black border border-zinc-700 pl-12 pr-4 outline-none focus:border-yellow-500"
              />
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-black font-black flex items-center justify-center gap-3 transition"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                {t(
                  "Creating account...",
                  "መለያ በመፍጠር ላይ..."
                )}
              </>
            ) : (
              <>
                <UserPlus size={20} />
                {t(
                  "Create Account",
                  "መለያ ይፍጠሩ"
                )}
              </>
            )}
          </button>

        </form>

        {/* FOOTER */}
        <div className="mt-8 text-center text-sm text-zinc-400">
          {t(
            "Already have an account?",
            "መለያ አለዎት?"
          )}
          {" "}
          <Link href="/login" className="text-yellow-400 font-bold hover:text-yellow-300">
            {t(
              "Login",
              "ግባ"
            )}
          </Link>
        </div>

      </div>
    </main>
  );
}