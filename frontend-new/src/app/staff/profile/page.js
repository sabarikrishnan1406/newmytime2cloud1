import Link from "next/link";

const contactCards = [
  {
    label: "Work Email",
    value: "alex.rivera@nexusdeck.io",
    icon: "work",
    iconClass: "bg-cyan-300/10 text-cyan-300",
  },
  {
    label: "Personal Email",
    value: "rivera.design@gmail.com",
    icon: "person",
    iconClass: "bg-purple-300/10 text-purple-300",
  },
  {
    label: "Mobile Number",
    value: "+1 (555) 293-0192",
    icon: "call",
    iconClass: "bg-emerald-300/10 text-emerald-300",
  },
  {
    label: "Emergency Contact",
    value: "Elena Rivera (Spouse)",
    icon: "e911_emergency",
    iconClass: "bg-red-300/10 text-red-300",
  },
];

const workSummary = [
  {
    label: "Joining Date",
    value: "12 Oct 2021",
    helper: "2 Years, 4 Months",
    valueClass: "text-cyan-300",
  },
  {
    label: "Branch / Office",
    value: "Silicon Valley HQ",
    helper: "California, USA",
    valueClass: "text-slate-100",
  },
  {
    label: "Employment Type",
    value: "Full-time",
    helper: "Permanent Employee",
    valueClass: "text-emerald-300",
  },
];

const documents = [
  {
    title: "Government ID Proof",
    file: "ID_VERIFY_4901.PDF - 2.4 MB",
    icon: "badge",
    iconClass: "bg-slate-800 text-cyan-300",
  },
  {
    title: "Degree Certificate",
    file: "EDU_MASTERS_92.PDF - 4.1 MB",
    icon: "school",
    iconClass: "bg-slate-800 text-purple-300",
  },
  {
    title: "Employment Contract",
    file: "CONT_NEXUS_2021.PDF - 1.8 MB",
    icon: "description",
    iconClass: "bg-slate-800 text-emerald-300",
  },
];

const quickActions = [
  {
    label: "Change Password",
    icon: "lock_reset",
    iconClass: "bg-cyan-300/5 text-cyan-300 group-hover:bg-cyan-300/20",
    actionIcon: "chevron_right",
    actionClass: "group-hover:text-cyan-300",
  },
  {
    label: "Update Emergency Contact",
    icon: "contact_emergency",
    iconClass: "bg-purple-300/5 text-purple-300 group-hover:bg-purple-300/20",
    actionIcon: "chevron_right",
    actionClass: "group-hover:text-purple-300",
  },
  {
    label: "Download ID Card",
    icon: "id_card",
    iconClass: "bg-emerald-300/5 text-emerald-300 group-hover:bg-emerald-300/20",
    actionIcon: "download",
    actionClass: "group-hover:text-emerald-300",
  },
  {
    label: "Policy Handbook",
    icon: "menu_book",
    iconClass: "bg-red-200/5 text-red-200 group-hover:bg-red-200/20",
    actionIcon: "open_in_new",
    actionClass: "group-hover:text-red-200",
  },
];

function ContactCard({ label, value, icon, iconClass }) {
  return (
    <article className="group flex items-start gap-4 rounded-2xl bg-slate-900/40 p-4 transition-colors hover:bg-slate-800/50">
      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <div>
        <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-sm font-semibold text-slate-100">{value}</p>
      </div>
    </article>
  );
}

function WorkSummaryCard({ label, value, helper, valueClass }) {
  return (
    <article className="rounded-2xl border border-white/5 bg-slate-900/40 p-6 text-center">
      <p className="mb-2 text-[10px] uppercase tracking-widest text-slate-500">{label}</p>
      <p className={`font-headline text-xl font-bold ${valueClass}`}>{value}</p>
      <p className="mt-1 text-[10px] text-slate-500">{helper}</p>
    </article>
  );
}

