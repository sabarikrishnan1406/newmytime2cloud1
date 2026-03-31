const conversations = [
  {
    name: "HR Support",
    time: "12:45 PM",
    preview: "Yes, I can confirm those were...",
    icon: "support_agent",
    active: true,
    online: true,
    avatarClass: "bg-cyan-300/10 border-cyan-300/30 text-cyan-300",
  },
  {
    name: "Sarah Jenkins",
    time: "2:15 PM",
    preview: "The quarterly reports are ready for review.",
    initials: "SJ",
    online: true,
    avatarClass: "bg-slate-800 border-white/10 text-white",
  },
  {
    name: "System Admin",
    time: "Yesterday",
    preview: "Security update: password rotation required.",
    icon: "shield_person",
    online: false,
    avatarClass: "bg-purple-400/10 border-purple-300/20 text-purple-300",
  },
  {
    name: "Design Team",
    time: "Oct 12",
    preview: "Mia: New landing page mockup is up!",
    group: ["MK", "AL"],
  },
];

const quickReplies = ["Thank you!", "I will check it", "Understood", "Great, thanks"];

export default function StaffChatPage() {
  return (
    <div className="h-screen overflow-hidden p-4 sm:p-6 lg:p-8">
      <div className="flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/5 bg-[#081223]/40">
        <main className="flex min-h-0 flex-1 flex-col xl:flex-row">
          <section className="flex w-full min-h-0 flex-col border-b border-cyan-300/10 bg-slate-950/20 xl:w-96 xl:border-b-0 xl:border-r">
            <div className="p-6">
              <h2 className="mb-6 font-headline text-2xl font-bold text-slate-100">Messages</h2>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
                <input
                  className="w-full rounded-xl bg-slate-800/60 py-3 pl-12 pr-4 text-sm text-slate-100 outline-none focus:ring-1 focus:ring-cyan-300/50"
                  placeholder="Search conversations"
                  type="text"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 pb-4">
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.name}
                    className={`flex cursor-pointer items-center gap-4 rounded-2xl p-3 transition ${
                      conversation.active
                        ? "staff-glass-card border border-cyan-300/20 shadow-[0_0_15px_rgba(129,236,255,0.2)]"
                        : "hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="relative">
                      {conversation.group ? (
                        <div className="flex w-12 -space-x-4">
                          {conversation.group.map((member) => (
                            <div
                              key={member}
                              className="flex h-8 w-8 items-center justify-center rounded-lg border-2 border-[#070e1b] bg-slate-800 text-[10px] font-bold text-white"
                            >
                              {member}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          <div className={`flex h-12 w-12 items-center justify-center rounded-xl border ${conversation.avatarClass}`}>
                            {conversation.icon ? (
                              <span className="material-symbols-outlined text-2xl">{conversation.icon}</span>
                            ) : (
                              <span className="text-sm font-bold">{conversation.initials}</span>
                            )}
                          </div>
                          <div
                            className={`absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#070e1b] ${
                              conversation.online ? "bg-emerald-300" : "bg-slate-500"
                            }`}
                          ></div>
                        </>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <h4 className={`truncate font-headline text-sm ${conversation.active ? "font-semibold text-cyan-300" : "font-medium text-slate-100"}`}>
                          {conversation.name}
                        </h4>
                        <span className={`text-[10px] ${conversation.active ? "text-cyan-300/70" : "text-slate-500"}`}>{conversation.time}</span>
                      </div>
                      <p className="truncate text-xs text-slate-500">{conversation.preview}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="flex min-h-0 flex-1 flex-col bg-slate-950/10">
            <header className="flex h-20 items-center justify-between border-b border-cyan-300/10 bg-[#070e1b]/40 px-4 backdrop-blur-md sm:px-8">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10">
                  <span className="material-symbols-outlined text-cyan-300">support_agent</span>
                </div>
                <div>
                  <h3 className="font-headline text-base font-bold text-slate-100">HR Support</h3>
                  <p className="flex items-center gap-1.5 text-[11px] text-emerald-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                    Online
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-800/70 hover:text-cyan-300">
                  <span className="material-symbols-outlined">call</span>
                </button>
                <button className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-800/70 hover:text-cyan-300">
                  <span className="material-symbols-outlined">videocam</span>
                </button>
                <button className="rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-800/70 hover:text-cyan-300">
                  <span className="material-symbols-outlined">info</span>
                </button>
              </div>
            </header>

            <div className="flex-1 space-y-8 overflow-y-auto p-4 sm:p-8">
              <div className="flex justify-center">
                <span className="rounded-full bg-slate-800/30 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">Today</span>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[85%] space-y-1 sm:max-w-[70%]">
                  <div className="rounded-2xl rounded-tr-none border border-cyan-300/20 bg-cyan-300/10 p-4 shadow-sm">
                    <p className="text-sm leading-relaxed text-slate-100">
                      Thank you! I was specifically wondering about the remote work allowance. Has that been finalized in the new handbook?
                    </p>
                  </div>
                  <p className="text-right text-[10px] text-slate-500">12:42 PM</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10">
                  <span className="material-symbols-outlined text-lg text-cyan-300">support_agent</span>
                </div>

                <div className="max-w-[85%] space-y-3 sm:max-w-[70%]">
                  <div className="rounded-2xl rounded-tl-none border border-white/10 bg-slate-800/70 p-4">
                    <p className="text-sm leading-relaxed text-slate-100">
                      Yes, I can confirm those were added last week. Section 4.2 specifically covers the home office stipend and eligibility criteria.
                    </p>
                  </div>

                  <div className="staff-glass-card group flex cursor-pointer items-center gap-4 rounded-2xl border border-cyan-300/10 p-4 transition hover:bg-cyan-300/[0.03]">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-400/10 text-red-300">
                      <span className="material-symbols-outlined text-2xl">description</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-100">Leave_Policy_2024.pdf</p>
                      <p className="text-[11px] text-slate-500">2.4 MB - PDF Document</p>
                    </div>
                    <button className="rounded-lg bg-slate-800 p-2 text-cyan-300 opacity-0 transition group-hover:opacity-100">
                      <span className="material-symbols-outlined">download</span>
                    </button>
                  </div>

                  <p className="text-[10px] text-slate-500">12:45 PM</p>
                </div>
              </div>
            </div>

            <footer className="border-t border-cyan-300/10 bg-slate-950/25 p-4 backdrop-blur-xl sm:p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    key={reply}
                    className="rounded-full border border-white/10 bg-slate-800/70 px-4 py-1.5 text-xs text-slate-100 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300"
                  >
                    {reply}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <button className="absolute left-3 top-1/2 -translate-y-1/2 p-2 text-slate-500 transition hover:text-cyan-300">
                    <span className="material-symbols-outlined">attach_file</span>
                  </button>
                  <input
                    className="w-full rounded-2xl bg-slate-800/80 py-4 pl-14 pr-16 text-sm text-slate-100 shadow-inner outline-none focus:ring-1 focus:ring-cyan-300/50"
                    placeholder="Type your message here..."
                    type="text"
                  />
                  <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
                    <button className="p-2 text-slate-500 transition hover:text-purple-300">
                      <span className="material-symbols-outlined">mood</span>
                    </button>
                  </div>
                </div>

                <button className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-cyan-400 text-[#005762] shadow-[0_0_20px_rgba(129,236,255,0.3)] transition active:scale-95">
                  <span className="material-symbols-outlined">send</span>
                </button>
              </div>
            </footer>
          </section>
        </main>
      </div>
    </div>
  );
}
