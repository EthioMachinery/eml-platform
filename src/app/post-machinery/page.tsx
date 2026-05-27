"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import Image from "next/image";

import {
  Upload,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

import { useAuth } from "@/context/AuthContext";

import { useLanguage } from "@/context/LanguageContext";

export default function PostMachineryPage() {
  const router = useRouter();

  const { user } = useAuth();

  const { t, language } = useLanguage();

  const isAm = language === "am";

  const [loading, setLoading] =
    useState(false);

  const [imagePreview, setImagePreview] =
    useState("");

  const [imageFile, setImageFile] =
    useState<File | null>(null);

  const [form, setForm] = useState({
    title: "",
    brand: "",
    type: "",
    location: "",
    price: "",
    model: "",
    year: "",
    condition: "",
    description: "",
    contact: "",
    whatsapp: "",
    sale_or_rental: "Sale",
  });

  const categories = [
    "Excavator",
    "Loader",
    "Bulldozer",
    "Crane",
    "Truck",
    "Grader",
    "Roller",
    "Generator",
    "Forklift",
    "Lowbed",
    "Tractor",
  ];

  const cities = [
    "Addis Ababa",
    "Adama",
    "Hawassa",
    "Dire Dawa",
    "Bahir Dar",
    "Gondar",
    "Jimma",
    "Mekelle",
  ];

  function updateField(
    key: string,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function handleImageChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = e.target.files?.[0];

    if (!file) return;

    setImageFile(file);

    const preview =
      URL.createObjectURL(file);

    setImagePreview(preview);
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    if (!user) return;

    setLoading(true);

    let imageUrl = "";

    /* IMAGE UPLOAD */
    if (imageFile) {
      const fileExt =
        imageFile.name.split(".").pop();

      const fileName =
        `${Date.now()}.${fileExt}`;

      const filePath =
        `machinery/${fileName}`;

      const { error: uploadError } =
        await supabase.storage
          .from("machinery-images")
          .upload(
            filePath,
            imageFile
          );

      if (!uploadError) {
        const { data } =
          supabase.storage
            .from(
              "machinery-images"
            )
            .getPublicUrl(filePath);

        imageUrl =
          data.publicUrl;
      }
    }

    /* INSERT */
    const { error } =
      await supabase
        .from("machinery")
        .insert([
          {
            ...form,
            image_url: imageUrl,
            user_id: user.id,
          },
        ]);

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    router.push("/browse");
  }

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-zinc-950 text-white py-16 px-4">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="mb-12">

          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-4 py-2 rounded-full text-sm font-bold mb-6">

            <ShieldCheck size={16} />

            {t(
              "VERIFIED SELLER AREA",
              "የተረጋገጠ ሻጭ ክፍል"
            )}

          </div>

          <h1 className="text-5xl font-black mb-6">

            {t(
              "Post Machinery",
              "ማሽነሪ ይለጥፉ"
            )}

          </h1>

          <p className="text-zinc-400 text-lg leading-8">

            {t(
              "Create live machinery listings for buyers and renters across Ethiopia.",
              "በመላው ኢትዮጵያ ለገዢዎች እና ለተከራዮች የቀጥታ የማሽነሪ ዝርዝሮችን ይፍጠሩ።"
            )}

          </p>

        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="space-y-8"
        >

          {/* IMAGE */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-2xl font-black mb-6">

              {t(
                "Machinery Image",
                "የማሽነሪ ምስል"
              )}

            </h2>

            <label className="border-2 border-dashed border-zinc-700 rounded-3xl p-10 flex flex-col items-center justify-center text-center cursor-pointer hover:border-yellow-500 transition">

              <Upload
                size={42}
                className="text-yellow-400 mb-4"
              />

              <div className="font-bold mb-2">

                {t(
                  "Upload machinery photo",
                  "የማሽነሪ ፎቶ ይጫኑ"
                )}

              </div>

              <div className="text-zinc-500 text-sm">

                JPG, PNG, WEBP

              </div>

              <input
                type="file"
                accept="image/*"
                hidden
                onChange={
                  handleImageChange
                }
              />

            </label>

            {imagePreview && (
              <div className="mt-6 relative h-80 rounded-3xl overflow-hidden border border-zinc-700">

                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />

              </div>
            )}

          </div>

          {/* DETAILS */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8">

            <h2 className="text-2xl font-black mb-8">

              {t(
                "Machine Details",
                "የማሽነሪ ዝርዝሮች"
              )}

            </h2>

            <div className="grid md:grid-cols-2 gap-6">

              <input
                required
                placeholder={t(
                  "Machine Title",
                  "የማሽነሪ ርዕስ"
                )}
                value={form.title}
                onChange={(e) =>
                  updateField(
                    "title",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              />

              <input
                required
                placeholder={t(
                  "Brand",
                  "ብራንድ"
                )}
                value={form.brand}
                onChange={(e) =>
                  updateField(
                    "brand",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              />

              <select
                required
                value={form.type}
                onChange={(e) =>
                  updateField(
                    "type",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              >

                <option value="">
                  {t(
                    "Select Category",
                    "ምድብ ይምረጡ"
                  )}
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  )
                )}

              </select>

              <select
                required
                value={form.location}
                onChange={(e) =>
                  updateField(
                    "location",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              >

                <option value="">
                  {t(
                    "Select City",
                    "ከተማ ይምረጡ"
                  )}
                </option>

                {cities.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}

              </select>

              <input
                required
                placeholder={t(
                  "Price",
                  "ዋጋ"
                )}
                value={form.price}
                onChange={(e) =>
                  updateField(
                    "price",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              />

              <input
                placeholder={t(
                  "Model",
                  "ሞዴል"
                )}
                value={form.model}
                onChange={(e) =>
                  updateField(
                    "model",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              />

              <input
                placeholder={t(
                  "Year",
                  "ዓመት"
                )}
                value={form.year}
                onChange={(e) =>
                  updateField(
                    "year",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              />

              <input
                placeholder={t(
                  "Condition",
                  "ሁኔታ"
                )}
                value={form.condition}
                onChange={(e) =>
                  updateField(
                    "condition",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              />

              <input
                required
                placeholder={t(
                  "Phone Number",
                  "ስልክ ቁጥር"
                )}
                value={form.contact}
                onChange={(e) =>
                  updateField(
                    "contact",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              />

              <input
                placeholder="WhatsApp"
                value={form.whatsapp}
                onChange={(e) =>
                  updateField(
                    "whatsapp",
                    e.target.value
                  )
                }
                className="h-14 rounded-2xl bg-black border border-zinc-700 px-4 outline-none focus:border-yellow-500"
              />

            </div>

            <textarea
              placeholder={t(
                "Description",
                "መግለጫ"
              )}
              value={form.description}
              onChange={(e) =>
                updateField(
                  "description",
                  e.target.value
                )
              }
              rows={6}
              className="w-full mt-6 rounded-2xl bg-black border border-zinc-700 px-4 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-16 rounded-2xl bg-yellow-500 hover:bg-yellow-400 disabled:opacity-60 text-black font-black text-lg flex items-center justify-center gap-3 transition"
          >

            {loading ? (
              <>
                <Loader2
                  size={22}
                  className="animate-spin"
                />

                {t(
                  "Publishing listing...",
                  "ዝርዝር በማተም ላይ..."
                )}
              </>
            ) : (
              <>
                <Upload size={22} />

                {t(
                  "Publish Machinery",
                  "ማሽነሪ ያትሙ"
                )}
              </>
            )}

          </button>

        </form>

      </div>

    </main>
  );
}