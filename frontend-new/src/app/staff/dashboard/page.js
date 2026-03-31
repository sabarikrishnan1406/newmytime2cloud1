"use client";

import { useState } from "react";

/* ── Metric Card ── */
const MetricCard = ({ icon, iconBg, label, value, suffix, badge, badgeColor }) => (
  <div className="staff-glass-card p-6 rounded-2xl relative overflow-hidden">
    <div className="flex justify-between items-start mb-6">
      <div className={`w-10 h-10 ${iconBg} rounded-xl flex items-center justify-center`}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      {badge && <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border ${badgeColor}`}>{badge}</span>}
    </div>
    <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">{label}</p>
    <h3 className="text-3xl font-bold font-headline">
      {value}
      {suffix && <span className="text-sm font-normal text-slate-500 ml-1">{suffix}</span>}
    </h3>
  </div>
);

/* ── Small Metric ── */
const SmallMetric = ({ icon, iconBg, label, value, unit, badge, badgeColor }) => (
  <div className="staff-glass-card p-4 rounded-xl">
    <div className="flex justify-between items-center mb-3">
      <div className={`w-8 h-8 rounded-lg ${iconBg} flex items-center justify-center`}>
        <span className="material-symbols-outlined text-base">{icon}</span>
      </div>
      {badge && <span className={`text-[10px] font-bold ${badgeColor}`}>{badge}</span>}
    </div>
    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{label}</p>
    <p className="text-lg font-bold font-headline mt-1">{value} <span className="text-xs font-normal text-slate-500">{unit}</span></p>
  </div>
);

/* ── Data ── */
const feedTabs = ["Feed", "Holidays", "My Docs", "Visitors"];

const activityLog = [
  { date: "Oct 24", time: "08:55 AM", timeColor: "text-cyan-400 font-bold", action: "Clock In", actionStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", actionIcon: "login", status: "On Time", dotColor: "bg-emerald-500", flag: null },
  { date: "Oct 23", time: "05:02 PM", timeColor: "text-slate-400", action: "Clock Out", actionStyle: "bg-slate-800 text-slate-400 border-white/5", actionIcon: "logout", status: "Standard", dotColor: "bg-cyan-400", flag: null },
  { date: "Oct 23", time: "09:15 AM", timeColor: "text-slate-400", action: "Clock In", actionStyle: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", actionIcon: "login", status: "Late (+15m)", dotColor: "bg-amber-500", flag: "FLAGGED" },
];

const weeklyChart = [
  { day: "MON", hours: "8.2h", height: 120, highlight: false },
  { day: "TUE", hours: "9.1h", height: 150, highlight: true },
  { day: "WED", hours: "7.8h", height: 110, highlight: false },
  { day: "THU", hours: "8.5h", height: 130, highlight: false },
  { day: "FRI", hours: "5.0h", height: 80, highlight: false },
  { day: "SAT", hours: "6.4h", height: 98, highlight: false },
  { day: "SUN", hours: "4.8h", height: 72, highlight: false, muted: true },
];

export default function StaffDashboard() {
  const [activeFeedTab, setActiveFeedTab] = useState("Feed");

  return (
    <div className="p-8 min-h-screen">
      {/* HEADER */}
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold font-headline mb-1">Good Morning, Sarah</h1>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="material-symbols-outlined text-sm">calendar_month</span>
            October 24, 2023 &bull; 10:42 AM
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2 text-slate-500">
              <span className="material-symbols-outlined text-lg">radio_button_checked</span>
            </div>
            <input
              className="bg-[#0D1626] border border-white/5 rounded-full py-2.5 pl-12 pr-16 text-sm text-slate-300 w-80 focus:outline-none focus:border-[#81ecff]/30 transition-all"
              placeholder="Ask Nexus AI..."
              type="text"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500">CMD+K</span>
          </div>
          <button className="relative w-10 h-10 staff-glass-card rounded-full flex items-center justify-center border-white/5">
            <span className="material-symbols-outlined text-slate-400">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>
        </div>
      </header>

      <div className="space-y-6">
        {/* TOP METRICS */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
          <MetricCard icon="timelapse" iconBg="bg-blue-500/10 text-blue-400 border border-blue-500/20" label="Monthly Hours" value="154" suffix="/ 160h" badge="96%" badgeColor="text-blue-400 bg-blue-400/10 border-blue-400/20" />
          <MetricCard icon="verified" iconBg="bg-purple-500/10 text-purple-400 border border-purple-500/20" label="Punctuality Score" value={<>98<span className="text-lg font-medium text-purple-400/60">%</span></>} badge="Top 5%" badgeColor="text-slate-400 bg-transparent border-transparent" />
          <MetricCard icon="flight" iconBg="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" label="Annual Leave" value="14" suffix="Days" badge="Available" badgeColor="text-emerald-400 bg-transparent border-transparent" />
          <div className="staff-glass-card p-6 rounded-2xl relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center border border-cyan-500/20">
                <span className="material-symbols-outlined text-cyan-400">calendar_today</span>
              </div>
              <span className="text-[10px] font-bold text-slate-400">Upcoming</span>
            </div>
            <p className="text-[10px] font-bold text-slate-500 tracking-widest uppercase mb-1">Next Shift</p>
            <h3 className="text-xl font-bold font-headline mb-1">Tomorrow</h3>
            <p className="text-[10px] text-emerald-400/80 font-mono tracking-tighter">09:00 AM - 05:00 PM</p>
          </div>
        </div>

        {/* SECONDARY METRICS */}
        <div className="grid grid-cols-3 xl:grid-cols-5 gap-4">
          <SmallMetric icon="person_check" iconBg="bg-emerald-500/10 text-emerald-400" label="Days Present" value="18" unit="Days" badge="On Track" badgeColor="text-emerald-400" />
          <SmallMetric icon="cancel_presentation" iconBg="bg-pink-500/10 text-pink-400" label="Days Absent" value="1" unit="Day" badge="Action" badgeColor="text-pink-400" />
          <SmallMetric icon="history_toggle_off" iconBg="bg-amber-500/10 text-amber-400" label="Late Arrivals" value="2" unit="Entries" badge="Warning" badgeColor="text-amber-400" />
          <SmallMetric icon="more_time" iconBg="bg-cyan-500/10 text-cyan-400" label="Total Overtime" value="12.5" unit="Hours" badge="+15%" badgeColor="text-emerald-400" />
          <div className="col-span-3 sm:col-span-1">
            <SmallMetric icon="running_with_errors" iconBg="bg-red-500/10 text-red-400" label="Missed Punch" value="3" unit="Entries" badge="Review" badgeColor="text-red-400" />
          </div>
        </div>

        {/* MAIN SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Weekly Attendance Chart */}
          <div className="lg:col-span-4 staff-glass-card p-6 rounded-2xl flex flex-col">
            <div className="flex justify-between items-center mb-1">
              <h4 className="font-bold font-headline">Weekly Attendance</h4>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Worked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-0 border-t-2 border-dashed border-slate-600"></span>
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-tighter">Goal</span>
                </div>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 mb-8">Hours Logged vs Target</p>
            <div className="flex-1 flex items-end justify-between gap-2 px-1 relative mb-2 min-h-[200px]">
              <div className="absolute w-full border-t border-dashed border-slate-700/50 top-1/3 left-0"></div>
              {weeklyChart.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-3 flex-1 min-w-[34px] max-w-[44px]">
                  <span className={`text-[10px] font-mono ${item.highlight ? "text-white font-bold" : "text-slate-400"}`}>{item.hours}</span>
                  <div className="w-full staff-chart-bar rounded-md" style={{ height: `${item.height}px`, opacity: item.muted ? 0.65 : 1 }}></div>
                  <span className="text-[9px] text-slate-500 font-bold">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wellness */}
          <div className="lg:col-span-4 staff-glass-card p-6 rounded-2xl flex flex-col items-center">
            <div className="self-start mb-1">
              <h4 className="font-bold font-headline">My Wellness</h4>
              <p className="text-[10px] text-slate-500 uppercase font-bold mt-1">Work-Life Balance</p>
            </div>
            <div className="relative w-48 h-48 mt-4 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 192 192">
                <circle className="text-slate-800/40" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12" />
                <circle cx="96" cy="96" fill="transparent" r="80" stroke="url(#wellness-grad)" strokeDasharray="502" strokeDashoffset="80" strokeLinecap="round" strokeWidth="12" />
                <defs>
                  <linearGradient id="wellness-grad" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#00e3fd" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-5xl font-black font-headline">84<span className="text-2xl opacity-40">%</span></span>
                <span className="bg-emerald-500/20 text-emerald-400 px-3 py-0.5 rounded-full text-[9px] font-black tracking-widest uppercase mt-2 border border-emerald-400/20">Healthy</span>
              </div>
            </div>
            <div className="w-full mt-auto pt-4">
              <div className="flex justify-between items-center text-[9px] font-black tracking-widest text-slate-500 mb-2">
                <span>BURNOUT RISK</span>
                <span>LOW</span>
              </div>
              <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 w-[15%]"></div>
              </div>
            </div>
          </div>

          {/* Feed Panel */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="staff-glass-card rounded-2xl overflow-hidden flex flex-col h-full">
              {/* Tabs */}
              <div className="flex border-b border-white/5 px-2">
                {feedTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFeedTab(tab)}
                    className={`px-4 py-3 text-[10px] font-black tracking-wider uppercase relative ${
                      activeFeedTab === tab
                        ? "border-b-2 border-cyan-400 text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {tab}
                    {tab === "My Docs" && <span className="absolute top-2.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>}
                  </button>
                ))}
              </div>

              {/* Feed Items */}
              <div className="p-4 space-y-3 overflow-y-auto max-h-[320px]">
                <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-red-400">report</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                      <span className="text-[9px] font-black text-red-400 uppercase tracking-widest">Document Alert</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200">Visa Expiring in 10 Days</h5>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-blue-400">campaign</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                      <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest">Announcement</span>
                    </div>
                    <h5 className="text-xs font-bold text-slate-200">Q4 All Hands Meeting</h5>
                  </div>
                </div>

                <div className="p-4 rounded-xl staff-glass-card border border-white/5 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-orange-400">celebration</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Thanksgiving Break</h5>
                    <p className="text-[10px] text-slate-500 mt-1">Office Closed &bull; Nov 23-24</p>
                  </div>
                </div>

                <div className="p-4 rounded-xl staff-glass-card border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/10 bg-slate-700 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-400">person</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-slate-200">Employee of the Week <span className="text-amber-400 ml-1">&#9733;</span></h5>
                    <p className="text-[10px] text-slate-500 mt-1">Congrats to <span className="text-white">Michael Jones!</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
          {/* Activity Log */}
          <div className="lg:col-span-8 staff-glass-card rounded-2xl overflow-hidden">
            <div className="px-6 py-5 border-b border-white/5 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                <h4 className="font-bold font-headline">My Recent Activity Log</h4>
              </div>
              <button className="text-[10px] font-black tracking-widest text-cyan-400 uppercase flex items-center gap-1 hover:brightness-110 transition-all">
                View Full History <span className="material-symbols-outlined text-xs">arrow_forward</span>
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] uppercase font-black text-slate-500 tracking-widest border-b border-white/5 bg-slate-900/30">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Time</th>
                    <th className="px-6 py-4">Action</th>
                    <th className="px-6 py-4">Punctuality</th>
                  </tr>
                </thead>
                <tbody className="text-slate-300 divide-y divide-white/5">
                  {activityLog.map((row, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-5 flex items-center gap-3">
                        <span className="material-symbols-outlined text-slate-600 text-base">calendar_today</span>
                        <span className="text-xs font-medium">{row.date}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`text-xs font-mono ${row.timeColor}`}>{row.time}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${row.actionStyle}`}>
                          <span className="material-symbols-outlined text-[14px]">{row.actionIcon}</span> {row.action}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 rounded-full ${row.dotColor}`}></span>
                          <span className="text-[10px] font-medium">{row.status}</span>
                          {row.flag && <span className="text-[8px] bg-red-500/10 text-red-400 px-1 rounded ml-2">{row.flag}</span>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Nexus AI */}
          <div className="lg:col-span-4 staff-glass-card p-6 rounded-2xl relative overflow-hidden flex flex-col border-purple-500/20">
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-purple-500/20 blur-[40px] rounded-full"></div>
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase">Nexus AI Active</span>
            </div>
            <div className="flex-1 relative z-10">
              <p className="text-sm italic text-slate-200 leading-relaxed">
                &ldquo;I noticed you clocked in late yesterday. Need to file an exception request?&rdquo;
              </p>
            </div>
            <div className="mt-8 flex gap-3 relative z-10">
              <button className="flex-1 py-2 rounded-xl bg-purple-600 text-white text-[11px] font-bold shadow-[0_0_15px_rgba(147,51,234,0.3)] hover:scale-[1.02] transition-transform">
                Yes, please
              </button>
              <button className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-400 text-[11px] font-bold border border-white/5 hover:bg-slate-700 transition-colors">
                Maybe later
              </button>
            </div>
            <button className="absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-cyan-500/20 hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-white">auto_awesome</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
