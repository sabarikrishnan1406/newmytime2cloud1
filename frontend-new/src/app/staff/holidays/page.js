import Link from "next/link";

const upcomingHolidays = [
  {
    name: "New Year's Day",
    date: "Monday, January 01",
    tag: "In 12 days",
    type: "Public Holiday",
    icon: "celebration",
    iconClass: "bg-cyan-300/10 text-cyan-300",
    tagClass: "bg-cyan-300/10 text-cyan-300 border-cyan-300/20",
    dotClass: "bg-cyan-300",
    glowClass: "bg-cyan-300/10 group-hover:bg-cyan-300/20",
  },
  {
    name: "Founder's Day",
    date: "Thursday, January 13",
    tag: "In 24 days",
    type: "Company Holiday",
    icon: "corporate_fare",
    iconClass: "bg-purple-300/10 text-purple-300",
    tagClass: "bg-purple-300/10 text-purple-300 border-purple-300/20",
    dotClass: "bg-purple-300",
    glowClass: "bg-purple-300/10 group-hover:bg-purple-300/20",
  },
  {
    name: "Spring Festival",
    date: "Saturday, February 10",
    tag: "In 45 days",
    type: "Regional Holiday",
    icon: "nature_people",
    iconClass: "bg-emerald-300/10 text-emerald-300",
    tagClass: "bg-emerald-300/10 text-emerald-300 border-emerald-300/20",
    dotClass: "bg-emerald-300",
    glowClass: "bg-emerald-300/10 group-hover:bg-emerald-300/20",
  },
];

const holidayMonths = [
  {
    name: "January",
    colorClass: "text-cyan-300",
    lineClass: "from-cyan-300/30",
    hoverClass: "group-hover:border-cyan-300/40",
    badgeClass: "bg-cyan-300/10 text-cyan-300",
    holidays: [
      {
        month: "Jan",
        day: "01",
        title: "New Year's Day",
        subtitle: "Global observance",
        badge: "Full Day Off",
      },
      {
        month: "Jan",
        day: "13",
        title: "Founder's Day",
        subtitle: "Company internal event",
        badge: "Full Day Off",
      },
    ],
  },
  {
    name: "February",
    colorClass: "text-purple-300",
    lineClass: "from-purple-300/30",
    hoverClass: "group-hover:border-purple-300/40",
    badgeClass: "bg-purple-300/10 text-purple-300",
    holidays: [
      {
        month: "Feb",
        day: "10",
        title: "Spring Festival",
        subtitle: "Regional lunar celebration",
        badge: "Full Day Off",
      },
      {
        month: "Feb",
        day: "14",
        title: "Valentine's Gala",
        subtitle: "Optional corporate mixer",
        badge: "Optional Holiday",
        badgeClass: "bg-slate-500/10 text-slate-400",
      },
    ],
  },
  {
    name: "March",
    colorClass: "text-emerald-300",
    lineClass: "from-emerald-300/30",
    hoverClass: "group-hover:border-emerald-300/40",
    badgeClass: "bg-cyan-300/10 text-cyan-300",
    holidays: [
      {
        month: "Mar",
        day: "29",
        title: "Equinox Observance",
        subtitle: "Seasonal transition break",
        badge: "Full Day Off",
      },
    ],
  },
];

const calendarDays = [
  { label: "26", muted: true },
  { label: "27", muted: true },
  { label: "28", muted: true },
  { label: "29", muted: true },
  { label: "30", muted: true },
  { label: "1" },
  { label: "2" },
  { label: "3" },
  { label: "4" },
  { label: "5" },
  { label: "6" },
  { label: "7" },
  { label: "8" },
  { label: "9" },
  { label: "10" },
  { label: "11" },
  { label: "12" },
  { label: "13" },
  { label: "14", active: true },
  { label: "15" },
  { label: "16" },
  { label: "17" },
  { label: "18" },
  { label: "19" },
  { label: "20", dot: "bg-purple-300", subtle: true },
  { label: "21" },
  { label: "22" },
  { label: "23" },
  { label: "24" },
  { label: "25", primary: true, dot: "bg-cyan-300" },
  { label: "26" },
  { label: "27" },
  { label: "28" },
  { label: "29" },
  { label: "30" },
  { label: "31" },
];

