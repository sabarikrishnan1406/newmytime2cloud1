const weeklyPlanner = [
  {
    day: "Mon",
    date: "23",
    active: false,
    shifts: [
      {
        title: "Day Shift",
        time: "08:00 - 16:00",
        location: "Sector C-4",
        theme: "primary",
        team: ["JT", "AL"],
      },
    ],
  },
  {
    day: "Tue",
    date: "24",
    active: false,
    shifts: [
      {
        title: "Day Shift",
        time: "08:00 - 16:00",
        location: "Sector C-4",
        theme: "primary",
      },
    ],
  },
  {
    day: "Wed",
    date: "25",
    active: true,
    shifts: [
      {
        title: "Lead Shift",
        time: "09:00 - 18:00",
        location: "Command Center",
        theme: "highlight",
        team: ["MT", "+4"],
      },
    ],
  },
  {
    day: "Thu",
    date: "26",
    active: false,
    shifts: [
      {
        title: "Late Shift",
        time: "16:00 - 00:00",
        location: "Vault Area",
        theme: "secondary",
      },
    ],
  },
  {
    day: "Fri",
    date: "27",
    active: false,
    shifts: [
      {
        title: "Rest Period",
        time: "-",
        location: "",
        theme: "neutral",
      },
    ],
  },
  {
    day: "Sat",
    date: "28",
    active: false,
    shifts: [
      {
        title: "Weekend Lead",
        time: "10:00 - 18:00",
        location: "Full Complex",
        theme: "primary",
      },
    ],
  },
  {
    day: "Sun",
    date: "29",
    active: false,
    shifts: [
      {
        title: "Off",
        time: "-",
        location: "",
        theme: "neutral",
      },
    ],
  },
];

const upcomingQueue = [
  {
    month: "OCT",
    day: "30",
    title: "Emergency Protocol Simulation",
    detail: "08:00 - 12:00 • High-Security Wing",
    members: ["LN", "AR"],
    status: "Confirmed",
    statusClass: "bg-emerald-400/10 text-emerald-300 border border-emerald-400/20",
  },
  {
    month: "OCT",
    day: "31",
    title: "Quarterly Review Cycle",
    detail: "14:00 - 18:00 • Boardroom Alpha",
    members: ["MT"],
    status: "Pending Swap",
    statusClass: "bg-purple-400/10 text-purple-300 border border-purple-400/20",
  },
  {
    month: "NOV",
    day: "01",
    title: "System Calibration Phase",
    detail: "08:00 - 16:00 • Maintenance Deck",
    members: ["+3"],
    status: "Scheduled",
    statusClass: "bg-slate-800 text-slate-400 border border-white/10",
  },
];

function getShiftTheme(theme) {
  if (theme === "secondary") {
    return {
      wrapper: "bg-purple-400/10 border-l-4 border-purple-300",
      title: "text-purple-300",
    };
  }
  if (theme === "highlight") {
    return {
      wrapper: "bg-gradient-to-br from-cyan-400/20 to-transparent border-l-4 border-cyan-300 shadow-[0_10px_30px_rgba(129,236,255,0.15)]",
      title: "text-cyan-300",
    };
  }
  if (theme === "neutral") {
    return {
      wrapper: "bg-slate-800/60 border-l-4 border-slate-600",
      title: "text-slate-400",
    };
  }
  return {
    wrapper: "bg-cyan-400/10 border-l-4 border-cyan-300",
    title: "text-cyan-300",
  };
}

