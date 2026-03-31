import Link from "next/link";

const metricCards = [
  {
    label: "Attendance Score",
    value: "98.5%",
    helper: "+1.2%",
    icon: "how_to_reg",
    iconClass: "bg-purple-300/10 text-purple-300 border-purple-300/20",
    helperClass: "bg-emerald-300/10 text-emerald-300",
  },
  {
    label: "Punctuality Score",
    value: "94%",
    helper: "+0.5%",
    icon: "schedule",
    iconClass: "bg-cyan-300/10 text-cyan-300 border-cyan-300/20",
    helperClass: "bg-emerald-300/10 text-emerald-300",
  },
  {
    label: "Total Overtime",
    value: "12.5 hrs",
    helper: "+2.0%",
    icon: "history",
    iconClass: "bg-red-300/10 text-red-300 border-red-300/20",
    helperClass: "bg-emerald-300/10 text-emerald-300",
  },
  {
    label: "Consistency Index",
    value: "High",
    helper: "Stable",
    icon: "trending_up",
    iconClass: "bg-emerald-300/10 text-emerald-300 border-emerald-300/20",
    helperClass: "bg-slate-800 text-slate-400",
  },
];

const insights = [
  "Your punctuality has improved by 5% compared to the previous quarter. This positive trend significantly boosts your reliability score.",
  "Try maintaining your current overtime levels to avoid burnout. Your Consistency Index is currently at an all-time high of 92/100.",
  "Peak productivity was recorded during the second week of each month, aligning with your high Attendance Score.",
];

const achievements = [
  { label: "Early Bird", icon: "wb_sunny", className: "border-cyan-300/40 bg-cyan-300/10 text-cyan-300 shadow-[0_0_20px_rgba(129,236,255,0.15)]" },
  { label: "Perfect 100", icon: "shield", className: "border-purple-300/40 bg-purple-300/10 text-purple-300 shadow-[0_0_20px_rgba(175,136,255,0.15)]" },
  { label: "Warrior", icon: "emoji_events", className: "border-emerald-300/40 bg-emerald-300/10 text-emerald-300 shadow-[0_0_20px_rgba(161,255,239,0.15)]" },
];

const trendMonths = ["MAY", "JUN", "JUL", "AUG", "SEP", "OCT"];

const lateArrivalBars = [
  { label: "WK1", height: "h-12", active: false },
  { label: "WK2", height: "h-24", active: false },
  { label: "WK3", height: "h-16", active: true },
  { label: "WK4", height: "h-32", active: false },
  { label: "WK5", height: "h-8", active: false },
];

