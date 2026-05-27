"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

import { useLanguage } from "@/context/LanguageContext";

import LanguageSwitcher from "@/components/LanguageSwitcher";

import TranslatedSelect from "@/components/TranslatedSelect";

import {
  machineryCategories,
  machineryConditions,
  rentalPeriods,
  fuelTypes,
  listingTypes,
} from "@/constants/options";

export default function UploadPage() {
  const router = useRouter();

  const {
    t,
    language,
  } = useLanguage();

  const [loading, setLoading] =
    useState(false);

  const [title, setTitle] =
    useState("");

  const [listingType, setListingType] =
    useState("");

  const [category, setCategory] =
    useState("");

  const [customCategory, setCustomCategory] =
    useState("");

  const [brand, setBrand] =
    useState("");

  const [model, setModel] =
    useState("");

  const [
    manufacturingYear,
    setManufacturingYear,
  ] = useState("");

  const [condition, setCondition] =
    useState("");

  const [
    customCondition,
    setCustomCondition,
  ] = useState("");

  const [capacity, setCapacity] =
    useState("");

  const [fuelType, setFuelType] =
    useState("");

  const [
    customFuelType,
    setCustomFuelType,
  ] = useState("");

  const [
    rentalPeriod,
    setRentalPeriod,
  ] = useState("");

  const [
    customRentalPeriod,
    setCustomRentalPeriod,
  ] = useState("");

  const [
    operatorIncluded,
    setOperatorIncluded,
  ] = useState(false);

  const [price, setPrice] =
    useState("");

  const [location, setLocation] =
    useState("");

  const [ownerName, setOwnerName] =
    useState("");

  const [phone, setPhone] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [image, setImage] =
    useState<File | null>(
      null
    );

  async function handleUpload(
    e: React.FormEvent
  ) {
    e.preventDefault();

    try {
      setLoading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        alert(
          t(
            "You must login first.",
            "እባክዎ መጀመሪያ ይግቡ።"
          )
        );

        router.push("/login");

        return;
      }

      let imageUrl = "";

      if (image) {
        const fileName = `${Date.now()}-${image.name}`;

        const {
          error: uploadError,
        } =
          await supabase.storage
            .from(
              "machinery-images"
            )
            .upload(
              fileName,
              image
            );

        if (uploadError) {
          alert(
            t(
              "Image upload failed.",
              "ፎቶ መጫን አልተሳካም።"
            )
          );

          return;
        }

        const { data } =
          supabase.storage
            .from(
              "machinery-images"
            )
            .getPublicUrl(
              fileName
            );

        imageUrl =
          data.publicUrl;
      }

      const finalCategory =
        category === "Other"
          ? customCategory
          : category;

      const finalCondition =
        condition === "Other"
          ? customCondition
          : condition;

      const finalFuelType =
        fuelType === "Other"
          ? customFuelType
          : fuelType;

      const finalRentalPeriod =
        rentalPeriod === "Other"
          ? customRentalPeriod
          : rentalPeriod;

      const { error } =
        await supabase
          .from("machinery")
          .insert([
            {
              title,

              listing_type:
                listingType,

              category:
                finalCategory,

              brand,

              model,

              manufacturing_year:
                manufacturingYear
                  ? Number(
                      manufacturingYear
                    )
                  : null,

              condition:
                finalCondition,

              capacity,

              fuel_type:
                finalFuelType,

              rental_period:
                listingType ===
                "Rental"
                  ? finalRentalPeriod
                  : null,

              operator_included:
                listingType ===
                "Rental"
                  ? operatorIncluded
                  : false,

              price,

              location,

              seller_name:
                ownerName,

              seller_phone:
                phone,

              description,

              image_url:
                imageUrl,

              user_id:
                user.id,
            },
          ]);

      if (error) {
        alert(error.message);

        return;
      }

      alert(
        t(
          "Machinery uploaded successfully!",
          "ማሽኑ በትክክል ተጭኗል!"
        )
      );

      router.push("/browse");
    } catch (error) {
      console.error(error);

      alert(
        t(
          "Something went wrong.",
          "ስህተት ተፈጥሯል።"
        )
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black px-4 py-10 text-white">

      <div className="mx-auto max-w-4xl rounded-[40px] border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">

        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

          <div>

            <h1 className="text-4xl font-black text-yellow-400">

              {t(
                "Upload Machinery",
                "ማሽን ያስገቡ"
              )}

            </h1>

            <p className="mt-3 text-zinc-400">

              {t(
                "Create industrial machinery listings for Ethiopia’s marketplace.",
                "ለኢትዮጵያ የማሽነሪ ገበያ ማስታወቂያ ይፍጠሩ።"
              )}

            </p>

          </div>

          <LanguageSwitcher />

        </div>

        {/* FORM */}

        <form
          onSubmit={
            handleUpload
          }
          className="space-y-8"
        >

          {/* TITLE */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Machinery Title",
                "የማሽን ርዕስ"
              )}

            </label>

            <input
              required
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(
                  e.target.value
                )
              }
              placeholder={t(
                "CAT 320D Excavator",
                "CAT 320D ኤክስካቫተር"
              )}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* LISTING TYPE */}

          <TranslatedSelect
            label={t(
              "Listing Type",
              "የማስታወቂያ አይነት"
            )}
            value={listingType}
            onChange={
              setListingType
            }
            options={
              listingTypes
            }
            required
          />

          {/* CATEGORY */}

          <TranslatedSelect
            label={t(
              "Category",
              "ምድብ"
            )}
            value={category}
            onChange={
              setCategory
            }
            options={
              machineryCategories
            }
            required
            showOtherInput
            otherValue={
              customCategory
            }
            onOtherChange={
              setCustomCategory
            }
          />

          {/* BRAND */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Brand",
                "ብራንድ"
              )}

            </label>

            <input
              type="text"
              value={brand}
              onChange={(e) =>
                setBrand(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* MODEL */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Model",
                "ሞዴል"
              )}

            </label>

            <input
              type="text"
              value={model}
              onChange={(e) =>
                setModel(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* YEAR */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Manufacturing Year",
                "የተመረተበት ዓመት"
              )}

            </label>

            <input
              type="number"
              value={
                manufacturingYear
              }
              onChange={(e) =>
                setManufacturingYear(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* CONDITION */}

          <TranslatedSelect
            label={t(
              "Condition",
              "ሁኔታ"
            )}
            value={condition}
            onChange={
              setCondition
            }
            options={
              machineryConditions
            }
            required
            showOtherInput
            otherValue={
              customCondition
            }
            onOtherChange={
              setCustomCondition
            }
          />

          {/* CAPACITY */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Capacity",
                "አቅም"
              )}

            </label>

            <input
              type="text"
              value={capacity}
              onChange={(e) =>
                setCapacity(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* FUEL */}

          <TranslatedSelect
            label={t(
              "Fuel Type",
              "የነዳጅ አይነት"
            )}
            value={fuelType}
            onChange={
              setFuelType
            }
            options={fuelTypes}
            showOtherInput
            otherValue={
              customFuelType
            }
            onOtherChange={
              setCustomFuelType
            }
          />

          {/* RENTAL */}

          {listingType ===
            "Rental" && (
            <>
              <TranslatedSelect
                label={t(
                  "Rental Period",
                  "የኪራይ ጊዜ"
                )}
                value={
                  rentalPeriod
                }
                onChange={
                  setRentalPeriod
                }
                options={
                  rentalPeriods
                }
                showOtherInput
                otherValue={
                  customRentalPeriod
                }
                onOtherChange={
                  setCustomRentalPeriod
                }
              />

              <div className="flex items-center gap-4">

                <input
                  type="checkbox"
                  checked={
                    operatorIncluded
                  }
                  onChange={(
                    e
                  ) =>
                    setOperatorIncluded(
                      e.target
                        .checked
                    )
                  }
                  className="h-5 w-5"
                />

                <span className="font-bold">

                  {t(
                    "Operator Included",
                    "ኦፕሬተር ተካትቷል"
                  )}

                </span>

              </div>
            </>
          )}

          {/* PRICE */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Price",
                "ዋጋ"
              )}

            </label>

            <input
              required
              type="text"
              value={price}
              onChange={(e) =>
                setPrice(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* LOCATION */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Location",
                "አካባቢ"
              )}

            </label>

            <input
              required
              type="text"
              value={location}
              onChange={(e) =>
                setLocation(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* OWNER */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Owner Name",
                "የባለቤት ስም"
              )}

            </label>

            <input
              required
              type="text"
              value={ownerName}
              onChange={(e) =>
                setOwnerName(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* PHONE */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Phone Number",
                "ስልክ ቁጥር"
              )}

            </label>

            <input
              required
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* DESCRIPTION */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Description",
                "መግለጫ"
              )}

            </label>

            <textarea
              rows={6}
              required
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4 outline-none focus:border-yellow-500"
            />

          </div>

          {/* IMAGE */}

          <div>

            <label className="mb-3 block font-black">

              {t(
                "Machinery Image",
                "የማሽን ፎቶ"
              )}

            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(
                  e.target
                    .files?.[0] ||
                    null
                )
              }
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-5 py-4"
            />

          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-yellow-500 py-5 text-xl font-black text-black transition hover:bg-yellow-400"
          >

            {loading
              ? t(
                  "Uploading...",
                  "በመጫን ላይ..."
                )
              : t(
                  "Upload Machinery",
                  "ማሽን ያስገቡ"
                )}

          </button>

        </form>

      </div>

    </div>
  );
}