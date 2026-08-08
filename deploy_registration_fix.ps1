# ============================================================================
# TM Registration Fix (Priority #1 of 4)
# Run from C:\tm-next in PowerShell with:
#   powershell -ExecutionPolicy Bypass -File deploy_registration_fix.ps1
# Writes 1 file as UTF-8 without BOM. Safe to re-run.
#
# WHAT THIS FIXES: registration was completely broken for every user. Two
# real bugs: (1) it tried to insert into a "users" table that doesn't exist
# in this database, and (2) it then tried to insert a SECOND profiles row
# with the same id that the handle_new_user() trigger had already created,
# which always violated the primary key. Both are removed; the form now
# correctly UPDATEs the trigger-created row with the wizard's details,
# using role/primary_role values confirmed against your actual database
# constraints.
# ============================================================================

$ErrorActionPreference = "Stop"
$Utf8NoBom = New-Object System.Text.UTF8Encoding $false

function Write-TmFile($RelativePath, $Content) {
    $full = Join-Path (Get-Location) $RelativePath
    $dir = Split-Path $full -Parent
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    [System.IO.File]::WriteAllText($full, $Content, $Utf8NoBom)
    Write-Host "Wrote $RelativePath"
}

$f1 = @'
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Building2, Globe2, HardHat, ShieldCheck, Truck, Brain, Sparkles } from "lucide-react";
import EnterpriseInput from "@/components/EnterpriseInput";
import EnterpriseSelect from "@/components/EnterpriseSelect";
import EnterpriseButton from "@/components/EnterpriseButton";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";
import { translate } from "@/lib/i18n";

