"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter, useParams } from "next/navigation";

export default function EditMachinery() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [model, setModel] = useState("");
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("");
  const [contact, setContact] = useState("");
  const [availability, setAvailability] = useState("available");
  const [condition, setCondition] = useState("");
  const [year, setYear] = useState("");
  const [operatorIncluded, setOperatorIncluded] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // ✅ Load existing machine data
  useEffect(() => {
    const fetchMachine = async () => {
      const { data, error } = await supabase
        .from("machinery")
        .select("*")
        .eq("id", id)
        .single();

      if (data) {
        setTitle(data.title || "");
        setType(data.type || "");
        setModel(data.model || "");
        setLocation(data.location || "");
        setPrice(data.price || "");
        setContact(data.contact || "");
        setAvailability(data.availability || "available");
        setCondition(data.condition || "");
        setYear(data.year || "");
        setOperatorIncluded(data.operator_included || false);
        setImagePreview(data.image_url || null);
      }

      setLoading(false);
    };

    if (id) fetchMachine();
  }, [id]);

  const handleUpdate = async () => {
    setMessage("Updating...");

    let imageUrl = imagePreview || "";

    // ✅ Upload new image if selected
    if (image) {
      const fileExt = image.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("machinery-images")
        .upload(fileName, image, {
          contentType: image.type,
        });

      if (uploadError) {
        setMessage("Image upload failed");
        return;
      }

      const { data } = supabase.storage
        .from("machinery-images")
        .getPublicUrl(fileName);

      imageUrl = data.publicUrl;
    }

    const { error } = await supabase
      .from("machinery")
      .update({
        title,
        type,
        model,
        location,
        price,
        contact,
        availability,
        condition,
        year,
        operator_included: operatorIncluded,
        image_url: imageUrl,
      })
      .eq("id", id);

    if (error) {
      console.error(error);
      setMessage("Update failed");
    } else {
      setMessage("Updated successfully!");
      setTimeout(() => router.push("/my-machinery"), 1000);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">

      <h1 className="text-3xl text-yellow-400 mb-6">
        Edit Machinery
      </h1>

      <div className="w-full max-w-sm">

        <input value={title} onChange={(e)=>setTitle(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input value={type} onChange={(e)=>setType(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input value={model} onChange={(e)=>setModel(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input value={location} onChange={(e)=>setLocation(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input value={price} onChange={(e)=>setPrice(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input value={contact} onChange={(e)=>setContact(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black" />

        {/* IMAGE */}
        <input
          type="file"
          accept="image/*"
          onChange={(e)=>setImage(e.target.files?.[0] || null)}
          className="w-full p-3 mb-3 bg-white text-black rounded"
        />

        {imagePreview && (
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded mb-4"
          />
        )}

        {/* Availability */}
        <select
          value={availability}
          onChange={(e)=>setAvailability(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black"
        >
          <option value="available">Available</option>
          <option value="rented">Rented</option>
          <option value="sold">Sold</option>
          <option value="maintenance">Maintenance</option>
        </select>

        <input value={condition} onChange={(e)=>setCondition(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black" />

        <input value={year} onChange={(e)=>setYear(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black" />

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={operatorIncluded}
            onChange={()=>setOperatorIncluded(!operatorIncluded)}
            className="mr-2"
          />
          Operator Included
        </label>

        <button
          onClick={handleUpdate}
          className="w-full bg-yellow-500 text-black py-3 rounded"
        >
          Update
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}
      </div>

    </main>
  );
}