export default function StaffSchedulePage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div>
        <header className="sticky top-0 z-20 -mx-4 mb-8 bg-[#081223]/70 px-4 py-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex flex-col">
            <div className="flex flex-col">
              <h1 className="font-headline text-2xl font-bold tracking-tight text-slate-100">Shift Schedule</h1>
              <p className="text-sm font-medium text-slate-500">October 23 - October 29, 2023</p>
            </div>
          </div>
        </header>

        <section className="staff-glass-card mb-10 rounded-[24px] p-6 xl:p-8">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <h2 className="font-headline text-xl font-bold text-slate-100">Weekly Planner</h2>
              <div className="flex rounded-lg bg-slate-800 p-1">
                <button className="rounded-md bg-slate-700 px-3 py-1 text-xs font-bold text-cyan-300 shadow-sm">Week</button>
                <button className="rounded-md px-3 py-1 text-xs font-bold text-slate-500 transition hover:text-slate-100">Month</button>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition hover:bg-slate-800">
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>
              <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 transition hover:bg-slate-800">
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid min-w-[980px] grid-cols-7 gap-4">
              {weeklyPlanner.map((day) => (
                <div
                  key={`${day.day}-${day.date}`}
                  className={`relative flex flex-col gap-4 rounded-2xl p-2 ${
                    day.active ? "border border-cyan-400/20 bg-cyan-400/5" : ""
                  }`}
                >
                  <div className="pb-4 text-center">
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${day.active ? "text-cyan-300" : "text-slate-500"}`}>{day.day}</p>
                    <p className={`text-xl font-bold ${day.active ? "text-cyan-300" : "text-slate-100"}`}>{day.date}</p>
                    {day.active && <div className="mx-auto mt-2 h-1 w-1 rounded-full bg-cyan-300"></div>}
                  </div>

                  <div className="flex flex-col gap-3">
                    {day.shifts.map((shift) => {
                      const theme = getShiftTheme(shift.theme);
                      return (
                        <div key={`${day.day}-${shift.title}`} className={`rounded-xl p-3 ${theme.wrapper}`}>
                          <p className={`mb-1 text-[10px] font-bold uppercase ${theme.title}`}>{shift.title}</p>
                          <p className="text-xs font-bold leading-tight text-slate-100">{shift.time}</p>
                          {shift.location && <p className="mt-2 text-[10px] text-slate-500">{shift.location}</p>}
                          {shift.team && (
                            <div className="mt-2 flex -space-x-2">
                              {shift.team.map((member) => (
                                <div
                                  key={`${day.day}-${shift.title}-${member}`}
                                  className="flex h-5 w-5 items-center justify-center rounded-full border border-[#11192a] bg-slate-700 text-[8px] font-bold text-cyan-300"
                                >
                                  {member}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-3">
          <div className="staff-glass-card rounded-[24px] p-6 lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="font-headline text-lg font-bold text-slate-100">Upcoming Shift Queue</h3>
              <button className="text-xs font-bold text-cyan-300 transition hover:underline">View All History</button>
            </div>

            <div className="space-y-1">
              {upcomingQueue.map((item) => (
                <div key={`${item.month}-${item.day}-${item.title}`} className="group flex flex-col gap-4 rounded-xl p-4 transition hover:bg-slate-900/30 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-white/10 bg-slate-800">
                      <p className="text-[10px] font-bold leading-none text-slate-500">{item.month}</p>
                      <p className="text-base font-bold text-slate-100">{item.day}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-100 transition group-hover:text-cyan-300">{item.title}</h4>
                      <p className="text-xs text-slate-500">{item.detail}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div className="flex -space-x-2">
                      {item.members.map((member) => (
                        <div
                          key={`${item.title}-${member}`}
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-[#11192a] bg-slate-700 text-[10px] font-bold text-cyan-300"
                        >
                          {member}
                        </div>
                      ))}
                    </div>
                    <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${item.statusClass}`}>{item.status}</span>
                    <button className="text-slate-500 transition hover:text-slate-100">
                      <span className="material-symbols-outlined">more_vert</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="staff-glass-card flex flex-col items-center rounded-[24px] p-6">
            <h3 className="mb-8 w-full font-headline text-lg font-bold text-slate-100">Shift Coverage</h3>

            <div className="relative mb-6 h-48 w-48">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="transparent" stroke="rgba(28,38,57,0.9)" strokeWidth="8"></circle>
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  fill="transparent"
                  stroke="url(#coverage-gradient)"
                  strokeDasharray="264"
                  strokeDashoffset="31.6"
                  strokeLinecap="round"
                  strokeWidth="8"
                ></circle>
                <defs>
                  <linearGradient id="coverage-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stopColor="#81ecff"></stop>
                    <stop offset="100%" stopColor="#00e3fd"></stop>
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline text-4xl font-bold text-slate-100">88%</span>
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-300">Optimal</span>
              </div>
            </div>

            <div className="w-full space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(129,236,255,0.5)]"></span>
                  <span className="text-xs font-medium text-slate-500">Active Personnel</span>
                </div>
                <span className="text-xs font-bold text-slate-100">24/28</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-purple-300 shadow-[0_0_8px_rgba(175,136,255,0.4)]"></span>
                  <span className="text-xs font-medium text-slate-500">On-Call Support</span>
                </div>
                <span className="text-xs font-bold text-slate-100">12 Available</span>
              </div>
              <div className="flex items-center justify-between border-t border-white/10 pt-4">
                <span className="text-xs italic text-slate-500">Next gap detected in 18h</span>
                <button className="text-cyan-300 transition hover:text-cyan-200">
                  <span className="material-symbols-outlined text-sm">notifications_active</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
