"use client";

import React, { useState } from "react";
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
  AlertCircle,
  Info,
  ChevronDown
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

type Props = {
  machineryId: string;
  ownerId: string;
  machineTitle?: string;
};

export default function InquiryForm({ machineryId, ownerId, machineTitle }: Props) {
  const { language } = useLanguage();

  // Unified Translation Helper
  const t = (en: string, am: string) => (language === "am" ? am : en);

  // --- FORM STATE ---
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [purpose, setPurpose] = useState("purchase");
  const [otherDescription, setOtherDescription] = useState(""); // Mandatory for 'other'
  const [message, setMessage] = useState("");

  // Ecosystem Service Toggles
  const [needTransport, setNeedTransport] = useState(false);
  const [needOperator, setNeedOperator] = useState(false);
  const [needFinancing, setNeedFinancing] = useState(false);
  const [needInsurance, setNeedInsurance] = useState(false);
  const [needMechanic, setNeedMechanic] = useState(false);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendInquiry() {
    // 1. Validation Logic
    if (!fullName.trim() || !phone.trim() || !message.trim()) {
      setError(t("Please fill all required fields", "እባክዎ ሁሉንም የግዴታ ቦታዎች ይሙሉ"));
      return;
    }

    if (purpose === 'other' && !otherDescription.trim()) {
      setError(t("Please provide specific details for your request", "እባክዎ ለጥያቄዎ ዝርዝር መግለጫ ይስጡ"));
      return;
    }

    setLoading(true);
    setError(null);

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError(t("Please login first to send an inquiry", "ጥያቄ ለመላክ እባክዎ መጀመሪያ ይግቡ"));
      setLoading(false);
      return;
    }

    try {
      const inquiryPayload = {
        machinery_id: machineryId,
        sender_id: user.id,
        owner_id: ownerId,
        message,
        full_name: fullName,
        phone,
        city,
        inquiry_type: purpose,
        other_description: purpose === 'other' ? otherDescription : null,
        needs_transport: needTransport,
        needs_operator: needOperator,
        needs_financing: needFinancing,
        needs_insurance: needInsurance,
        needs_mechanic: needMechanic,
        status: "pending",
        created_at: new Date().toISOString(),
      };

      // 2. Insert into Main Inquiries Table
      const { error: mainError } = await supabase.from("inquiries").insert([inquiryPayload]);
      if (mainError) throw mainError;

      // 3. Populate Ecosystem Opportunities (Parallel)
      const ecosystemTasks = [];

      // Logic: Lead Creation
      ecosystemTasks.push(supabase.from("ecosystem_leads").insert([{
        machinery_id: machineryId,
        buyer_id: user.id,
        owner_id: ownerId,
        lead_type: purpose,
        transport_required: needTransport,
        operator_required: needOperator,
        status: "open"
      }]));

      if (needTransport) {
        ecosystemTasks.push(supabase.from("transport_requests").insert([{
          machinery_id: machineryId,
          requester_id: user.id,
          phone,
          city,
          status: "open"
        }]));
      }

      if (needFinancing) {
        ecosystemTasks.push(supabase.from("financing_requests").insert([{
          machinery_id: machineryId,
          requester_id: user.id,
          status: "pending"
        }]));
      }

      await Promise.all(ecosystemTasks);

      // 4. Telemetry: Notify the CEO Autopilot Dashboard
      await supabase.from('tm_events').insert({
        event_name: 'LEAD_GENERATED',
        severity: 'INFO',
        payload: { machine: machineTitle, type: purpose, is_other: purpose === 'other' }
      });

      setSuccess(true);
      setLoading(false);
    } catch (err: any) {
      console.error(err);
      setError(t("Failed to send inquiry. Check network.", "ጥያቄውን መላክ አልተቻለም። ኢንተርኔትዎን ያረጋግጡ።"));
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 p-10 rounded-3xl text-center animate-in zoom-in-95 duration-500">
        <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-2xl font-black text-white uppercase tracking-tight">
          {t("Inquiry Submitted", "ጥያቄዎ ተልኳል")}
        </h3>
        <p className="text-zinc-400 mt-2 text-sm">
          {t("The owner and AI matching engine have been notified.", "ባለቤቱ እና የAI አገናኙ መልዕክት ደርሷቸዋል።")}
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="mt-6 text-emerald-500 text-xs font-bold uppercase tracking-widest hover:underline"
        >
          {t("Send another request", "ሌላ ጥያቄ ላክ")}
        </button>
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-white/5 rounded-[2rem] overflow-hidden shadow-2xl">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-600/20 to-zinc-900 border-b border-white/5 p-8">
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/20">
            <MessageSquare className="text-emerald-400 w-8 h-8" />
          </div>
          <div>
            <div className="text-emerald-400 font-black tracking-[0.2em] text-[10px] uppercase">
              TM Industrial Intelligence
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
              {t("Contact Owner", "ባለቤቱን ያግኙ")}
            </h2>
          </div>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-center gap-3 text-red-500 text-xs font-bold uppercase">
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* FULL NAME */}
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">
              {t("Full Name", "ሙሉ ስም")}
            </label>
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("Enter your name", "ስምዎን ያስገቡ")}
              className="w-full h-14 rounded-xl bg-black border border-white/10 px-5 text-white outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">
              {t("Phone Number", "ስልክ ቁጥር")}
            </label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+251..."
              className="w-full h-14 rounded-xl bg-black border border-white/10 px-5 text-white outline-none focus:border-emerald-500 transition-all"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* CITY */}
          <div>
            <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">
              {t("City / Region", "ከተማ / ክልል")}
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder={t("Addis Ababa", "አዲስ አበባ")}
              className="w-full h-14 rounded-xl bg-black border border-white/10 px-5 text-white outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* PURPOSE */}
          <div className="relative">
            <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">
              {t("Inquiry Purpose", "የጥያቄው ዓላማ")}
            </label>
            <select
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full h-14 rounded-xl bg-black border border-white/10 px-5 text-white outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
            >
              <option value="purchase">{t("Purchase", "ግዢ")}</option>
              <option value="rental">{t("Rental", "ኪራይ")}</option>
              <option value="leasing">{t("Leasing", "ሊዝ")}</option>
              <option value="partnership">{t("Partnership", "ሽርክና")}</option>
              <option value="other">{t("Other", "ሌላ")}</option>
            </select>
            <ChevronDown className="absolute right-4 top-10 text-zinc-500 pointer-events-none" size={18} />
          </div>
        </div>

        {/* --- DYNAMIC: SPECIFY OTHER FIELD --- */}
        {purpose === 'other' && (
          <div className="mb-6 animate-in slide-in-from-top-4 duration-300">
            <label className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase mb-2 tracking-widest">
              <Info size={14} /> {t("Specification Required", "ዝርዝር መግለጫ ያስፈልጋል")}
            </label>
            <textarea
              required
              value={otherDescription}
              onChange={(e) => setOtherDescription(e.target.value)}
              rows={3}
              placeholder={t(
                "please specify, mention, describe or other appropriate means of description", 
                "እባክዎ በዝርዝር ይጥቀሱ፣ ይጥቀሱ፣ ይግለጹ ወይም በሌላ ተገቢ መግለጫ ያብራሩ"
              )}
              className="w-full p-5 rounded-xl bg-black border border-emerald-500/30 text-white outline-none focus:border-emerald-500 transition-all placeholder:text-zinc-700"
            />
          </div>
        )}

        {/* MESSAGE */}
        <div className="mb-8">
          <label className="block text-[10px] font-black text-zinc-500 uppercase mb-2 tracking-widest">
            {t("Message", "መልዕክት")}
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={5}
            placeholder={t(
              "Describe machine condition needs, transport requirements, etc.", 
              "ስለ ማሽነሪው ሁኔታ፣ መጓጓዣ እና ሌሎች ፍላጎቶችን እዚህ ይግለጹ..."
            )}
            className="w-full p-5 rounded-xl bg-black border border-white/10 text-white outline-none focus:border-emerald-500 transition-all"
          />
        </div>

        {/* ECOSYSTEM TOGGLES */}
        <div className="mb-10">
          <div className="text-zinc-500 font-black tracking-[0.2em] text-[10px] mb-5 uppercase">
            {t("Ecosystem Value-Add Services", "ተጨማሪ የኢንዱስትሪ አገልግሎቶች")}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ServiceToggle active={needTransport} onClick={() => setNeedTransport(!needTransport)} icon={<Truck />} title={t("Transport", "መጓጓዣ")} />
            <ServiceToggle active={needOperator} onClick={() => setNeedOperator(!needOperator)} icon={<UserCheck />} title={t("Operator", "ኦፕሬተር")} />
            <ServiceToggle active={needFinancing} onClick={() => setNeedFinancing(!needFinancing)} icon={<Banknote />} title={t("Financing", "ፋይናንስ")} />
            <ServiceToggle active={needInsurance} onClick={() => setNeedInsurance(!needInsurance)} icon={<ShieldCheck />} title={t("Insurance", "ኢንሹራንስ")} />
            <ServiceToggle active={needMechanic} onClick={() => setNeedMechanic(!needMechanic)} icon={<Wrench />} title={t("Mechanic", "መካኒክ")} />
            
            <div className="hidden lg:flex bg-zinc-950/50 border border-white/5 rounded-2xl p-4 items-center gap-3">
              <Briefcase className="text-emerald-500 shrink-0" size={20} />
              <div className="text-[10px] leading-tight text-zinc-500 uppercase font-bold">
                {t("Auto-Connect to verified partners", "ከታመኑ አጋሮች ጋር ያገናኛል")}
              </div>
            </div>
          </div>
        </div>

        {/* SUBMIT BUTTON */}
        <button
          onClick={sendInquiry}
          disabled={loading}
          className="w-full h-16 rounded-2xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-900/20"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              {t("Processing...", "በማስገባት ላይ...")}
            </>
          ) : (
            <>
              <MessageSquare size={20} />
              {t("Send Secure Inquiry", "ጥያቄውን ላክ")}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT: SERVICE TOGGLE ---
function ServiceToggle({ active, onClick, icon, title }: { active: boolean; onClick: () => void; icon: any; title: string }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-4 flex items-center gap-3 transition-all text-left ${
        active ? "bg-emerald-500/10 border-emerald-500" : "bg-black border-white/5 hover:border-white/20"
      }`}
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${active ? "bg-emerald-500 text-black" : "bg-zinc-800 text-zinc-400"}`}>
        {React.cloneElement(icon, { size: 18 })}
      </div>
      <div className={`text-[11px] font-black uppercase tracking-tighter ${active ? "text-white" : "text-zinc-500"}`}>
        {title}
      </div>
    </button>
  );
}