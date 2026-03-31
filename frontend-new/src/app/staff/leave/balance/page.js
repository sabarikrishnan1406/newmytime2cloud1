import Link from "next/link";

const balanceCards = [
  {
    label: "Annual Leave",
    value: "15.5",
    suffix: "Days Left",
    tag: "Active",
    icon: "beach_access",
    iconClass: "bg-cyan-300/10 text-cyan-300",
    tagClass: "bg-cyan-300/20 text-cyan-300",
    progress: "70%",
    barClass: "bg-cyan-300",
  },
  {
    label: "Sick Leave",
    value: "8.0",
    suffix: "Days Left",
    tag: "Health",
    icon: "medical_services",
    iconClass: "bg-purple-300/10 text-purple-300",
    tagClass: "bg-purple-300/20 text-purple-300",
    progress: "80%",
    barClass: "bg-purple-300",
  },
  {
    label: "Casual Leave",
    value: "2.0",
    suffix: "Days Left",
    tag: "Casual",
    icon: "coffee",
    iconClass: "bg-emerald-300/10 text-emerald-300",
    tagClass: "bg-emerald-300/20 text-emerald-300",
    progress: "40%",
    barClass: "bg-emerald-300",
  },
  {
    label: "Unpaid Leave",
    value: "0.0",
    suffix: "Days Used",
    tag: "Unpaid",
    icon: "credit_card_off",
    iconClass: "bg-red-300/10 text-red-300",
    tagClass: "bg-red-300/20 text-red-300",
    progress: "0%",
    barClass: "bg-red-300",
  },
];

const trendMonths = [
  { month: "APR", accrued: "h-full", taken: "h-1/4" },
  { month: "MAY", accrued: "h-[90%]", taken: "h-1/2" },
  { month: "JUN", accrued: "h-full", taken: "h-[10%]" },
  { month: "JUL", accrued: "h-full", taken: "h-1/3" },
  { month: "AUG", accrued: "h-[95%]", taken: "h-full" },
  { month: "SEP", accrued: "h-full", taken: "h-1/5" },
];

const recentActivity = [
  {
    title: "Annual Leave Deduction",
    subtitle: "Approved by HR Core - Sept 12, 2023",
    change: "-3.0 Days",
    status: "Processed",
    icon: "logout",
    iconClass: "bg-red-300/10 text-red-300",
    changeClass: "text-red-300",
  },
  {
    title: "Monthly Accrual Credited",
    subtitle: "System Automated - Sept 01, 2023",
    change: "+1.83 Days",
    status: "Credited",
    icon: "add_task",
    iconClass: "bg-emerald-300/10 text-emerald-300",
    changeClass: "text-emerald-300",
  },
  {
    title: "Sick Leave Deduction",
    subtitle: "Medical Certificate Verified - Aug 24, 2023",
    change: "-1.0 Day",
    status: "Verified",
    icon: "health_and_safety",
    iconClass: "bg-purple-300/10 text-purple-300",
    changeClass: "text-red-300",
  },
];

const annualDistribution = [
  { label: "Available", value: "15.5 Days", dotClass: "bg-cyan-300" },
  { label: "Consumed", value: "10.0 Days", dotClass: "bg-slate-700" },
];

const upcomingHolidays = [
  { month: "SEP", day: "04", title: "Labor Day", subtitle: "Public Holiday" },
  { month: "NOV", day: "11", title: "Veterans Day", subtitle: "Regional Observance" },
];

function BalanceMetricCard({ label, value, suffix, tag, icon, iconClass, tagClass, progress, barClass }) {
  return (
    <article className="staff-glass-card flex flex-col justify-between rounded-xl p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`rounded px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${tagClass}`}>{tag}</span>
      </div>

      <div>
        <h3 className="mb-1 text-xs font-bold uppercase tracking-widest text-slate-500">{label}</h3>
        <div className="mb-4 flex items-baseline gap-2">
          <span className="font-headline text-3xl font-bold text-slate-100">{value}</span>
          <span className="text-xs text-slate-500 uppercase">{suffix}</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
          <div className={`h-full rounded-full ${barClass}`} style={{ width: progress }}></div>
        </div>
      </div>
    </article>
  );
}

