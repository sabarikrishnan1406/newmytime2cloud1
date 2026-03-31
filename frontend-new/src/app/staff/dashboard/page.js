"use client";

import { useState } from "react";

const MetricCard = ({ icon, iconBg, label, value, badge, badgeColor }) => (
  <div className="staff-glass-card p-4 xl:p-5 rounded-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 staff-neon-border">
    <div className="flex justify-between items-start mb-2">
      <div className={`w-8 h-8 ${iconBg} rounded-lg flex items-center justify-center`}>
        <span className="material-symbols-outlined text-[20px]" style={{ color: "inherit" }}>{icon}</span>
      </div>
      {badge && (
        <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded-md border ${badgeColor}`}>
          {badge}
        </span>
      )}
    </div>
    <p className="text-[#a5abbd] text-[10px] uppercase tracking-widest">{label}</p>
    <h3 className="text-2xl font-bold text-[#e2e8fb] font-headline mt-0.5">{value}</h3>
  </div>
);

const SmallMetric = ({ label, value, valueColor = "text-[#e2e8fb]" }) => (
  <div className="staff-glass-card p-3 rounded-xl staff-neon-border">
    <p className="text-[#a5abbd] text-[9px] uppercase font-bold tracking-wider">{label}</p>
    <p className={`text-lg font-bold mt-0.5 ${valueColor}`}>{value}</p>
  </div>
);

const feedTabs = ["Feed", "Holidays", "Spotlight", "My Docs"];

const activityLog = [
  { date: "Oct 24, 2023", time: "08:58 AM", action: "Standard", status: "On Time", statusColor: "text-[#a1ffef]", dotColor: "bg-[#a1ffef]" },
  { date: "Oct 23, 2023", time: "09:02 AM", action: "Meeting Early", status: "Grace Period", statusColor: "text-[#81ecff]", dotColor: "bg-[#81ecff]" },
  { date: "Oct 20, 2023", time: "08:45 AM", action: "Standard", status: "On Time", statusColor: "text-[#a1ffef]", dotColor: "bg-[#a1ffef]" },
];

const weeklyData = [
  { day: "Mon", height: "85%" },
  { day: "Tue", height: "95%" },
  { day: "Wed", height: "70%" },
  { day: "Thu", height: "90%" },
  { day: "Fri", height: "80%" },
];

export default function StaffDashboard() {
  const [activeFeedTab, setActiveFeedTab] = useState("Feed");

  return (
    <>
      {/* TOP APP BAR */}
      <header className="flex justify-between items-center w-full px-5 xl:px-6 py-3 bg-gradient-to-b from-[#0a1628] to-transparent sticky top-0 z-40">
        <div>
          <h1 className="text-lg xl:text-xl font-bold text-[#e2e8fb] font-headline tracking-wide">
            Good Morning, Sarah
          </h1>
          <p className="text-[#a5abbd] text-xs mt-0.5">
            Monday, 24 Oct 2023 &bull; 09:14 AM
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <input
              className="bg-[#172031] border-none rounded-full py-2 px-5 pl-10 text-xs text-[#a5abbd] w-52 xl:w-60 focus:ring-1 focus:ring-[#81ecff]/30 transition-all duration-300 staff-glass-card"
              placeholder="Search insights..."
              type="text"
            />
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#a5abbd] text-base">
              search
            </span>
          </div>
          <button className="relative w-9 h-9 flex items-center justify-center text-[#a5abbd] hover:text-[#81ecff] transition-colors duration-300">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#ff716c] rounded-full border-2 border-[#070e1b]"></span>
          </button>
        </div>
      </header>

      <div className="px-5 xl:px-6 pb-8 space-y-5">
        {/* TOP METRIC CARDS */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            icon="timer"
            iconBg="bg-[#6001d1]/20 text-[#af88ff]"
            label="Total Hours (Week)"
            value="38.5"
            badge="+2.5h"
            badgeColor="bg-[#81ecff]/10 text-[#81ecff] border-[#81ecff]/20"
          />
          <MetricCard
            icon="verified"
            iconBg="bg-[#00e3fd]/20 text-[#81ecff]"
            label="Punctuality Score"
            value="98%"
            badge="Top 5%"
            badgeColor="bg-[#a1ffef]/10 text-[#a1ffef] border-[#a1ffef]/20"
          />
          <MetricCard
            icon="beach_access"
            iconBg="bg-[#6df5e1]/20 text-[#a1ffef]"
            label="Annual Leave"
            value={<>12 <span className="text-xs font-medium text-[#a5abbd]">days</span></>}
          />
          <MetricCard
            icon="event"
            iconBg="bg-[#6001d1]/20 text-[#af88ff]"
            label="Next Shift"
            value={<span className="text-lg">08:00 AM</span>}
            badge="Tomorrow"
            badgeColor="bg-[#af88ff]/10 text-[#af88ff] border-[#af88ff]/20"
          />
        </div>

        {/* SECOND METRIC ROW */}
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-4">
          <SmallMetric label="Days Present" value="19" />
          <SmallMetric label="Days Absent" value="1" />
          <SmallMetric label="Late Arrivals" value="0" valueColor="text-[#ff716c]" />
          <SmallMetric label="Total Overtime" value="4.2h" valueColor="text-[#81ecff]" />
          <div className="col-span-3 sm:col-span-1">
            <SmallMetric label="Monthly Hours" value="156.5" />
          </div>
        </div>

        {/* MAIN CONTENT GRID (Bento Style) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Weekly Attendance Bar Chart */}
          <div className="lg:col-span-4 staff-glass-card p-5 rounded-2xl staff-neon-border flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-bold text-sm font-headline">Weekly Attendance</h4>
              <span className="material-symbols-outlined text-[#a5abbd] text-[20px]">more_horiz</span>
            </div>
            <div className="flex-1 flex items-end justify-between gap-3 px-1 relative">
              <div className="absolute w-full border-t border-dashed border-[#81ecff]/30 top-1/4 left-0"></div>
              {weeklyData.map((item) => (
                <div key={item.day} className="flex flex-col items-center gap-2 flex-1">
                  <div className="w-full bg-[#81ecff]/20 rounded-full h-36 relative overflow-hidden">
                    <div
                      className="absolute bottom-0 w-full bg-gradient-to-t from-[#81ecff] to-[#00e3fd] rounded-full shadow-[0_0_15px_rgba(129,236,255,0.4)]"
                      style={{ height: item.height }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-[#a5abbd]">{item.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Wellness Ring Chart */}
          <div className="lg:col-span-4 staff-glass-card p-5 rounded-2xl staff-neon-border flex flex-col items-center justify-center text-center min-h-[300px]">
            <h4 className="font-bold text-sm font-headline mb-5 self-start">Wellness Pulse</h4>
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 224 224">
                <circle
                  className="text-[#1c2639]"
                  cx="112" cy="112" fill="transparent" r="95"
                  stroke="currentColor" strokeWidth="12"
                />
                <circle
                  cx="112" cy="112" fill="transparent" r="95"
                  stroke="url(#staff-cyan-gradient)"
                  strokeDasharray="596" strokeDashoffset="95"
                  strokeLinecap="round" strokeWidth="12"
                />
                <defs>
                  <linearGradient id="staff-cyan-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#81ecff" />
                    <stop offset="100%" stopColor="#00e3fd" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-bold font-headline">84%</span>
                <span className="text-[#a1ffef] text-[10px] font-bold uppercase tracking-widest mt-0.5">Healthy</span>
              </div>
            </div>
            <div className="mt-5 flex gap-6">
              <div className="text-center">
                <p className="text-[#a5abbd] text-[9px] uppercase font-bold">Burnout Risk</p>
                <p className="text-[#a1ffef] font-bold text-sm mt-0.5">Low</p>
              </div>
              <div className="text-center border-l border-[#414857]/30 pl-6">
                <p className="text-[#a5abbd] text-[9px] uppercase font-bold">Engagement</p>
                <p className="text-[#e2e8fb] font-bold text-sm mt-0.5">High</p>
              </div>
            </div>
          </div>

          {/* Feed Panel */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full">
            <div className="staff-glass-card p-4 rounded-2xl staff-neon-border flex-1 overflow-hidden flex flex-col min-h-[300px]">
              {/* Tabs */}
              <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-1">
                {feedTabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFeedTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors ${
                      activeFeedTab === tab
                        ? "bg-[#00e3fd] text-[#004d57] shadow-[0_0_10px_rgba(129,236,255,0.3)]"
                        : "text-[#a5abbd] hover:bg-[#1c2639]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Feed Items */}
              <div className="space-y-3 overflow-y-auto pr-1 flex-1">
                <div className="p-3 rounded-xl bg-[#ff716c]/5 border border-[#ff716c]/20 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#ff716c]/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#ff716c] text-[18px]">priority_high</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">Update Required</h5>
                    <p className="text-[10px] text-[#a5abbd] mt-0.5">Your certification expires in 3 days. Renew now to avoid gaps.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#81ecff]/5 border border-[#81ecff]/20 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#81ecff]/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#81ecff] text-[18px]">campaign</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">New Policy Updated</h5>
                    <p className="text-[10px] text-[#a5abbd] mt-0.5">The remote work guidelines for Q4 have been published.</p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#af88ff]/5 border border-[#af88ff]/20 flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#af88ff]/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[#af88ff] text-[18px]">emoji_events</span>
                  </div>
                  <div>
                    <h5 className="text-xs font-bold">Spotlight: David Chen</h5>
                    <p className="text-[10px] text-[#a5abbd] mt-0.5">Celebrating outstanding performance in Client Success!</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Activity Log Table */}
          <div className="lg:col-span-8 staff-glass-card rounded-2xl staff-neon-border overflow-hidden">
            <div className="px-5 py-4 border-b border-[#414857]/10 flex justify-between items-center">
              <h4 className="font-bold text-sm font-headline">Activity Log</h4>
              <button className="text-[#81ecff] text-xs font-bold hover:underline">View All History</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-[#0c1322]">
                  <tr>
                    <th className="px-5 py-3 text-[9px] uppercase font-bold text-[#a5abbd] tracking-wider">Date</th>
                    <th className="px-5 py-3 text-[9px] uppercase font-bold text-[#a5abbd] tracking-wider">Check-in Time</th>
                    <th className="px-5 py-3 text-[9px] uppercase font-bold text-[#a5abbd] tracking-wider">Action</th>
                    <th className="px-5 py-3 text-[9px] uppercase font-bold text-[#a5abbd] tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#414857]/10">
                  {activityLog.map((row, i) => (
                    <tr key={i} className="hover:bg-[#0c1322] transition-colors">
                      <td className="px-5 py-3 text-xs font-medium">{row.date}</td>
                      <td className="px-5 py-3 text-xs font-medium">{row.time}</td>
                      <td className="px-5 py-3">
                        <span className="px-2 py-0.5 bg-[#1c2639] text-[#a5abbd] rounded-md text-[10px] font-bold border border-[#414857]/30">
                          {row.action}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={`w-1.5 h-1.5 rounded-full ${row.dotColor}`}></div>
                          <span className={`text-[10px] font-bold ${row.statusColor}`}>{row.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI Assistant Card */}
          <div className="lg:col-span-4 staff-glass-card p-5 rounded-2xl staff-neon-border flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#81ecff]/20 blur-[60px] rounded-full"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#81ecff] to-[#af88ff] flex items-center justify-center animate-pulse">
                  <span className="material-symbols-outlined text-[14px] text-[#070e1b]">smart_toy</span>
                </div>
                <h5 className="font-bold text-xs tracking-wide">Pulse AI Assistant</h5>
              </div>
              <div className="bg-[#1c2639]/60 rounded-xl p-3 mb-3 border border-[#414857]/20">
                <p className="text-xs leading-relaxed">
                  You&apos;re on track for your <span className="text-[#81ecff] font-bold">Attendance Bonus</span> this month! Keep arriving by 09:00 AM for the next 3 days to qualify.
                </p>
              </div>
              <div className="flex gap-2">
                <span className="px-2.5 py-1 bg-[#1c2639] rounded-full text-[9px] font-bold text-[#a5abbd] border border-[#414857]/20 cursor-pointer hover:bg-[#81ecff]/10 transition-colors">
                  Analyze my patterns
                </span>
                <span className="px-2.5 py-1 bg-[#1c2639] rounded-full text-[9px] font-bold text-[#a5abbd] border border-[#414857]/20 cursor-pointer hover:bg-[#81ecff]/10 transition-colors">
                  Holiday policy
                </span>
              </div>
            </div>
            <div className="mt-5 relative z-10">
              <div className="relative">
                <input
                  className="w-full bg-[#172031] border-none rounded-xl py-2.5 px-3 text-xs text-[#e2e8fb] focus:ring-1 focus:ring-[#81ecff]/40 staff-glass-card"
                  placeholder="Ask anything..."
                  type="text"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 text-[#81ecff]">
                  <span className="material-symbols-outlined text-[18px]">send</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
