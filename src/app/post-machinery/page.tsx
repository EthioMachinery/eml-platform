"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useLanguage } from "../../lib/LanguageContext";

export default function PostMachineryPage() {
  const { lang } = useLanguage();

  const [form, setForm] = useState({
    title: "",
    type: "",
    location: "",
    price: "",
    contact: "",
    image_url: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: any) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.from("machinery").insert([
      {
        title: form.title,
        type: form.type,
        location: form.location,
        price: form.price,
        price_value: parseFloat(form.price),
        contact: form.contact,
        image_url: form.image_url,
      },
    ]);

    if (error) {
      console.error(error);
      setMessage(lang === "am" ? "ስህተት ተፈጥሯል" : "Error occurred");
    } else {
      setMessage(
        lang === "am"
          ? "ማሽነሪ በተሳካ ሁኔታ ተመዝግቧል"
          : "Machinery posted successfully!"
      );

      setForm({
        title: "",
        type: "",
        location: "",
        price: "",
        contact: "",
        image_url: "",
      });
    }

    setLoading(false);
  }

  return (
    <div className="p-6 text-white max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">
        {lang === "am" ? "ማሽነሪ አስገባ" : "Post Machinery"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          placeholder={lang === "am" ? "ርዕስ" : "Title"}
          className="w-full p-2 bg-gray-800 rounded"
          value={form.title}
          onChange={handleChange}
          required
        />

        <input
          name="type"
          placeholder={lang === "am" ? "አይነት" : "Type"}
          className="w-full p-2 bg-gray-800 rounded"
          value={form.type}
          onChange={handleChange}
          required
        />

        <input
          name="location"
          placeholder={lang === "am" ? "አካባቢ" : "Location"}
          className="w-full p-2 bg-gray-800 rounded"
          value={form.location}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder={lang === "am" ? "ዋጋ" : "Price"}
          className="w-full p-2 bg-gray-800 rounded"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          name="contact"
          placeholder={lang === "am" ? "ኮንታክት" : "Contact"}
          className="w-full p-2 bg-gray-800 rounded"
          value={form.contact}
          onChange={handleChange}
        />

        <input
          name="image_url"
          placeholder={lang === "am" ? "የምስል URL" : "Image URL"}
          className="w-full p-2 bg-gray-800 rounded"
          value={form.image_url}
          onChange={handleChange}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-yellow-500 text-black p-2 rounded font-bold"
        >
          {loading
            ? lang === "am"
              ? "በመላክ ላይ..."
              : "Posting..."
            : lang === "am"
            ? "አስገባ"
            : "Submit"}
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-green-400">{message}</p>
      )}
    </div>
  );
}