const legendItems = [
  { label: "Public Holiday", value: "12 days", dotClass: "bg-cyan-300" },
  { label: "Company Holiday", value: "4 days", dotClass: "bg-purple-300" },
  { label: "Regional Holiday", value: "3 days", dotClass: "bg-emerald-300" },
];

function UpcomingHolidayCard({ name, date, tag, type, icon, iconClass, tagClass, dotClass, glowClass }) {
  return (
    <article className="staff-glass-card group relative overflow-hidden rounded-2xl p-6 transition duration-300 hover:scale-[1.02]">
      <div className={`absolute -right-4 -top-4 h-24 w-24 rounded-full blur-3xl transition-all ${glowClass}`}></div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${iconClass}`}>
          <span className="material-symbols-outlined text-3xl">{icon}</span>
        </div>
        <span className={`rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${tagClass}`}>{tag}</span>
      </div>
      <h3 className="font-headline text-xl font-bold text-slate-100">{name}</h3>
      <p className="mb-4 mt-1 text-sm text-slate-500">{date}</p>
      <div className="flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${dotClass}`}></span>
        <span className="text-xs font-semibold text-slate-300">{type}</span>
      </div>
    </article>
  );
}

function MonthSection({ name, colorClass, lineClass, hoverClass, badgeClass, holidays }) {
  return (
    <section className="mb-10 last:mb-0">
      <div className="mb-4 flex items-center gap-4">
        <h4 className={`font-headline text-lg font-bold ${colorClass}`}>{name}</h4>
        <div className={`h-px flex-1 bg-gradient-to-r ${lineClass} to-transparent`}></div>
      </div>
      <div className="space-y-3">
        {holidays.map((holiday) => (
          <article
            key={`${name}-${holiday.day}-${holiday.title}`}
            className="group flex items-center justify-between gap-4 rounded-xl bg-slate-900/30 p-4 transition hover:bg-slate-800/40"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 flex-col items-center justify-center rounded-lg border border-white/10 bg-slate-800/70 transition ${hoverClass}`}>
                <span className="text-[10px] font-bold uppercase text-slate-500">{holiday.month}</span>
                <span className="text-sm font-bold leading-none text-slate-100">{holiday.day}</span>
              </div>
              <div>
                <h5 className="font-semibold text-slate-100">{holiday.title}</h5>
                <p className="text-xs text-slate-500">{holiday.subtitle}</p>
              </div>
            </div>
            <span className={`rounded-lg px-3 py-1 text-[10px] font-bold uppercase ${holiday.badgeClass || badgeClass}`}>
              {holiday.badge}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function StaffHolidaysPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen relative">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-cyan-300/10 blur-[150px]"></div>
        <div className="absolute -bottom-[10%] -left-[10%] h-[500px] w-[500px] rounded-full bg-purple-300/10 blur-[120px]"></div>
      </div>

      <div>
        <section className="mb-8 rounded-2xl border border-cyan-300/10 bg-[#070e1b]/80 px-6 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="font-headline text-2xl font-bold tracking-tight text-slate-100">
                Holidays &amp; Calendar
              </h1>
              <p className="mt-1 text-sm text-slate-500">Official holiday schedule, regional observances, and quick leave planning.</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative min-w-0 sm:w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">search</span>
                <input
                  className="w-full rounded-full border border-white/10 bg-slate-800/70 py-2 pl-10 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/40 focus:ring-1 focus:ring-cyan-300/40"
                  placeholder="Search events..."
                  type="text"
                />
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button className="rounded-full p-2 text-slate-500 transition hover:bg-cyan-300/10 hover:text-cyan-300">
                  <span className="material-symbols-outlined">notifications</span>
                </button>
                <button className="rounded-full p-2 text-slate-500 transition hover:bg-cyan-300/10 hover:text-cyan-300">
                  <span className="material-symbols-outlined">settings</span>
                </button>
                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-cyan-300/20 bg-slate-800 text-sm font-bold text-cyan-300">
                  AP
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
          {upcomingHolidays.map((holiday) => (
            <UpcomingHolidayCard key={holiday.name} {...holiday} />
          ))}
        </section>

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <section className="staff-glass-card rounded-2xl p-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-slate-100">2024 Holiday Calendar</h2>
                  <p className="text-sm text-slate-500">Official holiday schedule for Nexus Global</p>
                </div>
                <div className="flex gap-3">
                  <button className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-slate-800/70 px-4 py-2 text-sm font-medium text-slate-100 transition hover:border-cyan-300/40">
                    <span className="material-symbols-outlined text-lg">filter_list</span>
                    Filter
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2 text-sm font-bold text-[#004d57] shadow-[0_0_15px_rgba(0,229,255,0.3)] transition hover:brightness-110">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Export PDF
                  </button>
                </div>
              </div>

              {holidayMonths.map((month) => (
                <MonthSection key={month.name} {...month} />
              ))}
            </section>
          </div>

          <aside className="space-y-8 lg:col-span-4">
            <section className="staff-glass-card rounded-2xl p-6">
              <div className="mb-6 flex items-center justify-between">
                <h4 className="font-headline font-bold text-slate-100">December 2023</h4>
                <div className="flex gap-1">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-cyan-300/10 hover:text-cyan-300">
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                  </button>
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-cyan-300/10 hover:text-cyan-300">
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              </div>

              <div className="mb-2 grid grid-cols-7 gap-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                  <div key={day} className="py-2 text-center text-[10px] font-bold uppercase text-slate-500">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const baseClass =
                    "aspect-square flex items-center justify-center rounded-lg text-xs transition-colors";
                  const calendarKey = `calendar-${index}-${day.label}`;

                  if (day.active) {
                    return (
                      <div
                        key={calendarKey}
                        className={`${baseClass} cursor-pointer bg-cyan-300 font-bold text-[#070e1b] shadow-[0_0_10px_rgba(0,229,255,0.4)]`}
                      >
                        {day.label}
                      </div>
                    );
                  }

                  if (day.muted) {
                    return (
                      <div key={calendarKey} className={`${baseClass} text-slate-500/30`}>
                        {day.label}
                      </div>
                    );
                  }

                  if (day.primary) {
                    return (
                      <div key={calendarKey} className={`${baseClass} relative font-bold text-cyan-300`}>
                        {day.label}
                        {day.dot && <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${day.dot}`}></span>}
                      </div>
                    );
                  }

                  if (day.dot) {
                    return (
                      <div
                        key={calendarKey}
                        className={`${baseClass} relative ${day.subtle ? "text-slate-400" : "text-slate-100"} hover:bg-cyan-300/5`}
                      >
                        {day.label}
                        <span className={`absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full ${day.dot}`}></span>
                      </div>
                    );
                  }

                  return (
                    <div key={calendarKey} className={`${baseClass} cursor-pointer text-slate-100 hover:bg-cyan-300/5`}>
                      {day.label}
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="staff-glass-card rounded-2xl p-6">
              <h4 className="mb-4 font-headline font-bold text-slate-100">Legend</h4>
              <div className="space-y-4">
                {legendItems.map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`h-3 w-3 rounded-full ${item.dotClass}`}></span>
                      <span className="text-sm font-medium text-slate-200">{item.label}</span>
                    </div>
                    <span className="font-mono text-xs text-slate-500">{item.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl p-6">
              <div className="absolute inset-0 bg-gradient-to-br from-[#6001d1] to-slate-800"></div>
              <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-cyan-300/20 blur-3xl transition duration-700 group-hover:scale-125"></div>
              <div className="relative z-10">
                <h4 className="mb-2 font-headline text-lg font-bold text-slate-100">Need time off?</h4>
                <p className="mb-6 text-sm leading-relaxed text-slate-200/80">
                  Planning a vacation or need a personal break? Apply for leave in just a few clicks.
                </p>
                <Link
                  href="/staff/leave/apply"
                  className="block w-full rounded-xl bg-cyan-300 py-3 text-center font-black tracking-wider text-[#004d57] shadow-[0_4px_20px_rgba(0,227,253,0.3)] transition duration-300 hover:scale-[1.02] hover:shadow-[0_4px_30px_rgba(0,227,253,0.45)] active:scale-95"
                >
                  Apply for Leave
                </Link>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
