"use client";

import { useMemo } from "react";

import { useLanguage } from "@/context/LanguageContext";

type Option = {
  value: string;

  en: string;

  am: string;
};

type Props = {
  label: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  options: Option[];

  placeholder?: string;

  required?: boolean;

  showOtherInput?: boolean;

  otherValue?: string;

  onOtherChange?: (
    value: string
  ) => void;
};

export default function TranslatedSelect({
  label,

  value,

  onChange,

  options,

  placeholder,

  required,

  showOtherInput,

  otherValue,

  onOtherChange,
}: Props) {
  const {
    language,
    t,
  } = useLanguage();

  const translatedOptions =
    useMemo(() => {
      return options.map(
        (option) => ({
          value:
            option.value,

          label:
            language ===
            "am"
              ? option.am
              : option.en,
        })
      );
    }, [
      options,
      language,
    ]);

  return (
    <div className="space-y-3">

      {/* LABEL */}

      <label className="block text-sm font-black text-white">
        {label}
      </label>

      {/* SELECT */}

      <select
        required={required}
        value={value}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white outline-none transition-all focus:border-yellow-500"
      >

        <option value="">
          {placeholder ||
            t(
              "Select option",
              "አማራጭ ይምረጡ"
            )}
        </option>

        {translatedOptions.map(
          (option) => (
            <option
              key={
                option.value
              }
              value={
                option.value
              }
            >
              {
                option.label
              }
            </option>
          )
        )}

      </select>

      {/* OTHER FIELD */}

      {showOtherInput &&
        value ===
          "Other" && (
          <div className="space-y-2">

            <label className="block text-sm font-bold text-zinc-300">

              {t(
                "Please Specify",
                "እባክዎ ይግለጹ"
              )}

            </label>

            <input
              type="text"
              required
              value={
                otherValue ||
                ""
              }
              onChange={(
                e
              ) =>
                onOtherChange?.(
                  e.target
                    .value
                )
              }
              placeholder={t(
                "Specify here...",
                "እዚህ ይግለጹ..."
              )}
              className="w-full rounded-2xl border border-zinc-700 bg-zinc-900 px-5 py-4 text-white outline-none transition-all focus:border-yellow-500"
            />

          </div>
        )}

    </div>
  );
}