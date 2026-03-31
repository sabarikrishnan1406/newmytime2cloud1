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

export default function StaffAnnouncementPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-12">
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
        </div>
      </div>
    </div>
  );
}
