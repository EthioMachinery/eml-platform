"use client";

import React, { useState, useEffect } from "react";
import { useTranslate } from "@/hooks/useTranslate";

export default function PushNotificationEngine() {
  const { t } = useTranslate();
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      
      // Verify if service worker active subscription exists
      navigator.serviceWorker.ready.then((reg) => {
        reg.pushManager.getSubscription().then((sub) => {
          setIsSubscribed(!!sub);
        });
      });
    }
  }, []);

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return;
    
    setLoading(true);
    const result = await Notification.requestPermission();
    setPermission(result);

    if (result === "granted") {
      try {
        const reg = await navigator.serviceWorker.ready;
        // Generate mock or dynamic push subscription options
        const sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: "MOCK_VAPID_PUBLIC_KEY_BASE64_CONVERTED"
        });
        
        console.log("Registered PWA Push Subscription:", sub);
        setIsSubscribed(true);
      } catch (err) {
        console.error("Failed to register push subscription:", err);
      }
    }
    setLoading(false);
  };

  if (permission === "denied") return null;

  return (
    <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 max-w-md mx-auto space-y-4" id="eml-push-engine">
      <div className="flex items-start gap-4">
        <div className="text-2xl">🔔</div>
        <div className="space-y-1">
          <h4 className="text-sm font-black text-white">
            Ecosystem Radar Notifications
          </h4>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Get instant mobile alerts as soon as new heavy machinery bids, certified operator jobs, or logistics transport contracts open in your region [1].
          </p>
        </div>
      </div>

      <div className="pt-2">
        {isSubscribed ? (
          <div className="p-2.5 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-center text-xs font-bold uppercase tracking-wider">
            ✓ Notifications Enabled
          </div>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={requestNotificationPermission}
            className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all disabled:opacity-50"
          >
            {loading ? "Registering..." : "Enable Mobile Alerts"}
          </button>
        )}
      </div>
    </div>
  );
}