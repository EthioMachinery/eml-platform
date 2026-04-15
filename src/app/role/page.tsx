"use client";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function RoleSelection() {
  const router = useRouter();

  const handleRole = async (role: string) => {
    const { data } = await supabase.auth.getUser();

    if (!data.user) {
      router.push("/login");
      return;
    }

    // Save role to user metadata
    await supabase.auth.updateUser({
      data: { role },
    });

    router.push("/dashboard");
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">

      <h1 className="text-3xl text-yellow-400 mb-8">
        Select Your Role
      </h1>

      <div className="grid gap-4 w-full max-w-sm">

        <button onClick={() => handleRole("owner")} className="bg-yellow-500 text-black py-3 rounded">
          Machinery Owner
        </button>

        <button onClick={() => handleRole("renter")} className="bg-yellow-500 text-black py-3 rounded">
          Renter
        </button>

        <button onClick={() => handleRole("operator")} className="bg-yellow-500 text-black py-3 rounded">
          Operator
        </button>

        <button onClick={() => handleRole("service")} className="bg-yellow-500 text-black py-3 rounded">
          Service Provider
        </button>

      </div>
    </main>
  );
}