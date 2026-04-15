"use client";

import { motion } from "framer-motion";
import {
  Wrench,
  Truck,
  ShieldCheck,
  Settings,
  HardHat,
  Factory,
} from "lucide-react";

const services = [
  {
    title_en: "Maintenance",
    title_am: "ጥገና",
    icon: Wrench,
    desc: "Professional machinery servicing and repair solutions.",
  },
  {
    title_en: "Transport",
    title_am: "መጓጓዣ",
    icon: Truck,
    desc: "Heavy equipment logistics and relocation services.",
  },
  {
    title_en: "Insurance",
    title_am: "ኢንሹራንስ",
    icon: ShieldCheck,
    desc: "Protect your machinery with verified insurance providers.",
  },
  {
    title_en: "Spare Parts",
    title_am: "መለዋወጫ ክፍሎች",
    icon: Settings,
    desc: "Access genuine and compatible machinery spare parts.",
  },
  {
    title_en: "Operators",
    title_am: "ኦፕሬተሮች",
    icon: HardHat,
    desc: "Hire skilled and certified machinery operators.",
  },
  {
    title_en: "Industrial Services",
    title_am: "ኢንዱስትሪ አገልግሎቶች",
    icon: Factory,
    desc: "End-to-end industrial and construction support services.",
  },
];

export default function ServiceGrid() {
  return (
    <section className="bg-[#f4f4f4] py-12 px-6">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-[#111111]">
          Service Marketplace
        </h2>
        <p className="text-gray-600 mt-2 text-sm">
          አገልግሎቶች | Explore verified machinery-related services
        </p>
      </div>

      {/* GRID */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {services.map((service, i) => {
          const Icon = service.icon;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="bg-white border-2 border-gray-200 p-6 flex flex-col justify-between hover:border-yellow-400 transition-all duration-300"
            >

              {/* ICON */}
              <div className="mb-4">
                <Icon size={32} className="text-yellow-400" />
              </div>

              {/* TITLE */}
              <h3 className="font-bold text-lg text-[#111111]">
                {service.title_en}
              </h3>

              <p className="text-sm text-gray-500 mb-2">
                {service.title_am}
              </p>

              {/* DESCRIPTION */}
              <p className="text-gray-600 text-sm mb-4">
                {service.desc}
              </p>

              {/* TRUST BADGES */}
              <div className="text-xs text-gray-400 mb-4">
                ✔ Verified • ✔ Trusted • ✔ Admin Controlled
              </div>

              {/* ACTION BUTTON */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ scale: 1.02 }}
                className="mt-auto bg-yellow-400 text-black py-2 font-semibold w-full"
              >
                Explore Service
              </motion.button>

            </motion.div>
          );
        })}

      </div>

    </section>
  );
}