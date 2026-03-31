const summaryCards = [
  {
    icon: "calendar_month",
    iconClass: "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20",
    label: "Total Working Days",
    value: "22",
    unit: "Days",
    badge: "100% Attendance",
    badgeClass: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20",
    footerType: "bar",
    footerLabel: "Full month coverage",
    footerClass: "w-full bg-emerald-300",
  },
  {
    icon: "schedule",
    iconClass: "bg-purple-400/10 text-purple-300 border border-purple-400/20",
    label: "Avg Punch-in Time",
    value: "09:04",
    unit: "AM",
    badge: "4m Behind",
    badgeClass: "bg-red-400/10 text-red-300 border border-red-400/20",
    footerType: "text",
    footerLabel: "Target: 09:00 AM",
  },
  {
    icon: "history",
    iconClass: "bg-red-400/10 text-red-300 border border-red-400/20",
    label: "Days Late",
    value: "03",
    unit: "Days",
    badge: "Higher",
    badgeClass: "text-red-300",
    footerType: "text",
    footerLabel: "than last month",
    footerIcon: "trending_up",
  },
];

const attendanceRows = [
  {
    date: "Oct 25, 2023",
    day: "Wednesday",
    status: "Present",
    statusClass: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20",
    statusDot: "bg-emerald-300",
    clockIn: "08:52 AM",
    clockOut: "05:45 PM",
    duration: "08h 53m",
    indicators: ["+15m OT"],
    indicatorClass: "bg-cyan-400/10 text-cyan-300 border border-cyan-400/20",
    sourceIcon: "fingerprint",
    source: "Biometric",
  },
  {
    date: "Oct 24, 2023",
    day: "Tuesday",
    status: "Late",
    statusClass: "bg-red-400/10 text-red-300 border border-red-400/20",
    statusDot: "bg-red-300",
    clockIn: "09:12 AM",
    clockOut: "06:05 PM",
    duration: "08h 53m",
    indicators: ["-12m"],
    indicatorClass: "bg-red-400/10 text-red-300 border border-red-400/20",
    sourceIcon: "smartphone",
    source: "Mobile App",
  },
  {
    date: "Oct 23, 2023",
    day: "Monday",
    status: "Present",
    statusClass: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20",
    statusDot: "bg-emerald-300",
    clockIn: "08:45 AM",
    clockOut: "05:30 PM",
    duration: "08h 45m",
    indicators: ["Remote"],
    indicatorClass: "bg-purple-400/10 text-purple-300 border border-purple-400/20",
    sourceIcon: "laptop_mac",
    source: "Web Portal",
  },
  {
    date: "Oct 22, 2023",
    day: "Sunday",
    status: "Weekend",
    statusClass: "bg-white/5 text-slate-400 border border-white/10",
    statusDot: "bg-slate-500",
    clockIn: "--:--",
    clockOut: "--:--",
    duration: "00h 00m",
    indicators: ["-"],
    indicatorClass: "text-slate-500",
    sourceIcon: null,
    source: "-",
  },
];

function getClockInClass(status) {
  if (status === "Late") return "text-red-300";
  if (status === "Weekend") return "text-slate-500";
  return "text-slate-100";
}

function getDefaultTextClass(status) {
  return status === "Weekend" ? "text-slate-500" : "text-slate-100";
}

