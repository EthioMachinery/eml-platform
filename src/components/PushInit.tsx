"use client";

import { useEffect } from "react";

export default function PushInit() {
  useEffect(() => {
    const init = async () => {
      if (typeof window === "undefined") return;

      const OneSignal =
        (window as any).OneSignal ||
        [];

      (window as any).OneSignal =
        OneSignal;

      OneSignal.push(async function () {
        await OneSignal.init({
          appId:
            "02a74938-f353-4519-b3f9-32653918eeb6",
          allowLocalhostAsSecureOrigin: true,
        });
      });
    };

    init();
  }, []);

  return null;
}