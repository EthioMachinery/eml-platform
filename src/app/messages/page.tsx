"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Bot,
  CheckCheck,
  Circle,
  MessageCircle,
  Phone,
  Search,
  Send,
  User,
  Wrench,
} from "lucide-react";

import { supabase } from "@/lib/supabaseClient";

type Conversation = {
  id: string;
  user: any;
  machinery: any;
  lastMessage: string;
  lastTime: string;
  unread: boolean;
  messages: any[];
};

export default function MessagesPage() {
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    loadMessages();
  }, []);

  async function loadMessages() {
    setLoading(true);

    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: inquiries } = await supabase
        .from("inquiries")
        .select("*")
        .or(`sender_id.eq.${user.id},owner_id.eq.${user.id}`)
        .order("created_at", { ascending: false });

      const grouped = new Map();

      for (const msg of inquiries || []) {
        const otherUser = msg.sender_id === user.id ? msg.owner_id : msg.sender_id;
        const key = `${otherUser}_${msg.machinery_id}`;

        if (!grouped.has(key)) {
          grouped.set(key, { messages: [] });
        }

        grouped.get(key).messages.push(msg);
      }

      const finalData = await Promise.all(
        Array.from(grouped.entries()).map(async ([key, value]: any) => {
          const latest = value.messages[0];
          const otherUserId = latest.sender_id === user.id ? latest.owner_id : latest.sender_id;

          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", otherUserId)
            .single();

          const { data: machinery } = await supabase
            .from("listings")
            .select("*")
            .eq("id", latest.machinery_id)
            .single();

          return {
            id: key,
            user: profile,
            machinery,
            lastMessage: latest.message,
            lastTime: latest.created_at,
            unread: false,
            messages: value.messages.reverse(),
          };
        })
      );

      setConversations(finalData);

      if (finalData.length > 0) {
        setSelectedConversation(finalData[0]);
      }
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  async function sendMessage() {
    if (!newMessage.trim() || !selectedConversation) return;

    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;
    if (!user) return;

    const otherUserId =
      selectedConversation.messages[0].sender_id === user.id
        ? selectedConversation.messages[0].owner_id
        : selectedConversation.messages[0].sender_id;

    const { error } = await supabase.from("inquiries").insert([
      {
        sender_id: user.id,
        owner_id: otherUserId,
        machinery_id: selectedConversation.machinery?.id,
        message: newMessage,
      },
    ]);

    if (!error) {
      setNewMessage("");
      loadMessages();
    }
  }

  const filtered = useMemo(() => {
    return conversations.filter((c) => {
      const keyword = `${c.user?.full_name} ${c.machinery?.title} ${c.lastMessage}`.toLowerCase();
      return keyword.includes(search.toLowerCase());
    });
  }, [search, conversations]);

  return (
    <main className="h-screen bg-black text-white overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-[420px_1fr] h-full">

        <aside className="border-r border-zinc-800 bg-zinc-950 flex flex-col">
          <div className="p-6 border-b border-zinc-800">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center">
                <MessageCircle className="text-cyan-400" size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black">Messages</h1>
                <p className="text-zinc-400">EML Enterprise Communication</p>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-4 top-4 text-zinc-500" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search conversations..."
                className="w-full bg-black border border-zinc-800 rounded-2xl py-4 pl-12 pr-4 outline-none"
              />
            </div>
          </div>

          <div className="px-6 pt-6">
            <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-3xl p-5">
              <div className="flex items-center gap-3 text-cyan-400 font-black mb-4">
                <Bot size={20} />
                AI REPLY ASSISTANT
              </div>
              <p className="text-zinc-300 text-sm leading-7">
                AI helps you negotiate faster, close more deals, and manage machinery buyers intelligently.
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-5 space-y-4">
            {loading ? (
              <div className="text-zinc-500 text-center font-bold px-2">Loading conversations...</div>
            ) : filtered.length === 0 ? (
              <div className="text-zinc-500 text-center px-2">No conversations yet.</div>
            ) : (
              filtered.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => setSelectedConversation(conversation)}
                  className={`w-full text-left rounded-3xl p-5 border transition ${
                    selectedConversation?.id === conversation.id
                      ? "bg-cyan-500/10 border-cyan-500/30"
                      : "bg-zinc-900 border-zinc-800 hover:border-zinc-700"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
                        <User className="text-cyan-400" />
                      </div>
                      <Circle
                        size={12}
                        className={`absolute bottom-0 right-0 ${
                          conversation.unread ? "fill-green-400 text-green-400" : "fill-zinc-600 text-zinc-600"
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <div className="font-black truncate">{conversation.user?.full_name || "User"}</div>
                        <div className="text-xs text-zinc-500">
                          {new Date(conversation.lastTime).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 mt-2 text-yellow-400 text-sm">
                        <Wrench size={15} />
                        <span className="truncate">{conversation.machinery?.title}</span>
                      </div>

                      <div className="mt-3 text-zinc-400 text-sm truncate">{conversation.lastMessage}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </aside>

        <section className="flex flex-col h-full">
          {!selectedConversation ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <MessageCircle size={80} className="mx-auto text-zinc-700 mb-6" />
                <h2 className="text-4xl font-black mb-4">No Conversation Selected</h2>
                <p className="text-zinc-400 text-lg">Select a conversation to start messaging.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="border-b border-zinc-800 px-8 py-6 bg-zinc-950">
                <div className="flex items-center justify-between gap-6">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 flex items-center justify-center">
                      <User className="text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-black">{selectedConversation.user?.full_name || "User"}</div>
                      <div className="flex items-center gap-3 mt-2 text-zinc-400">
                        <Wrench size={16} />
                        {selectedConversation.machinery?.title}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="w-14 h-14 rounded-2xl bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center transition">
                      <Phone className="text-green-400" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-8 py-8 space-y-6">
                {selectedConversation.messages.map((message: any, idx: number) => {
                  const isMine = selectedConversation.messages[0].owner_id === message.sender_id;

                  return (
                    <div key={idx} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[70%] rounded-[30px] px-6 py-5 ${
                          isMine ? "bg-cyan-500 text-black" : "bg-zinc-900 border border-zinc-800 text-white"
                        }`}
                      >
                        <div className="leading-8 text-lg">{message.message}</div>
                        <div
                          className={`flex items-center gap-2 mt-4 text-sm ${
                            isMine ? "text-black/70" : "text-zinc-500"
                          }`}
                        >
                          <CheckCheck size={15} />
                          {new Date(message.created_at).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-zinc-800 p-6 bg-zinc-950">
                <div className="flex items-center gap-4">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows={2}
                    placeholder="Type your message..."
                    className="flex-1 bg-black border border-zinc-800 rounded-3xl px-6 py-5 outline-none resize-none"
                  />
                  <button
                    onClick={sendMessage}
                    className="w-20 h-20 rounded-3xl bg-cyan-500 hover:bg-cyan-400 flex items-center justify-center transition"
                  >
                    <Send className="text-black" />
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}