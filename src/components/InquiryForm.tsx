"use client";

import { useState } from "react";

import {
  MessageSquare,
  Truck,
  ShieldCheck,
  Banknote,
  Wrench,
  UserCheck,
  Briefcase,
  Loader2,
  CheckCircle2,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/context/LanguageContext";

type Props = {
  machineryId: string;
  ownerId: string;
};

export default function InquiryForm({
  machineryId,
  ownerId,
}: Props) {
  const { t } = useLanguage();

  const [message, setMessage] =
    useState("");

  const [fullName, setFullName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [city, setCity] =
    useState("");

  const [purpose, setPurpose] =
    useState("purchase");

  const [needTransport, setNeedTransport] =
    useState(false);

  const [needOperator, setNeedOperator] =
    useState(false);

  const [needFinancing, setNeedFinancing] =
    useState(false);

  const [needInsurance, setNeedInsurance] =
    useState(false);

  const [needMechanic, setNeedMechanic] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  async function sendInquiry() {
    if (
      !message.trim() ||
      !fullName.trim() ||
      !phone.trim()
    ) {
      alert(
        t(
          "Please complete required fields",
          "እባክዎ አስፈላጊ መረጃዎችን ያስገቡ"
        )
      );

      return;
    }

    setLoading(true);

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    if (!user) {
      alert(
        t(
          "Please login first",
          "እባክዎ መጀመሪያ ይግቡ"
        )
      );

      setLoading(false);

      return;
    }

    const inquiryPayload = {
      machinery_id: machineryId,

      sender_id: user.id,

      owner_id: ownerId,

      message,

      full_name: fullName,

      phone,

      city,

      inquiry_type: purpose,

      needs_transport:
        needTransport,

      needs_operator:
        needOperator,

      needs_financing:
        needFinancing,

      needs_insurance:
        needInsurance,

      needs_mechanic:
        needMechanic,

      status: "pending",

      ecosystem_stage:
        "lead_created",

      created_at:
        new Date().toISOString(),
    };

    const { error } =
      await supabase
        .from("inquiries")
        .insert([inquiryPayload]);

    if (!error) {
      /*
       OPTIONAL ECOSYSTEM LEAD CREATION
      */

      await supabase
        .from("ecosystem_leads")
        .insert([
          {
            machinery_id:
              machineryId,

            buyer_id:
              user.id,

            owner_id:
              ownerId,

            lead_type:
              purpose,

            transport_required:
              needTransport,

            operator_required:
              needOperator,

            financing_required:
              needFinancing,

            insurance_required:
              needInsurance,

            mechanic_required:
              needMechanic,

            status: "open",
          },
        ]);

      /*
       TRANSPORT OPPORTUNITY
      */

      if (needTransport) {
        await supabase
          .from(
            "transport_requests"
          )
          .insert([
            {
              machinery_id:
                machineryId,

              requester_id:
                user.id,

              owner_id:
                ownerId,

              phone,

              city,

              status: "open",
            },
          ]);
      }

      /*
       FINANCING OPPORTUNITY
      */

      if (needFinancing) {
        await supabase
          .from(
            "financing_requests"
          )
          .insert([
            {
              machinery_id:
                machineryId,

              requester_id:
                user.id,

              status:
                "pending",
            },
          ]);
      }

      /*
       INSURANCE OPPORTUNITY
      */

      if (needInsurance) {
        await supabase
          .from(
            "insurance_requests"
          )
          .insert([
            {
              machinery_id:
                machineryId,

              requester_id:
                user.id,

              status:
                "pending",
            },
          ]);
      }

      /*
       OPERATOR OPPORTUNITY
      */

      if (needOperator) {
        await supabase
          .from(
            "operator_requests"
          )
          .insert([
            {
              machinery_id:
                machineryId,

              requester_id:
                user.id,

              status:
                "open",
            },
          ]);
      }
    }

    setLoading(false);

    if (error) {
      console.error(error);

      alert(
        t(
          "Failed to send inquiry",
          "ጥያቄውን መላክ አልተቻለም"
        )
      );
    } else {
      setSuccess(true);

      setMessage("");

      alert(
        t(
          "Inquiry submitted successfully",
          "ጥያቄው በትክክል ተልኳል"
        )
      );
    }
  }

  return (
    <div className="mt-10 bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-b border-zinc-800 p-6">

        <div className="flex items-center gap-4">

          <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 flex items-center justify-center">

            <MessageSquare className="text-yellow-400" />

          </div>

          <div>

            <div className="text-yellow-400 font-black tracking-widest text-sm">
              EML SMART LEAD ENGINE
            </div>

            <h2 className="text-3xl font-black text-white">
              {t(
                "Contact Owner",
                "ባለቤቱን ያግኙ"
              )}
            </h2>

          </div>

        </div>

      </div>

      {/* BODY */}

      <div className="p-6 md:p-8">

        {/* SUCCESS */}

        {success && (
          <div className="mb-8 bg-green-500/10 border border-green-500/20 rounded-2xl p-5 flex items-start gap-4">

            <CheckCircle2 className="text-green-400 mt-1" />

            <div>

              <div className="font-black text-green-400">
                {t(
                  "Inquiry Submitted Successfully",
                  "ጥያቄው በትክክል ተልኳል"
                )}
              </div>

              <p className="text-zinc-300 mt-2">
                {t(
                  "The owner and relevant ecosystem providers will be notified.",
                  "ባለቤቱ እና ተዛማጅ አገልግሎት ሰጪዎች ይነገራቸዋል።"
                )}
              </p>

            </div>

          </div>
        )}

        {/* USER INFO */}

        <div className="grid md:grid-cols-2 gap-5 mb-6">

          <div>

            <label className="block text-sm font-bold mb-2">
              {t(
                "Full Name",
                "ሙሉ ስም"
              )}
            </label>

            <input
              value={fullName}
              onChange={(e) =>
                setFullName(
                  e.target.value
                )
              }
              placeholder={t(
                "Enter your name",
                "ስምዎን ያስገቡ"
              )}
              className="w-full h-14 rounded-2xl bg-zinc-950 border border-zinc-700 px-5 text-white outline-none focus:border-yellow-500"
            />

          </div>

          <div>

            <label className="block text-sm font-bold mb-2">
              {t(
                "Phone Number",
                "ስልክ ቁጥር"
              )}
            </label>

            <input
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              placeholder="+251..."
              className="w-full h-14 rounded-2xl bg-zinc-950 border border-zinc-700 px-5 text-white outline-none focus:border-yellow-500"
            />

          </div>

        </div>

        {/* CITY + PURPOSE */}

        <div className="grid md:grid-cols-2 gap-5 mb-6">

          <div>

            <label className="block text-sm font-bold mb-2">
              {t(
                "City / Region",
                "ከተማ / ክልል"
              )}
            </label>

            <input
              value={city}
              onChange={(e) =>
                setCity(
                  e.target.value
                )
              }
              placeholder={t(
                "Addis Ababa",
                "አዲስ አበባ"
              )}
              className="w-full h-14 rounded-2xl bg-zinc-950 border border-zinc-700 px-5 text-white outline-none focus:border-yellow-500"
            />

          </div>

          <div>

            <label className="block text-sm font-bold mb-2">
              {t(
                "Purpose",
                "ዓላማ"
              )}
            </label>

            <select
              value={purpose}
              onChange={(e) =>
                setPurpose(
                  e.target.value
                )
              }
              className="w-full h-14 rounded-2xl bg-zinc-950 border border-zinc-700 px-5 text-white outline-none focus:border-yellow-500"
            >

              <option value="purchase">
                {t(
                  "Purchase",
                  "ግዢ"
                )}
              </option>

              <option value="rental">
                {t(
                  "Rental",
                  "ኪራይ"
                )}
              </option>

              <option value="leasing">
                {t(
                  "Leasing",
                  "ሊዝ"
                )}
              </option>

              <option value="partnership">
                {t(
                  "Partnership",
                  "ሽርክና"
                )}
              </option>

              <option value="other">
                {t(
                  "Other",
                  "ሌላ"
                )}
              </option>

            </select>

          </div>

        </div>

        {/* MESSAGE */}

        <div className="mb-8">

          <label className="block text-sm font-bold mb-2">
            {t(
              "Message",
              "መልዕክት"
            )}
          </label>

          <textarea
            value={message}
            onChange={(e) =>
              setMessage(
                e.target.value
              )
            }
            rows={6}
            placeholder={t(
              "Ask about machinery condition, transport, financing, availability, operator, inspection and more...",
              "ስለ ማሽነሪው ሁኔታ፣ መጓጓዣ፣ ፋይናንስ፣ ኦፕሬተር፣ ምርመራ እና ሌሎች ይጠይቁ..."
            )}
            className="w-full p-5 rounded-2xl bg-zinc-950 border border-zinc-700 text-white outline-none focus:border-yellow-500"
          />

        </div>

        {/* ECOSYSTEM SERVICES */}

        <div className="mb-10">

          <div className="text-yellow-400 font-black tracking-widest mb-5">
            {t(
              "OPTIONAL ECOSYSTEM SERVICES",
              "አማራጭ የEML አገልግሎቶች"
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">

            <ServiceToggle
              active={needTransport}
              onClick={() =>
                setNeedTransport(
                  !needTransport
                )
              }
              icon={<Truck size={20} />}
              title={t(
                "Need Transport",
                "መጓጓዣ እፈልጋለሁ"
              )}
            />

            <ServiceToggle
              active={needOperator}
              onClick={() =>
                setNeedOperator(
                  !needOperator
                )
              }
              icon={<UserCheck size={20} />}
              title={t(
                "Need Operator",
                "ኦፕሬተር እፈልጋለሁ"
              )}
            />

            <ServiceToggle
              active={needFinancing}
              onClick={() =>
                setNeedFinancing(
                  !needFinancing
                )
              }
              icon={<Banknote size={20} />}
              title={t(
                "Need Financing",
                "ፋይናንስ እፈልጋለሁ"
              )}
            />

            <ServiceToggle
              active={needInsurance}
              onClick={() =>
                setNeedInsurance(
                  !needInsurance
                )
              }
              icon={<ShieldCheck size={20} />}
              title={t(
                "Need Insurance",
                "ኢንሹራንስ እፈልጋለሁ"
              )}
            />

            <ServiceToggle
              active={needMechanic}
              onClick={() =>
                setNeedMechanic(
                  !needMechanic
                )
              }
              icon={<Wrench size={20} />}
              title={t(
                "Need Mechanic",
                "መካኒክ እፈልጋለሁ"
              )}
            />

            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 flex items-center gap-3">

              <Briefcase className="text-yellow-400" />

              <div className="text-sm text-zinc-300">
                {t(
                  "EML intelligently connects related stakeholders automatically.",
                  "EML ተዛማጅ አገልግሎት ሰጪዎችን በራስ-ሰር ያገናኛል።"
                )}
              </div>

            </div>

          </div>

        </div>

        {/* SUBMIT */}

        <button
          onClick={sendInquiry}
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-50 text-black font-black text-lg transition flex items-center justify-center gap-3"
        >

          {loading ? (
            <>
              <Loader2 className="animate-spin" />

              {t(
                "Submitting...",
                "በመላክ ላይ..."
              )}
            </>
          ) : (
            <>
              <MessageSquare />

              {t(
                "Submit Inquiry",
                "ጥያቄ ይላኩ"
              )}
            </>
          )}

        </button>

      </div>

    </div>
  );
}

/* -------------------------------- */
/* SERVICE TOGGLE */
/* -------------------------------- */

function ServiceToggle({
  active,
  onClick,
  icon,
  title,
}: {
  active: boolean;

  onClick: () => void;

  icon: React.ReactNode;

  title: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl border p-5 flex items-center gap-4 transition text-left ${
        active
          ? "bg-yellow-500/10 border-yellow-500"
          : "bg-zinc-950 border-zinc-800 hover:border-zinc-600"
      }`}
    >

      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center ${
          active
            ? "bg-yellow-500 text-black"
            : "bg-zinc-800 text-zinc-300"
        }`}
      >
        {icon}
      </div>

      <div className="font-bold text-white">
        {title}
      </div>

    </button>
  );
}