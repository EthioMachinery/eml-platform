"use client";

import {
  useState,
} from "react";

import {
  Eye,
  EyeOff,
} from "lucide-react";

import {
  useLanguage,
} from "@/context/LanguageContext";

type EnterpriseInputProps = {
  label: string;

  placeholder?: string;

  value: string;

  onChange: (
    value: string
  ) => void;

  type?: string;

  required?: boolean;

  disabled?: boolean;

  error?: string;

  multiline?: boolean;

  rows?: number;
};

export default function EnterpriseInput({
  label,

  placeholder,

  value,

  onChange,

  type = "text",

  required = false,

  disabled = false,

  error,

  multiline = false,

  rows = 5,
}: EnterpriseInputProps) {
  const {
    language,
  } = useLanguage();

  const [showPassword, setShowPassword] =
    useState(false);

  const actualType =
    type === "password"
      ? showPassword
        ? "text"
        : "password"
      : type;

  return (
    <div className="space-y-3">

      {/* LABEL */}

      <label className="block text-sm font-black text-zinc-300">

        {label}

        {required && (
          <span className="text-red-400 ml-1">
            *
          </span>
        )}

      </label>

      {/* INPUT AREA */}

      <div className="relative">

        {multiline ? (

          <textarea
            rows={rows}

            value={value}

            disabled={disabled}

            onChange={(e) =>
              onChange(
                e.target.value
              )
            }

            placeholder={
              placeholder
            }

            className={`w-full bg-zinc-900 border rounded-2xl px-5 py-4 outline-none transition resize-none text-white ${
              error
                ? "border-red-500"
                : "border-zinc-800 focus:border-yellow-500"
            } ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          />

        ) : (

          <input
            type={actualType}

            value={value}

            disabled={disabled}

            onChange={(e) =>
              onChange(
                e.target.value
              )
            }

            placeholder={
              placeholder
            }

            className={`w-full bg-zinc-900 border rounded-2xl px-5 py-4 outline-none transition text-white ${
              type ===
              "password"
                ? "pr-14"
                : ""
            } ${
              error
                ? "border-red-500"
                : "border-zinc-800 focus:border-yellow-500"
            } ${
              disabled
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          />

        )}

        {/* PASSWORD TOGGLE */}

        {type ===
          "password" && (

          <button
            type="button"

            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }

            className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition"
          >

            {showPassword ? (
              <EyeOff
                size={20}
              />
            ) : (
              <Eye size={20} />
            )}

          </button>

        )}

      </div>

      {/* ERROR */}

      {error && (

        <div className="text-red-400 text-sm font-semibold">

          {error}

        </div>

      )}

    </div>
  );
}