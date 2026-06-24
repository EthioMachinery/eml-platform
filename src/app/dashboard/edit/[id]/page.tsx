"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function EditMachineryPage() {
  const params = useParams();
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notFound, setNotFound] = useState(false);

  const [titleEn, setTitleEn] = useState("");
  const [titleAm, setTitleAm] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [modelYear, setModelYear] = useState("");
  const [serialNumber, setSerialNumber] = useState("");
  const [price, setPrice] = useState("");
  const [priceSale, setPriceSale] = useState("");
  const [priceRentalDaily, setPriceRentalDaily] = useState("");
  const [isRentalOnly, setIsRentalOnly] = useState(false);
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [descriptionEn, setDescriptionEn] = useState("");
  const [descriptionAm, setDescriptionAm] = useState("");

  useEffect(() => {
    init();
  }, []);

  async function init() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setUserId(null); setLoading(false); return; }
    setUserId(user.id);
    if (params?.id) await fetchListing(params.id as string, user.id);
    setLoading(false);
  }

  async function fetchListing(id: string, uid: string) {
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("id", id)
      .eq("owner_id", uid)
      .maybeSingle();

    if (error || !data) {
      setNotFound(true);
      return;
    }

    setTitleEn(data.title_en || data.title || "");
    setTitleAm(data.title_am || "");
    setCategory(data.category || "");
    setSubCategory(data.sub_category || "");
    setBrand(data.brand || "");
    setModel(data.model || "");
    setModelYear(data.model_year ? String(data.model_year) : "");
    setSerialNumber(data.serial_number || "");
    setPrice(data.price ? String(data.price) : "");
    setPriceSale(data.price_sale ? String(data.price_sale) : "");
    setPriceRentalDaily(data.price_rental_daily ? String(data.price_rental_daily) : "");
    setIsRentalOnly(data.is_rental_only || false);
    setLocation(data.location || "");
    setCity(data.city || "");
    setDescriptionEn(data.description_en || "");
    setDescriptionAm(data.description_am || "");
  }

  async function updateListing() {
    if (!titleEn || !price || !location) {
      alert("Please fill in Title, Price, and Location.");
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("listings")
      .update({
        title_en: titleEn,
        title_am: titleAm,
        title: titleEn,
        category,
        sub_category: subCategory,
        brand,
        model,
        model_year: modelYear ? Number(modelYear) : null,
        serial_number: serialNumber,
        price: price ? Number(price) : null,
        price_sale: priceSale ? Number(priceSale) : null,
        price_rental_daily: priceRentalDaily ? Number(priceRentalDaily) : null,
        is_rental_only: isRentalOnly,
        location,
        city,
        description_en: descriptionEn,
        description_am: descriptionAm,
      })
      .eq("id", params.id)
      .eq("owner_id", userId);

    setSaving(false);

    if (error) {
      console.error("update error:", error);
      alert("Failed to update listing: " + error.message);
    } else {
      alert("Listing updated successfully.");
      router.push("/dashboard/listings");
    }
  }

  if (!userId && !loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Please sign in</h1>
          <p className="text-zinc-400 mb-6">Sign in to edit your listings.</p>
          <a href="/login" className="inline-block bg-yellow-500 hover:bg-yellow-400 text-black px-8 py-3 rounded-xl font-bold">Sign In</a>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <p className="text-zinc-400">Loading...</p>
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center px-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Listing not found</h1>
          <p className="text-zinc-400 mb-6">This listing does not exist or you do not have permission to edit it.</p>
          <a href="/dashboard/listings" className="inline-block bg-zinc-800 hover:bg-zinc-700 text-white px-8 py-3 rounded-xl font-bold">Back to Listings</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold">Edit Listing</h1>
        <p className="text-zinc-400 mt-2">Update your machinery listing details.</p>
      </div>

      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Title (English)" value={titleEn} onChange={setTitleEn} />
          <Field label="Title (Amharic)" value={titleAm} onChange={setTitleAm} />
          <Field label="Category" value={category} onChange={setCategory} />
          <Field label="Sub-category" value={subCategory} onChange={setSubCategory} />
          <Field label="Brand" value={brand} onChange={setBrand} />
          <Field label="Model" value={model} onChange={setModel} />
          <Field label="Model Year" value={modelYear} onChange={setModelYear} />
          <Field label="Serial Number" value={serialNumber} onChange={setSerialNumber} />
          <Field label="Price (ETB)" value={price} onChange={setPrice} />
          <Field label="Sale Price (ETB)" value={priceSale} onChange={setPriceSale} />
          <Field label="Rental Price / Day (ETB)" value={priceRentalDaily} onChange={setPriceRentalDaily} />
          <Field label="Location" value={location} onChange={setLocation} />
          <Field label="City" value={city} onChange={setCity} />
        </div>

        <div className="mt-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isRentalOnly}
              onChange={(e) => setIsRentalOnly(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="font-bold">Rental only (not for sale)</span>
          </label>
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-bold">Description (English)</label>
          <textarea
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            rows={5}
            className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
          />
        </div>

        <div className="mt-6">
          <label className="block mb-2 font-bold">Description (Amharic)</label>
          <textarea
            value={descriptionAm}
            onChange={(e) => setDescriptionAm(e.target.value)}
            rows={5}
            className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
          />
        </div>

        <button
          onClick={updateListing}
          disabled={saving}
          className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition disabled:opacity-50"
        >
          {saving ? "Saving..." : "Update Listing"}
        </button>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block mb-2 font-bold text-sm text-zinc-300">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700 text-white"
      />
    </div>
  );
}
