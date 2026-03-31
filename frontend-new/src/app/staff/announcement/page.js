const updates = [
  {
    category: "HR Update",
    categoryClass: "text-purple-300 bg-purple-400/10 border-purple-300/20",
    date: "Oct 12, 2024",
    title: "New Health Insurance Policy for 2025",
    description: "Review the updated benefit packages and dental coverage changes before the enrollment deadline.",
    icon: "medical_information",
    iconClass: "bg-purple-500 text-white",
    metaA: { icon: "attachment", label: "2 Files" },
    metaB: { icon: "visibility", label: "1.2k Views" },
  },
  {
    category: "Urgent",
    categoryClass: "text-red-300 bg-red-400/10 border-red-300/20",
    date: "Oct 10, 2024",
    title: "Mandatory IT Security Training",
    description: "All employees must complete the Q4 Cyber Security module by Friday to maintain network access.",
    icon: "security",
    iconClass: "bg-red-500 text-white shadow-[0_0_15px_rgba(159,5,25,0.3)]",
    metaA: { icon: "schedule", label: "15 min read" },
    metaB: { icon: "visibility", label: "3.4k Views" },
  },
  {
    category: "Social",
    categoryClass: "text-emerald-300 bg-emerald-400/10 border-emerald-300/20",
    date: "Oct 08, 2024",
    title: "October Birthday Celebration",
    description: "Join us in the main lounge this Friday at 4 PM for cake and refreshments to celebrate our October babies!",
    icon: "cake",
    iconClass: "bg-emerald-300 text-[#005b51]",
    metaA: { icon: "location_on", label: "Main Lounge" },
    metaB: { icon: "group", label: "42 RSVP'd" },
  },
];

const trendingTopics = ["#CompanyRetreat", "#SecurityFirst", "#Health2025", "#NexusHackathon", "#PulseUpdate"];

const quickResources = [
  { icon: "menu_book", label: "Employee Handbook" },
  { icon: "calendar_month", label: "Holiday Calendar" },
  { icon: "support_agent", label: "IT Service Desk" },
];

const aiTasks = [
  { icon: "check_circle", label: "Submit Expense Reports", done: true },
  { icon: "radio_button_unchecked", label: "Complete Security Module" },
  { icon: "radio_button_unchecked", label: "Verify 2025 Health Plan" },
];