export default function RegisterPage() {
  const { language } = useLanguage();
  const router = useRouter();
  const tr = (key: string) => translate(key, language);

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [region, setRegion] = useState("");
  const [otherRegion, setOtherRegion] = useState("");
  const [userType, setUserType] = useState("");
  const [otherUserType, setOtherUserType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const regionOptions = [
    { value: "addis", label: { en: "Addis Ababa", am: "አዲስ አበባ", or: "Finfinnee", ti: "ኣዲስ ኣበባ" } },
    { value: "amhara", label: { en: "Amhara", am: "አማራ", or: "Amaaraa", ti: "ኣምሓራ" } },
    { value: "oromia", label: { en: "Oromia", am: "ኦሮሚያ", or: "Oromiyaa", ti: "ኦሮምያ" } },
    { value: "tigray", label: { en: "Tigray", am: "ትግራይ", or: "Tigiraay", ti: "ትግራይ" } },
    { value: "sidama", label: { en: "Sidama", am: "ሲዳማ", or: "Sidaamaa", ti: "ሲዳማ" } },
    { value: "snnpr", label: { en: "SNNPR", am: "ደቡብ ኢትዮጵያ", or: "SNNPR", ti: "ደቡብ ኢትዮጵያ" } },
    { value: "somali", label: { en: "Somali", am: "ሱማሌ", or: "Somaalee", ti: "ሶማሊ" } },
    { value: "afar", label: { en: "Afar", am: "አፋር", or: "Afaar", ti: "ኣፋር" } },
    { value: "benishangul", label: { en: "Benishangul-Gumuz", am: "ቤኒሻንጉል-ጉሙዝ", or: "Beniishaangul", ti: "ቤኒሻንጉል" } },
    { value: "gambella", label: { en: "Gambella", am: "ጋምቤላ", or: "Gambellaa", ti: "ጋምቤላ" } },
    { value: "harari", label: { en: "Harari", am: "ሐረሪ", or: "Hararee", ti: "ሓረሪ" } },
    { value: "dire_dawa", label: { en: "Dire Dawa", am: "ድሬዳዋ", or: "Dirree Dhawaa", ti: "ድሬዳዋ" } },
  ];

  const userTypeOptions = [
    { value: "owner", label: { en: "Machinery Owner", am: "የማሽነሪ ባለቤት", or: "Abbaa Maashinii", ti: "ዋና ማሽነሪ" } },
    { value: "operator", label: { en: "Certified Operator", am: "የተረጋገጠ ኦፕሬተር", or: "Oopireetara Mirkanaaye", ti: "ዝተረጋገጸ ኦፕሬተር" } },
    { value: "contractor", label: { en: "Contractor", am: "ኮንትራክተር", or: "Kontiraaktaraa", ti: "ኮንትራክተር" } },
    { value: "supplier", label: { en: "Supplier / Dealer", am: "አቅራቢ / ነጋዴ", or: "Dhiyeessaa", ti: "ኣቕራቢ" } },
    { value: "transporter", label: { en: "Transporter", am: "አጓጓዥ", or: "Geessaa", ti: "መጓዓዛይ" } },
    { value: "mechanic", label: { en: "Mechanic", am: "ሜካኒክ", or: "Makaanikaa", ti: "መካኒክ" } },
    { value: "investor", label: { en: "Investor", am: "ባለሀብት", or: "Inveestara", ti: "ወፋሪ" } },
  ];

  const validateStep1 = () => {
    if (!fullName.trim()) { setError("Full name is required"); return false; }
    if (!email.trim()) { setError("Email is required"); return false; }
    if (!phone.trim()) { setError("Phone number is required"); return false; }
    if (!/^0[97][0-9]{8}$/.test(phone.trim())) { setError("Enter a valid 10-digit Ethiopian number (09... or 07...)"); return false; }
    if (!password.trim() || password.length < 6) { setError("Password must be at least 6 characters"); return false; }
    setError("");
    return true;
  };

  const handleNext = () => {
    if (validateStep1()) setStep(2);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!region) { setError("Please select your region"); return; }
    if (!userType) { setError("Please select your user type"); return; }
    setLoading(true);
    setError("");

    try {
      const cleanPhone = phone.trim();
      // profiles.role is constrained to a fixed list (buyer, seller, operator,
      // mechanic, transporter, insurer, supplier, admin). profiles.primary_role
      // is a separate, more descriptive enum with its own fixed list. Both are
      // mapped explicitly here — using an unlisted value in either throws a
      // constraint error and silently breaks registration, which is exactly
      // what was happening before this fix.
      let dbRole: string = "buyer";
      let dbProfileRole: string = "renter_contractor";
      if (userType === "owner") { dbRole = "seller"; dbProfileRole = "machinery_owner"; }
      else if (userType === "operator") { dbRole = "operator"; dbProfileRole = "certified_operator"; }
      else if (userType === "mechanic") { dbRole = "mechanic"; dbProfileRole = "equipment_mechanic"; }
      else if (userType === "transporter") { dbRole = "transporter"; dbProfileRole = "logistics_transporter"; }
      else if (userType === "supplier") { dbRole = "supplier"; dbProfileRole = "spare_parts_provider"; }
      else if (userType === "investor") { dbRole = "buyer"; dbProfileRole = "machinery_investor"; }
      // "contractor" (and anything unmapped) keeps the buyer / renter_contractor defaults above.

      const { data: authData, error: authError } = await supabase.auth.signUp({
        email, password,
        options: { data: { full_name: fullName } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error("Could not initialize authentication profile.");

      const internationalPhone = `+251${cleanPhone.substring(1)}`;

      // FIXED: this used to INSERT a second profiles row here, but the
      // handle_new_user() database trigger already creates a profiles row
      // the moment auth.signUp() succeeds (same id, primary key). Inserting
      // again always violated the primary key and threw, so no registration
      // ever completed successfully through this form. This now UPDATEs
      // that already-created row with the wizard's extra details instead.
      // (The old insert into a "users" table has also been removed — that
      // table doesn't exist in this database; profiles is the real one.)
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          phone: cleanPhone,
          phone_number: internationalPhone,
          role: dbRole,
          primary_role: dbProfileRole,
          region: region === "other" ? otherRegion : region,
          is_verified: false,
        })
        .eq("id", authData.user.id);
      if (profileError) throw profileError;

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "An error occurred during account creation.");
    }
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <section className="relative border-b border-yellow-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 py-16">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-6 py-3 rounded-full font-black mb-6">
              <Sparkles size={20} />
              TM ENTERPRISE IDENTITY
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight">
              {tr("register.title")}
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-3xl">
              {tr("register.subtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid xl:grid-cols-2 gap-12">
          <div>
            {/* Step indicator */}
            <div className="flex items-center gap-2 mb-8">
              {[1, 2].map(s => (
                <div key={s} className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black transition-all ${
                    step === s ? "bg-amber-500 text-white" : step > s ? "bg-green-500 text-white" : "bg-zinc-800 text-zinc-400"
                  }`}>
                    {step > s ? "✓" : s}
                  </div>
                  <span className={`text-sm font-bold ${step === s ? "text-white" : "text-zinc-500"}`}>
                    {s === 1 ? tr("register.step1") : tr("register.step2")}
                  </span>
                  {s < 2 && <div className={`w-12 h-0.5 mx-2 ${step > s ? "bg-green-500" : "bg-zinc-800"}`} />}
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-14 h-14 rounded-3xl bg-yellow-500/10 flex items-center justify-center">
                  <ShieldCheck className="text-yellow-400" size={28} />
                </div>
                <div>
                  <div className="text-2xl font-black">
                    {step === 1 ? tr("register.step1") : tr("register.step2")}
                  </div>
                  <div className="text-zinc-400 text-sm mt-1">TM Ecosystem Identity Gateway</div>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-2xl border border-red-500/30 bg-red-500/10 text-red-400 text-xs">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 rounded-2xl border border-green-500/30 bg-green-500/10 text-green-400 text-xs">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {step === 1 && (
                  <>
                    <EnterpriseInput
                      label={tr("forms.name")}
                      placeholder="Abebe Girma"
                      value={fullName}
                      onChange={setFullName}
                      required
                    />
                    <EnterpriseInput
                      label={tr("forms.email")}
                      placeholder="partner@trustworthymachinery.com"
                      value={email}
                      onChange={setEmail}
                      type="email"
                      required
                    />
                    <EnterpriseInput
                      label={tr("forms.phone")}
                      placeholder="e.g. 0911123456"
                      value={phone}
                      onChange={setPhone}
                      required
                    />
                    <EnterpriseInput
                      label={tr("forms.password")}
                      placeholder="••••••••"
                      value={password}
                      onChange={setPassword}
                      type="password"
                      required
                    />
                    <button
                      type="button"
                      onClick={handleNext}
                      className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-black rounded-2xl text-sm uppercase tracking-wider transition-all"
                    >
                      {tr("register.next")}
                    </button>
                  </>
                )}

                {step === 2 && (
                  <>
                    <EnterpriseSelect
                      label={tr("forms.region")}
                      placeholder={tr("forms.selectRegion")}
                      value={region}
                      onChange={setRegion}
                      otherValue={otherRegion}
                      onOtherChange={setOtherRegion}
                      options={regionOptions}
                      required
                    />
                    <EnterpriseSelect
                      label={tr("forms.userType")}
                      placeholder={tr("forms.selectUserType")}
                      value={userType}
                      onChange={setUserType}
                      otherValue={otherUserType}
                      onOtherChange={setOtherUserType}
                      options={userTypeOptions}
                      required
                    />
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setStep(1); setError(""); }}
                        className="flex-1 py-4 bg-zinc-800 hover:bg-zinc-700 text-white font-black rounded-2xl text-sm uppercase tracking-wider transition-all"
                      >
                        {tr("register.back")}
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 py-4 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white font-black rounded-2xl text-sm uppercase tracking-wider transition-all"
                      >
                        {loading ? tr("loading") : tr("register.submit")}
                      </button>
                    </div>
                  </>
                )}
              </form>

              <div className="text-center text-zinc-400 text-sm pt-2">
                {tr("auth.alreadyHaveAccount")}
                <Link href="/login" className="text-yellow-400 hover:text-yellow-300 ml-2 font-bold">
                  {tr("auth.login")}
                </Link>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[40px] p-10">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-3xl bg-cyan-500/10 flex items-center justify-center">
                  <Brain className="text-cyan-400" size={28} />
                </div>
                <div>
                  <div className="text-2xl font-black">AI Identity Intelligence</div>
                  <div className="text-zinc-400 mt-1 text-sm">Smart ecosystem onboarding</div>
                </div>
              </div>
              <p className="text-zinc-300 leading-8">
                TM AI automatically builds your industrial profile, trust score, business classification, operational intelligence, and ecosystem compatibility.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: HardHat, title: "Operators", text: "AI-powered workforce identity." },
                { icon: Truck, title: "Fleet Systems", text: "Connected logistics infrastructure." },
                { icon: Building2, title: "Enterprise", text: "Industrial business onboarding." },
                { icon: Globe2, title: "Digital Economy", text: "Unified ecosystem participation." },
              ].map(({ icon: Icon, title, text }) => (
                <div key={title} className="bg-zinc-900 border border-zinc-800 rounded-[24px] p-6">
                  <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-4">
                    <Icon className="text-yellow-400" size={24} />
                  </div>
                  <div className="text-lg font-black mb-2">{title}</div>
                  <div className="text-zinc-400 text-sm">{text}</div>
                </div>
              ))}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-8">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-14 h-14 rounded-3xl bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="text-green-400" size={28} />
                </div>
                <div>
                  <div className="text-2xl font-black">Sovereign Security</div>
                  <div className="text-zinc-400 mt-1 text-sm">Enterprise-grade protection</div>
                </div>
              </div>
              <div className="space-y-3 text-zinc-300 text-sm">
                {["AI Fraud Detection", "Enterprise Authentication", "Identity Verification", "Sovereign Infrastructure", "Multi-System Security"].map(item => (
                  <div key={item} className="flex items-center gap-2">
                    <span className="text-green-400">✓</span> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
'@
Write-TmFile "src/app/register/page.tsx" $f1

Write-Host ""
Write-Host "Registration fix written. Run: git status" -ForegroundColor Green
