"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function PostMachinery() {
  const router = useRouter();

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

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleSubmit = async () => {
    if (!title || !type || !model || !location || !price || !contact) {
      setMessage("Please fill all required fields");
      return;
    }

    setLoading(true);
    setMessage("Submitting...");

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    if (!user) {
      setMessage("User not authenticated");
      setLoading(false);
      return;
    }

    let imageUrls: string[] = [];

    // 🔥 Upload Images
    for (let img of images) {
      const fileExt = img.name.split(".").pop();
      const fileName = `${user.id}-${Date.now()}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("machinery-images")
        .upload(fileName, img, {
          contentType: img.type,
        });

      if (uploadError) {
        console.error(uploadError);
        setMessage("Image upload failed");
        setLoading(false);
        return;
      }

      const { data } = supabase.storage
        .from("machinery-images")
        .getPublicUrl(fileName);

      imageUrls.push(data.publicUrl);
    }

    const primaryImage = imageUrls.length > 0 ? imageUrls[0] : "";

    // 🔥 INSERT MACHINERY
    const { data: insertedMachine, error } = await supabase
      .from("machinery")
      .insert([
        {
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
          image_url: primaryImage,
          image_urls: imageUrls,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      setMessage("Error posting machinery");
      setLoading(false);
      return;
    }

    // 🔥 AUTOMATIC MATCH ALERT ENGINE
    const { data: requests } = await supabase
      .from("machine_requests")
      .select("*");

    if (requests) {
      for (const req of requests) {

        const typeMatch =
          insertedMachine.type?.toLowerCase().includes(
            req.machine_type?.toLowerCase()
          );

        const locationMatch =
          insertedMachine.location?.toLowerCase().includes(
            req.location?.toLowerCase()
          );

        const operatorMatch =
          req.operator_required === null ||
          req.operator_required === insertedMachine.operator_included;

        const budgetMatch =
          !req.budget ||
          parseFloat(insertedMachine.price) <= parseFloat(req.budget);

        if (typeMatch && locationMatch && operatorMatch && budgetMatch) {

          await supabase.from("notifications").insert([
            {
              user_id: req.user_id,
              title: "New Machine Match Found",
              message: `${insertedMachine.title} matches your request for ${req.machine_type}`,
              link: `/machinery/${insertedMachine.id}`,
            },
          ]);
        }
      }
    }

    setMessage("Machinery posted successfully!");

    setTitle("");
    setType("");
    setModel("");
    setLocation("");
    setPrice("");
    setContact("");
    setCondition("");
    setYear("");
    setOperatorIncluded(false);
    setImages([]);
    setImagePreviews([]);

    setTimeout(() => router.push("/dashboard"), 1200);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-6">

      <h1 className="text-3xl text-yellow-400 mb-6">
        Post Machinery
      </h1>

      <div className="w-full max-w-sm">

        <input
          placeholder="Title"
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black"
        />

        <input
          placeholder="Type"
          value={type}
          onChange={(e)=>setType(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black"
        />

        <input
          placeholder="Model"
          value={model}
          onChange={(e)=>setModel(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black"
        />

        <input
          placeholder="Location"
          value={location}
          onChange={(e)=>setLocation(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black"
        />

        <input
          placeholder="Price"
          value={price}
          onChange={(e)=>setPrice(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black"
        />

        <input
          placeholder="Contact"
          value={contact}
          onChange={(e)=>setContact(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black"
        />

        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setImages(files);

            const previews = files.map((file) =>
              URL.createObjectURL(file)
            );

            setImagePreviews(previews);
          }}
          className="w-full p-3 mb-3 bg-white text-black rounded"
        />

        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {imagePreviews.map((src, index) => (
              <img
                key={index}
                src={src}
                className="h-24 w-full object-cover rounded"
              />
            ))}
          </div>
        )}

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

        <input
          placeholder="Condition"
          value={condition}
          onChange={(e)=>setCondition(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black"
        />

        <input
          placeholder="Year"
          value={year}
          onChange={(e)=>setYear(e.target.value)}
          className="w-full p-3 mb-3 rounded bg-white text-black"
        />

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
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full py-3 rounded ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-yellow-500 text-black"
          }`}
        >
          {loading ? "Posting..." : "Submit"}
        </button>

        {message && <p className="mt-4 text-center">{message}</p>}

      </div>

    </main>
  );
}