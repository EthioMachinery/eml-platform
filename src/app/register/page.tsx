"use client";

import { useState } from "react";

import Link from "next/link";

import {
  Building2,
  Globe2,
  HardHat,
  ShieldCheck,
  Truck,
  UserCheck,
  Users,
  Wrench,
  Brain,
  Sparkles,
} from "lucide-react";

import EnterpriseInput from "@/components/EnterpriseInput";
import EnterpriseSelect from "@/components/EnterpriseSelect";
import EnterpriseButton from "@/components/EnterpriseButton";

import {
  translations,
  translate,
} from "@/lib/i18n";

import {
  useLanguage,
} from "@/context/LanguageContext";

export default function RegisterPage() {
  const { language } =
    useLanguage();

  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [region, setRegion] =
    useState("");

  const [otherRegion, setOtherRegion] =
    useState("");

  const [userType, setUserType] =
    useState("");

  const [otherUserType, setOtherUserType] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  async function handleRegister() {
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      alert(
        "Enterprise Registration Initialized"
      );
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* HERO */}

      <section className="relative border-b border-yellow-500/10 overflow-hidden">

        <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 via-orange-500/5 to-transparent" />

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

              Join the sovereign industrial ecosystem powering machinery,
              infrastructure,
              logistics,
              AI,
              finance,
              operators,
              cloud systems,
              and enterprise transformation across Ethiopia and Africa.

            </p>

          </div>

        </div>

      </section>

      {/* CONTENT */}

      <section className="max-w-7xl mx-auto px-4 py-20">

        <div className="grid xl:grid-cols-2 gap-12">

          {/* LEFT */}

          <div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10">

              <div className="flex items-center gap-4 mb-10">

                <div className="w-16 h-16 rounded-3xl bg-yellow-500/10 flex items-center justify-center">

                  <ShieldCheck
                    className="text-yellow-400"
                    size={32}
                  />

                </div>

                <div>

                  <div className="text-3xl font-black">

                    Enterprise Registration

                  </div>

                  <div className="text-zinc-400 mt-2">

                    EML Ecosystem Identity Gateway

                  </div>

                </div>

              </div>

              <div className="space-y-7">

                {/* NAME */}

                <EnterpriseInput
                  label={translate(
                    "forms.name",
                    language
                  )}

                  placeholder={translate(
                    "forms.name",
                    language
                  )}

                  value={fullName}

                  onChange={
                    setFullName
                  }

                  required
                />

                {/* EMAIL */}

                <EnterpriseInput
                  label={translate(
                    "forms.email",
                    language
                  )}

                  placeholder={translate(
                    "forms.email",
                    language
                  )}

                  value={email}

                  onChange={
                    setEmail
                  }

                  type="email"

                  required
                />

                {/* PHONE */}


                <EnterpriseInput
                  label={translate(
                    "forms.phone",
                    language
                  )}

                  placeholder="+251..."

                  value={phone}

                  onChange={
                    setPhone
                  }

                  required
                />

                {/* PASSWORD */}

                <EnterpriseInput
                  label="Password"

                  placeholder="••••••••"

                  value={password}

                  onChange={
                    setPassword
                  }

                  type="password"

                  required
                />

                {/* REGION */}

                <EnterpriseSelect
                  label={translate(
                    "forms.region",
                    language
                  )}

                  placeholder={translate(
                    "forms.selectRegion",
                    language
                  )}

                  value={region}

                  onChange={
                    setRegion
                  }

                  otherValue={
                    otherRegion
                  }

                  onOtherChange={
                    setOtherRegion
                  }

                  options={[
                    {
                      value:
                        "addis",

                      label: {
                        en: "Addis Ababa",

                        am: "አዲስ አበባ",

                        or: "Finfinnee",

                        ti: "ኣዲስ ኣበባ",
                      },
                    },

                    {
                      value:
                        "amhara",

                      label: {
                        en: "Amhara",

                        am: "አማራ",

                        or: "Amaaraa",

                        ti: "ኣምሓራ",
                      },
                    },

                    {
                      value:
                        "oromia",

                      label: {
                        en: "Oromia",

                        am: "ኦሮሚያ",

                        or: "Oromiyaa",

                        ti: "ኦሮሚያ",
                      },
                    },

                    {
                      value:
                        "tigray",

                      label: {
                        en: "Tigray",

                        am: "ትግራይ",

                        or: "Tigiraay",

                        ti: "ትግራይ",
                      },
                    },
                  ]}

                  required
                />

                {/* USER TYPE */}

                <EnterpriseSelect
                  label="User Type"

                  placeholder="Select User Type"

                  value={userType}

                  onChange={
                    setUserType
                  }

                  otherValue={
                    otherUserType
                  }

                  onOtherChange={
                    setOtherUserType
                  }

                  options={[
                    {
                      value:
                        "operator",

                      label: {
                        en: "Operator",

                        am: "ኦፕሬተር",

                        or: "Ogeessa",

                        ti: "ኦፕሬተር",
                      },
                    },

                    {
                      value:
                        "owner",

                      label: {
                        en: "Machinery Owner",

                        am: "የማሽነሪ ባለቤት",

                        or: "Abbaa Maashinii",

                        ti: "ባዓል ማሽነሪ",
                      },
                    },

                    {
                      value:
                        "contractor",

                      label: {
                        en: "Contractor",

                        am: "ኮንትራክተር",

                        or: "Kontiraaktaraa",

                        ti: "ኮንትራክተር",
                      },
                    },

                    {
                      value:
                        "supplier",

                      label: {
                        en: "Supplier",

                        am: "አቅራቢ",

                        or: "Dhiyeessaa",

                        ti: "ኣቕራቢ",
                      },
                    },

                    {
                      value:
                        "government",

                      label: {
                        en: "Government",

                        am: "መንግስት",

                        or: " mootummaa",

                        ti: "መንግስቲ",
                      },
                    },

                    {
                      value:
                        "developer",

                      label: {
                        en: "Developer",

                        am: "አበልፃጊ",

                        or: "Developer",

                        ti: "ዲቨሎፐር",
                      },
                    },
                  ]}

                  required
                />

                {/* BUTTON */}

                <EnterpriseButton
                  variant="primary"

                  size="lg"

                  fullWidth

                  loading={loading}

                  onClick={
                    handleRegister
                  }
                >

                  Create Enterprise Identity

                </EnterpriseButton>

                {/* LOGIN */}

                <div className="text-center text-zinc-400 pt-2">

                  Already have an account?

                  <Link
                    href="/login"
                    className="text-yellow-400 hover:text-yellow-300 ml-2 font-bold"
                  >

                    Login

                  </Link>

                </div>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="space-y-8">

            {/* AI */}

            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-[40px] p-10">

              <div className="flex items-center gap-4 mb-6">

                <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center">

                  <Brain
                    className="text-cyan-400"
                    size={32}
                  />

                </div>

                <div>

                  <div className="text-3xl font-black">

                    AI Identity Intelligence

                  </div>

                  <div className="text-zinc-400 mt-2">

                    Smart ecosystem onboarding

                  </div>

                </div>

              </div>

              <p className="text-zinc-300 text-lg leading-9">

                EML AI automatically builds your industrial profile,
                trust score,
                business classification,
                operational intelligence,
                and ecosystem compatibility.

              </p>

            </div>

            {/* FEATURES */}

            <div className="grid md:grid-cols-2 gap-6">

              <FeatureCard
                icon={HardHat}
                title="Operators"
                text="AI-powered workforce identity."
              />

              <FeatureCard
                icon={Truck}
                title="Fleet Systems"
                text="Connected logistics infrastructure."
              />

              <FeatureCard
                icon={Building2}
                title="Enterprise"
                text="Industrial business onboarding."
              />

              <FeatureCard
                icon={Globe2}
                title="Digital Economy"
                text="Unified ecosystem participation."
              />

              <FeatureCard
                icon={Users}
                title="Government"
                text="Public infrastructure integration."
              />

              <FeatureCard
                icon={Wrench}
                title="Machinery"
                text="Industrial asset management."
              />

            </div>

            {/* SECURITY */}

            <div className="bg-zinc-900 border border-zinc-800 rounded-[40px] p-10">

              <div className="flex items-center gap-4 mb-6">

                <div className="w-16 h-16 rounded-3xl bg-green-500/10 flex items-center justify-center">

                  <ShieldCheck
                    className="text-green-400"
                    size={32}
                  />

                </div>

                <div>

                  <div className="text-3xl font-black">

                    Sovereign Security

                  </div>

                  <div className="text-zinc-400 mt-2">

                    Enterprise-grade protection

                  </div>

                </div>

              </div>

              <div className="space-y-5 text-zinc-300">

                <div>
                  ✅ AI Fraud Detection
                </div>

                <div>
                  ✅ Enterprise Authentication
                </div>

                <div>
                  ✅ Identity Verification
                </div>

                <div>
                  ✅ Sovereign Infrastructure
                </div>

                <div>
                  ✅ Multi-System Security
                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

    </main>
  );
}

function FeatureCard({
  icon: Icon,
  title,
  text,
}: any) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-[30px] p-7">

      <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-5">

        <Icon
          className="text-yellow-400"
          size={28}
        />

      </div>

      <div className="text-2xl font-black mb-3">

        {title}

      </div>

      <div className="text-zinc-400 leading-7">

        {text}

      </div>

    </div>
  );
}