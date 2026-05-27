"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const [allowed, setAllowed] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function check() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      const founderEmail =
        user?.email ===
        "machinerymatchmaker@gmail.com";

      const founderPhone =
        user?.phone ===
        "+251911404186";

      if (
        founderEmail ||
        founderPhone
      ) {
        setAllowed(true);
      }

      setLoading(false);
    }

    check();
  }, []);

  if (loading) {
    return (
      <div className="p-10 text-center">
        Checking access...
      </div>
    );
  }

  if (!allowed) {
    return (
      <div className="p-10 text-center">
        Access Denied
      </div>
    );
  }

  return <>{children}</>;
}