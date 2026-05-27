"use client";

import {
  Loader2,
} from "lucide-react";

import React from "react";

type EnterpriseButtonProps = {
  children: React.ReactNode;

  onClick?: () => void;

  type?:
    | "button"
    | "submit"
    | "reset";

  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "ai"
    | "ghost";

  size?:
    | "sm"
    | "md"
    | "lg";

  loading?: boolean;

  disabled?: boolean;

  fullWidth?: boolean;

  icon?: React.ReactNode;

  className?: string;
};

export default function EnterpriseButton({
  children,

  onClick,

  type = "button",

  variant = "primary",

  size = "md",

  loading = false,

  disabled = false,

  fullWidth = false,

  icon,

  className = "",
}: EnterpriseButtonProps) {
  const variants: any = {
    primary:
      "bg-yellow-500 hover:bg-yellow-400 text-black shadow-lg shadow-yellow-500/20",

    secondary:
      "bg-zinc-900 border border-zinc-800 hover:border-yellow-500 text-white",

    danger:
      "bg-red-500 hover:bg-red-400 text-white shadow-lg shadow-red-500/20",

    success:
      "bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-500/20",

    ai:
      "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/20",

    ghost:
      "bg-transparent hover:bg-zinc-900 text-zinc-300 border border-zinc-800",
  };

  const sizes: any = {
    sm:
      "h-10 px-4 text-sm rounded-xl",

    md:
      "h-12 px-6 text-base rounded-2xl",

    lg:
      "h-14 px-8 text-lg rounded-2xl",
  };

  return (
    <button
      type={type}

      onClick={onClick}

      disabled={
        disabled || loading
      }

      className={`
        inline-flex
        items-center
        justify-center
        gap-3
        font-black
        transition-all
        duration-300
        active:scale-[0.98]
        disabled:opacity-50
        disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${
          fullWidth
            ? "w-full"
            : ""
        }
        ${className}
      `}
    >

      {/* LOADING */}

      {loading ? (
        <Loader2
          size={20}
          className="animate-spin"
        />
      ) : (
        icon
      )}

      {/* LABEL */}

      <span>

        {children}

      </span>

    </button>
  );
}