function MetricCard({ label, value, helper, icon, iconClass, helperClass }) {
  return (
    <article className="staff-glass-card rounded-2xl p-6 transition-colors hover:border-cyan-300/30">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${iconClass}`}>
          <span className="material-symbols-outlined text-[22px]">{icon}</span>
        </div>
        <span className={`rounded-lg px-2 py-1 text-xs font-bold ${helperClass}`}>{helper}</span>
      </div>
      <div className="mb-1 font-headline text-3xl font-bold text-slate-100">{value}</div>
      <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</div>
    </article>
  );
}

export default function StaffPerformancePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div>
        <header className="mb-10 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight text-slate-100">
              Performance Report
            </h1>
            <p className="mt-1 text-slate-500">Comprehensive analysis of your workplace metrics and trends.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-slate-800/70 px-4 py-2.5">
              <span className="material-symbols-outlined text-sm text-cyan-300">calendar_today</span>
              <span className="text-sm font-medium text-slate-100">Oct 2023 - Mar 2024</span>
              <span className="material-symbols-outlined text-sm text-slate-500">expand_more</span>
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-6 py-2.5 font-bold tracking-wide text-[#004d57] shadow-[0_0_20px_rgba(129,236,255,0.3)] transition hover:scale-105 active:scale-95">
              <span className="material-symbols-outlined text-[20px]">download</span>
              Download Report
            </button>
          </div>
        </header>

        <section className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
          {metricCards.map((card) => (
            <MetricCard key={card.label} {...card} />
          ))}
        </section>

        <section className="mb-8 grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="staff-glass-card relative overflow-hidden rounded-2xl p-8 xl:col-span-8">
            <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-cyan-300/5 blur-[100px]"></div>
            <div className="relative z-10">
              <div className="mb-6 flex items-center gap-3">
                <span className="material-symbols-outlined text-cyan-300">auto_awesome</span>
                <h2 className="font-headline text-xl font-bold text-slate-100">Smart Assistant Insights</h2>
              </div>
              <div className="space-y-5">
                {insights.map((item) => (
                  <div key={item} className="flex items-start gap-4">
                    <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-300/10">
                      <span className="material-symbols-outlined text-sm text-cyan-300">colors_spark</span>
                    </div>
                    <p className="leading-relaxed text-slate-400">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="staff-glass-card flex flex-col justify-between rounded-2xl p-8 xl:col-span-4">
            <h2 className="mb-8 text-left font-headline text-xl font-bold text-slate-100">Achievements</h2>
            <div className="flex justify-around gap-4">
              {achievements.map((item) => (
                <div key={item.label} className="flex flex-col items-center gap-3 text-center">
                  <div className={`flex h-16 w-16 items-center justify-center rounded-full border-2 ${item.className}`}>
                    <span className="material-symbols-outlined text-3xl">{item.icon}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mb-8 grid grid-cols-1 gap-8 xl:grid-cols-12">
          <div className="staff-glass-card rounded-2xl p-8 xl:col-span-7">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <h2 className="font-headline text-xl font-bold text-slate-100">Monthly Attendance Trend</h2>
              <div className="text-right">
                <div className="font-headline text-2xl font-bold text-cyan-300">Avg: 97.8%</div>
                <div className="text-xs font-semibold uppercase tracking-widest text-slate-500">Last 6 Months</div>
              </div>
            </div>

            <div className="relative mt-4 h-48 w-full">
              <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 600 200">
                <defs>
                  <linearGradient id="wave-gradient-performance" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#81ecff" stopOpacity="0.3"></stop>
                    <stop offset="100%" stopColor="#81ecff" stopOpacity="0"></stop>
                  </linearGradient>
                </defs>
                <path
                  d="M0,150 C100,140 150,180 200,160 C250,140 300,150 350,130 C400,110 450,130 500,120 C550,110 600,140 600,140 L600,200 L0,200 Z"
                  fill="url(#wave-gradient-performance)"
                  stroke="#81ecff"
                  strokeWidth="3"
                ></path>
                <circle cx="200" cy="160" fill="#81ecff" r="4"></circle>
                <circle cx="350" cy="130" fill="#81ecff" r="4"></circle>
                <circle cx="500" cy="120" fill="#81ecff" r="4"></circle>
              </svg>
              <div className="mt-6 flex justify-between text-[10px] font-bold tracking-widest text-slate-500">
                {trendMonths.map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="staff-glass-card rounded-2xl p-8 xl:col-span-5">
            <div className="mb-10 flex items-center justify-between">
              <h2 className="font-headline text-xl font-bold text-slate-100">Late Arrival Incidents</h2>
              <div className="flex h-10 w-10 items-center justify-center rounded-full border border-red-300/30 bg-red-300/10">
                <span className="font-headline font-bold text-red-300">4</span>
              </div>
            </div>

            <div className="flex h-48 items-end justify-between gap-4 px-2">
              {lateArrivalBars.map((bar) => (
                <div key={bar.label} className="flex flex-1 flex-col items-center gap-3">
                  <div className={`relative w-full rounded-t-lg bg-slate-800 ${bar.height}`}>
                    <div
                      className={`absolute bottom-0 left-0 h-full w-full rounded-t-lg transition-all ${
                        bar.active
                          ? "bg-cyan-300/40 shadow-[0_0_15px_rgba(129,236,255,0.2)] hover:bg-cyan-300/60"
                          : "bg-cyan-300/20 hover:bg-cyan-300/40"
                      }`}
                    ></div>
                  </div>
                  <span className={`text-[10px] font-bold ${bar.active ? "text-slate-100" : "text-slate-500"}`}>{bar.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <footer className="staff-glass-card flex flex-col gap-4 rounded-2xl p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <span className="font-headline font-bold text-slate-100">Monthly Summary Breakdown</span>
            <p className="text-xs text-slate-500">Aggregated data across all active workspaces for the current cycle.</p>
          </div>
          <Link href="/staff/attendance" className="group inline-flex items-center gap-2 text-sm font-bold text-cyan-300 transition hover:drop-shadow-[0_0_8px_rgba(129,236,255,0.4)]">
            View Detailed History
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">arrow_forward_ios</span>
          </Link>
        </footer>
      </div>
    </div>
  );
}
