"use client";

import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function EnterpriseCard({
  children,
}: Props) {
  return (
    <div
      className="
        rounded-[32px]
        border
        border-zinc-800
        bg-zinc-900
        p-6
        transition
        hover:border-yellow-500/30
      "
    >
      {children}
    </div>
  );
}