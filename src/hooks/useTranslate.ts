"use client";

import {
  useEnterpriseTranslation,
} from "@/hooks/useEnterpriseTranslation";

export function useTranslate() {
  return useEnterpriseTranslation();
}