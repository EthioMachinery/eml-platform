"use client";

import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const [loading, setLoading] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const [form, setForm] = useState({
    full_name: "",
    company_name: "",
    phone: "",
    region: "",
    city: "",
    bio: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  async function fetchProfile() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setForm({
        full_name:
          data.full_name || "",
        company_name:
          data.company_name || "",
        phone: data.phone || "",
        region: data.region || "",
        city: data.city || "",
        bio: data.bio || "",
      });
    }
  }

  async function saveProfile(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        ...form,
      });

    if (error) {
      console.error(error);
      alert(error.message);
    } else {
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 3000);
    }

    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      <div className="max-w-3xl mx-auto">

        <h1 className="text-4xl font-bold mb-8">
          Seller Profile
        </h1>

        <form
          onSubmit={saveProfile}
          className="space-y-6 bg-zinc-900 border border-zinc-800 rounded-2xl p-8"
        >

          {/* FULL NAME */}

          <div>

            <label className="block mb-2 font-bold">
              Full Name
            </label>

            <input
              type="text"
              value={form.full_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  full_name:
                    e.target.value,
                })
              }
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700"
            />

          </div>

          {/* COMPANY */}

          <div>

            <label className="block mb-2 font-bold">
              Company Name
            </label>

            <input
              type="text"
              value={form.company_name}
              onChange={(e) =>
                setForm({
                  ...form,
                  company_name:
                    e.target.value,
                })
              }
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700"
            />

          </div>

          {/* PHONE */}

          <div>

            <label className="block mb-2 font-bold">
              Phone Number
            </label>

            <input
              type="text"
              value={form.phone}
              onChange={(e) =>
                setForm({
                  ...form,
                  phone:
                    e.target.value,
                })
              }
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700"
            />

          </div>

          {/* REGION */}

          <div>

            <label className="block mb-2 font-bold">
              Region
            </label>

            <input
              type="text"
              value={form.region}
              onChange={(e) =>
                setForm({
                  ...form,
                  region:
                    e.target.value,
                })
              }
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700"
            />

          </div>

          {/* CITY */}

          <div>

            <label className="block mb-2 font-bold">
              City
            </label>

            <input
              type="text"
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city:
                    e.target.value,
                })
              }
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700"
            />

          </div>

          {/* BIO */}

          <div>

            <label className="block mb-2 font-bold">
              Company / Seller Bio
            </label>

            <textarea
              rows={5}
              value={form.bio}
              onChange={(e) =>
                setForm({
                  ...form,
                  bio:
                    e.target.value,
                })
              }
              className="w-full p-4 rounded-xl bg-zinc-950 border border-zinc-700"
            />

          </div>

          {/* BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-4 rounded-xl transition"
          >
            {loading
              ? "Saving..."
              : "Save Profile"}
          </button>

          {/* SUCCESS */}

          {saved && (
            <div className="bg-green-600 text-white p-4 rounded-xl text-center font-bold">
              Profile Saved Successfully
            </div>
          )}

        </form>

      </div>

    </div>
  );
}