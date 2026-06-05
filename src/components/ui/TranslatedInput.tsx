"use client";

import React, { InputHTMLAttributes } from 'react';
import { useTranslate, TranslationPath } from '@/hooks/useTranslate';

interface TranslatedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  placeholderKey: TranslationPath;
  labelKey?: TranslationPath;
}

export default function TranslatedInput({
  placeholderKey,
  labelKey,
  className = '',
  ...props
}: TranslatedInputProps) {
  const { t } = useTranslate();

  return (
    <div className="w-full">
      {labelKey && (
        <label className="block mb-1.5 text-xs font-bold text-zinc-400 uppercase tracking-wider">
          {t(labelKey)}
        </label>
      )}
      <input
        {...props}
        placeholder={t(placeholderKey)}
        className={`w-full px-4 py-2.5 rounded-lg border bg-zinc-950 text-white border-zinc-800 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-colors ${className}`}
      />
    </div>
  );
}