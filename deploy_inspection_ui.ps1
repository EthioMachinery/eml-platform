# ============================================================================
# TM Request Inspection UI (Priority #2 of 4)
# Run from C:\tm-next in PowerShell with:
#   powershell -ExecutionPolicy Bypass -File deploy_inspection_ui.ps1
# Writes 2 files as UTF-8 without BOM. Safe to re-run.
#
# WHAT THIS ADDS: a real "Request Verified Inspection" button + payment
# modal on every /browse listing card (for buyers, any tier), and a "Get
# Verified" button + modal on each of your own listings in /dashboard
# (Basic tier, seller-paid). Before this, only admins could see the
# inspection system existed at /admin/inspections — now real users can
# actually request one.
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

import React, { useState, useEffect, useTransition } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabaseClient";
import { fetchLocalizedListings } from "@/lib/db/machinery/search";
import type { LocalizedListing } from "@/types";
import TranslatedInput from "@/components/ui/TranslatedInput";
import TranslatedSelect from "@/components/ui/TranslatedSelect";
import {
  requestOpportunityUnlock,
  getBuyerUnlocksForListing,
  type OpportunityUnlock,
  type OpportunityStatus,
} from "@/lib/opportunityEngine";
import {
  requestInspection,
  getRequesterInspectionsForListing,
  DEFAULT_TIER_FEES,
  type Inspection,
  type InspectionStatus,
  type InspectionTier,
} from "@/lib/inspectionEngine";

const localizedLocations: Record<string, Record<string, string>> = {
  "addis_ababa": { en: "Addis Ababa", am: "አዲስ አበባ", om: "Finfinnee", ti: "ኣዲስ ኣበባ" },
  "hawassa": { en: "Hawassa", am: "ሀዋሳ", om: "Hawaas", ti: "ሃዋሳ" },
  "adama": { en: "Adama", am: "አዳማ", om: "Adaamaa", ti: "ኣማራ" },
  "mekelle": { en: "Mekelle", am: "መቀሌ", om: "Maqalee", ti: "መቐለ" },
  "bahir_dar": { en: "Bahir Dar", am: "ባህር ዳር", om: "Baahir Daar", ti: "ባህር ዳር" },
  "dire_dawa": { en: "Dire Dawa", am: "ድሬዳዋ", om: "Dirree Dhawaa", ti: "ድሬዳዋ" }
};

// Local modal view states, derived from the buyer's most recent
// opportunity_unlocks row for the selected listing (see opportunityEngine.ts
// for the authoritative status machine).
type ModalView =
  | "loading"
  | "needs_login"
  | "form"
  | "submitting"
  | "submitted"
  | "pending_review"
  | "awaiting_facilitation"
  | "rejected"
  | "released";

// Simplified for the buyer-facing inspection request modal — collapses the
// admin-side 6-status lifecycle (see inspectionEngine.ts) into what a
// requester actually needs to see.
type InspectionModalView =
  | "loading"
  | "needs_login"
  | "form"
  | "submitting"
  | "submitted"
  | "pending_review"
  | "rejected"
  | "in_progress"
  | "done";

