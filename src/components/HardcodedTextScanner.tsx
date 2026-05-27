"use client";

import {
  useEffect,
  useState,
} from "react";

export default function HardcodedTextScanner() {
  const [texts, setTexts] =
    useState<string[]>([]);

  useEffect(() => {
    if (
      process.env.NODE_ENV !==
      "development"
    ) {
      return;
    }

    const elements =
      document.querySelectorAll("*");

    const detected =
      new Set<string>();

    elements.forEach((el) => {
      const text =
        el.textContent?.trim();

      if (!text) return;

      if (
        text.length < 2
      )
        return;

      if (
        /^[A-Za-z0-9 ,.'":;!?()\-&/%]+$/.test(
          text
        )
      ) {
        detected.add(text);
      }
    });

    setTexts(
      Array.from(detected).slice(
        0,
        100
      )
    );
  }, []);

  if (
    process.env.NODE_ENV !==
    "development"
  ) {
    return null;
  }

  return (
    <div
      className="
        fixed
        top-4
        left-4
        z-[99999]
        w-[380px]
        max-h-[500px]
        overflow-auto
        rounded-2xl
        border
        border-yellow-500/30
        bg-black/95
        p-4
        shadow-2xl
      "
    >
      <div className="mb-4 text-yellow-400 font-black text-sm">

        Hardcoded Text Scanner

      </div>

      <div className="space-y-2">

        {texts.map(
          (
            text,
            index
          ) => (
            <div
              key={index}
              className="
                rounded-lg
                border
                border-zinc-800
                bg-zinc-900
                p-2
                text-xs
                text-zinc-300
              "
            >
              {text}
            </div>
          )
        )}

      </div>
    </div>
  );
}