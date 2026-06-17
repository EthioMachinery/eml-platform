"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useTranslate } from "@/hooks/useTranslate";
import { useLanguage } from "@/context/LanguageContext";
import { calculateEscrowSplits, EscrowStage } from "@/lib/escrow/stateMachine";
import { supabase } from "@/lib/supabaseClient";

const localEscrowTranslations: Record<string, Record<string, string>> = {
  "portal_title": {
    en: "EML Secure Escrow Portal",
    am: "የ EML ታማኝ የክፍያ ዋስትና መድረክ",
    or: "Dabaree Kafaltii Wabii EML",
    ti: "መድረኽ ውሑስ ክፍሊት EML"
  },
  "portal_desc": {
    en: "Secure heavy machinery transactions in Ethiopia. Funds are released to suppliers, operators, or haulers only as milestones are verified.",
    am: "በኢትዮጵያ ውስጥ የሚደረጉ ከባድ ማሽነሪዎች ግብይቶችን ደህንነት ያረጋግጡ። ግብይቱ ደረጃ በደረጃ ሲረጋገጥ ብቻ ክፍያ ለባለቤቶች ወይም ማሽነሪዎች ይለቀቃል።",
    or: "Kafaltii daldala maashinarii ulfaataa Itoophiyaa keessatti amanamaa taasisaa. Adeemsi hojii yeroo mirkanaa'u qofa kaffaltiin ni gadi lakkifama.",
    ti: "ኣብ ኢትዮጵያ ዝግበሩ ናይ ከበድቲ ማሽነሪታት ግብይታት ድሕንነት ኣረጋግጹ። ግብይት ብብርኪ ክረጋገጽ ከሎ ጥራሕ ክፍሊት ይለቐቕ።"
  },
  "milestone_title": {
    en: "Escrow Processing Milestones",
    am: "የዋስትና ክፍያ ሂደት ደረጃዎች",
    or: "Milestone-wwan Adeemsa Kafaltii",
    ti: "ብርክታት መስርሕ ክፍሊት ዋስትና"
  },
  "milestone_1": { en: "1. Fund Escrow Wallet", am: "፩. የዋስትና አካውንቱን ይሙሉ", or: "1. Waletii Wabii Kafali", ti: "፩. መአከቢ ክፍሊት ምልኣት" },
  "milestone_1_desc": {
    en: "Buyer deposits the total balance into EML secure holding.",
    am: "ገዢው ጠቅላላውን የዋስትና ገንዘብ በEML አስተማማኝ የዋስትና አካውንት ውስጥ ያስቀምጣል።",
    or: "Bitiin guutuu kaffaltii herrega wabii EML keessatti dhangalaasa.",
    ti: "ዓዳጊ ምሉእ መጠን ክፍሊት ኣብ ናይ EML ውሑስ ሕሳብ የቐምጥ።"
  },
  "milestone_2": { en: "2. Certified Inspection Check", am: "፪. የተረጋገጠ የማሽነሪ ምርመራ", or: "2. Mirkaneessa Gamaggamaa", ti: "፪. ዝተረጋገጸ ምርመራ ማሽን" },
  "milestone_2_desc": {
    en: "Independent EML certified inspector performs checks. Post verification, the inspection fee is released.",
    am: "የተረጋገጠ የEML ባለሙያ ማሽኑን ይፈትሻል። ከምርመራ በኋላ የባለሙያ ክፍያ ይለቀቃል።",
    or: "Ogeessi mirkanaaye maashinicha qorata. Mirkaneessaan booda kaffaltiin ogeessaa ni gadi lakkifama.",
    ti: "ዝተረጋገጸ ናይ EML ኪኢላ ነቲ ማሽን ይምረምሮ። ድሕሪ ምርግጋጽ ክፍሊት እቲ ኪኢላ ይለቐቕ።"
  },
  "milestone_3": { en: "3. Heavy Transport Dispatch", am: "፫. የከባድ ጫኝ ትራንስፖርት ስምሪት", or: "3. Geessiba Maashinarii Fe'i", ti: "፫. መጓዓዝቲ ከበድቲ ማሽነሪታት" },
  "milestone_3_desc": {
    en: "Heavy transport dispatch is booked. Lowbed dispatcher receives logistics deposit upon tracking ignition.",
    am: "የከባድ ጭነት መጓጓዣ ይያዛል። ሎቤድ አሽከርካሪው መነሻውን ሲያረጋግጥ የሎጂስቲክስ ክፍያ ይለቀቃል።",
    or: "Geessibni maashinarii ulfaataa ni qophaa'a. Konkolaachisaan erga jalqabee kaffaltiin isaa ni gadi lakkifama.",
    ti: "መጓዓዝቲ ከበድቲ ማሽነሪታት ይዳሎ። መጓዓዝቲ መነበሪኡ ምስ ኣረጋገጸ ናይ ሎጂስቲክስ ክፍሊት ይለቐቕ።"
  },
  "milestone_4": { en: "4. Final Site Verification", am: "፬. የመጨረሻ ስራ ቦታ ርክክብ", or: "4. Mirkaneessa Hojii dhumaa", ti: "፬. ናይ መወዳእታ ምርጋጽ ቦታ ስራሕ" },
  "milestone_4_desc": {
    en: "Buyer verifies on-site operations. Remaining balance is released to the machinery owner, and the EML commission is settled.",
    am: "ገዢው በስራ ቦታው ላይ ማሽኑን ተረክቦ ያረጋግጣል። ቀሪው ገንዘብ ለአቅራቢው ይለቀቃል፣ የEML ኮሚሽንም ይቆረጣል።",
    or: "Bitiin iddoo hojiitti maashinicha mirkaneessa. Kaffaltiin hafe abbaa maashiniif gadi lakkifama, komishiniin EML ni murama.",
    ti: "ዓዳጊ ኣብ ቦታ ስራሕ ነቲ ማሽን ተረኪቡ የረጋግጽ። ዝተረፈ ክፍሊት ንዋና ማሽን ይለቐቕ፣ ናይ EML ኮሚሽን ይቑረጽ።"
  },
  "financial_title": { en: "Financial Split Breakdown", am: "የክፍያ ክፍፍል ዝርዝር", or: "Ibsa Kafaltii Hiramaa", ti: "ዝርዝር ምክፍፋል ክፍሊት" },
  "include_insp": { en: "Include Certified Inspection", am: "የማሽነሪ ምርመራን አካትት", or: "Mirkaneessa Gamaggamaa dabaladhu", ti: "ምርመራ ማሽን ኣእትው" },
  "include_log": { en: "Include Logistics Transport", am: "የሎጂስቲክስ መጓጓዣን አካትት", or: "Geessiba Maashinarii dabaladhu", ti: "መጓዓዝቲ ማሽን ኣእትው" },
  "listed_price": { en: "Machinery Listed Price:", am: "የማሽኑ መደበኛ ዋጋ፡", or: "Gatii Maashinarii Galmeeffame:", ti: "ዋጋ ማሽን፡" },
  "platform_fee": { en: "EML Platform Fee (3%):", am: "የ EML ፕላትፎርም ክፍያ (3%)፡", or: "Kafaltii Platform EML (3%):", ti: "ክፍሊት መድረኽ EML (3%)፡" },
  "insp_alloc": { en: "Inspector Allocation (1.5%):", am: "የባለሙያ መገምገሚያ ክፍያ (1.5%)፡", or: "Kafaltii Qorataa (1.5%):", ti: "ክፍሊት መርማሪ (1.5%)፡" },
  "log_alloc": { en: "Logistics Allocation (2.5%):", am: "የከባድ ጫኝ መኪና ክፍያ (2.5%)፡", or: "Kafaltii Geessibaa (2.5%):", ti: "ክፍሊት መጓዓዝቲ (2.5%)፡" },
  "net_payout": { en: "Supplier Net Payout:", am: "ለአቅራቢው የተጣራ ክፍያ፡", or: "Kafaltii Qulqulluu Dhiyeessaa:", ti: "የተረጋገጸ ክፍሊት ኣቕራቢ፡" },
  "admin_controls": { en: "Escrow Actions", am: "የክፍያ ዋስትና ድርጊቶች", or: "Tarkaanfiilee Kafaltii Wabii", ti: "ተግባራት ክፍሊት ዋስትና" },
  "deposit_btn": { en: "Deposit Escrow Funds", am: "ገንዘቡን በዋስትና አስቀምጥ", or: "Kafaltii Wabii Kuusi", ti: "ክፍሊት ዋስትና ኣቐምጥ" },
  "release_insp_btn": { en: "Release Inspection Fee", am: "የምርመራ ክፍያ ልቀቅ", or: "Kafaltii Qorataa Gadi Lakkisi", ti: "ክፍሊት ምርመራ ልቐቕ" },
  "release_log_btn": { en: "Release Logistics Fee", am: "የሎጂስቲክስ ክፍያ ልቀቅ", or: "Kafaltii Geessibaa Gadi Lakkisi", ti: "ክፍሊት ሎጂስቲክስ ልቐቕ" },
  "release_final_btn": { en: "Final Sign-off: Release Balance", am: "የመጨረሻ ርክክብ፡ ቀሪውን ገንዘብ ልቀቅ", or: "Kafaltii Dhumaa Gadi Lakkisi", ti: "ናይ መወዳእታ ርክክብ፡ ዝተረፈ ክፍሊት ልቐቕ" },
  "settled_msg": { en: "Escrow Settled Successfully", am: "የዋስትና ግብይቱ በትክክል ተጠናቋል", or: "Kafaltiin Wabii Milkaa'inaan Xumurameera", ti: "ግብይት ክፍሊት ዋስትና ተሳሊጡ ኣሎ" },
  "start_new_btn": { en: "Start New Escrow", am: "አዲስ ዋስትና ጀምር", or: "Kafaltii Wabii Haaraa Jalqabi", ti: "ሓድሽ ዋስትና ጀምር" },
  "status_badge": { en: "Stage", am: "ደረጃ", or: "Sadarkaa", ti: "ብርኪ" },
  "select_listing_title": { en: "Select a Machinery Listing", am: "የማሽነሪ ዝርዝር ይምረጡ", or: "Tarreffama Maashinarii Filadhu", ti: "ዝርዝር ማሽን ምረጽ" },
  "choose_listing_placeholder": { en: "Choose a listing to begin escrow...", am: "ለመጀመር ዝርዝር ይምረጡ...", or: "Kafaltii jalqabuuf tarreffama filadhu...", ti: "ንምጅማር ዝርዝር ምረጽ..." },
  "no_listings_available": { en: "No verified listings available right now.", am: "በአሁኑ ጊዜ የተረጋገጡ ዝርዝሮች የለም።", or: "Yeroo ammaa tarreffama mirkanaa'e hin jiru.", ti: "ኣብዚ ሕጂ ዝተረጋገጸ ዝርዝር የለን።" },
  "list_your_machine": { en: "List Your Machine", am: "ማሽንዎን ይዘርዝሩ", or: "Maashinii Kee Galmeessi", ti: "ማሽንካ ዘርዝር" },
  "please_login_msg": { en: "Please sign in to start a secure escrow transaction.", am: "ደህንነቱ የተጠበቀ ግብይት ለመጀመር እባክዎ ይግቡ።", or: "Maaloo seenuun kafaltii wabii eegalchuun.", ti: "በጃኹም ውሑስ ግብይት ንምጅማር እቶ።" },
  "login_btn": { en: "Sign In", am: "ግባ", or: "Seeni", ti: "እተው" },
  "change_listing_btn": { en: "Change Listing", am: "ዝርዝር ይቀይሩ", or: "Tarreffama Jijjiiri", ti: "ዝርዝር ቀይር" },
  "direct_warning": {
    en: "Note: This escrow protection is optional. Direct payment bypasses EML financial protection and holds zero platform guarantees.",
    am: "ማሳሰቢያ፡ ይህ የዋስትና ክፍያ አማራጭ ነው። ቀጥታ ክፍያ የ EML የፋይናንስ ጥበቃን ያልፋል፤ እንዲሁም ምንም አይነት የፕላትፎርም ዋስትና የለውም።",
    or: "Hubachiisa: Kafaltiin wabii kun filannoo dha. Kafaltiin kallattii daldala keessan balaadhaaf saaxila, wabummaa platform hin qabu.",
    ti: "መተሓሳሰቢ፡ እዚ ናይ ዋስትና ክፍሊት ኣማራጺ እዩ። ቀጥታዊ ክፍሊት ውሕስነት የብሉን፣ ዋስትና መድረኽ እውን ኣይህብን።"
  }
};

