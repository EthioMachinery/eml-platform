"use client";

import { useEffect, useState } from "react";
import { liveEventBus } from "@/core/liveEventBus";
import { supabase } from "@/lib/supabaseClient";
import { TMActivityEvent } from "@/core/eventTypes";

export function useLiveEvents() {
  const [events, setEvents] = useState<TMActivityEvent[]>([]);

  useEffect(() => {
    let mounted = true;

    // -------------------------
    // 1. LOAD INITIAL EVENTS
    // -------------------------
    const loadInitial = async () => {
      const { data } = await supabase
        .from("tm_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);

      if (!mounted || !data) return;

      const formatted = data.map((d) => ({
        id: d.id,
        type: d.type,
        title: d.title,
        description: d.description,
        userId: d.user_id,
        entityId: d.entity_id,
        timestamp: d.created_at,
        metadata: d.metadata,
      }));

      setEvents(formatted);
    };

    loadInitial();

    // -------------------------
    // 2. LOCAL LIVE BUS (FAST UI)
    // -------------------------
    const unsubscribe = liveEventBus.subscribe((event) => {
      setEvents((prev) => {
        // prevent duplicates
        if (prev.some((e) => e.id === event.id)) return prev;

        return [event, ...prev].slice(0, 50);
      });
    });

    // -------------------------
    // 3. SUPABASE REAL-TIME SYNC
    // -------------------------
    const channel = supabase
      .channel("eml_events_live")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "tm_events" },
        (payload) => {
          const d = payload.new;

          const event: TMActivityEvent = {
            id: d.id,
            type: d.type,
            title: d.title,
            description: d.description,
            userId: d.user_id,
            entityId: d.entity_id,
            timestamp: d.created_at,
            metadata: d.metadata,
          };

          setEvents((prev) => {
            if (prev.some((e) => e.id === event.id)) return prev;
            return [event, ...prev].slice(0, 50);
          });
        }
      )
      .subscribe();

    // -------------------------
    // CLEANUP
    // -------------------------
    return () => {
      mounted = false;
      unsubscribe();
      supabase.removeChannel(channel);
    };
  }, []);

  return events;
}