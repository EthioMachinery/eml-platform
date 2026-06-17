"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import EnterpriseInput from "@/components/EnterpriseInput";

const localLoginTranslations: Record<string, Record<string, string>> = {
  "login_title": {
    en: "Sign In to Your EML Account",
    am: "ወደ EML አካውንትዎ ይግቡ",
    or: "Akkaawuntii EML Keessan Seenaa",
    ti: "ናብ ናይ EML ኣካውንትኩም እተው"
  },
  "login_subtitle": {
    en: "Access your verified industrial identity",
    am: "የተረጋገጠ የኢንዱስትሪ መንነትዎን ይድረሱ",
    or: "Eenyummaa industirii mirkanaa'e kee argadhu",
    ti: "ናብ ዝተረጋገጸ ናይ ኢንዱስትሪ መንነትካ እቶ"
  },
  "label_email": {
    en: "Email Address",
    am: "ኢሜል አድራሻ",
    or: "Teessoo Email",
    ti: "ኢሜይል ኣድራሻ"
  },
  "label_password": {
    en: "Password",
    am: "የይለፍ ቃል",
    or: "Jecha Darbii",
    ti: "ምስጢራዊ ቃል"
  },
  "login_btn": {
    en: "Sign In",
    am: "ግባ",
    or: "Seeni",
    ti: "እተው"
  },
  "logging_in": {
    en: "Signing in...",
    am: "በመግባት ላይ...",
    or: "Seenaa jira...",
    ti: "ይኣቱ ኣሎ..."
  },
  "no_account": {
    en: "Don't have an account?",
    am: "አካውንት የለዎትም?",
    or: "Akkaawuntii hin qabduu?",
    ti: "ኣካውንት የብልካን?"
  },
  "register_link": {
    en: "Register",
    am: "ይመዝገቡ",
    or: "Galmeeffadhu",
    ti: "ተመዝገብ"
  },
  "error_invalid": {
    en: "Invalid email or password. Please try again.",
    am: "ትክክል ያልሆነ ኢሜል ወይም የይለፍ ቃል። እባክዎ እንደገና ይሞክሩ።",
    or: "Email ykn jecha darbii sirrii miti. Maaloo irra deebi'ii yaali.",
    ti: "ዘይቅኑዕ ኢሜይል ወይ ምስጢራዊ ቃል። በጃኻ እንደገና ፈትን።"
  }
};

export default function LoginPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const tr = (key: string) =>
    localLoginTranslations[key]?.[language] || localLoginTranslations[key]["en"];

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        router.push("/dashboard");
      }
    }
    checkSession();
  }, [router]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(tr("error_invalid"));
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-5 py-2 rounded-full font-black text-xs mb-6">
            <Sparkles size={16} />
            EML ENTERPRISE IDENTITY
          </div>
          <div className="w-16 h-16 mx-auto rounded-3xl bg-yellow-500/10 flex items-center justify-center mb-5">
            <ShieldCheck className="text-yellow-400" size={32} />
          </div>
          <h1 className="text-3xl font-black text-white">
            {tr("login_title")}
          </h1>
          <p className="text-zinc-400 mt-3 text-sm">
            {tr("login_subtitle")}
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="bg-zinc-900 border border-zinc-800 rounded-[32px] p-8 space-y-5"
        >
          {error && (
            <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
              {error}
            </div>
          )}

          <EnterpriseInput
            label={tr("label_email")}
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            type="email"
            required
          />

          <EnterpriseInput
            label={tr("label_password")}
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            type="password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black rounded-2xl text-sm uppercase tracking-wider transition-all"
          >
            {loading ? tr("logging_in") : tr("login_btn")}
          </button>

          <div className="text-center text-zinc-400 text-sm pt-2">
            {tr("no_account")}
            <Link href="/register" className="text-yellow-400 hover:text-yellow-300 ml-2 font-bold">
              {tr("register_link")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}