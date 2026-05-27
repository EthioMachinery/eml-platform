"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
};

export default function EnterpriseButton({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled = false,
}: Props) {
  const variants = {
    primary:
      "bg-yellow-500 hover:bg-yellow-400 text-black",

    secondary:
      "bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700",

    danger:
      "bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/20",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`
        h-14
        px-6
        rounded-2xl
        font-black
        transition
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
      `}
    >
      {children}
    </button>
  );
}