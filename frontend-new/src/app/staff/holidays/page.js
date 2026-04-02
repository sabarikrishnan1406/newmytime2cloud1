"use client";

import { useEffect, useState } from "react";
import { api, buildQueryParams } from "@/lib/api-client";

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthShort = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const dayLabels = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const palette = [
  { color: "cyan", icon: "celebration", iconClass: "bg-cyan-300/10 text-cyan-300", tagClass: "bg-cyan-300/10 text-cyan-300 border-cyan-300/20", dotClass: "bg-cyan-300", glowClass: "bg-cyan-300/10 group-hover:bg-cyan-300/20", lineClass: "from-cyan-300/30", hoverClass: "group-hover:border-cyan-300/40", badgeClass: "bg-cyan-300/10 text-cyan-300", textClass: "text-cyan-300" },
  { color: "purple", icon: "corporate_fare", iconClass: "bg-purple-300/10 text-purple-300", tagClass: "bg-purple-300/10 text-purple-300 border-purple-300/20", dotClass: "bg-purple-300", glowClass: "bg-purple-300/10 group-hover:bg-purple-300/20", lineClass: "from-purple-300/30", hoverClass: "group-hover:border-purple-300/40", badgeClass: "bg-purple-300/10 text-purple-300", textClass: "text-purple-300" },
  { color: "emerald", icon: "nature_people", iconClass: "bg-emerald-300/10 text-emerald-300", tagClass: "bg-emerald-300/10 text-emerald-300 border-emerald-300/20", dotClass: "bg-emerald-300", glowClass: "bg-emerald-300/10 group-hover:bg-emerald-300/20", lineClass: "from-emerald-300/30", hoverClass: "group-hover:border-emerald-300/40", badgeClass: "bg-emerald-300/10 text-emerald-300", textClass: "text-emerald-300" },
  { color: "amber", icon: "beach_access", iconClass: "bg-amber-300/10 text-amber-300", tagClass: "bg-amber-300/10 text-amber-300 border-amber-300/20", dotClass: "bg-amber-300", glowClass: "bg-amber-300/10 group-hover:bg-amber-300/20", lineClass: "from-amber-300/30", hoverClass: "group-hover:border-amber-300/40", badgeClass: "bg-amber-300/10 text-amber-300", textClass: "text-amber-300" },
  { color: "red", icon: "flag", iconClass: "bg-red-300/10 text-red-300", tagClass: "bg-red-300/10 text-red-300 border-red-300/20", dotClass: "bg-red-300", glowClass: "bg-red-300/10 group-hover:bg-red-300/20", lineClass: "from-red-300/30", hoverClass: "group-hover:border-red-300/40", badgeClass: "bg-red-300/10 text-red-300", textClass: "text-red-300" },
  { color: "blue", icon: "event", iconClass: "bg-blue-300/10 text-blue-300", tagClass: "bg-blue-300/10 text-blue-300 border-blue-300/20", dotClass: "bg-blue-300", glowClass: "bg-blue-300/10 group-hover:bg-blue-300/20", lineClass: "from-blue-300/30", hoverClass: "group-hover:border-blue-300/40", badgeClass: "bg-blue-300/10 text-blue-300", textClass: "text-blue-300" },
];

function buildCalendarDays(year, month, holidayDates) {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const todayStr = today.toISOString().split("T")[0];
  const days = [];

  // Previous month padding
  const prevDays = new Date(year, month, 0).getDate();
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({ label: String(prevDays - i), muted: true });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const isToday = dateStr === todayStr;
    const isHoliday = holidayDates.has(dateStr);
    days.push({ label: String(d), active: isToday, holiday: isHoliday });
  }

  // Next month padding
  const remaining = 42 - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({ label: String(i), muted: true });
  }
  return days;
}

