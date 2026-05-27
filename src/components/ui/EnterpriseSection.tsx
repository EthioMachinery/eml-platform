"use client";

import React from "react";

type Props = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

export default function EnterpriseSection({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <section className="space-y-6">

      <div>

        <h2 className="text-3xl font-black">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-3 text-zinc-400">
            {subtitle}
          </p>
        )}

      </div>

      {children}

    </section>
  );
}