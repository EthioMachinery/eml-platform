"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { translate } from "@/lib/i18n";
import { useLanguage } from "@/context/LanguageContext";

type Option = {
  value: string;
  label: {
    en: string;
    am: string;
    or: string;
    ti: string;
  };
};

type EnterpriseSelectProps = {
  label: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  otherValue?: string;
  onOtherChange?: (value: string) => void;
  required?: boolean;
};

export default function EnterpriseSelect({
  label,
  placeholder,
  options,
  value,
  onChange,
  otherValue,
  onOtherChange,
  required = false,
}: EnterpriseSelectProps) {
  const { language } = useLanguage();
  const [isOther, setIsOther] = useState(false);

  useEffect(() => {
    setIsOther(value === "other");
  }, [value]);

  return (
    <div className="space-y-3">
      <label className="block text-sm font-black text-zinc-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>

      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none bg-zinc-900 border border-zinc-800 focus:border-yellow-500 rounded-2xl px-5 py-4 pr-12 outline-none text-white font-semibold transition"
        >
          <option value="">
            {placeholder || translate("common.select", language)}
          </option>

          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {translate(option.label, language)}
            </option>
          ))}

          <option value="other">
            {translate("common.other", language)}
          </option>
        </select>

        <ChevronDown
          size={18}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none"
        />
      </div>

      {isOther && (
        <div className="space-y-2">
          <label className="text-sm font-bold text-zinc-400">
            Please specify
          </label>
          <input
            type="text"
            value={otherValue || ""}
            onChange={(e) => onOtherChange?.(e.target.value)}
            placeholder="Please specify..."
            className="w-full bg-black border border-zinc-800 focus:border-yellow-500 rounded-2xl px-5 py-4 outline-none text-white transition"
          />
        </div>
      )}
    </div>
  );
}