export default function StaffHolidaysPage() {
  const [holidays, setHolidays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  // All months collapsed by default
  const [collapsedMonths, setCollapsedMonths] = useState(() => {
    const all = {};
    for (let i = 0; i < 12; i++) all[i] = true;
    return all;
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = await buildQueryParams({});
        const { data } = await api.get("/holidays", { params: { ...params, per_page: 100, year: selectedYear } });
        setHolidays(data?.data || (Array.isArray(data) ? data : []));
      } catch (e) { console.warn("Holidays error", e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [selectedYear]);

  const now = new Date();
  const upcoming = holidays.filter((h) => new Date(h.start_date) >= now).sort((a, b) => new Date(a.start_date) - new Date(b.start_date)).slice(0, 3);
  const byMonth = {};
  holidays.forEach((h) => { const m = new Date(h.start_date).getMonth(); if (!byMonth[m]) byMonth[m] = []; byMonth[m].push(h); });
  const totalDays = holidays.reduce((s, h) => s + (parseInt(h.total_days) || 1), 0);

  // Calendar holiday dates
  const holidayDates = new Set();
  holidays.forEach((h) => {
    let d = new Date(h.start_date);
    const end = new Date(h.end_date || h.start_date);
    while (d <= end) { holidayDates.add(d.toISOString().split("T")[0]); d.setDate(d.getDate() + 1); }
  });
  const calDays = buildCalendarDays(calYear, calMonth, holidayDates);

  if (loading) return <div className="p-8 flex items-center justify-center min-h-screen"><div className="text-slate-400 text-sm">Loading...</div></div>;

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-[10%] -top-[10%] h-[400px] w-[400px] rounded-full bg-cyan-300/10 blur-[150px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] h-[300px] w-[300px] rounded-full bg-purple-300/10 blur-[120px]"></div>
      </div>

      <div>
        {/* Header */}
        <section className="mb-5 rounded-2xl border border-cyan-300/10 bg-[#070e1b]/80 px-5 py-4 backdrop-blur-xl flex items-center justify-between">
          <div>
            <h1 className="font-headline text-xl font-bold tracking-tight text-slate-100">Holidays & Calendar</h1>
            <p className="mt-0.5 text-xs text-slate-500">{totalDays} days off scheduled for {selectedYear}</p>
          </div>
          <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))} className="rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 text-xs text-slate-100">
            {[2026, 2025, 2024].map((y) => <option key={y} value={y}>{y}</option>)}
          </select>
        </section>

        {/* Upcoming Cards */}
        {upcoming.length > 0 && (
          <section className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {upcoming.map((h, i) => {
              const s = palette[i % palette.length];
              const dt = new Date(h.start_date);
              const diff = Math.ceil((dt - now) / 86400000);
              return (
                <article key={h.id} className="staff-glass-card group relative overflow-hidden rounded-2xl p-5 transition duration-300 hover:scale-[1.01]">
                  <div className={`absolute -right-4 -top-4 h-20 w-20 rounded-full blur-3xl transition-all ${s.glowClass}`}></div>
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${s.iconClass}`}>
                      <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                    </div>
                    <span className={`rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest ${s.tagClass}`}>
                      {diff > 0 ? `In ${diff} days` : diff === 0 ? "Today!" : "Passed"}
                    </span>
                  </div>
                  <h3 className="font-headline text-base font-bold text-slate-100">{h.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{dt.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dotClass}`}></span>
                    <span className="text-[10px] font-semibold text-slate-300">{h.total_days || 1} Day{(h.total_days || 1) > 1 ? "s" : ""} Off</span>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-12">
          {/* Monthly List */}
          <div className="lg:col-span-8">
            <div className="staff-glass-card rounded-2xl p-5">
              <h2 className="mb-5 font-headline text-sm font-bold text-slate-100">{selectedYear} Holiday Calendar</h2>
              {Object.keys(byMonth).sort((a, b) => a - b).map((m, idx) => {
                const s = palette[parseInt(m) % palette.length];
                const isCollapsed = collapsedMonths[m];
                return (
                  <section key={m} className="mb-5 last:mb-0">
                    <div
                      className="mb-2 flex items-center gap-3 cursor-pointer select-none"
                      onClick={() => setCollapsedMonths((prev) => ({ ...prev, [m]: !prev[m] }))}
                    >
                      <h4 className={`font-headline text-xs font-bold ${s.textClass}`}>{monthNames[m]}</h4>
                      <div className={`h-px flex-1 bg-gradient-to-r ${s.lineClass} to-transparent`}></div>
                      <span className="text-[9px] font-bold text-slate-500">{byMonth[m].length} holiday{byMonth[m].length > 1 ? "s" : ""}</span>
                      <span className={`material-symbols-outlined text-sm text-slate-500 transition-transform ${isCollapsed ? "" : "rotate-180"}`}>expand_less</span>
                    </div>
                    {!isCollapsed && (
                      <div className="space-y-2">
                        {byMonth[m].map((h, hIdx) => {
                          const hs = palette[(parseInt(m) + hIdx) % palette.length];
                          const dt = new Date(h.start_date);
                          return (
                            <article key={h.id} className="group flex items-center justify-between gap-3 rounded-xl bg-slate-900/30 p-3 transition hover:bg-slate-800/40">
                              <div className="flex items-center gap-3">
                                <div className={`flex h-9 w-9 flex-col items-center justify-center rounded-lg border border-white/10 bg-slate-800/70 transition ${hs.hoverClass}`}>
                                  <span className="text-[7px] font-bold uppercase text-slate-500">{monthShort[m]}</span>
                                  <span className="text-xs font-bold leading-none text-slate-100">{dt.getDate()}</span>
                                </div>
                                <div>
                                  <h5 className="text-xs font-semibold text-slate-100">{h.name}</h5>
                                  <p className="text-[10px] text-slate-500">
                                    {h.end_date && h.end_date !== h.start_date
                                      ? `${dt.toLocaleDateString("en-US", { month: "short", day: "numeric" })} — ${new Date(h.end_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                                      : dt.toLocaleDateString("en-US", { weekday: "long" })}
                                  </p>
                                </div>
                              </div>
                              <span className={`rounded-lg px-2 py-0.5 text-[9px] font-bold uppercase ${hs.badgeClass}`}>
                                {h.total_days || 1} Day{(h.total_days || 1) > 1 ? "s" : ""}
                              </span>
                            </article>
                          );
                        })}
                      </div>
                    )}
                  </section>
                );
              })}
              {Object.keys(byMonth).length === 0 && (
                <div className="text-center text-slate-500 text-xs py-8">No holidays found for {selectedYear}</div>
              )}
            </div>
          </div>

          {/* Sidebar: Mini Calendar + Legend */}
          <aside className="space-y-5 lg:col-span-4">
            {/* Mini Calendar */}
            <section className="staff-glass-card rounded-2xl p-5">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="font-headline text-sm font-bold text-slate-100">{monthNames[calMonth]} {calYear}</h4>
                <div className="flex gap-1">
                  <button onClick={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1); } else setCalMonth(calMonth - 1); }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-cyan-300/10 hover:text-cyan-300">
                    <span className="material-symbols-outlined text-base">chevron_left</span>
                  </button>
                  <button onClick={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1); } else setCalMonth(calMonth + 1); }}
                    className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 transition hover:bg-cyan-300/10 hover:text-cyan-300">
                    <span className="material-symbols-outlined text-base">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="mb-1 grid grid-cols-7 gap-1">
                {dayLabels.map((d) => <div key={d} className="py-1 text-center text-[9px] font-bold uppercase text-slate-500">{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calDays.map((day, i) => {
                  const base = "aspect-square flex items-center justify-center rounded-lg text-[11px] transition-colors";
                  if (day.active) return <div key={i} className={`${base} bg-cyan-300 font-bold text-[#070e1b] shadow-[0_0_8px_rgba(0,229,255,0.4)]`}>{day.label}</div>;
                  if (day.muted) return <div key={i} className={`${base} text-slate-500/30`}>{day.label}</div>;
                  if (day.holiday) {
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day.label).padStart(2, "0")}`;
                    const holIdx = holidays.findIndex((h) => dateStr >= h.start_date && dateStr <= (h.end_date || h.start_date));
                    const hol = holIdx >= 0 ? holidays[holIdx] : null;
                    const holColor = palette[(holIdx >= 0 ? holIdx : 0) % palette.length];
                    return (
                      <div key={i} className={`${base} relative font-bold ${holColor.textClass} bg-${holColor.color}-300/5 cursor-pointer group/cal`} title={hol?.name || "Holiday"}>
                        {day.label}
                        <span className={`absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${holColor.dotClass}`}></span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/cal:block z-50 pointer-events-none">
                          <div className="rounded-lg bg-[#0D1626] border border-cyan-300/20 px-3 py-2 shadow-lg shadow-cyan-300/10 whitespace-nowrap">
                            <p className="text-[10px] font-bold text-cyan-300">{hol?.name || "Holiday"}</p>
                            {hol?.total_days > 1 && <p className="text-[9px] text-slate-400">{hol.total_days} days</p>}
                          </div>
                          <div className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45 bg-[#0D1626] border-r border-b border-cyan-300/20"></div>
                        </div>
                      </div>
                    );
                  }
                  return <div key={i} className={`${base} text-slate-100 hover:bg-cyan-300/5 cursor-pointer`}>{day.label}</div>;
                })}
              </div>
            </section>

            {/* Legend */}
            <section className="staff-glass-card rounded-2xl p-5">
              <h4 className="mb-3 font-headline text-sm font-bold text-slate-100">Summary</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300"></span>
                    <span className="text-xs font-medium text-slate-200">Total Holidays</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-cyan-300">{holidays.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-purple-300"></span>
                    <span className="text-xs font-medium text-slate-200">Total Days Off</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-purple-300">{totalDays}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-300"></span>
                    <span className="text-xs font-medium text-slate-200">Upcoming</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-emerald-300">{upcoming.length}</span>
                </div>
              </div>
            </section>

            {/* Next Holiday */}
            {upcoming.length > 0 && (
              <section className="staff-glass-card rounded-2xl border-l-4 border-cyan-300 p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                    <span className="material-symbols-outlined">event</span>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-100">{upcoming[0].name}</p>
                    <p className="text-[10px] text-slate-500">
                      {new Date(upcoming[0].start_date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                      {" — "}
                      {Math.ceil((new Date(upcoming[0].start_date) - now) / 86400000)} days away
                    </p>
                  </div>
                </div>
              </section>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}
