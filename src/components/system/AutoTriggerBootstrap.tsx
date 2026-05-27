"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AutoTrigger } from "@/core/autoTrigger";

export default function AutoTriggerBootstrap() {
  useEffect(() => {
    const channel = supabase
      .channel("auto-trigger-live")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "deals",
        },
        async (payload) => {
          await AutoTrigger.handleRealtimeInsert(
            payload
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}