export default function StaffProfilePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div>
        <section className="staff-glass-card relative mb-10 overflow-hidden rounded-[1.75rem] p-8">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-cyan-300/10 blur-[100px]"></div>
          <div className="relative flex flex-col items-center gap-8 md:flex-row md:items-end">
            <div className="relative">
              <div className="flex h-40 w-40 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-cyan-300/25 to-purple-300/20 text-5xl font-black text-slate-100 ring-4 ring-cyan-300/20">
                AR
              </div>
              <div className="absolute -bottom-2 -right-2 rounded-full bg-emerald-300 px-3 py-1 text-[10px] font-bold tracking-widest text-[#005b51] shadow-lg">
                ACTIVE
              </div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <div className="mb-2 flex flex-col gap-4 md:flex-row md:items-center">
                <h1 className="font-headline text-4xl font-extrabold tracking-tight text-slate-100">Alex Rivera</h1>
                <span className="self-center rounded-lg border border-white/10 bg-slate-800 px-3 py-1 text-xs font-semibold text-slate-400">
                  EMP-9402
                </span>
              </div>
              <p className="mb-6 font-headline text-lg font-medium tracking-wide text-cyan-300">Senior Product Designer - Design Ops</p>
              <div className="flex flex-wrap justify-center gap-3 md:justify-start">
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/40 px-4 py-2">
                  <span className="material-symbols-outlined text-sm text-cyan-300">location_on</span>
                  <span className="text-sm font-medium text-slate-100">Silicon Valley HQ</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/40 px-4 py-2">
                  <span className="material-symbols-outlined text-sm text-emerald-300">laptop_mac</span>
                  <span className="text-sm font-medium text-slate-100">On-Site</span>
                </div>
                <div className="flex items-center gap-2 rounded-xl bg-slate-900/40 px-4 py-2">
                  <span className="material-symbols-outlined text-sm text-purple-300">schedule</span>
                  <span className="text-sm font-medium text-slate-100">GMT -08:00</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button className="rounded-xl bg-cyan-300 px-8 py-3 font-headline font-bold text-[#004d57] shadow-lg shadow-cyan-300/20 transition hover:scale-105 active:scale-95">
                EDIT PROFILE
              </button>
              <button className="rounded-xl border border-white/10 bg-slate-800 px-4 py-3 text-slate-100 transition hover:bg-slate-700">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section className="staff-glass-card rounded-[1.75rem] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-headline text-xl font-bold text-slate-100">Contact Information</h2>
                <button className="text-slate-500 transition hover:text-cyan-300">
                  <span className="material-symbols-outlined">edit</span>
                </button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {contactCards.map((card) => (
                  <ContactCard key={card.label} {...card} />
                ))}
              </div>
            </section>

            <section className="staff-glass-card rounded-[1.75rem] p-6">
              <h2 className="mb-6 font-headline text-xl font-bold text-slate-100">Work Details</h2>
              <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
                {workSummary.map((item) => (
                  <WorkSummaryCard key={item.label} {...item} />
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-6 rounded-2xl border border-cyan-300/10 bg-slate-800/40 p-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300/20 to-purple-300/20 text-xl font-black text-slate-100 ring-2 ring-cyan-300/10">
                    SJ
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">Reporting Manager</p>
                    <p className="font-headline text-lg font-bold text-slate-100">Sarah Jenkins</p>
                    <p className="text-xs text-cyan-300">VP of Product Design</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Link
                    href="/staff/chat"
                    className="rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-6 py-2 font-headline font-bold text-cyan-300 transition hover:bg-cyan-300 hover:text-[#004d57]"
                  >
                    MESSAGE
                  </Link>
                  <button className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-slate-800 text-slate-500 transition hover:text-slate-100">
                    <span className="material-symbols-outlined">info</span>
                  </button>
                </div>
              </div>
            </section>

            <section className="staff-glass-card rounded-[1.75rem] p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-headline text-xl font-bold text-slate-100">Verified Documents</h2>
                <button className="inline-flex items-center gap-1 text-xs font-bold text-cyan-300 transition hover:underline">
                  <span className="material-symbols-outlined text-sm">add</span>
                  UPLOAD NEW
                </button>
              </div>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <article
                    key={doc.title}
                    className="group flex items-center justify-between rounded-2xl border border-white/5 bg-slate-900/40 p-4 transition hover:border-cyan-300/30"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${doc.iconClass}`}>
                        <span className="material-symbols-outlined">{doc.icon}</span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-100">{doc.title}</p>
                        <p className="text-[10px] uppercase tracking-tighter text-slate-500">{doc.file}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1 rounded bg-emerald-300/10 px-2 py-1 text-[10px] font-bold text-emerald-300">
                        <span className="material-symbols-outlined text-xs">check_circle</span>
                        VERIFIED
                      </div>
                      <button className="text-slate-500 transition hover:text-slate-100">
                        <span className="material-symbols-outlined">download</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8 lg:col-span-4">
            <section className="staff-glass-card rounded-[1.75rem] p-6">
              <h2 className="mb-6 font-headline text-xl font-bold text-slate-100">Quick Actions</h2>
              <div className="space-y-3">
                {quickActions.map((item) => (
                  <button
                    key={item.label}
                    className="group flex w-full items-center gap-4 rounded-2xl border border-white/10 bg-slate-800/60 p-4 text-left transition hover:bg-slate-700/60"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${item.iconClass}`}>
                      <span className="material-symbols-outlined">{item.icon}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-100">{item.label}</span>
                    <span className={`material-symbols-outlined ml-auto text-slate-500 transition-all ${item.actionClass}`}>{item.actionIcon}</span>
                  </button>
                ))}
              </div>
            </section>

            <section className="staff-glass-card relative overflow-hidden rounded-[1.75rem] p-6">
              <div className="absolute right-0 top-0 h-32 w-32 bg-purple-300/10 blur-3xl"></div>
              <h2 className="mb-6 font-headline text-xl font-bold text-slate-100">Attendance Overview</h2>
              <div className="flex flex-col items-center py-4">
                <div className="relative mb-6 h-40 w-40">
                  <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 160 160">
                    <circle className="text-slate-800" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeWidth="8"></circle>
                    <circle className="text-cyan-300" cx="80" cy="80" fill="transparent" r="70" stroke="currentColor" strokeDasharray="440" strokeDashoffset="66" strokeWidth="8"></circle>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="font-headline text-3xl font-bold text-slate-100">85%</span>
                    <span className="text-[10px] uppercase tracking-widest text-slate-500">Healthy</span>
                  </div>
                </div>
                <div className="grid w-full grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-slate-900/40 p-4 text-center">
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">Leaves Used</p>
                    <p className="text-2xl font-bold text-slate-100">
                      04 <span className="text-sm font-normal text-slate-500">/ 18</span>
                    </p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/40 p-4 text-center">
                    <p className="mb-1 text-[10px] uppercase tracking-widest text-slate-500">Work Days</p>
                    <p className="text-2xl font-bold text-slate-100">224</p>
                  </div>
                </div>
              </div>
            </section>

            <section className="staff-glass-card rounded-[1.75rem] border-l-4 border-purple-300 p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-300/10 text-purple-300">
                  <span className="material-symbols-outlined">calendar_month</span>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Upcoming PTO</p>
                  <p className="text-xs text-slate-500">Feb 24 - Feb 26 - Annual Leave</p>
                </div>
              </div>
            </section>
          </div>
        </div>

      </div>
    </div>
  );
}
