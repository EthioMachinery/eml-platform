"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Deal = {
  id: string;
  deal_type: string;
  price: number;
  commission: number;
  status: string;
  payment_status: string;
};

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();

  const dealId = params.required as string;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // ===============================
  // FETCH DEAL
  // ===============================
  useEffect(() => {
    fetchDeal();
  }, []);

  const fetchDeal = async () => {
    const { data, error } = await supabase
      .from("deals")
      .select("*")
      .eq("id", dealId)
      .single();

    if (error) {
      console.error("Error fetching deal:", error);
      return;
    }

    setDeal(data);
  };

  // ===============================
  // HANDLE PAYMENT UPLOAD
  // ===============================
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a payment proof file.");
      return;
    }

    if (!deal) return;

    setUploading(true);

    try {
      const filePath = `${dealId}/${Date.now()}-${file.name}`;

      // Upload file
      const { error: uploadError } = await supabase.storage
        .from("payment-proofs")
        .upload(filePath, file);

      if (uploadError) {
        console.error(uploadError);
        alert("Upload failed.");
        setUploading(false);
        return;
      }

      // Get public URL
      const { data: publicUrlData } = supabase.storage
        .from("payment-proofs")
        .getPublicUrl(filePath);

      const publicUrl = publicUrlData.publicUrl;

      // Update deal
      const { error: updateError } = await supabase
        .from("deals")
        .update({
          payment_status: "pending_verification",
          payment_proof_url: publicUrl,
        })
        .eq("id", dealId);

      if (updateError) {
        console.error(updateError);
        alert("Failed to update payment status.");
        setUploading(false);
        return;
      }

      alert("✅ Payment submitted. Waiting for admin verification.");

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Unexpected error occurred.");
    }

    setUploading(false);
  };

  // ===============================
  // LOADING STATE
  // ===============================
  if (!deal) {
    return <div className="p-6">Loading deal...</div>;
  }

  // ===============================
  // UI
  // ===============================
  return (
    <div className="p-6 max-w-2xl mx-auto">

      <h1 className="text-2xl font-bold mb-6">
        Complete Payment
      </h1>

      {/* DEAL DETAILS */}
      <div className="border p-4 rounded mb-6 bg-white text-black">
        <p><strong>Deal ID:</strong> {deal.id}</p>
        <p><strong>Type:</strong> {deal.deal_type}</p>
        <p><strong>Price:</strong> {deal.price} ETB</p>
        <p><strong>Commission:</strong> {deal.commission} ETB</p>
        <p><strong>Status:</strong> {deal.status}</p>
        <p><strong>Payment Status:</strong> {deal.payment_status}</p>
      </div>

      {/* PAYMENT METHODS */}
      <div className="space-y-4 mb-6">

        <div className="border p-4 rounded">
          <p className="font-bold">Telebirr</p>
          <p>Send payment to: <strong>+251943194099</strong></p>
        </div>

        <div className="border p-4 rounded">
          <p className="font-bold">Bank Transfer</p>
          <p>Bank: Commercial Bank of Ethiopia</p>
          <p>Account Name: EML</p>
          <p>Account Number: 1000XXXXXX</p>
        </div>

      </div>

      {/* UPLOAD SECTION */}
      <div className="border p-4 rounded">
        <p className="font-bold mb-2">
          Upload Payment Proof
        </p>

        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
          className="mb-4"
        />

        <button
          onClick={handleUpload}
          disabled={uploading}
          className="bg-yellow-400 text-black px-4 py-2 rounded font-bold w-full"
        >
          {uploading ? "Uploading..." : "Submit Payment"}
        </button>
      </div>

    </div>
  );
}