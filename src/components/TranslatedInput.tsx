"use client";

import React from "react";

import { useI18n } from "@/hooks/useI18n";

type Props =
  React.InputHTMLAttributes<HTMLInputElement> & {
    label?: string;
    translationKey?: string;
  };

export default function TranslatedInput({
  label,
  translationKey,
  className = "",
  ...props
}: Props) {
  const { tr } = useI18n();

  const translatedPlaceholder =
    translationKey
      ? tr(translationKey)
      : props.placeholder;

  return (
    <div className="space-y-2">

      {label && (
        <label className="text-sm font-bold text-zinc-300">
          {label}
        </label>
      )}

      <input
        {...props}
        placeholder={translatedPlaceholder}
        className={`w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-5 py-4 outline-none focus:border-yellow-500 transition ${className}`}
      />

    </div>
  );
}