export default function StaffAnnouncementPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <section className="group relative overflow-hidden rounded-[1.75rem] shadow-2xl">
              <img
                alt="Company retreat background"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1600&q=80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#070e1b] via-[#070e1b]/45 to-transparent"></div>
              <div className="relative flex min-h-[340px] flex-col items-start justify-end gap-4 p-6 sm:min-h-[400px] sm:p-10">
                <span className="rounded-full border border-cyan-300/30 bg-cyan-300/20 px-3 py-1 text-xs font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-md">
                  Featured
                </span>
                <h1 className="font-headline text-3xl font-extrabold leading-tight text-white drop-shadow-lg sm:text-4xl xl:text-5xl">
                  Annual Company Retreat 2024:
                  <br />
                  Registration Now Open
                </h1>
                <p className="max-w-xl text-base font-medium text-slate-300 sm:text-lg">
                  Join us in the Swiss Alps for a week of collaboration, innovation, and team building. Early bird slots are limited.
                </p>
                <div className="mt-2 flex flex-wrap gap-4">
                  <button className="rounded-xl bg-cyan-300 px-8 py-3 font-headline font-bold text-[#004d57] shadow-[0_0_20px_rgba(0,229,255,0.4)] transition hover:scale-[1.02]">
                    Register Now
                  </button>
                  <button className="rounded-xl border border-white/20 bg-white/10 px-8 py-3 font-headline font-bold text-white backdrop-blur-md transition hover:bg-white/20">
                    View Details
                  </button>
                </div>
              </div>
            </section>

            <div className="flex items-center justify-between gap-4">
              <h2 className="flex items-center gap-3 font-headline text-2xl font-bold text-white">
                <span className="h-8 w-1.5 rounded-full bg-cyan-300"></span>
                Recent Updates
              </h2>
              <button className="flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-cyan-300">
                View All
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>

            <div className="flex flex-col gap-4">
              {updates.map((update) => (
                <article
                  key={update.title}
                  className="staff-glass-card group flex flex-col gap-6 rounded-2xl p-6 transition hover:bg-slate-800/45 sm:flex-row sm:items-start"
                >
                  <div className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl ${update.iconClass}`}>
                    <span className="material-symbols-outlined text-3xl">{update.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="mb-1 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${update.categoryClass}`}>
                        {update.category}
                      </span>
                      <span className="text-xs text-slate-500">{update.date}</span>
                    </div>
                    <h3 className="font-headline text-xl font-bold text-white transition group-hover:text-cyan-300">{update.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{update.description}</p>
                    <div className="mt-4 flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="material-symbols-outlined text-sm">{update.metaA.icon}</span>
                        <span>{update.metaA.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <span className="material-symbols-outlined text-sm">{update.metaB.icon}</span>
                        <span>{update.metaB.label}</span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-8 lg:col-span-4">
            <div className="staff-glass-card group relative overflow-hidden rounded-[1.75rem] p-6">
              <div className="absolute right-0 top-0 p-4 opacity-20">
                <span className="material-symbols-outlined text-6xl text-cyan-300">auto_awesome</span>
              </div>
              <div className="mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-cyan-300">insights</span>
                <h3 className="font-headline font-bold text-white">AI Pulse Summary</h3>
              </div>
              <p className="mb-6 text-sm leading-relaxed text-slate-500">
                This week focuses on <span className="font-semibold text-cyan-300">Security Compliance</span> and{" "}
                <span className="font-semibold text-purple-300">Benefits Enrollment</span>. 82% of your department has completed the IT training.
              </p>
              <div className="flex flex-col gap-3">
                {aiTasks.map((task) => (
                  <div
                    key={task.label}
                    className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 transition group-hover:bg-white/10"
                  >
                    <span className={`material-symbols-outlined text-sm ${task.done ? "text-cyan-300" : "text-slate-500"}`}>{task.icon}</span>
                    <span className="text-sm text-slate-100">{task.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <h3 className="px-2 font-headline text-sm font-bold uppercase tracking-widest text-white">Trending Topics</h3>
              <div className="flex flex-wrap gap-2">
                {trendingTopics.map((topic, index) => (
                  <span
                    key={topic}
                    className={`cursor-pointer rounded-full border px-4 py-2 text-xs font-semibold transition ${
                      index === 0
                        ? "border-cyan-300/20 bg-slate-800 text-cyan-300 hover:bg-cyan-300/10"
                        : "border-white/10 bg-slate-800 text-slate-500 hover:border-cyan-300/50 hover:text-slate-100"
                    }`}
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            <div className="staff-glass-card rounded-[1.75rem] p-6">
              <h3 className="mb-6 font-headline font-bold text-white">Quick Resources</h3>
              <nav className="flex flex-col gap-2">
                {quickResources.map((resource) => (
                  <a
                    key={resource.label}
                    className="flex items-center justify-between rounded-xl p-3 text-slate-500 transition hover:bg-white/5 hover:text-white"
                    href="#"
                  >
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-xl text-cyan-300">{resource.icon}</span>
                      <span className="text-sm font-medium">{resource.label}</span>
                    </div>
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#6001d1] to-[#6514d6] p-6">
              <div className="absolute -bottom-4 -right-4 opacity-20">
                <span className="material-symbols-outlined rotate-12 text-9xl text-white">celebration</span>
              </div>
              <div className="relative z-10">
                <h3 className="mb-2 font-headline text-xl font-extrabold text-white">Refer a Friend</h3>
                <p className="mb-6 text-sm leading-relaxed text-purple-100">
                  Know someone who would be a perfect fit? Refer them and earn a $1,000 bonus!
                </p>
                <button className="w-full rounded-xl bg-white py-3 font-headline font-bold text-[#6001d1] transition hover:scale-[1.02] hover:bg-white/90">
                  Check Job Board
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
