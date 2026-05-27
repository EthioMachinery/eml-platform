"use client";

import React from "react";

type Props = {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
};

export default function EnterpriseModal({
  open,
  title,
  children,
  onClose,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="
        fixed
        inset-0
        z-50
        flex
        items-center
        justify-center
        bg-black/70
        backdrop-blur-sm
      "
    >

      <div
        className="
          w-full
          max-w-2xl
          rounded-[36px]
          border
          border-zinc-800
          bg-zinc-900
          p-8
        "
      >

        <div className="flex items-center justify-between mb-8">

          <h2 className="text-3xl font-black">
            {title}
          </h2>

          <button
            onClick={onClose}
            className="
              w-12
              h-12
              rounded-2xl
              bg-zinc-800
              hover:bg-zinc-700
              transition
            "
          >
            ✕
          </button>

        </div>

        {children}

      </div>

    </div>
  );
}