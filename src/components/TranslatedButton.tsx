"use client";

import React from "react";
import { useTranslate } from "@/hooks/useTranslate";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  translationKey?: string;
  variant?: "primary" | "secondary" | "danger" | "outline";
};

export default function TranslatedButton({
  translationKey,
  variant = "primary",
  className = "",
  children,
  ...props
}: Props) {
  const { t } = useTranslate();

  const variants = {
    primary: "bg-yellow-500 hover:bg-yellow-400 text-black",
    secondary: "bg-zinc-800 hover:bg-zinc-700 text-white",
    danger: "bg-red-600 hover:bg-red-500 text-white",
    outline: "border border-yellow-500 text-yellow-400 hover:bg-yellow-500/10",
  };

  return (
    <button
      {...props}
      className={`
        px-6 py-4 rounded-2xl font-black transition duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${className}
      `}
    >
      {translationKey ? t(translationKey as any) : children}
    </button>
  );
}