export default function TMUniversalMarketplace() {
  const { t, currentLanguage } = useTranslate();
  const { user } = useAuth();
  const [isPending, startTransition] = useTransition();

  const [listings, setListings] = useState<LocalizedListing[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filter state variables
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [otherCategorySpecification, setOtherCategorySpecification] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [otherLocationSpecification, setOtherLocationSpecification] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [rentFilter, setRentFilter] = useState<"all" | "rent" | "sale">("all");

  // Opportunity unlock modal state
  const [showUnlockModal, setShowUnlockModal] = useState(false);
  const [selectedListingForUnlock, setSelectedListingForUnlock] = useState<LocalizedListing | null>(null);
  const [modalView, setModalView] = useState<ModalView>("form");
  const [existingUnlock, setExistingUnlock] = useState<OpportunityUnlock | null>(null);
  const [releasedContact, setReleasedContact] = useState<{ name: string | null; phone: string | null } | null>(null);

  // Payment submission form fields
  const [paymentMethod, setPaymentMethod] = useState("telebirr");
  const [paymentReference, setPaymentReference] = useState("");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Verified Inspection request modal state
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [selectedListingForInspection, setSelectedListingForInspection] = useState<LocalizedListing | null>(null);
  const [inspectionModalView, setInspectionModalView] = useState<InspectionModalView>("form");
  const [existingInspection, setExistingInspection] = useState<Inspection | null>(null);
  const [inspectionTier, setInspectionTier] = useState<InspectionTier>("standard");
  const [inspectionPaymentMethod, setInspectionPaymentMethod] = useState("telebirr");
  const [inspectionPaymentReference, setInspectionPaymentReference] = useState("");
  const [inspectionReceiptFile, setInspectionReceiptFile] = useState<File | null>(null);
  const [inspectionSubmitError, setInspectionSubmitError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);

      const targetCategory = selectedCategory === "other" ? otherCategorySpecification : selectedCategory;
      const targetLocation = selectedLocation === "other" ? otherLocationSpecification : selectedLocation;

      const data = await fetchLocalizedListings(currentLanguage, {
        category: targetCategory || undefined,
        location: targetLocation || undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        intent: rentFilter
      });
      setListings(data);
      setIsLoading(false);
    }

    startTransition(() => {
      loadData();
    });
  }, [currentLanguage, selectedCategory, otherCategorySpecification, selectedLocation, otherLocationSpecification, maxPrice, rentFilter]);

  const displayedListings = listings.filter((item) => {
    return `${item.brand} ${item.model}`.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Compute stats
  const totalListings = displayedListings.length;
  const verifiedCount = displayedListings.filter(l => l.verified).length;
  const avgPrice = totalListings > 0
    ? Math.floor(displayedListings.reduce((sum, l) => sum + (l.isRentalOnly ? (l.priceRentalDaily || 0) : (l.priceSale || 0)), 0) / totalListings)
    : 0;

  function statusToView(status: OpportunityStatus): ModalView {
    if (status === "pending_review") return "pending_review";
    if (status === "payment_approved" || status === "facilitating") return "awaiting_facilitation";
    if (status === "payment_rejected") return "rejected";
    if (status === "contact_released") return "released";
    return "form";
  }

  // Handle opening the unlock modal — check for an existing request first
  const handleUnlockContact = async (listing: LocalizedListing) => {
    setSelectedListingForUnlock(listing);
    setSubmitError(null);
    setPaymentReference("");
    setReceiptFile(null);
    setExistingUnlock(null);
    setReleasedContact(null);
    setShowUnlockModal(true);

    if (!user) {
      setModalView("needs_login");
      return;
    }

    setModalView("loading");

    const unlocks = await getBuyerUnlocksForListing(user.id, listing.id);
    const latest = unlocks[0] || null;
    setExistingUnlock(latest);

    if (!latest) {
      setModalView("form");
      return;
    }

    const view = statusToView(latest.status);
    setModalView(view);

    if (view === "released" && listing.ownerId) {
      const { data: seller } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", listing.ownerId)
        .maybeSingle();
      setReleasedContact({ name: seller?.full_name ?? null, phone: seller?.phone ?? null });
    }
  };

  async function handleSubmitPayment() {
    if (!user || !selectedListingForUnlock) return;

    if (!paymentReference.trim()) {
      setSubmitError("Please enter your payment reference / transaction ID.");
      return;
    }

    setSubmitError(null);
    setModalView("submitting");

    let receiptPath: string | null = null;
    if (receiptFile) {
      const path = `${user.id}/${Date.now()}-${receiptFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(path, receiptFile);
      if (!uploadError) {
        receiptPath = path;
      }
    }

    const { error } = await requestOpportunityUnlock({
      listingId: selectedListingForUnlock.id,
      buyerId: user.id,
      sellerId: selectedListingForUnlock.ownerId,
      paymentMethod,
      paymentReference: paymentReference.trim(),
      paymentReceiptPath: receiptPath,
    });

    if (error) {
      setSubmitError(error);
      setModalView("form");
      return;
    }

    setModalView("submitted");
  }

  function inspectionStatusToView(status: InspectionStatus): InspectionModalView {
    if (status === "pending_review") return "pending_review";
    if (status === "payment_rejected") return "rejected";
    if (status === "payment_approved" || status === "scheduled" || status === "completed") return "in_progress";
    if (status === "published") return "done";
    return "form";
  }

  const handleRequestInspection = async (listing: LocalizedListing) => {
    setSelectedListingForInspection(listing);
    setInspectionSubmitError(null);
    setInspectionPaymentReference("");
    setInspectionReceiptFile(null);
    setExistingInspection(null);
    setShowInspectionModal(true);

    if (!user) {
      setInspectionModalView("needs_login");
      return;
    }

    setInspectionModalView("loading");

    const inspections = await getRequesterInspectionsForListing(user.id, listing.id);
    const latest = inspections[0] || null;
    setExistingInspection(latest);

    if (!latest) {
      setInspectionModalView("form");
      return;
    }

    setInspectionModalView(inspectionStatusToView(latest.status));
  };

  async function handleSubmitInspectionRequest() {
    if (!user || !selectedListingForInspection) return;

    if (!inspectionPaymentReference.trim()) {
      setInspectionSubmitError("Please enter your payment reference / transaction ID.");
      return;
    }

    setInspectionSubmitError(null);
    setInspectionModalView("submitting");

    let receiptPath: string | null = null;
    if (inspectionReceiptFile) {
      const path = `${user.id}/${Date.now()}-${inspectionReceiptFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from("payment-receipts")
        .upload(path, inspectionReceiptFile);
      if (!uploadError) {
        receiptPath = path;
      }
    }

    const { error } = await requestInspection({
      listingId: selectedListingForInspection.id,
      requestedBy: user.id,
      tier: inspectionTier,
      paymentMethod: inspectionPaymentMethod,
      paymentReference: inspectionPaymentReference.trim(),
      paymentReceiptPath: receiptPath,
    });

    if (error) {
      setInspectionSubmitError(error);
      setInspectionModalView("form");
      return;
    }

    setInspectionModalView("submitted");
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-8" id="eml-marketplace-app">

      {/* BANNER SECTION (add carousel later) */}
      <div className="mb-6 bg-gradient-to-r from-amber-600 to-amber-800 rounded-xl p-4 text-white shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">🔥 Special Offer</h2>
            <p className="text-sm">List your machinery for free until end of month!</p>
          </div>
          <a href="/post-machinery" className="bg-white text-amber-800 px-4 py-2 rounded-lg font-bold text-sm hover:bg-amber-50 transition-colors">Learn More</a>
        </div>
      </div>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-zinc-900">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="text-amber-500">TM</span> {t("nav.browse")}
          </h1>
          <p className="text-sm text-zinc-400 mt-1">
            {isLoading ? "..." : `${displayedListings.length} ${t("status.available")}`}
          </p>
        </div>
      </header>

      {/* TRUST INDICATORS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 mb-8 bg-zinc-950 border border-zinc-900 rounded-xl p-4">
        <div className="flex items-center gap-3">
          <span className="text-green-500 text-xl">✓</span>
          <div>
            <p className="text-xs text-zinc-400">Verified Sellers</p>
            <p className="text-sm font-bold text-white">100% ID Check</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-blue-500 text-xl">🛡️</span>
          <div>
            <p className="text-xs text-zinc-400">Secure Escrow</p>
            <p className="text-sm font-bold text-white">Payment Protected</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-amber-500 text-xl">📞</span>
          <div>
            <p className="text-xs text-zinc-400">24/7 Support</p>
            <p className="text-sm font-bold text-white">Dedicated Team</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-purple-500 text-xl">📊</span>
          <div>
            <p className="text-xs text-zinc-400">Market Insights</p>
            <p className="text-sm font-bold text-white">Real-time Pricing</p>
          </div>
        </div>
      </div>

      {/* MARKETPLACE STATS */}
      <div className="grid grid-cols-3 gap-4 mb-8 bg-zinc-900/30 rounded-xl p-4 border border-zinc-800">
        <div className="text-center">
          <p className="text-2xl font-black text-white">{totalListings}</p>
          <p className="text-xs text-zinc-400">Total Listings</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-green-400">{verifiedCount}</p>
          <p className="text-xs text-zinc-400">Verified Sellers</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-black text-amber-400">{avgPrice.toLocaleString()}</p>
          <p className="text-xs text-zinc-400">Avg. Price (ETB)</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-8">
        <aside className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 space-y-5 h-fit">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-200 border-b border-zinc-900 pb-3">
            {t("actions.search")}
          </h3>

          {/* Search Term input */}
          <div>
            <TranslatedInput
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholderKey="placeholders.searchPlaceholder"
              labelKey="actions.search"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <TranslatedSelect
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              placeholderKey="placeholders.selectCategory"
              labelKey="placeholders.selectCategory"
              enableOther={true}
              otherValue={otherCategorySpecification}
              onOtherChange={setOtherCategorySpecification}
              otherPlaceholderKey="placeholders.searchPlaceholder"
              options={[
                { value: "excavator", labelKey: "categories.excavator" },
                { value: "loader", labelKey: "categories.loader" },
                { value: "dozer", labelKey: "categories.dozer" },
                { value: "crane", labelKey: "categories.crane" },
                { value: "grader", labelKey: "categories.grader" },
                { value: "roller", labelKey: "categories.roller" },
                { value: "dumpTruck", labelKey: "categories.dumpTruck" },
                { value: "generator", labelKey: "categories.generator" },
                { value: "backhoe", labelKey: "categories.backhoe" }
              ]}
            />
          </div>

          {/* Location Dropdown */}
          <div>
            <TranslatedSelect
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              placeholderKey="placeholders.selectLocation"
              labelKey="labels.location"
              enableOther={true}
              otherValue={otherLocationSpecification}
              onOtherChange={setOtherLocationSpecification}
              otherPlaceholderKey="placeholders.selectLocation"
              options={Object.keys(localizedLocations).map((key) => ({
                value: key,
                label: localizedLocations[key][currentLanguage] || localizedLocations[key]["en"]
              }))}
            />
          </div>

          <div className="space-y-2">
            <span className="block text-xs font-bold text-zinc-400 uppercase tracking-wider">
              {t("actions.sell")}
            </span>
            <div className="grid grid-cols-3 gap-1 bg-zinc-900 p-1 rounded-lg border border-zinc-800">
              {(["all", "rent", "sale"] as const).map((type) => {
                let labelKey: any = "actions.filterAll";
                if (type === "rent") labelKey = "actions.filterRent";
                if (type === "sale") labelKey = "actions.filterBuy";

                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setRentFilter(type)}
                    className={`py-1.5 rounded text-[10px] font-bold uppercase transition-all ${
                      rentFilter === type
                        ? "bg-amber-500 text-white shadow-sm"
                        : "text-zinc-400 hover:text-white"
                    }`}
                  >
                    {t(labelKey)}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <TranslatedInput
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholderKey="placeholders.priceMax"
              labelKey="placeholders.priceMax"
            />
          </div>
        </aside>

        <main className="lg:col-span-3">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
            </div>
          ) : displayedListings.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-zinc-900 rounded-xl bg-zinc-950/20">
              <p className="text-zinc-400 text-sm font-semibold">
                No active machinery found matches your selected filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayedListings.map((item) => {
                const translatedCategory = t(`categories.${item.categoryToken}` as any);
                const localizedCity = item.locationToken ? (localizedLocations[item.locationToken]?.[currentLanguage] || localizedLocations[item.locationToken]?.["en"]) : "N/A";
                const currencyFormatter = new Intl.NumberFormat("en-US", { style: "decimal" });
                const displayPrice = item.isRentalOnly ? item.priceRentalDaily : item.priceSale;

                return (
                  <article
                    key={item.id}
                    className="flex flex-col bg-zinc-950 border border-zinc-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-zinc-800 transition-all duration-200"
                  >
                    {/* Visual Imagery Mock Container - Dynamically loads user image if present */}
                    <div className="relative h-48 bg-zinc-900 flex items-center justify-center border-b border-zinc-900 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.brand}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            // Fallback to text template if image load fails
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="text-center">
                          <span className="block text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            {translatedCategory}
                          </span>
                          <span className="block text-lg font-black text-zinc-300">
                            {item.brand}
                          </span>
                        </div>
                      )}

                      {/* Trust Verification Badge */}
                      {item.verified && (
                        <span className="absolute top-3 left-3 bg-green-500 text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm tracking-widest z-10">
                          {t("status.verified")}
                        </span>
                      )}

                      {/* Transaction Intent Badge */}
                      <span className="absolute top-3 right-3 bg-black text-white text-[9px] font-black uppercase px-2 py-1 rounded shadow-sm tracking-wider border border-zinc-800 z-10">
                        {item.isRentalOnly ? t("actions.rent") : t("actions.buy")}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-base font-bold text-white">
                            {item.title}
                          </h4>
                          <span className="text-xs font-black text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                            {item.modelYear}
                          </span>
                        </div>

                        {/* Localized Metadata Fields */}
                        <div className="grid grid-cols-2 gap-2 mt-4 text-[11px] text-zinc-400 border-t border-b border-zinc-900 py-3 my-3">
                          <div>
                            <span className="block font-bold text-zinc-500 uppercase text-[9px]">
                              {t("labels.location")}
                            </span>
                            <span className="font-semibold text-zinc-200">
                              {localizedCity}
                            </span>
                          </div>
                          <div>
                            <span className="block font-bold text-zinc-500 uppercase text-[9px]">
                              {t("labels.workingHours")}
                            </span>
                            <span className="font-semibold text-zinc-200">
                              {item.engineHours || "N/A"} Hrs
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Pricing and Contact Unlock Button */}
                      <div className="mt-2">
                        <div className="mb-3">
                          <span className="text-xs text-zinc-500 block uppercase font-bold">
                            {item.isRentalOnly ? t("labels.dailyRate") : t("labels.salePrice")}
                          </span>
                          <span className="text-xl font-black text-white tracking-tight">
                            {displayPrice ? currencyFormatter.format(displayPrice) : "0"} <span className="text-sm font-bold text-zinc-400">ETB</span>
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleUnlockContact(item)}
                          className="w-full py-2.5 rounded-lg text-xs font-bold uppercase transition-all shadow-sm flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white"
                        >
                          🔓 Unlock Opportunity (ETB 500)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRequestInspection(item)}
                          className="w-full mt-2 py-2.5 rounded-lg text-xs font-bold uppercase transition-all border border-blue-500/40 text-blue-400 hover:bg-blue-500/10 flex items-center justify-center gap-1.5"
                        >
                          🔍 Request Verified Inspection
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* OPPORTUNITY UNLOCK MODAL */}
      {showUnlockModal && selectedListingForUnlock && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl">

            {modalView === "loading" && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-amber-500" />
              </div>
            )}

            {modalView === "needs_login" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Sign in to unlock this opportunity</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Create a free TM account or log in to submit your ETB 500 payment for &quot;{selectedListingForUnlock.title}&quot;.
                </p>
                <a
                  href="/login"
                  className="block w-full text-center bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition"
                >
                  Log In / Sign Up
                </a>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full mt-4 text-zinc-400 text-sm hover:text-white transition"
                >
                  Cancel
                </button>
              </>
            )}

            {(modalView === "form" || modalView === "submitting" || modalView === "rejected") && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Unlock This Opportunity</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Pay <strong className="text-amber-400">ETB 500</strong> to unlock &quot;{selectedListingForUnlock.title}&quot;.
                  This confirms your serious interest — TM will then personally facilitate the introduction
                  and release the seller&apos;s direct contact once verification and communication are complete.
                  It is not an instant contact reveal.
                </p>

                {modalView === "rejected" && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-xs text-red-300">
                    Your previous payment submission was rejected{existingUnlock?.admin_notes ? `: ${existingUnlock.admin_notes}` : "."} Please submit valid payment details below.
                  </div>
                )}

                {submitError && (
                  <p className="text-red-400 text-xs mb-3">{submitError}</p>
                )}

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Payment Method</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="telebirr">Telebirr</option>
                      <option value="cbe">CBE Birr</option>
                      <option value="chapa">Chapa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                      Payment Reference / Transaction ID
                    </label>
                    <input
                      type="text"
                      value={paymentReference}
                      onChange={(e) => setPaymentReference(e.target.value)}
                      placeholder="e.g. TB123456789"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                      Receipt Screenshot (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-zinc-400"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitPayment}
                  disabled={modalView === "submitting"}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {modalView === "submitting" ? "Submitting..." : "Submit Payment for Review"}
                </button>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full mt-3 text-zinc-400 text-sm hover:text-white transition"
                >
                  Cancel
                </button>
              </>
            )}

            {modalView === "submitted" && (
              <>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Payment Submitted</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Thank you. Your ETB 500 payment for &quot;{selectedListingForUnlock.title}&quot; is now under review by
                  the TM team. Once confirmed, TM will personally facilitate an introduction between you and the
                  seller and release direct contact details.
                </p>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}

            {modalView === "pending_review" && (
              <>
                <h3 className="text-xl font-bold text-amber-400 mb-2">Payment Under Review</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Your ETB 500 payment for &quot;{selectedListingForUnlock.title}&quot; is being reviewed by the TM
                  team. You&apos;ll be notified once it&apos;s confirmed and TM begins facilitating the introduction.
                </p>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}

            {modalView === "awaiting_facilitation" && (
              <>
                <h3 className="text-xl font-bold text-blue-400 mb-2">TM Is Facilitating Your Introduction</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Your payment for &quot;{selectedListingForUnlock.title}&quot; is confirmed. The TM team is now
                  personally verifying and facilitating the introduction with the seller. Direct contact details
                  will be released here once that process is complete.
                </p>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}

            {modalView === "released" && (
              <>
                <h3 className="text-xl font-bold text-green-400 mb-2">✓ Contact Released</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  TM has completed facilitation for &quot;{selectedListingForUnlock.title}&quot;. Seller contact
                  information:
                </p>
                <div className="bg-zinc-900 p-4 rounded-lg mb-4">
                  <p className="text-white font-semibold text-sm">{releasedContact?.name || "TM Verified Seller"}</p>
                  <p className="text-zinc-300 font-mono text-sm mt-1">{releasedContact?.phone || "Contact via TM"}</p>
                </div>
                <button
                  onClick={() => setShowUnlockModal(false)}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* VERIFIED INSPECTION REQUEST MODAL */}
      {showInspectionModal && selectedListingForInspection && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl">

            {inspectionModalView === "loading" && (
              <div className="flex justify-center items-center py-10">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500" />
              </div>
            )}

            {inspectionModalView === "needs_login" && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Sign in to request an inspection</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Create a free TM account or log in to request a Verified Inspection for &quot;{selectedListingForInspection.title}&quot;.
                </p>
                <a
                  href="/login"
                  className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition"
                >
                  Log In / Sign Up
                </a>
                <button
                  onClick={() => setShowInspectionModal(false)}
                  className="w-full mt-4 text-zinc-400 text-sm hover:text-white transition"
                >
                  Cancel
                </button>
              </>
            )}

            {(inspectionModalView === "form" || inspectionModalView === "submitting" || inspectionModalView === "rejected") && (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Request a Verified Inspection</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  A TM inspector checks &quot;{selectedListingForInspection.title}&quot; in person and publishes a report — engine
                  hours, condition, and (for Standard/Premium) an operational test. This is separate from the Unlock Opportunity
                  fee and gives you evidence you keep regardless of where the deal closes.
                </p>

                {inspectionModalView === "rejected" && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-4 text-xs text-red-300">
                    Your previous payment submission was rejected{existingInspection?.admin_notes ? `: ${existingInspection.admin_notes}` : "."} Please submit valid payment details below.
                  </div>
                )}

                {inspectionSubmitError && (
                  <p className="text-red-400 text-xs mb-3">{inspectionSubmitError}</p>
                )}

                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Inspection Tier</label>
                    <select
                      value={inspectionTier}
                      onChange={(e) => setInspectionTier(e.target.value as InspectionTier)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="basic">Basic Verification — {DEFAULT_TIER_FEES.basic} ETB (documents only)</option>
                      <option value="standard">Standard Inspection — {DEFAULT_TIER_FEES.standard} ETB (physical visit)</option>
                      <option value="premium">Premium Inspection — {DEFAULT_TIER_FEES.premium} ETB (+ mechanical check)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Payment Method</label>
                    <select
                      value={inspectionPaymentMethod}
                      onChange={(e) => setInspectionPaymentMethod(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="telebirr">Telebirr</option>
                      <option value="cbe">CBE Birr</option>
                      <option value="chapa">Chapa</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                      Payment Reference / Transaction ID
                    </label>
                    <input
                      type="text"
                      value={inspectionPaymentReference}
                      onChange={(e) => setInspectionPaymentReference(e.target.value)}
                      placeholder="e.g. TB123456789"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                      Receipt Screenshot (optional)
                    </label>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={(e) => setInspectionReceiptFile(e.target.files?.[0] || null)}
                      className="w-full text-xs text-zinc-400"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSubmitInspectionRequest}
                  disabled={inspectionModalView === "submitting"}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {inspectionModalView === "submitting" ? "Submitting..." : "Submit Payment for Review"}
                </button>
                <button
                  onClick={() => setShowInspectionModal(false)}
                  className="w-full mt-3 text-zinc-400 text-sm hover:text-white transition"
                >
                  Cancel
                </button>
              </>
            )}

            {inspectionModalView === "submitted" && (
              <>
                <h3 className="text-xl font-bold text-blue-400 mb-2">Payment Submitted</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Thank you. Your inspection payment for &quot;{selectedListingForInspection.title}&quot; is now under review.
                  Once confirmed, TM will schedule an inspector and publish the report here.
                </p>
                <button
                  onClick={() => setShowInspectionModal(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}

            {inspectionModalView === "pending_review" && (
              <>
                <h3 className="text-xl font-bold text-blue-400 mb-2">Payment Under Review</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Your inspection payment for &quot;{selectedListingForInspection.title}&quot; is being reviewed by the TM team.
                </p>
                <button
                  onClick={() => setShowInspectionModal(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}

            {inspectionModalView === "in_progress" && (
              <>
                <h3 className="text-xl font-bold text-blue-400 mb-2">Inspection In Progress</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Payment confirmed for &quot;{selectedListingForInspection.title}&quot;. TM is scheduling or has completed the
                  physical inspection — the report will appear on the listing once published.
                </p>
                <button
                  onClick={() => setShowInspectionModal(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}

            {inspectionModalView === "done" && (
              <>
                <h3 className="text-xl font-bold text-green-400 mb-2">✓ Report Published</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  The inspection report for &quot;{selectedListingForInspection.title}&quot; is live.
                </p>
                {existingInspection?.report_url && (
                  <a
                    href={existingInspection.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-center bg-zinc-900 border border-zinc-800 text-blue-400 font-bold py-2 rounded-lg mb-3 hover:bg-zinc-800 transition"
                  >
                    View Report
                  </a>
                )}
                <button
                  onClick={() => setShowInspectionModal(false)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

'@
Write-TmFile "src/components/system/TMUniversalMarketplace.tsx" $f1

$f2 = @'
"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslate } from "@/hooks/useTranslate";
import { supabase } from "@/lib/supabaseClient";
import { requestInspection, DEFAULT_TIER_FEES } from "@/lib/inspectionEngine";

type UserProfile = {
  full_name: string;
  email: string;
  phone: string;
  role: string;
  is_premium: boolean;
  is_admin: boolean;
  created_at: string;
};

type Listing = {
  id: string;
  brand: string;
  model: string;
  status: string;
  price_sale: number;
  price_rental_daily: number;
  is_rental_only: boolean;
  created_at: string;
};

type Request = {
  id: string;
  title: string;
  category: string;
  status: string;
  budget: number;
  created_at: string;
};

export default function DashboardPage() {
  const { t } = useTranslate();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"listings" | "requests" | "profile">("listings");

  // Seller-side "Request Verification" modal (Basic tier — document check,
  // seller-paid, gets the real "Verified" badge onto the listing)
  const [verifyModalListing, setVerifyModalListing] = useState<Listing | null>(null);
  const [verifyPaymentMethod, setVerifyPaymentMethod] = useState("telebirr");
  const [verifyPaymentReference, setVerifyPaymentReference] = useState("");
  const [verifySubmitting, setVerifySubmitting] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [verifySuccess, setVerifySuccess] = useState(false);

  useEffect(() => {
    async function loadDashboard() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUser(user);

      const { data: profileData } = await supabase
        .from("users")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();
      setProfile(profileData);

      const { data: listingsData } = await supabase
        .from("listings")
        .select("id, brand, model, status, price_sale, price_rental_daily, is_rental_only, created_at")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: false });
      setListings(listingsData || []);

      const { data: requestsData } = await supabase
        .from("requests")
        .select("id, title, category, status, budget, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });
      setRequests(requestsData || []);

      setLoading(false);
    }
    loadDashboard();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  function openVerifyModal(listing: Listing) {
    setVerifyModalListing(listing);
    setVerifyPaymentReference("");
    setVerifyError(null);
    setVerifySuccess(false);
  }

  async function handleSubmitVerification() {
    if (!user || !verifyModalListing) return;

    if (!verifyPaymentReference.trim()) {
      setVerifyError("Please enter your payment reference / transaction ID.");
      return;
    }

    setVerifySubmitting(true);
    setVerifyError(null);

    const { error } = await requestInspection({
      listingId: verifyModalListing.id,
      requestedBy: user.id,
      tier: "basic",
      paymentMethod: verifyPaymentMethod,
      paymentReference: verifyPaymentReference.trim(),
    });

    if (error) {
      setVerifyError(error);
      setVerifySubmitting(false);
      return;
    }

    setVerifySuccess(true);
    setVerifySubmitting(false);
  }

  function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, string> = {
      verified_available: "bg-green-500/20 text-green-400 border-green-500/30",
      pending_review: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
      rejected: "bg-red-500/20 text-red-400 border-red-500/30",
      suspended: "bg-orange-500/20 text-orange-400 border-orange-500/30",
      active: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      approved: "bg-green-500/20 text-green-400 border-green-500/30",
      closed: "bg-zinc-700/40 text-zinc-400 border-zinc-600/30",
    };
    return (
      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${colors[status] || "bg-zinc-800 text-zinc-400 border-zinc-700"}`}>
        {status?.replace(/_/g, " ")}
      </span>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen text-white">

      {/* Header */}
      <div className="border-b border-zinc-900 px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tight">
              {t("dashboard.title")}
            </h1>
            <p className="text-zinc-500 text-sm mt-1">{user?.email}</p>
          </div>
          <div className="flex items-center gap-3">
            {profile?.is_admin && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-lg uppercase tracking-wider transition-all"
              >
                ⚡ Admin Panel
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-lg uppercase tracking-wider transition-all"
            >
              {t("dashboard.logout")}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase font-bold">My Listings</p>
            <p className="text-3xl font-black text-amber-400 mt-1">{listings.length}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase font-bold">Active</p>
            <p className="text-3xl font-black text-green-400 mt-1">{listings.filter(l => l.status === "verified_available").length}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase font-bold">Pending</p>
            <p className="text-3xl font-black text-yellow-400 mt-1">{listings.filter(l => l.status === "pending_review").length}</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-4">
            <p className="text-zinc-500 text-xs uppercase font-bold">My Requests</p>
            <p className="text-3xl font-black text-blue-400 mt-1">{requests.length}</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Link href="/post-machinery" className="flex items-center gap-2 px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
            ➕ List Machinery
          </Link>
          <Link href="/post-request" className="flex items-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-wider border border-zinc-800 transition-all">
            📋 Post Request
          </Link>
          <Link href="/browse" className="flex items-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-wider border border-zinc-800 transition-all">
            🔍 Browse
          </Link>
          <Link href="/escrow" className="flex items-center gap-2 px-4 py-3 bg-zinc-900 hover:bg-zinc-800 text-white rounded-xl text-xs font-black uppercase tracking-wider border border-zinc-800 transition-all">
            🔒 Escrow
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 w-fit">
          {(["listings", "requests", "profile"] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab ? "bg-amber-500 text-white" : "text-zinc-400 hover:text-white"
              }`}
            >
              {tab === "listings" ? "My Listings" : tab === "requests" ? "My Requests" : "Profile"}
            </button>
          ))}
        </div>

        {/* My Listings */}
        {activeTab === "listings" && (
          <div className="space-y-3">
            {listings.length === 0 ? (
              <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-xl p-12 text-center">
                <p className="text-zinc-500 text-sm mb-4">You have no listings yet.</p>
                <Link href="/post-machinery" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                  List Your First Machine
                </Link>
              </div>
            ) : listings.map(l => (
              <div key={l.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5 flex items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-black text-white">{l.brand} {l.model}</h4>
                    <StatusBadge status={l.status} />
                  </div>
                  <p className="text-zinc-500 text-xs">
                    {l.is_rental_only ? `ETB ${l.price_rental_daily?.toLocaleString()}/day` : `ETB ${l.price_sale?.toLocaleString()}`}
                    {" • "}{new Date(l.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => openVerifyModal(l)}
                    className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/40 hover:bg-blue-500/20 text-blue-400 text-xs font-bold rounded-lg transition-all"
                  >
                    🔍 Get Verified
                  </button>
                  <Link
                    href={`/edit/${l.id}`}
                    className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition-all"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Requests */}
        {activeTab === "requests" && (
          <div className="space-y-3">
            {requests.length === 0 ? (
              <div className="bg-zinc-950 border border-dashed border-zinc-800 rounded-xl p-12 text-center">
                <p className="text-zinc-500 text-sm mb-4">You have no sourcing requests yet.</p>
                <Link href="/post-request" className="px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all">
                  Post a Request
                </Link>
              </div>
            ) : requests.map(r => (
              <div key={r.id} className="bg-zinc-950 border border-zinc-900 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-black text-white">{r.title}</h4>
                  <StatusBadge status={r.status} />
                </div>
                <p className="text-zinc-500 text-xs">
                  {r.category} • Budget: ETB {r.budget?.toLocaleString()} • {new Date(r.created_at).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Profile */}
        {activeTab === "profile" && (
          <div className="bg-zinc-950 border border-zinc-900 rounded-xl p-6 max-w-lg space-y-4">
            <h3 className="font-black text-white text-lg">Account Details</h3>
            <div className="space-y-3">
              {[
                { label: "Full Name", value: profile?.full_name || "—" },
                { label: "Email", value: user?.email || "—" },
                { label: "Phone", value: profile?.phone || "—" },
                { label: "Role", value: profile?.role || "—" },
                { label: "Member Since", value: profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "—" },
                { label: "Account Type", value: profile?.is_premium ? "Premium" : "Standard" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between border-b border-zinc-900 pb-3">
                  <span className="text-zinc-500 text-sm">{label}</span>
                  <span className="text-white text-sm font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* GET VERIFIED (Basic Inspection) MODAL */}
      {verifyModalListing && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-950 border border-zinc-800 rounded-xl max-w-md w-full p-6 shadow-2xl">
            {!verifySuccess ? (
              <>
                <h3 className="text-xl font-bold text-white mb-2">Get Verified</h3>
                <p className="text-zinc-400 text-sm mb-4">
                  Pay <strong className="text-blue-400">{DEFAULT_TIER_FEES.basic} ETB</strong> for Basic Verification of{" "}
                  &quot;{verifyModalListing.brand} {verifyModalListing.model}&quot;. TM checks your ownership documents and
                  confirms your listing photos are accurate, then applies the real &quot;Verified&quot; badge — buyers trust
                  verified listings more.
                </p>
                {verifyError && <p className="text-red-400 text-xs mb-3">{verifyError}</p>}
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">Payment Method</label>
                    <select
                      value={verifyPaymentMethod}
                      onChange={(e) => setVerifyPaymentMethod(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    >
                      <option value="telebirr">Telebirr</option>
                      <option value="cbe">CBE Birr</option>
                      <option value="chapa">Chapa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-zinc-400 uppercase mb-1">
                      Payment Reference / Transaction ID
                    </label>
                    <input
                      type="text"
                      value={verifyPaymentReference}
                      onChange={(e) => setVerifyPaymentReference(e.target.value)}
                      placeholder="e.g. TB123456789"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={handleSubmitVerification}
                  disabled={verifySubmitting}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-lg transition disabled:opacity-50"
                >
                  {verifySubmitting ? "Submitting..." : "Submit Payment for Review"}
                </button>
                <button
                  onClick={() => setVerifyModalListing(null)}
                  className="w-full mt-3 text-zinc-400 text-sm hover:text-white transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-blue-400 mb-2">Payment Submitted</h3>
                <p className="text-zinc-300 text-sm mb-4">
                  Thanks — your verification payment is under review. Once confirmed, TM will check your documents and
                  publish the result.
                </p>
                <button
                  onClick={() => setVerifyModalListing(null)}
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition"
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
'@
Write-TmFile "src/app/dashboard/page.tsx" $f2

Write-Host ""
Write-Host "Inspection request UI written. Run: git status" -ForegroundColor Green
