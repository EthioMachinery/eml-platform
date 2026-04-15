"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useParams } from "next/navigation";

export default function ChatPage() {

  const { requestId } = useParams();

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [user, setUser] = useState<any>(null);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {

    const init = async () => {

      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData.user;
      setUser(currentUser);

      if (!currentUser) return;

      // 🔐 CHECK IF APPROVED
      const { data: req } = await supabase
        .from("contact_requests")
        .select("*")
        .eq("id", requestId)
        .single();

      if (req?.status === "approved") {
        setAllowed(true);
      }

      // 📥 FETCH MESSAGES
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("request_id", requestId)
        .order("created_at", { ascending: true });

      setMessages(data || []);
    };

    init();

  }, [requestId]);

  // 📡 REALTIME
  useEffect(() => {

    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `request_id=eq.${requestId}`
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [requestId]);

  const sendMessage = async () => {

    if (!newMessage.trim() || !user) return;

    await supabase.from("messages").insert([
      {
        request_id: requestId,
        sender_id: user.id,
        message: newMessage.trim()
      }
    ]);

    setNewMessage("");
  };

  if (!allowed) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-black text-white">
        <p>⛔ Chat not allowed. Await admin approval.</p>
      </main>
    );
  }

  return (

    <main className="min-h-screen bg-black text-white flex flex-col">

      <div className="flex-1 overflow-y-auto p-4 space-y-3">

        {messages.map((msg) => (

          <div
            key={msg.id}
            className={`p-3 rounded max-w-sm ${
              msg.sender_id === user?.id
                ? "bg-yellow-500 text-black ml-auto"
                : "bg-gray-800"
            }`}
          >
            {msg.message}
          </div>

        ))}

      </div>

      <div className="p-4 border-t border-gray-700 flex gap-2">

        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type message..."
          className="flex-1 p-3 rounded text-black"
        />

        <button
          onClick={sendMessage}
          className="bg-yellow-500 px-4 rounded text-black"
        >
          Send
        </button>

      </div>

    </main>
  );
}