type ListingOption = {
  id: string;
  brand: string;
  model: string;
  price_sale: number;
  price_rental_daily: number;
  is_rental_only: boolean;
  owner_id: string;
};

export default function EscrowPage() {
  const { t } = useTranslate();
  const { language } = useLanguage();

  const getLocalText = (key: string) => {
    return localEscrowTranslations[key]?.[language] || localEscrowTranslations[key]["en"];
  };

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [listingIdParam, setListingIdParam] = useState<string | null>(null);
  const [listings, setListings] = useState<ListingOption[]>([]);
  const [selectedListing, setSelectedListing] = useState<ListingOption | null>(null);
  const [loadingListings, setLoadingListings] = useState(true);

  const [escrowId, setEscrowId] = useState<string | null>(null);
  const [currentStage, setCurrentStage] = useState<EscrowStage>("awaiting_funding");
  const [includeInspection, setIncludeInspection] = useState(true);
  const [includeLogistics, setIncludeLogistics] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const formatter = new Intl.NumberFormat("en-US", { style: "decimal" });

  // Check auth
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setCurrentUser(user);
      setCheckingAuth(false);
    });
  }, []);

  // Parse ?listing= param and load listings
  useEffect(() => {
    async function init() {
      setLoadingListings(true);
      const params = new URLSearchParams(window.location.search);
      const paramId = params.get("listing");
      setListingIdParam(paramId);

      if (paramId) {
        const { data } = await supabase
          .from("listings")
          .select("id, brand, model, price_sale, price_rental_daily, is_rental_only, owner_id")
          .eq("id", paramId)
          .maybeSingle();
        if (data) setSelectedListing(data as ListingOption);
      } else {
        const { data } = await supabase
          .from("listings")
          .select("id, brand, model, price_sale, price_rental_daily, is_rental_only, owner_id")
          .eq("status", "verified_available")
          .order("created_at", { ascending: false })
          .limit(30);
        setListings((data || []) as ListingOption[]);
      }
      setLoadingListings(false);
    }
    init();
  }, []);

  const machineryPrice = selectedListing
    ? (selectedListing.is_rental_only ? selectedListing.price_rental_daily : selectedListing.price_sale) || 0
    : 0;

  const splits = calculateEscrowSplits(machineryPrice, includeInspection, includeLogistics);

  const handleSelectListing = (id: string) => {
    const found = listings.find(l => l.id === id) || null;
    setSelectedListing(found);
  };

  const handleDeposit = async () => {
    if (!currentUser || !selectedListing) return;
    setProcessing(true);
    setErrorMsg("");

    const { data, error } = await supabase
      .from("escrow")
      .insert([{
        buyer_id: currentUser.id,
        seller_id: selectedListing.owner_id,
        amount: splits.totalAmount,
        status: "funded",
        released: false,
      }])
      .select()
      .single();

    if (error || !data) {
      setErrorMsg("Failed to create escrow transaction. Please try again.");
    } else {
      setEscrowId(data.id);
      setCurrentStage("funded");
    }
    setProcessing(false);
  };

  const updateEscrowStage = async (stage: EscrowStage, released = false) => {
    if (!escrowId) return;
    setProcessing(true);
    await supabase.from("escrow").update({ status: stage, released }).eq("id", escrowId);
    setCurrentStage(stage);
    setProcessing(false);
  };

  const handleStartNew = () => {
    setEscrowId(null);
    setSelectedListing(null);
    setCurrentStage("awaiting_funding");
    setErrorMsg("");
  };

  return (
    <div className="bg-black min-h-screen text-white py-12 px-4 sm:px-6 lg:px-8" id="eml-escrow-portal">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Left Side: Milestones */}
        <div className="lg:col-span-2 space-y-6">
          <header className="space-y-2">
            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-amber-500/20">
              🛡️ {t("nav.escrow")}
            </span>
            <h1 className="text-3xl font-black text-white uppercase tracking-tight">
              {getLocalText("portal_title")}
            </h1>
            <p className="text-sm text-zinc-400 leading-relaxed">
              {getLocalText("portal_desc")}
            </p>
          </header>

          {/* Listing Selector */}
          {!selectedListing && !listingIdParam && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-4">
              <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-900 pb-3">
                {getLocalText("select_listing_title")}
              </h3>
              {loadingListings ? (
                <p className="text-zinc-500 text-sm">Loading listings...</p>
              ) : listings.length === 0 ? (
                <div className="text-center py-6 space-y-3">
                  <p className="text-zinc-400 text-sm">{getLocalText("no_listings_available")}</p>
                  <Link href="/post-machinery" className="inline-block px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all">
                    {getLocalText("list_your_machine")}
                  </Link>
                </div>
              ) : (
                <select
                  onChange={(e) => handleSelectListing(e.target.value)}
                  defaultValue=""
                  className="w-full px-4 py-3 rounded-lg border bg-black text-white border-zinc-800 focus:outline-none focus:border-amber-500 text-sm"
                >
                  <option value="" disabled>{getLocalText("choose_listing_placeholder")}</option>
                  {listings.map(l => (
                    <option key={l.id} value={l.id}>
                      {l.brand} {l.model} — ETB {formatter.format(l.is_rental_only ? l.price_rental_daily : l.price_sale)}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {selectedListing && (
            <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-900 pb-3">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {getLocalText("milestone_title")}
                </h3>
                {!listingIdParam && currentStage === "awaiting_funding" && (
                  <button
                    onClick={() => setSelectedListing(null)}
                    className="text-[10px] text-zinc-500 hover:text-amber-500 font-bold uppercase tracking-wider transition-all"
                  >
                    {getLocalText("change_listing_btn")}
                  </button>
                )}
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4">
                <p className="text-white font-black text-sm">{selectedListing.brand} {selectedListing.model}</p>
              </div>

              <div className="space-y-4">
                <div className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                  currentStage === "awaiting_funding"
                    ? "bg-amber-500/10 border-amber-500 text-white"
                    : "bg-zinc-900/40 border-zinc-900 text-zinc-500"
                }`}>
                  <div className="text-lg">💰</div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">{getLocalText("milestone_1")}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {getLocalText("milestone_1_desc")} ({formatter.format(splits.totalAmount)} ETB)
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                  includeInspection && currentStage === "funded"
                    ? "bg-amber-500/10 border-amber-500 text-white"
                    : currentStage === "inspection_released" || currentStage === "logistics_released" || currentStage === "completed_payout"
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-zinc-900/40 border-zinc-900 text-zinc-500"
                }`}>
                  <div className="text-lg">🔎</div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">{getLocalText("milestone_2")}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {getLocalText("milestone_2_desc")} ({formatter.format(splits.inspectionFee)} ETB)
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                  includeLogistics && currentStage === "inspection_released"
                    ? "bg-amber-500/10 border-amber-500 text-white"
                    : currentStage === "logistics_released" || currentStage === "completed_payout"
                    ? "bg-emerald-500/5 border-emerald-500/20 text-emerald-400"
                    : "bg-zinc-900/40 border-zinc-900 text-zinc-500"
                }`}>
                  <div className="text-lg">🚛</div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">{getLocalText("milestone_3")}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {getLocalText("milestone_3_desc")} ({formatter.format(splits.logisticsFee)} ETB)
                    </p>
                  </div>
                </div>

                <div className={`p-4 rounded-xl border flex items-start gap-4 transition-all ${
                  currentStage === "completed_payout"
                    ? "bg-emerald-500/10 border-emerald-500 text-white"
                    : "bg-zinc-900/40 border-zinc-900 text-zinc-500"
                }`}>
                  <div className="text-lg">🤝</div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold">{getLocalText("milestone_4")}</h4>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {getLocalText("milestone_4_desc")}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Financials & Controls */}
        <div className="space-y-6">
          <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 sm:p-8 space-y-6 h-full flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-900 pb-4">
                <h3 className="text-xs font-bold text-zinc-500 uppercase tracking-widest">
                  {getLocalText("financial_title")}
                </h3>
                <span className="text-[10px] bg-amber-500/10 text-amber-500 px-2.5 py-0.5 rounded-full font-black uppercase">
                  {getLocalText("status_badge")}: {currentStage.replace(/_/g, " ")}
                </span>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 text-xs font-bold text-zinc-300 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeInspection}
                    onChange={(e) => setIncludeInspection(e.target.checked)}
                    disabled={currentStage !== "awaiting_funding"}
                    className="rounded bg-black border-zinc-800 text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>{getLocalText("include_insp")}</span>
                </label>

                <label className="flex items-center gap-3 text-xs font-bold text-zinc-300 select-none cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includeLogistics}
                    onChange={(e) => setIncludeLogistics(e.target.checked)}
                    disabled={currentStage !== "awaiting_funding"}
                    className="rounded bg-black border-zinc-800 text-amber-500 focus:ring-amber-500 w-4 h-4"
                  />
                  <span>{getLocalText("include_log")}</span>
                </label>
              </div>

              <div className="space-y-3 pt-4 border-t border-zinc-900 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>{getLocalText("listed_price")}</span>
                  <span className="font-bold text-white">{formatter.format(machineryPrice)} ETB</span>
                </div>
                <div className="flex justify-between text-zinc-500">
                  <span>{getLocalText("platform_fee")}</span>
                  <span>-{formatter.format(splits.emlCommission)} ETB</span>
                </div>
                {includeInspection && (
                  <div className="flex justify-between text-zinc-500">
                    <span>{getLocalText("insp_alloc")}</span>
                    <span>-{formatter.format(splits.inspectionFee)} ETB</span>
                  </div>
                )}
                {includeLogistics && (
                  <div className="flex justify-between text-zinc-500">
                    <span>{getLocalText("log_alloc")}</span>
                    <span>-{formatter.format(splits.logisticsFee)} ETB</span>
                  </div>
                )}

                <div className="flex justify-between pt-3 border-t border-zinc-900 text-sm font-black text-white">
                  <span>{getLocalText("net_payout")}</span>
                  <span className="text-amber-500">{formatter.format(splits.supplierPayout)} ETB</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-zinc-900 space-y-3">
              <span className="block text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                {getLocalText("admin_controls")}
              </span>

              {errorMsg && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-xs">
                  {errorMsg}
                </div>
              )}

              {!checkingAuth && !currentUser && (
                <div className="p-4 bg-zinc-900/60 border border-zinc-800 rounded-lg text-center space-y-3">
                  <p className="text-zinc-400 text-xs">{getLocalText("please_login_msg")}</p>
                  <Link href="/login" className="inline-block px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-black uppercase tracking-wider transition-all">
                    {getLocalText("login_btn")}
                  </Link>
                </div>
              )}

              {currentUser && selectedListing && currentStage === "awaiting_funding" && (
                <button
                  onClick={handleDeposit}
                  disabled={processing}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {processing ? "..." : getLocalText("deposit_btn")}
                </button>
              )}

              {currentStage === "funded" && (
                <button
                  onClick={() => updateEscrowStage(includeInspection ? "inspection_released" : "logistics_released")}
                  disabled={processing}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {processing ? "..." : getLocalText("release_insp_btn")}
                </button>
              )}

              {currentStage === "inspection_released" && (
                <button
                  onClick={() => updateEscrowStage("logistics_released")}
                  disabled={processing}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {processing ? "..." : getLocalText("release_log_btn")}
                </button>
              )}

              {currentStage === "logistics_released" && (
                <button
                  onClick={() => updateEscrowStage("completed_payout", true)}
                  disabled={processing}
                  className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                >
                  {processing ? "..." : getLocalText("release_final_btn")}
                </button>
              )}

              {currentStage === "completed_payout" && (
                <>
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-center text-xs font-bold uppercase tracking-wider">
                    🎉 {getLocalText("settled_msg")}
                  </div>
                  {!listingIdParam && (
                    <button
                      onClick={handleStartNew}
                      className="w-full py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all"
                    >
                      {getLocalText("start_new_btn")}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          <p className="text-[10px] text-zinc-600 leading-relaxed">
            {getLocalText("direct_warning")}
          </p>
        </div>

      </div>
    </div>
  );
}