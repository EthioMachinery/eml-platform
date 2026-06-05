"use client";

import React, { SelectHTMLAttributes } from 'react';
import { useTranslate, TranslationPath } from '@/hooks/useTranslate';
import TranslatedInput from './TranslatedInput';

interface SelectOption {
  value: string;
  labelKey?: TranslationPath;
  label?: string; // Pre-translated string fallback (e.g. for dynamic locations)
}

interface TranslatedSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'placeholder'> {
  placeholderKey: TranslationPath;
  labelKey?: TranslationPath;
  options: SelectOption[];
  
  // Custom props to handle "Other (Specify)" workflow
  enableOther?: boolean;
  otherValue?: string;
  onOtherChange?: (val: string) => void;
  otherPlaceholderKey?: TranslationPath;
}

export default function TranslatedSelect({
  placeholderKey,
  labelKey,
  options,
  enableOther = false,
  otherValue = "",
  onOtherChange,
  otherPlaceholderKey = "placeholders.additionalDetails",
  className = '',
  ...props
}: TranslatedSelectProps) {
  const { t } = useTranslate();

  const isOtherSelected = props.value === "other";

  return (
    <div className="w-full">
      {labelKey && (
        <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          {t(labelKey)}
        </label>
      )}
      
      <select
        {...props}
        className={`w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${className}`}
      >
        <option value="" disabled>
          {t(placeholderKey)}
        </option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-950 text-white">
            {opt.labelKey ? t(opt.labelKey) : opt.label}
          </option>
        ))}
        {enableOther && (
          <option value="other" className="bg-zinc-950 text-amber-500 font-bold">
            {t("actions.other")}
          </option>
        )}
      </select>

      {/* Conditionally render dynamic specify input field when 'other' is selected */}
      {enableOther && isOtherSelected && (
        <div className="mt-3 animate-fadeIn">
          <TranslatedInput
            type="text"
            required
            value={otherValue}
            onChange={(e) => onOtherChange?.(e.target.value)}
            placeholderKey={otherPlaceholderKey}
          />
        </div>
      )}
    </div>
  );
}