function ActivityItem({ title, subtitle, change, status, icon, iconClass, changeClass }) {
  return (
    <div className="flex items-center justify-between gap-4 px-8 py-4 transition hover:bg-slate-800/30">
      <div className="flex items-center gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-full ${iconClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-100">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-sm font-bold ${changeClass}`}>{change}</p>
        <p className="text-[10px] uppercase text-slate-500">{status}</p>
      </div>
    </div>
  );
}

export default function StaffLeaveBalancePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-[8%] top-0 h-[420px] w-[420px] rounded-full bg-cyan-300/5 blur-[120px]"></div>
        <div className="absolute -left-[10%] bottom-0 h-[360px] w-[360px] rounded-full bg-purple-300/5 blur-[120px]"></div>
      </div>

      <div>
        <section className="mb-8 rounded-2xl border border-cyan-300/10 bg-slate-950/60 px-6 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
                <Link href="/staff/leave" className="transition hover:text-cyan-300">
                  Leave Management
                </Link>
                <span className="material-symbols-outlined text-sm">chevron_right</span>
                <span className="text-cyan-300">Leave Balance</span>
              </div>
              <h1 className="font-headline text-4xl font-bold tracking-tight text-slate-100">
                Leave <span className="text-cyan-300 drop-shadow-[0_0_10px_rgba(0,227,253,0.35)]">Balance</span>
              </h1>
              <p className="mt-2 font-medium text-slate-500">Nexus Core Operating System - HR Management Unit</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 sm:w-64">
                <input
                  className="w-full rounded-full border border-white/10 bg-slate-800/70 px-6 py-2 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/40"
                  placeholder="Search systems..."
                  type="text"
                />
                <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">search</span>
              </div>
              <div className="flex items-center gap-3">
                <button className="rounded-full p-2 text-slate-500 transition hover:bg-cyan-300/10 hover:text-cyan-300">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="rounded-full p-2 text-slate-500 transition hover:bg-cyan-300/10 hover:text-cyan-300">
                  <span className="material-symbols-outlined">history_edu</span>
                </button>
                <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-cyan-300/30 bg-slate-800 text-sm font-bold text-cyan-300">
                  AP
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {balanceCards.map((card) => (
            <BalanceMetricCard key={card.label} {...card} />
          ))}
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section className="staff-glass-card relative overflow-hidden rounded-2xl p-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="mb-1 font-headline text-xl font-bold text-slate-100">Leave Utilization &amp; Accrual Trend</h2>
                  <p className="text-xs uppercase tracking-wider text-slate-500">Metrics: Apr - Sep 2023</p>
                </div>
                <div className="flex gap-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-cyan-300"></span>
                    <span className="text-xs text-slate-500">Accrued</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full bg-purple-300"></span>
                    <span className="text-xs text-slate-500">Taken</span>
                  </div>
                </div>
              </div>

              <div className="relative flex h-64 items-end justify-between gap-2">
                <div className="absolute inset-0 flex flex-col justify-between opacity-5">
                  <div className="h-px w-full border-b border-slate-100"></div>
                  <div className="h-px w-full border-b border-slate-100"></div>
                  <div className="h-px w-full border-b border-slate-100"></div>
                  <div className="h-px w-full border-b border-slate-100"></div>
                </div>

                {trendMonths.map((item) => (
                  <div key={item.month} className="group flex flex-1 cursor-pointer flex-col items-center gap-2">
                    <div className="flex h-40 w-full justify-center gap-1">
                      <div className={`w-3 self-end rounded-t-sm bg-cyan-300/20 transition-all group-hover:bg-cyan-300/40 ${item.accrued}`}></div>
                      <div className={`w-3 self-end rounded-t-sm bg-purple-300/20 transition-all group-hover:bg-purple-300/40 ${item.taken}`}></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-500">{item.month}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="staff-glass-card overflow-hidden rounded-2xl">
              <div className="flex items-center justify-between border-b border-cyan-300/10 px-8 py-6">
                <h2 className="font-headline text-xl font-bold text-slate-100">Recent Activity</h2>
                <button className="text-xs font-bold uppercase tracking-widest text-cyan-300 transition hover:text-cyan-200">View All</button>
              </div>
              <div className="divide-y divide-cyan-300/5">
                {recentActivity.map((item) => (
                  <ActivityItem key={item.title} {...item} />
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8 lg:col-span-4">
            <section className="staff-glass-card flex flex-col items-center rounded-2xl p-8">
              <h2 className="mb-8 self-start text-xs font-bold uppercase tracking-widest text-slate-500">Annual Distribution</h2>
              <div className="relative mb-8 h-48 w-48">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                  <circle className="text-slate-800" cx="50" cy="50" fill="transparent" r="40" stroke="currentColor" strokeWidth="8"></circle>
                  <circle
                    className="text-cyan-300 drop-shadow-[0_0_8px_rgba(0,227,253,0.4)]"
                    cx="50"
                    cy="50"
                    fill="transparent"
                    r="40"
                    stroke="currentColor"
                    strokeDasharray="251.2"
                    strokeDashoffset="100.48"
                    strokeWidth="8"
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline text-3xl font-bold text-slate-100">25.5</span>
                  <span className="text-[10px] font-bold uppercase text-slate-500">Total Days</span>
                </div>
              </div>

              <div className="w-full space-y-3">
                {annualDistribution.map((item) => (
                  <div key={item.label} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${item.dotClass}`}></div>
                      <span className="text-slate-500">{item.label}</span>
                    </div>
                    <span className="font-bold text-slate-100">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="staff-glass-card rounded-2xl p-8">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-widest text-slate-500">Upcoming Holidays</h2>
              <div className="space-y-6">
                {upcomingHolidays.map((holiday) => (
                  <div key={holiday.title} className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-cyan-300/10 bg-slate-800">
                      <span className="text-[10px] font-bold uppercase text-cyan-300">{holiday.month}</span>
                      <span className="font-headline text-lg font-bold text-slate-100">{holiday.day}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-100">{holiday.title}</p>
                      <p className="text-xs text-slate-500">{holiday.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>
        </div>

        <Link
          href="/staff/leave/apply"
          aria-label="Create leave request"
          className="fixed bottom-8 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-cyan-300 text-[#004d57] shadow-[0_0_20px_rgba(0,227,253,0.4)] transition hover:scale-105 active:scale-90 sm:bottom-10 sm:right-8"
        >
          <span className="material-symbols-outlined text-3xl font-bold">add</span>
        </Link>
      </div>
    </div>
  );
}
