"use client";

import {
  useEnterpriseTranslation,
} from "@/hooks/useEnterpriseTranslation";

export function useI18n() {
  return useEnterpriseTranslation();
}