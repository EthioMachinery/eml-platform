"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { supabase }
  from "@/lib/supabase";

const AuthContext =
  createContext<any>(null);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {

    supabase.auth
      .getUser()
      .then(({ data }) => {
        setUser(data.user);
      });

    const {
      data: listener,
    } =
      supabase.auth.onAuthStateChange(
        (_, session) => {
          setUser(
            session?.user || null
          );
        }
      );

    return () => {
      listener.subscription.unsubscribe();
    };

  }, []);

  return (
    <AuthContext.Provider
      value={{ user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}