"use client";

import { useEffect, useState, useRef } from "react";
import { getUser } from "@/config";
import { api, buildQueryParams } from "@/lib/api-client";

const quickReplies = ["Thank you!", "I will check it", "Understood", "Great, thanks"];

export default function StaffChatPage() {
  const [contacts, setContacts] = useState([]);
  const [activeContact, setActiveContact] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [search, setSearch] = useState("");
  const [myId, setMyId] = useState(null);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const pollRef = useRef(null);

  // Fetch contacts
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const u = getUser();
        console.log("Chat user:", u?.id, u?.employee_id, u?.email);
        setMyId(u.employee_id);
        const params = await buildQueryParams({});
        const { data } = await api.get("/chat/contacts", { params: { ...params, user_id: u.id || u.employee_id } });
        setContacts(data?.data || []);
      } catch (e) {
        console.warn("Contacts error", e);
      } finally {
        setLoading(false);
      }
    };
    fetchContacts();
  }, []);

  // Fetch messages when contact selected
  useEffect(() => {
    if (!activeContact) return;

    const u = getUser();
    const fetchMessages = async () => {
      try {
        const { data } = await api.get(`/chat/messages/${activeContact.id}`, { params: { user_id: u.id } });
        setMessages((data?.data || []).reverse());
        scrollToBottom();
      } catch (e) {
        console.warn("Messages error", e);
      }
    };

    fetchMessages();

    // Poll for new messages every 3 seconds
    pollRef.current = setInterval(fetchMessages, 3000);
    return () => clearInterval(pollRef.current);
  }, [activeContact]);

  const scrollToBottom = () => {
    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeContact) return;

    try {
      const u = getUser();
      const params = await buildQueryParams({});
      await api.post("/chat/send", {
        ...params,
        user_id: u.id,
        receiver_id: activeContact.id,
        message: newMessage.trim(),
      });
      setNewMessage("");

      // Refresh messages
      const { data } = await api.get(`/chat/messages/${activeContact.id}`, { params: { user_id: u.id } });
      setMessages((data?.data || []).reverse());
      scrollToBottom();

      // Refresh contacts to update last message
      const contactsRes = await api.get("/chat/contacts", { params: { ...params, user_id: u.id } });
      setContacts(contactsRes.data?.data || []);
    } catch (e) {
      console.warn("Send error", e);
    }
  };

  const handleQuickReply = (reply) => {
    setNewMessage(reply);
  };

  const filteredContacts = contacts.filter((c) => {
    const name = `${c.first_name} ${c.last_name}`.toLowerCase();
    return name.includes(search.toLowerCase());
  });

  const getInitials = (c) => ((c.first_name || "?")[0] + (c.last_name || "")[0]).toUpperCase();

  if (loading) {
    return <div className="h-screen flex items-center justify-center"><div className="text-slate-400 text-sm">Loading chat...</div></div>;
  }

  return (
    <div className="h-screen overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#081223]/40">
        <main className="flex min-h-0 flex-1 flex-col xl:flex-row">
          {/* Contacts Sidebar */}
          <section className="flex w-full min-h-0 flex-col border-b border-cyan-300/10 bg-slate-950/20 xl:w-96 xl:border-b-0 xl:border-r">
            <div className="p-6">
              <h2 className="mb-6 font-headline text-2xl font-bold text-slate-100">Messages</h2>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                <input
                  className="w-full rounded-xl bg-slate-800/60 py-3 pl-12 pr-4 text-sm text-slate-100 outline-none focus:ring-1 focus:ring-cyan-300/50"
                  placeholder="Search conversations"
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <div className="space-y-1">
                {filteredContacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => setActiveContact(c)}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl p-3 transition ${
                      activeContact?.id === c.id
                        ? "staff-glass-card border border-cyan-300/20 shadow-[0_0_15px_rgba(129,236,255,0.2)]"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="relative">
                      {c.profile_picture ? (
                        <div className="h-12 w-12 rounded-xl overflow-hidden border border-white/10">
                          <img
                            src={typeof c.profile_picture === "string" && c.profile_picture.startsWith("http") ? c.profile_picture : `https://backend.mytime2cloud.com/media/employee/profile_picture/${c.profile_picture}`}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-sm font-bold text-white">
                          {getInitials(c)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className={`truncate font-headline text-sm ${activeContact?.id === c.id ? "font-semibold text-cyan-300" : "font-medium text-slate-100"}`}>
                          {c.first_name} {c.last_name}
                        </h4>
                        <span className={`text-[10px] ${activeContact?.id === c.id ? "text-cyan-300/70" : "text-slate-500"}`}>
                          {c.last_message_time || ""}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="truncate text-xs text-slate-500">{c.last_message || c.branch?.branch_name || "Start a conversation"}</p>
                        {c.unread_count > 0 && (
                          <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-300 text-[9px] font-bold text-[#005b51]">
                            {c.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                {filteredContacts.length === 0 && (
                  <div className="text-center text-slate-500 text-xs py-8">No contacts found</div>
                )}
              </div>
            </div>
          </section>

          {/* Chat Area */}
          <section className="flex min-h-0 flex-1 flex-col bg-slate-950/10">
            {activeContact ? (
              <>
                {/* Chat Header */}
                <header className="flex h-20 items-center justify-between border-b border-cyan-300/10 bg-[#070e1b]/40 px-4 backdrop-blur-md sm:px-8">
                  <div className="flex items-center gap-4">
                    {activeContact.profile_picture ? (
                      <div className="h-10 w-10 rounded-xl overflow-hidden border border-cyan-300/30">
                        <img
                          src={typeof activeContact.profile_picture === "string" && activeContact.profile_picture.startsWith("http") ? activeContact.profile_picture : `https://backend.mytime2cloud.com/media/employee/profile_picture/${activeContact.profile_picture}`}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-sm font-bold text-cyan-300">
                        {getInitials(activeContact)}
                      </div>
                    )}
                    <div>
                      <h3 className="font-headline text-base font-bold text-slate-100">{activeContact.first_name} {activeContact.last_name}</h3>
                      <p className="text-[11px] text-slate-400">
                        {activeContact.branch?.branch_name || ""} {activeContact.department?.name ? `/ ${activeContact.department.name}` : ""}
                      </p>
                    </div>
                  </div>
                </header>

                {/* Messages */}
                <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
                  {messages.length === 0 && (
                    <div className="text-center text-slate-500 text-xs py-20">No messages yet. Start the conversation!</div>
                  )}
                  {messages.map((msg, i) => {
                    const isMine = msg.sender_id === myId;
                    return (
                      <div key={msg.id || i} className={`flex ${isMine ? "justify-end" : "items-start gap-3"}`}>
                        {!isMine && (
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-slate-800 text-[10px] font-bold text-white">
                            {getInitials(activeContact)}
                          </div>
                        )}
                        <div className={`max-w-[85%] space-y-1 sm:max-w-[70%]`}>
                          <div className={`rounded-2xl p-3 ${
                            isMine
                              ? "rounded-tr-none border border-cyan-300/20 bg-cyan-300/10"
                              : "rounded-tl-none border border-white/10 bg-slate-800/70"
                          }`}>
                            <p className="text-sm leading-relaxed text-slate-100">{msg.message}</p>
                          </div>
                          <p className={`text-[10px] text-slate-500 ${isMine ? "text-right" : ""}`}>
                            {msg.created_at ? new Date(msg.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <footer className="border-t border-cyan-300/10 bg-slate-950/25 p-4 backdrop-blur-xl sm:p-6">
                  <div className="mb-3 flex flex-wrap gap-2">
                    {quickReplies.map((reply) => (
                      <button
                        key={reply}
                        onClick={() => handleQuickReply(reply)}
                        className="rounded-full border border-white/10 bg-slate-800/70 px-4 py-1.5 text-xs text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <input
                        className="w-full rounded-2xl bg-slate-800/80 py-4 pl-5 pr-16 text-sm text-slate-100 shadow-inner outline-none focus:ring-1 focus:ring-cyan-300/50"
                        placeholder="Type your message here..."
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                      />
                    </div>
                    <button
                      onClick={handleSend}
                      className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-cyan-400 text-[#005762] shadow-[0_0_20px_rgba(129,236,255,0.3)] transition active:scale-95"
                    >
                      <span className="material-symbols-outlined">send</span>
                    </button>
                  </div>
                </footer>
              </>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center text-slate-500">
                <span className="material-symbols-outlined text-6xl mb-4 text-slate-600">chat</span>
                <p className="text-sm">Select a conversation to start messaging</p>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
