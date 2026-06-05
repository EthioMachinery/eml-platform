"use client";

import {
  useEffect,
  useState,
} from "react";

import { useLanguage } from "@/context/LanguageContext";
import { translations } from "@/lib/i18n";

type NotificationItem = {
  id: string;
  title: string;
  title_am?: string;
  message: string;
  message_am?: string;
  type: string;
  created_at?: string;
  read?: boolean;
  action_url?: string;
};

export default function TranslationDebugger() {
  const { language } = useLanguage();

  const [missing, setMissing] = useState<string[]>([]);

  useEffect(() => {
    const issues: string[] = [];

    function scan(
      obj: any,
      path = ""
    ) {
      // Guard check to prevent "Cannot convert undefined or null to object" runtime error
      if (!obj || typeof obj !== "object") {
        return;
      }

      Object.entries(obj).forEach(
        ([key, value]) => {
          const current =
            path
              ? `${path}.${key}`
              : key;

          if (
            typeof value ===
              "string" &&
            value.trim() === ""
          ) {
            issues.push(
              current
            );
          }

          if (
            typeof value ===
              "object" &&
            value !== null
          ) {
            scan(
              value,
              current
            );
          }
        }
      );
    }

    // Scan only the dictionary of the active selected language
    scan(translations[language]);

    setMissing(issues);
  }, [language]);

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
        bottom-4
        right-4
        z-[9999]
        w-[350px]
        max-h-[400px]
        overflow-auto
        rounded-2xl
        border
        border-red-500/30
        bg-black/95
        p-4
        text-xs
        text-white
        shadow-2xl
      "
    >
      <div className="mb-3 font-black text-red-400">
        Translation Debugger
      </div>

      <div className="mb-3 text-zinc-400">
        Active Language:
        {" "}
        <span className="text-yellow-400">
          {language}
        </span>
      </div>

      {missing.length === 0 ? (
        <div className="text-green-400">
          No missing translations
        </div>
      ) : (
        <div className="space-y-2">
          {missing.map(
            (
              item,
              index
            ) => (
              <div
                key={index}
                className="
                  rounded-lg
                  bg-red-500/10
                  p-2
                  text-red-300
                "
              >
                {item}
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}