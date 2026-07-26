"use client";

import React, { useState, useEffect, useTransition } from "react";
import { useTranslate } from "@/hooks/useTranslate";
import { useAuth } from "@/context/AuthContext";
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
    </section>
  );
}
