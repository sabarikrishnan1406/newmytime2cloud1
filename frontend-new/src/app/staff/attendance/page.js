"use client";

import { useEffect, useState } from "react";
import { getUser } from "@/config";
import { api, buildQueryParams } from "@/lib/api-client";
import { getStaffUser } from "@/lib/staff-user";

function getClockInClass(status) {
  if (status === "Late") return "text-red-300";
  if (status === "Weekend" || status === "Off") return "text-slate-500";
  return "text-slate-100";
}

function getDefaultTextClass(status) {
  return status === "Weekend" || status === "Off" ? "text-slate-500" : "text-slate-100";
}

function getStatusStyle(status) {
  const map = {
    Present: { class: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20", dot: "bg-emerald-300" },
    Late: { class: "bg-red-400/10 text-red-300 border border-red-400/20", dot: "bg-red-300" },
    Absent: { class: "bg-red-400/10 text-red-300 border border-red-400/20", dot: "bg-red-400" },
    Weekend: { class: "bg-white/5 text-slate-400 border border-white/10", dot: "bg-slate-500" },
    Off: { class: "bg-white/5 text-slate-400 border border-white/10", dot: "bg-slate-500" },
    Leave: { class: "bg-purple-400/10 text-purple-300 border border-purple-400/20", dot: "bg-purple-300" },
    Holiday: { class: "bg-amber-400/10 text-amber-300 border border-amber-400/20", dot: "bg-amber-300" },
  };
  return map[status] || map.Present;
}

export default function StaffAttendancePage() {
  const [stats, setStats] = useState({ present: 0, absent: 0, late: 0, total: 0 });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const u = await getStaffUser();
        const params = await buildQueryParams({});
        const sysUserId = u.system_user_id || u.employee_id;

        // Get month date range
        const from = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`;
        const lastDay = new Date(selectedYear, selectedMonth + 1, 0).getDate();
        const to = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${lastDay}`;

        // Fetch attendance logs for the month (stats calculated from these)
        try {
          const { data } = await api.get("/attendance_logs", {
            params: { ...params, from_date: from, to_date: to, system_user_id: sysUserId, per_page: 200 },
          });
          const logs = data?.data || [];

          // Group by date
          const byDate = {};
          logs.forEach((log) => {
            const date = log.LogTime?.split(" ")[0] || log.LogTime?.split("T")[0];
            if (!byDate[date]) byDate[date] = [];
            byDate[date].push(log);
          });

          // Build rows for each day of the month
          const dayRows = [];
          for (let d = 1; d <= lastDay; d++) {
            const dateStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
            const dt = new Date(dateStr + "T00:00:00");
            const dayName = dt.toLocaleDateString("en-US", { weekday: "long" });
            const dateDisplay = dt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
            const dayLogs = byDate[dateStr] || [];
            const isFuture = dt > new Date();

            if (isFuture) continue;

            if (dayLogs.length === 0) {
              dayRows.push({
                date: dateDisplay, day: dayName, status: "Absent",
                clockIn: "--:--", clockOut: "--:--", duration: "00h 00m",
                indicators: ["-"], indicatorClass: "text-slate-500",
                sourceIcon: null, source: "-",
              });
              continue;
            }

            // Sort logs by time
            dayLogs.sort((a, b) => new Date(a.LogTime) - new Date(b.LogTime));
            const firstLog = dayLogs[0];
            const lastLog = dayLogs[dayLogs.length - 1];
            const inTime = new Date(firstLog.LogTime);
            const outTime = dayLogs.length > 1 ? new Date(lastLog.LogTime) : null;

            // Duration
            let durationStr = "00h 00m";
            if (outTime) {
              const mins = Math.round((outTime - inTime) / 60000);
              durationStr = `${String(Math.floor(mins / 60)).padStart(2, "0")}h ${String(mins % 60).padStart(2, "0")}m`;
            }

            // Status
            let status = "Present";
            if (firstLog.log_type === "In" && !outTime) status = "Present";

            // Source
            const isCamera = firstLog.DeviceID?.startsWith("Camera") || firstLog.DeviceID?.startsWith("CAM") || firstLog.channel === "camera";
            const isMobile = firstLog.DeviceID?.includes("Mobile");
            const sourceIcon = isCamera ? "videocam" : isMobile ? "smartphone" : "fingerprint";
            const source = isCamera ? "Camera" : isMobile ? "Mobile" : "Device";

            dayRows.push({
              date: dateDisplay, day: dayName, status,
              clockIn: inTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              clockOut: outTime ? outTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--",
              duration: durationStr,
              indicators: dayLogs.length > 2 ? [`${dayLogs.length} logs`] : ["-"],
              indicatorClass: "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20",
              sourceIcon, source,
            });
          }

          // Calculate stats from actual rows
          const presentDays = dayRows.filter((r) => r.status === "Present").length;
          const absentDays = dayRows.filter((r) => r.status === "Absent").length;
          const lateDays = dayRows.filter((r) => r.status === "Late").length;
          setStats({
            present: presentDays,
            absent: absentDays,
            late: lateDays,
            total: dayRows.length,
          });

          setRows(dayRows.reverse()); // Most recent first
        } catch (e) { console.warn("Logs error", e); }

      } catch (err) {
        console.error("Attendance error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedMonth, selectedYear]);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const attendancePercent = stats.total > 0 ? Math.round((stats.present / stats.total) * 100) : 0;

  const summaryCards = [
    {
      icon: "calendar_month", iconClass: "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20",
      label: "Days Present", value: stats.present, unit: "Days",
      badge: `${attendancePercent}%`, badgeClass: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20",
      footerType: "bar", footerLabel: "Attendance rate",
      footerClass: `bg-emerald-300`, footerWidth: `${attendancePercent}%`,
    },
    {
      icon: "schedule", iconClass: "bg-purple-400/10 text-purple-300 border border-purple-400/20",
      label: "Days Absent", value: stats.absent, unit: "Days",
      badge: stats.absent > 3 ? "Action" : "OK",
      badgeClass: stats.absent > 3 ? "text-red-300" : "text-emerald-300",
      footerType: "text", footerLabel: "This month",
    },
    {
      icon: "history", iconClass: "bg-red-400/10 text-red-300 border border-red-400/20",
      label: "Days Late", value: stats.late, unit: "Days",
      badge: stats.late > 2 ? "Warning" : "OK",
      badgeClass: stats.late > 2 ? "text-red-300" : "text-emerald-300",
      footerType: "text", footerLabel: "This month",
      footerIcon: stats.late > 2 ? "trending_up" : null,
    },
  ];

  if (loading) {
    return <div className="p-8 flex items-center justify-center min-h-screen"><div className="text-slate-400 text-sm">Loading attendance...</div></div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div>
        <section className="mb-4">
          <nav className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-slate-500">
            <span>DASHBOARD</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-cyan-300">ATTENDANCE LOGS</span>
          </nav>
          <div className="flex items-center justify-between">
            <h1 className="font-headline text-xl font-bold tracking-tight text-slate-100">Attendance Logs</h1>
            <div className="flex gap-2">
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 text-xs text-slate-100">
                {monthNames.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select value={selectedYear} onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="rounded-xl border border-white/10 bg-slate-800/80 px-3 py-2 text-xs text-slate-100">
                {[2026, 2025, 2024].map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
          </div>
        </section>

        <section className="mb-4 grid gap-3 md:grid-cols-2 2xl:grid-cols-3">
          {summaryCards.map((card) => (
            <div key={card.label} className="staff-glass-card rounded-2xl p-4 transition hover:bg-slate-800/40">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconClass}`}>
                    <span className="material-symbols-outlined text-xl">{card.icon}</span>
                  </div>
                  <div>
                    <p className="mb-0.5 text-[9px] font-bold uppercase tracking-widest text-slate-500">{card.label}</p>
                    <h3 className="font-headline text-2xl font-bold text-slate-100">
                      {card.value} <span className="text-sm font-medium text-slate-500">{card.unit}</span>
                    </h3>
                  </div>
                </div>
                <div className="flex flex-col sm:items-end">
                  {card.footerType === "bar" ? (
                    <>
                      <span className={`w-fit rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${card.badgeClass}`}>{card.badge}</span>
                      <div className="mt-1.5 h-1 w-14 overflow-hidden rounded-full bg-slate-700">
                        <div className={`h-full ${card.footerClass}`} style={{ width: card.footerWidth }}></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className={`flex items-center gap-1 text-xs font-bold ${card.badgeClass}`}>
                        {card.footerIcon && <span className="material-symbols-outlined text-sm">{card.footerIcon}</span>}
                        {card.badge}
                      </span>
                      <span className="mt-0.5 text-[9px] font-medium uppercase text-slate-500">{card.footerLabel}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="staff-glass-card overflow-hidden rounded-2xl border border-white/5">
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[800px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-900/40">
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Date & Day</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Status</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Clock In</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Clock Out</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Duration</th>
                  <th className="px-4 py-3 text-[9px] font-black uppercase tracking-[0.14em] text-slate-500">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {rows.map((row, i) => {
                  const st = getStatusStyle(row.status);
                  return (
                    <tr key={i} className="transition-colors hover:bg-slate-900/20">
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold text-slate-100">{row.date}</span>
                        <span className="text-[10px] text-slate-500 ml-2">{row.day}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${st.class}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`}></span>
                          {row.status}
                        </span>
                      </td>
                      <td className={`px-4 py-3 text-xs font-semibold ${getClockInClass(row.status)}`}>{row.clockIn}</td>
                      <td className={`px-4 py-3 text-xs font-semibold ${getDefaultTextClass(row.status)}`}>{row.clockOut}</td>
                      <td className={`px-4 py-3 text-xs font-medium ${getDefaultTextClass(row.status)}`}>{row.duration}</td>
                      <td className="px-4 py-3">
                        {row.source === "-" ? (
                          <span className="text-slate-500 text-xs">-</span>
                        ) : (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <span className="material-symbols-outlined text-sm">{row.sourceIcon}</span>
                            <span className="text-[11px] font-medium">{row.source}</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr><td colSpan="6" className="px-4 py-8 text-center text-slate-500 text-xs">No attendance data for this month</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="space-y-3 p-3 lg:hidden">
            {rows.map((row, i) => {
              const st = getStatusStyle(row.status);
              return (
                <div key={i} className="rounded-xl border border-white/5 bg-slate-900/20 p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-xs font-bold text-slate-100">{row.date}</p>
                      <p className="text-[10px] text-slate-500">{row.day}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${st.class}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`}></span>
                      {row.status}
                    </span>
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <div className="rounded-lg bg-slate-800/40 p-2">
                      <p className="text-[8px] font-bold uppercase text-slate-500">In</p>
                      <p className={`text-xs font-semibold ${getClockInClass(row.status)}`}>{row.clockIn}</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/40 p-2">
                      <p className="text-[8px] font-bold uppercase text-slate-500">Out</p>
                      <p className={`text-xs font-semibold ${getDefaultTextClass(row.status)}`}>{row.clockOut}</p>
                    </div>
                    <div className="rounded-lg bg-slate-800/40 p-2">
                      <p className="text-[8px] font-bold uppercase text-slate-500">Duration</p>
                      <p className={`text-xs font-semibold ${getDefaultTextClass(row.status)}`}>{row.duration}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between bg-slate-900/20 px-4 py-3">
            <p className="text-[10px] font-semibold text-slate-500">
              Showing <span className="text-slate-100">{rows.length}</span> entries for {monthNames[selectedMonth]} {selectedYear}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
