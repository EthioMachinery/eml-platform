"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function EditMachineryPage() {
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState("");
  const [listingType, setListingType] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [condition, setCondition] = useState("");
  const [capacity, setCapacity] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [rentalPeriod, setRentalPeriod] = useState("");
  const [operatorIncluded, setOperatorIncluded] = useState(false);

  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [sellerPhone, setSellerPhone] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (params?.id) {
      fetchMachinery(params.id as string);
    }
  }, [params]);

  async function fetchMachinery(id: string) {
    setLoading(true);

    const { data, error } = await supabase
      .from("machinery")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      alert(
        t(
          "Failed to load machinery",
          "ማሽኑን መጫን አልተቻለም"
        )
      );
    } else {
      setTitle(data.title || "");
      setListingType(data.listing_type || "");
      setCategory(data.category || "");
      setBrand(data.brand || "");
      setModel(data.model || "");
      setYear(
        data.manufacturing_year
          ? String(data.manufacturing_year)
          : ""
      );
      setCondition(data.condition || "");
      setCapacity(data.capacity || "");
      setFuelType(data.fuel_type || "");
      setRentalPeriod(data.rental_period || "");
      setOperatorIncluded(
        data.operator_included || false
      );

      setPrice(data.price || "");
      setLocation(data.location || "");
      setSellerName(data.seller_name || "");
      setSellerPhone(data.seller_phone || "");
      setDescription(data.description || "");
    }

    setLoading(false);
  }

  async function updateMachinery() {
    if (!title || !price || !location) {
      alert(
        t(
          "Please fill required fields",
          "እባክዎ አስፈላጊ መረጃዎችን ያስገቡ"
        )
      );

      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("machinery")
      .update({
        title,
        listing_type: listingType,
        category,
        brand,
        model,
        manufacturing_year: year
          ? Number(year)
          : null,
        condition,
        capacity,
        fuel_type: fuelType,
        rental_period: rentalPeriod,
        operator_included: operatorIncluded,

        price,
        location,
        seller_name: sellerName,
        seller_phone: sellerPhone,
        description,
      })
      .eq("id", params.id);

    setSaving(false);

    if (error) {
      console.error(error);

      alert(
        t(
          "Failed to update machinery",
          "ማሽኑን ማስተካከል አልተቻለም"
        )
      );
    } else {
      alert(
        t(
          "Machinery updated successfully",
          "ማሽኑ በትክክል ተስተካክሏል"
        )
      );

      router.push("/dashboard/listings");
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        {t("Loading...", "በመጫን ላይ...")}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">
            {t(
              "Edit Machinery",
              "ማሽን ያስተካክሉ"
            )}
          </h1>

          <p className="text-zinc-400 mt-2">
            {t(
              "Update your machinery listing",
              "የማሽን ማስታወቂያዎን ያስተካክሉ"
            )}
          </p>
        </div>

        <LanguageSwitcher />
      </div>

      {/* FORM */}
      <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-2xl p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label={t(
              "Machinery Title",
              "የማሽን ስም"
            )}
            value={title}
            onChange={setTitle}
          />

          <Input
            label={t("Category", "ምድብ")}
            value={category}
            onChange={setCategory}
          />

          <Input
            label={t("Brand", "ብራንድ")}
            value={brand}
            onChange={setBrand}
          />

          <Input
            label={t("Model", "ሞዴል")}
            value={model}
            onChange={setModel}
          />

          <Input
            label={t("Year", "ዓመት")}
            value={year}
            onChange={setYear}
          />

          <Input
            label={t("Condition", "ሁኔታ")}
            value={condition}
            onChange={setCondition}
          />

          <Input
            label={t("Capacity", "አቅም")}
            value={capacity}
            onChange={setCapacity}
          />

          <Input
            label={t(
              "Fuel Type",
              "የነዳጅ አይነት"
            )}
            value={fuelType}
            onChange={setFuelType}
          />

          <Input
            label={t(
              "Rental Period",
              "የኪራይ ጊዜ"
            )}
            value={rentalPeriod}
            onChange={setRentalPeriod}
          />

          <Input
            label={t("Price", "ዋጋ")}
            value={price}
            onChange={setPrice}
          />

          <Input
            label={t("Location", "ቦታ")}
            value={location}
            onChange={setLocation}
          />

          <Input
            label={t(
              "Owner Name",
              "የባለቤት ስም"
            )}
            value={sellerName}
            onChange={setSellerName}
          />

          <Input
            label={t("Phone", "ስልክ")}
            value={sellerPhone}
            onChange={setSellerPhone}
          />
        </div>

        {/* OPERATOR */}
        <div className="mt-6">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={operatorIncluded}
              onChange={(e) =>
                setOperatorIncluded(e.target.checked)
              }
            />
            <span>
              {t(
                "Operator Included",
                "ኦፕሬተር ተካቷል"
              )}
            </span>
          </label>
        </div>

        {/* DESCRIPTION */}
        <div className="mt-6">
          <label className="block mb-2 font-bold">
            {t("Description", "መግለጫ")}
          </label>
          <textarea
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            rows={7}
            className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700"
          />
        </div>

        {/* BUTTON */}
        <button
          onClick={updateMachinery}
          disabled={saving}
          className="w-full mt-8 bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition"
        >
          {saving
            ? t("Saving...", "በማስቀመጥ ላይ...")
            : t(
                "Update Machinery",
                "ማሽኑን ያስተካክሉ"
              )}
        </button>

      </div>
    </div>
  );
}

/* INPUT COMPONENT */
function Input({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="block mb-2 font-bold">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700"
      />
    </div>
  );
}