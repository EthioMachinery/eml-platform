"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  ShieldCheck,
  ChevronLeft,
  Loader2,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";
import { useLanguage } from "@/context/LanguageContext";

type Machinery = {
  id: string;
  title: string;
  price: string;
  location: string;
  image_url: string;
  brand: string;
  type: string;
  model: string;
  year: string;
  condition: string;
  description: string;
  contact: string;
  whatsapp: string;
  sale_or_rental: string;
  created_at: string;
};

export default function MachineDetailPage() {
  const params = useParams();
  const { language } = useLanguage();

  // Local helper to translate dual-strings without contract lookup errors
  const t = (en: string, am: string): string => {
    return language === "am" ? am : en;
  };

  const isAm = language === "am";

  const [machine, setMachine] = useState<Machinery | null>(null);
  const [relatedMachines, setRelatedMachines] = useState<Machinery[]>([]);
  const [loading, setLoading] = useState(true);

  const cityTranslations: Record<string, string> = {
    "Addis Ababa": "አዲስ አበባ",
    Adama: "አዳማ",
    Hawassa: "ሀዋሳ",
    "Dire Dawa": "ድሬዳዋ",
    "Bahir Dar": "ባህር ዳር",
    Gondar: "ጎንደር",
    Mekelle: "መቀሌ",
    Jimma: "ጅማ",
    Mojo: "ሞጆ",
  };

  const categoryTranslations: Record<string, string> = {
    Excavator: "ኤክስካቫተር",
    Loader: "ሎደር",
    Bulldozer: "ቡልዶዘር",
    Crane: "ክሬን",
    Truck: "ትራክ",
    Grader: "ግሬደር",
    Roller: "ሮለር",
    Generator: "ጄኔሬተር",
    Compressor: "ኮምፕሬሰር",
    "Concrete Mixer": "ኮንክሪት ማቀላቀያ",
    Forklift: "ፎርክሊፍት",
    Tractor: "ትራክተር",
    Lowbed: "ሎውቤድ",
    "Combine harvester": "ኮምባይን ሀርቨስተር",
    Heavy: "ከባድ ማሽነሪ",
  };

  function translateCity(cityName: string) {
    if (!isAm) return cityName;
    return cityTranslations[cityName] || cityName;
  }

  function translateCategory(categoryName: string) {
    if (!isAm) return categoryName;
    return (
      categoryTranslations[categoryName] ||
      categoryName
    );
  }

  useEffect(() => {
    if (params?.id) {
      loadMachine(params.id as string);
    }
  }, [params]);

  async function loadMachine(id: string) {
    setLoading(true);

    const { data, error } = await supabase
      .from("machinery")
      .select("*")
      .eq("id", id)
      .single();

    if (!error && data) {
      setMachine(data);
      loadRelatedMachines(data.type, data.id);
    }

    setLoading(false);
  }

  async function loadRelatedMachines(
    type: string,
    currentId: string
  ) {
    const { data } = await supabase
      .from("machinery")
      .select("*")
      .eq("type", type)
      .neq("id", currentId)
      .limit(3);

    setRelatedMachines(data || []);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-yellow-400 text-xl font-bold">
          <Loader2 className="animate-spin" />
          {t(
            "Loading machinery...",
            "ማሽነሪው በመጫን ላይ..."
          )}
        </div>
      </main>
    );
  }

  if (!machine) {
    return (
      <main className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center px-4 text-center">

        <h1 className="text-4xl font-black mb-4">
          {t(
            "Machine Not Found",
            "ማሽነሪው አልተገኘም"
          )}
        </h1>

        <p className="text-zinc-400 mb-8">
          {t(
            "This machinery listing may have been removed.",
            "ይህ ዝርዝር ሊወገድ ይችላል።"
          )}
        </p>

        <Link
          href="/browse"
          className="bg-yellow-500 hover:bg-yellow-400 text-black px-6 py-3 rounded-2xl font-black"
        >
          {t(
            "Back to Marketplace",
            "ወደ ገበያ ተመለስ"
          )}
        </Link>

      </main>
    );
  }

  const whatsappLink = machine.whatsapp
    ? `https://wa.me/${machine.whatsapp.replace(
        /\D/g,
        ""
      )}`
    : null;

  return (
    <main className="min-h-screen bg-zinc-950 text-white">

      {/* TOP BAR */}
      <section className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 py-5">
          <Link
            href="/browse"
            className="inline-flex items-center gap-2 text-yellow-400 font-bold"
          >
            <ChevronLeft size={20} />
            {t(
              "Back to Marketplace",
              "ወደ ገበያ ተመለስ"
            )}
          </Link>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-10">

          {/* IMAGE */}
          <div>
            <div className="relative h-[500px] bg-black rounded-3xl overflow-hidden border border-zinc-800">
              {machine.image_url ? (
                <Image
                  src={machine.image_url}
                  alt={machine.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-zinc-600 text-2xl font-bold">
                  {t(
                    "No Image Available",
                    "ምስል የለም"
                  )}
                </div>
              )}
            </div>
          </div>

          {/* DETAILS */}
          <div>
            <div className="flex items-center gap-3 mb-5">
              <div className="bg-yellow-500/10 text-yellow-400 px-4 py-2 rounded-full text-sm font-black">
                {machine.sale_or_rental === "Sale"
                  ? t("Sale", "ሽያጭ")
                  : machine.sale_or_rental === "Rental"
                  ? t("Rental", "ኪራይ")
                  : machine.sale_or_rental}
              </div>

              <div className="flex items-center gap-2 text-zinc-400 text-sm">
                <ShieldCheck size={16} />
                {t(
                  "Verified Listing",
                  "የተረጋገጠ ዝርዝር"
                )}
              </div>
            </div>

            <h1 className="text-5xl font-black mb-4 leading-tight">
              {machine.title}
            </h1>

            <div className="flex items-center gap-2 text-zinc-400 text-lg mb-8">
              <MapPin size={18} />
              {translateCity(machine.location)}
            </div>

            <div className="text-5xl font-black text-yellow-400 mb-10">
              {machine.price}
            </div>

            <div className="grid grid-cols-2 gap-5 mb-10">
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 text-sm mb-2">
                  {t("Type", "አይነት")}
                </div>
                <div className="font-bold text-lg">
                  {translateCategory(machine.type)}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 text-sm mb-2">
                  {t("Brand", "ብራንድ")}
                </div>
                <div className="font-bold text-lg">
                  {machine.brand || "-"}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 text-sm mb-2">
                  {t("Model", "ሞዴል")}
                </div>
                <div className="font-bold text-lg">
                  {machine.model || "-"}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 text-sm mb-2">
                  {t("Condition", "ሁኔታ")}
                </div>
                <div className="font-bold text-lg">
                  {machine.condition || "-"}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 text-sm mb-2">
                  {t("Year", "ዓመት")}
                </div>
                <div className="font-bold text-lg">
                  {machine.year || "-"}
                </div>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
                <div className="text-zinc-500 text-sm mb-2">
                  {t("Listed", "የተለጠፈበት")}
                </div>
                <div className="font-bold text-lg flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(machine.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-7 mb-10">
              <h2 className="text-2xl font-black mb-5">
                {t(
                  "Description",
                  "መግለጫ"
                )}
              </h2>

              <p className="text-zinc-300 leading-8 whitespace-pre-line">
                {machine.description ||
                  t(
                    "No description provided.",
                    "ምንም መግለጫ አልተሰጠም።"
                  )}
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <a
                href={`tel:${machine.contact}`}
                className="h-16 rounded-2xl bg-yellow-500 hover:bg-yellow-400 text-black font-black flex items-center justify-center gap-3 text-lg transition"
              >
                <Phone size={22} />
                {t(
                  "Call Seller",
                  "ሻጩን ይደውሉ"
                )}
              </a>

              {whatsappLink && (
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-16 rounded-2xl bg-green-600 hover:bg-green-500 text-white font-black flex items-center justify-center gap-3 text-lg transition"
                >
                  <MessageCircle size={22} />
                  WhatsApp
                </a>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* RELATED */}
      {relatedMachines.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-20">
          <div className="mb-10">
            <div className="text-yellow-400 font-black tracking-widest mb-2">
              {t(
                "RELATED MACHINERY",
                "ተመሳሳይ ማሽነሪዎች"
              )}
            </div>

            <h2 className="text-4xl font-black">
              {t(
                "You may also like",
                "ሊወዱት ይችላሉ"
              )}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
            {relatedMachines.map((item) => (
              <Link
                href={`/machines/${item.id}`}
                key={item.id}
                className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden hover:border-yellow-500/30 transition"
              >
                <div className="relative h-64 bg-black">
                  {item.image_url ? (
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">
                      {t(
                        "No Image",
                        "ምስል የለም"
                      )}
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-yellow-500/10 text-yellow-400 px-3 py-1 rounded-full text-xs font-bold">
                      {item.sale_or_rental}
                    </div>

                    <div className="text-zinc-400 text-sm flex items-center gap-1">
                      <MapPin size={14} />
                      {translateCity(item.location)}
                    </div>
                  </div>

                  <h3 className="text-2xl font-black mb-3">
                    {item.title}
                  </h3>

                  <div className="text-zinc-400 mb-2">
                    {item.brand}
                  </div>

                  <div className="text-zinc-500 text-sm mb-6">
                    {translateCategory(item.type)}
                  </div>

                  <div className="text-3xl font-black text-yellow-400">
                    {item.price}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

    </main>
  );
}