export default function StaffAttendancePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div>
        <section className="mb-6 flex flex-col gap-5 xl:mb-8 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <nav className="mb-2 flex flex-wrap items-center gap-2 text-xs font-medium tracking-wide text-slate-500">
              <span>DASHBOARD</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-cyan-300">ATTENDANCE LOGS</span>
            </nav>
            <h1 className="font-headline text-2xl font-bold tracking-tight text-slate-100">Attendance Logs</h1>
          </div>

          <div className="flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row sm:items-center">
            <div className="grid grid-cols-3 rounded-2xl bg-slate-800/70 p-1 sm:flex">
              <button className="rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-slate-400 transition hover:text-slate-100">Daily</button>
              <button className="rounded-xl bg-cyan-400/10 px-3.5 py-1.5 text-[11px] font-bold text-cyan-300 shadow-sm">Weekly</button>
              <button className="rounded-xl px-3.5 py-1.5 text-[11px] font-bold text-slate-400 transition hover:text-slate-100">Monthly</button>
            </div>
            <button className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-slate-800/70 px-4 py-2 text-[13px] font-semibold text-slate-100 shadow-lg transition hover:bg-slate-700/70 sm:w-auto">
              <span className="material-symbols-outlined text-sm">download</span>
              Export
            </button>
          </div>
        </section>

        <section className="mb-6 grid gap-4 sm:mb-8 md:grid-cols-2 2xl:grid-cols-3">
          {summaryCards.map((card) => (
            <div key={card.label} className="staff-glass-card rounded-[1.35rem] p-4 transition hover:bg-slate-800/40 sm:rounded-[1.5rem] sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-3.5 sm:gap-4">
                  <div className={`flex h-11 w-11 items-center justify-center rounded-2xl sm:h-12 sm:w-12 ${card.iconClass}`}>
                    <span className="material-symbols-outlined text-2xl">{card.icon}</span>
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">{card.label}</p>
                    <h3 className="font-headline text-3xl font-bold text-slate-100">
                      {card.value} <span className="text-base font-medium text-slate-500">{card.unit}</span>
                    </h3>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end">
                  {card.footerType === "bar" ? (
                    <>
                      <span className={`w-fit rounded-full px-2 py-0.5 text-[9px] font-black uppercase ${card.badgeClass}`}>{card.badge}</span>
                      <div className="mt-2 h-1 w-14 overflow-hidden rounded-full bg-slate-700">
                        <div className={`h-full ${card.footerClass}`}></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className={`flex items-center gap-1 text-xs font-bold sm:text-sm ${card.badgeClass}`}>
                        {card.footerIcon && <span className="material-symbols-outlined text-sm">{card.footerIcon}</span>}
                        {card.badge}
                      </span>
                      <span className="mt-1 text-[9px] font-medium uppercase text-slate-500">{card.footerLabel}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="staff-glass-card mb-6 rounded-[1.35rem] border border-white/5 p-3 sm:mb-8 sm:rounded-[1.5rem] sm:p-4">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <button className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-800/70 px-3.5 py-2 text-[13px] font-semibold text-slate-100 sm:w-auto">
                <span className="material-symbols-outlined text-sm text-slate-500">calendar_today</span>
                Oct 01 - Oct 31, 2023
                <span className="material-symbols-outlined text-sm text-slate-500">arrow_drop_down</span>
              </button>
              <button className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-800/70 px-3.5 py-2 text-[13px] font-semibold text-slate-100 sm:w-auto">
                Status: All
                <span className="material-symbols-outlined text-sm text-slate-500">arrow_drop_down</span>
              </button>
              <button className="flex w-full items-center justify-between gap-2 rounded-xl border border-white/10 bg-slate-800/70 px-3.5 py-2 text-[13px] font-semibold text-slate-100 sm:w-auto">
                Location: HQ
                <span className="material-symbols-outlined text-sm text-slate-500">arrow_drop_down</span>
              </button>
              <button className="px-1 text-left text-xs font-bold uppercase tracking-widest text-cyan-300 transition hover:text-cyan-200 sm:px-2">
                Clear All Filters
              </button>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
              <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-300 px-4 py-2 text-[13px] font-bold text-slate-900 shadow-[0_4px_15px_rgba(90,228,208,0.2)] transition hover:shadow-[0_4px_25px_rgba(90,228,208,0.35)] sm:w-auto">
                <span className="material-symbols-outlined text-sm">login</span>
                Clock In
              </button>
              <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-800 px-4 py-2 text-[13px] font-bold text-slate-100 transition hover:bg-slate-700 sm:w-auto">
                <span className="material-symbols-outlined text-sm">logout</span>
                Clock Out
              </button>
            </div>
          </div>
        </section>

        <section className="staff-glass-card overflow-hidden rounded-[1.5rem] border border-white/5 sm:rounded-[2rem]">
          <div className="space-y-4 p-4 sm:p-6 lg:hidden">
            {attendanceRows.map((row) => (
              <div key={`mobile-${row.date}-${row.day}`} className="rounded-[1.25rem] border border-white/5 bg-slate-900/20 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-100">{row.date}</p>
                    <p className="mt-1 text-xs text-slate-500">{row.day}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-black uppercase ${row.statusClass}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${row.statusDot}`}></span>
                    {row.status}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl bg-slate-800/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Clock In</p>
                    <p className={`mt-2 text-sm font-semibold ${getClockInClass(row.status)}`}>{row.clockIn}</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Clock Out</p>
                    <p className={`mt-2 text-sm font-semibold ${getDefaultTextClass(row.status)}`}>{row.clockOut}</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Duration</p>
                    <p className={`mt-2 text-sm font-semibold ${getDefaultTextClass(row.status)}`}>{row.duration}</p>
                  </div>
                  <div className="rounded-xl bg-slate-800/40 p-3">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Source</p>
                    {row.source === "-" ? (
                      <p className="mt-2 text-sm font-semibold text-slate-500">-</p>
                    ) : (
                      <div className="mt-2 flex items-center gap-2 text-sm font-semibold text-slate-200">
                        <span className="material-symbols-outlined text-base text-slate-500">{row.sourceIcon}</span>
                        <span>{row.source}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Indicators</span>
                    {row.indicators[0] === "-" ? (
                      <span className="text-sm text-slate-500">-</span>
                    ) : (
                      row.indicators.map((indicator) => (
                        <span key={`${row.date}-${indicator}`} className={`rounded-md px-2 py-0.5 text-xs font-bold ${row.indicatorClass}`}>
                          {indicator}
                        </span>
                      ))
                    )}
                  </div>
                  <button className="text-xs font-black uppercase tracking-widest text-slate-500 transition hover:text-cyan-300">Details</button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full min-w-[940px] border-collapse text-left">
              <thead>
                <tr className="bg-slate-900/40">
                  <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Date &amp; Day</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Status</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Clock In</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Clock Out</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Duration</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Indicators</th>
                  <th className="px-5 py-4 text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Source</th>
                  <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-[0.14em] text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {attendanceRows.map((row) => (
                  <tr key={`${row.date}-${row.day}`} className="transition-colors hover:bg-slate-900/20">
                    <td className="px-6 py-5">
                      <div className="flex flex-col">
                        <span className="text-[15px] font-bold text-slate-100">{row.date}</span>
                        <span className="text-xs text-slate-500">{row.day}</span>
                      </div>
                    </td>
                    <td className="px-5 py-5">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-black uppercase ${row.statusClass}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${row.statusDot}`}></span>
                        {row.status}
                      </span>
                    </td>
                    <td className={`px-5 py-5 text-[15px] font-semibold ${getClockInClass(row.status)}`}>{row.clockIn}</td>
                    <td className={`px-5 py-5 text-[15px] font-semibold ${getDefaultTextClass(row.status)}`}>{row.clockOut}</td>
                    <td className="px-5 py-5">
                      <span className={`text-[14px] font-medium ${getDefaultTextClass(row.status)}`}>{row.duration}</span>
                    </td>
                    <td className="px-5 py-5">
                      {row.indicators[0] === "-" ? (
                        <span className="text-slate-500">-</span>
                      ) : (
                        <div className="flex items-center gap-2">
                          {row.indicators.map((indicator) => (
                            <span key={`${row.date}-${indicator}-desktop`} className={`rounded-md px-2 py-0.5 text-[11px] font-bold ${row.indicatorClass}`}>
                              {indicator}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-5 py-5">
                      {row.source === "-" ? (
                        <span className="text-slate-500">-</span>
                      ) : (
                        <div className="flex items-center gap-2 text-slate-500">
                          <span className="material-symbols-outlined text-base">{row.sourceIcon}</span>
                          <span className="text-[13px] font-medium">{row.source}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <button className="text-[11px] font-black uppercase tracking-widest text-slate-500 transition hover:text-cyan-300">Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-4 bg-slate-900/20 px-4 py-4 sm:px-6 sm:py-5 md:flex-row md:items-center md:justify-between">
            <p className="text-[11px] font-semibold text-slate-500">
              Showing <span className="text-slate-100">1 - 10</span> of <span className="text-slate-100">31</span> entries
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-500 transition hover:bg-slate-700">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-300 font-bold text-slate-900 shadow-[0_0_10px_rgba(129,236,255,0.3)]">1</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 font-bold text-slate-100 transition hover:bg-slate-700">2</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 font-bold text-slate-100 transition hover:bg-slate-700">3</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 font-bold text-slate-100 transition hover:bg-slate-700">4</button>
              <button className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 text-slate-500 transition hover:bg-slate-700">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
