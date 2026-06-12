"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ImagePlus, CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useEnterpriseTranslation } from "@/hooks/useEnterpriseTranslation";

const CATEGORIES = [
  "Earthmoving", "Lifting & Cranes", "Concrete & Construction",
  "Road & Paving", "Agricultural", "Transport & Haulage",
  "Power & Generators", "Mining", "Forestry", "Other",
];

const CONDITIONS = ["New", "Used", "Refurbished", "Other"];

const ETHIOPIAN_CITIES = [
  "Addis Ababa", "Dire Dawa", "Mekelle", "Gondar", "Bahir Dar",
  "Hawassa", "Jimma", "Adama", "Dessie", "Jijiga", "Other",
];

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => CURRENT_YEAR - i);

function Label({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="mb-2 block text-sm font-black uppercase tracking-widest text-zinc-400">
      {children}{required && <span className="ml-1 text-yellow-500">*</span>}
    </label>
  );
}

function Input({ value, onChange, placeholder, type = "text", required }: {
  value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-yellow-500/60 placeholder:text-zinc-600"
    />
  );
}

function SelectWithOther({ label, value, onChange, options, required }: {
  label: string; value: string; onChange: (v: string) => void;
  options: string[]; required?: boolean;
}) {
  const [custom, setCustom] = useState("");
  const showCustom = value === "Other";

  return (
    <div className="space-y-3">
      <Label required={required}>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-yellow-500/60"
      >
        <option value="">Select {label}</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
      {showCustom && (
        <input
          type="text"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); onChange(e.target.value || "Other"); }}
          placeholder={`Specify ${label.toLowerCase()}...`}
          className="w-full rounded-2xl border border-yellow-500/40 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-yellow-500"
        />
      )}
    </div>
  );
}

