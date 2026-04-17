"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function MachineryDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [machine, setMachine] = useState<any>(null);

  useEffect(() => {
    fetchMachine();
  }, [id]);

  const fetchMachine = async () => {
    const { data, error } = await supabase
      .from("machinery")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setMachine(data);
  };

  if (!machine) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-2">{machine.name}</h1>
      <p className="text-gray-500 mb-4">{machine.description}</p>

      <div className="bg-white p-4 rounded shadow">
        <p><strong>Price:</strong> {machine.price} ETB</p>
        <p><strong>Status:</strong> {machine.status}</p>
      </div>
    </div>
  );
}