"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Building2,
  Globe2,
  HardHat,
  ShieldCheck,
  Truck,
  Users,
  Wrench,
  Brain,
  Sparkles,
} from "lucide-react";

import EnterpriseInput from "@/components/EnterpriseInput";
import EnterpriseSelect from "@/components/EnterpriseSelect";
import EnterpriseButton from "@/components/EnterpriseButton";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const { language } = useLanguage();
  const router = useRouter();

  // Form States
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

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // 1. Enforce strict domestic phone validation (09...) before submission to protect check_phone
    const cleanPhone = phone.trim();
    if (!/^0[97][0-9]{8}$/.test(cleanPhone)) {
      setError("Please enter a valid 10-digit Ethiopian mobile number starting with 09 or 07 (e.g., 0911123456).");
      setLoading(false);
      return;
    }

    try {
      // 2. Map frontend inputs to exact permitted DB check-constraints
      let dbRole: 'owner' | 'renter' | 'operator' | 'mechanic' | 'transporters_supplier' | 'service_provider' = 'renter';
      let dbProfileRole: 'machinery_owner' | 'renter_contractor' | 'certified_operator' | 'equipment_mechanic' | 'logistics_transporter' = 'renter_contractor';

      if (userType === "owner") {
        dbRole = "owner";
        dbProfileRole = "machinery_owner";
      } else if (userType === "operator") {
        dbRole = "operator";
        dbProfileRole = "certified_operator";
      } else if (userType === "contractor") {
        dbRole = "renter";
        dbProfileRole = "renter_contractor";
      } else if (userType === "supplier") {
        dbRole = "service_provider";
        dbProfileRole = "renter_contractor";
      }

      // 3. Trigger Supabase Sign-Up
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("Could not initialize authentication profile.");

      // 4. Populate public.users with domestic phone (09...) matching 'phone_format_check'
      const { error: userError } = await supabase.from("users").insert([
        {
          id: authData.user.id,
          full_name: fullName,
          phone: cleanPhone,
          email: email,
          role: dbRole,
          language_preference: language,
          is_admin: false,
          is_premium: false
        }
      ]);

      if (userError) throw userError;

      // 5. Populate public.profiles with +251 formatted phone matching 'check_ethiopian_phone'
      const internationalPhone = `+251${cleanPhone.substring(1)}`;
      const { error: profileError } = await supabase.from("profiles").insert([
        {
          id: authData.user.id,
          full_name: fullName,
          phone_number: internationalPhone,
          primary_role: dbProfileRole,
          is_verified: false
        }
      ]);

      if (profileError) throw profileError;

      setSuccess("Enterprise Identity created successfully! Redirecting to login...");
      setLoading(false);

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (err: any) {
      setError(err.message || "An error occurred during account creation.");
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      
      {/* HERO */}
      <section className="relative border-b border-yellow-500/10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 py-24">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-6 py-3 rounded-full font-black mb-8">
              <Sparkles size={20} />
              EML ENTERPRISE IDENTITY
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-tight">
              Build Your Digital Industrial Identity
            </h1>
            <p className="mt-8 text-xl text-zinc-400 leading-9 max-w-4xl">
              Join the sovereign industrial ecosystem powering machinery, infrastructure, logistics, AI, finance, operators, cloud systems, and enterprise transformation across Ethiopia and Africa [1].
            </p>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid xl:grid-cols-2 gap-12">
          
          {/* LEFT FORM */}
          <div>
            <form onSubmit={handleRegister} className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10 space-y-7">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 flex items-center justify-center">
                  <ShieldCheck className="text-yellow-400" size={32} />
                </div>
                <div>
                  <div className="text-3xl font-black">Enterprise Registration</div>
                  <div className="text-zinc-400 mt-2">EML Ecosystem Identity Gateway</div>
                </div>
              </div>

              {/* Status Alert Panels */}
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

              {/* NAME */}
              <EnterpriseInput
                label="Full Name"
                placeholder="Admas Imports"
                value={fullName}
                onChange={setFullName}
                required
              />

              {/* EMAIL */}
              <EnterpriseInput
                label="Email Address"
                placeholder="partner@ethiomachinery.com"
                value={email}
                onChange={setEmail}
                type="email"
                required
              />

              {/* PHONE */}
              <EnterpriseInput
                label="Mobile Phone Number"
                placeholder="e.g. 0911123456"
                value={phone}
                onChange={setPhone}
                required
              />

              {/* PASSWORD */}
              <EnterpriseInput
                label="Password"
                placeholder="••••••••"
                value={password}
                onChange={setPassword}
                type="password"
                required
              />

              {/* REGION */}
              <EnterpriseSelect
                label="Region / Deploy Zone"
                placeholder="Select Region"
                value={region}
                onChange={setRegion}
                otherValue={otherRegion}
                onOtherChange={setOtherRegion}
                options={[
                  { value: "addis", label: { en: "Addis Ababa", am: "አዲስ አበባ", or: "Finfinnee", ti: "ኣዲስ ኣበባ" } },
                  { value: "amhara", label: { en: "Amhara", am: "አማራ", or: "Amaaraa", ti: "ኣምሓራ" } },
                  { value: "oromia", label: { en: "Oromia", am: "ኦሮሚያ", or: "Oromiyaa", ti: "ኦሮሚያ" } },
                  { value: "tigray", label: { en: "Tigray", am: "ትግራይ", or: "Tigiraay", ti: "ትግራይ" } }
                ]}
                required
              />

              {/* USER TYPE */}
              <EnterpriseSelect
                label="User Type"
                placeholder="Select User Type"
                value={userType}
                onChange={setUserType}
                otherValue={otherUserType}
                onOtherChange={setOtherUserType}
                options={[
                  { value: "operator", label: { en: "Operator", am: "ኦፕሬተር", or: "Ogeessa", ti: "ኦፕሬተር" } },
                  { value: "owner", label: { en: "Machinery Owner", am: "የማሽነሪ ባለቤት", or: "Abbaa Maashinii", ti: "ባዓል ማሽነሪ" } },
                  { value: "contractor", label: { en: "Contractor", am: "ኮንትራክተር", or: "Kontiraaktaraa", ti: "ኮንትራክተር" } },
                  { value: "supplier", label: { en: "Supplier", am: "አቅራቢ", or: "Dhiyeessaa", ti: "ኣቕራቢ" } }
                ]}
                required
              />

              {/* BUTTON */}
              <EnterpriseButton
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
                type="submit"
              >
                Create Enterprise Identity
              </EnterpriseButton>

              <div className="text-center text-zinc-400 pt-2 text-sm">
                Already have an account?
                <Link href="/login" className="text-yellow-400 hover:text-yellow-300 ml-2 font-bold">
                  Login
                </Link>
              </div>

            </form>
          </div>

          {/* RIGHT SIDE DETAILS */}
          <div className="space-y-8">
            {/* AI */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[40px] p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center">
                  <Brain className="text-cyan-400" size={32} />
                </div>
                <div>
                  <div className="text-3xl font-black">AI Identity Intelligence</div>
                  <div className="text-zinc-400 mt-2">Smart ecosystem onboarding</div>
                </div>
              </div>
              <p className="text-zinc-300 text-lg leading-9">
                EML AI automatically builds your industrial profile, trust score, business classification, operational intelligence, and ecosystem compatibility.
              </p>
            </div>

            {/* FEATURES */}
            <div className="grid md:grid-cols-2 gap-6">
              <FeatureCard icon={HardHat} title="Operators" text="AI-powered workforce identity." />
              <FeatureCard icon={Truck} title="Fleet Systems" text="Connected logistics infrastructure." />
              <FeatureCard icon={Building2} title="Enterprise" text="Industrial business onboarding." />
              <FeatureCard icon={Globe2} title="Digital Economy" text="Unified ecosystem participation." />
            </div>

            {/* SECURITY */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-3xl bg-green-500/10 flex items-center justify-center">
                  <ShieldCheck className="text-green-400" size={32} />
                </div>
                <div>
                  <div className="text-3xl font-black">Sovereign Security</div>
                  <div className="text-zinc-400 mt-2">Enterprise-grade protection</div>
                </div>
              </div>
              <div className="space-y-5 text-zinc-300 text-sm">
                <div>✅ AI Fraud Detection</div>
                <div>✅ Enterprise Authentication</div>
                <div>✅ Identity Verification</div>
                <div>✅ Sovereign Infrastructure</div>
                <div>✅ Multi-System Security</div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}

function FeatureCard({ icon: Icon, title, text }: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[30px] p-7">
      <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5">
        <Icon className="text-yellow-400" size={28} />
      </div>
      <div className="text-2xl font-black mb-3">{title}</div>
      <div className="text-zinc-400 leading-7">{text}</div>
    </div>
  );
}