export default function UploadPage() {
  const router = useRouter();
  const { t } = useEnterpriseTranslation();

  const [title,        setTitle]        = useState("");
  const [category,     setCategory]     = useState("");
  const [type,         setType]         = useState("");
  const [brand,        setBrand]        = useState("");
  const [city,         setCity]         = useState("");
  const [region,       setRegion]       = useState("");
  const [condition,    setCondition]    = useState("");
  const [year,         setYear]         = useState("");
  const [forSale,      setForSale]      = useState(true);
  const [forRent,      setForRent]      = useState(false);
  const [price,        setPrice]        = useState("");
  const [rentPrice,    setRentPrice]    = useState("");
  const [description,  setDescription]  = useState("");
  const [image,        setImage]        = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading,      setLoading]      = useState(false);
  const [success,      setSuccess]      = useState(false);
  const [error,        setError]        = useState("");

  function handleImageChange(file: File | null) {
    setImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!forSale && !forRent) {
      setError("Please select at least one: For Sale or For Rent.");
      return;
    }
    if (forSale && !price) {
      setError("Please enter a sale price.");
      return;
    }
    if (forRent && !rentPrice) {
      setError("Please enter a rental price per day.");
      return;
    }

    try {
      setLoading(true);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      let imageUrl = "";
      if (image) {
        const ext      = image.name.split(".").pop();
        const fileName = `${user.id}/${Date.now()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("machinery-images")
          .upload(fileName, image, { upsert: false });
        if (uploadError) {
          setError(`Image upload failed: ${uploadError.message}`);
          setLoading(false);
          return;
        }
        const { data: urlData } = supabase.storage
          .from("machinery-images")
          .getPublicUrl(fileName);
        imageUrl = urlData.publicUrl;
      }

      const { error: insertError } = await supabase
        .from("machinery")
        .insert({
          user_id:     user.id,
          title:       title.trim(),
          category,
          type:        type.trim()   || null,
          brand:       brand.trim()  || null,
          city,
          region:      region.trim() || null,
          condition:   condition     || null,
          year:        year ? parseInt(year) : null,
          for_sale:    forSale,
          for_rent:    forRent,
          price:       forSale ? parseInt(price) : 0,
          rent_price:  forRent ? parseInt(rentPrice) : null,
          description: description.trim() || null,
          image_url:   imageUrl || null,
          status:      "pending_review",
        });

      if (insertError) { setError(insertError.message); return; }

      await supabase.from("eml_events").insert({
        event_name: "MACHINERY_LISTING_CREATED",
        actor_id:   user.id,
        severity:   "INFO",
        payload:    { title, category, city },
        created_at: new Date().toISOString(),
      });

      setSuccess(true);
      setTimeout(() => router.push("/browse"), 2500);

    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="text-center space-y-4">
          <CheckCircle2 size={64} className="mx-auto text-green-400" />
          <h2 className="text-3xl font-black">Listing Published!</h2>
          <p className="text-zinc-400">Redirecting you to the marketplace...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white pb-20">

      <section className="border-b border-zinc-800 bg-zinc-950">
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-yellow-500/20 bg-yellow-500/10 px-4 py-2 text-sm font-black text-yellow-400">
            <Upload size={14} /> LIST YOUR MACHINERY
          </div>
          <h1 className="mt-4 text-4xl font-black md:text-5xl">{t("listMachinery")}</h1>
          <p className="mt-3 text-zinc-400">{t("heroDescription")}</p>
        </div>
      </section>

      <div className="mx-auto max-w-3xl px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* BASIC INFO */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-black text-yellow-400">Basic Information</h2>
            <div>
              <Label required>Machinery Title</Label>
              <Input value={title} onChange={setTitle} placeholder="e.g. CAT 320D Excavator 2019" required />
            </div>
            <SelectWithOther label="Category" value={category} onChange={setCategory} options={CATEGORIES} required />
            <div>
              <Label>Machine Type</Label>
              <Input value={type} onChange={setType} placeholder="e.g. Excavator, Crane, Loader" />
            </div>
            <div>
              <Label>Brand</Label>
              <Input value={brand} onChange={setBrand} placeholder="e.g. CAT, Komatsu, Volvo" />
            </div>
          </div>

          {/* DETAILS */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-black text-yellow-400">Details</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <SelectWithOther label="Condition" value={condition} onChange={setCondition} options={CONDITIONS} />
              <div>
                <Label>Manufacturing Year</Label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-yellow-500/60"
                >
                  <option value="">Select Year</option>
                  {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <SelectWithOther label="City" value={city} onChange={setCity} options={ETHIOPIAN_CITIES} required />
              <div>
                <Label>Region / Zone</Label>
                <Input value={region} onChange={setRegion} placeholder="e.g. Oromia, Amhara" />
              </div>
            </div>
          </div>

          {/* PRICING */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8 space-y-6">
            <h2 className="text-xl font-black text-yellow-400">Pricing & Availability</h2>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForSale(!forSale)}
                className={`flex-1 rounded-2xl border py-4 font-black transition ${
                  forSale
                    ? "border-yellow-500 bg-yellow-500/10 text-yellow-400"
                    : "border-zinc-700 bg-zinc-950 text-zinc-500 hover:border-zinc-500"
                }`}
              >
                {forSale ? "✓ " : ""}For Sale
              </button>
              <button
                type="button"
                onClick={() => setForRent(!forRent)}
                className={`flex-1 rounded-2xl border py-4 font-black transition ${
                  forRent
                    ? "border-blue-500 bg-blue-500/10 text-blue-400"
                    : "border-zinc-700 bg-zinc-950 text-zinc-500 hover:border-zinc-500"
                }`}
              >
                {forRent ? "✓ " : ""}For Rent
              </button>
            </div>
            {forSale && (
              <div>
                <Label required>Sale Price (ETB)</Label>
                <Input type="number" value={price} onChange={setPrice} placeholder="e.g. 2500000" required />
              </div>
            )}
            {forRent && (
              <div>
                <Label required>Rental Price per Day (ETB)</Label>
                <Input type="number" value={rentPrice} onChange={setRentPrice} placeholder="e.g. 15000" required />
              </div>
            )}
          </div>

          {/* DESCRIPTION */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-black text-yellow-400">Description</h2>
            <textarea
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the machinery condition, history, features and any other relevant details..."
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 text-white outline-none transition focus:border-yellow-500/60 placeholder:text-zinc-600 resize-none"
            />
          </div>

          {/* IMAGE */}
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-black text-yellow-400">Machinery Photo</h2>
            {imagePreview ? (
              <div className="relative rounded-2xl overflow-hidden">
                <img src={imagePreview} alt="Preview" className="w-full h-64 object-cover" />
                <button
                  type="button"
                  onClick={() => handleImageChange(null)}
                  className="absolute top-3 right-3 rounded-xl bg-black/70 px-3 py-1 text-sm font-black hover:bg-red-600 transition"
                >
                  Remove
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-950 p-12 cursor-pointer hover:border-yellow-500/40 transition">
                <ImagePlus size={40} className="text-zinc-600" />
                <div className="text-center">
                  <p className="font-black text-zinc-400">Click to upload photo</p>
                  <p className="text-sm text-zinc-600 mt-1">JPG, PNG or WebP — max 5MB</p>
                </div>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
                />
              </label>
            )}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-4 text-red-400 font-bold text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-yellow-500 py-5 text-xl font-black text-black transition hover:bg-yellow-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Publishing..." : "Publish Listing"}
          </button>

          <p className="text-center text-sm text-zinc-500">
            By publishing, you confirm this listing is accurate and you are authorised to sell or rent this machinery.
          </p>

        </form>
      </div>
    </main>
  );
}