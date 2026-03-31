import Link from "next/link";

const leaveTypes = [
  { label: "Annual", icon: "calendar_month", active: true, className: "border-cyan-300/40 bg-cyan-400/10 text-cyan-300" },
  { label: "Sick", icon: "medical_services", className: "border-transparent text-slate-500 hover:border-white/10 hover:bg-slate-800/40 hover:text-slate-100" },
  { label: "Casual", icon: "beach_access", className: "border-transparent text-slate-500 hover:border-white/10 hover:bg-slate-800/40 hover:text-slate-100" },
  { label: "Other", icon: "more_horiz", className: "border-transparent text-slate-500 hover:border-white/10 hover:bg-slate-800/40 hover:text-slate-100" },
];

const balances = [
  { label: "Annual", value: "12 / 20 Days", progress: "60%", barClass: "bg-gradient-to-r from-cyan-300 to-cyan-400 shadow-[0_0_10px_rgba(0,227,253,0.4)]" },
  { label: "Sick", value: "08 / 10 Days", progress: "80%", barClass: "bg-purple-300 shadow-[0_0_10px_rgba(175,136,255,0.4)]" },
  { label: "Casual", value: "02 / 05 Days", progress: "40%", barClass: "bg-emerald-300 shadow-[0_0_10px_rgba(161,255,239,0.4)]" },
];

const workflow = [
  {
    label: "Sarah Williams",
    role: "Reporting Manager",
    status: "Pending",
    statusClass: "text-amber-400",
    avatar: "SW",
    avatarClass: "bg-cyan-400 text-[#004d57] shadow-[0_0_10px_rgba(0,227,253,0.35)]",
    active: true,
  },
  {
    label: "HR Operations Team",
    role: "HR Administrator",
    status: "Auto-Approve",
    statusClass: "text-slate-500",
    icon: "groups",
    avatarClass: "bg-purple-400/15 text-purple-300",
  },
];

function FieldLabel({ children }) {
  return <label className="text-xs font-bold uppercase tracking-widest text-slate-500">{children}</label>;
}

export default function StaffLeaveApplyPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen">
      <div>
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500">
              <Link href="/staff/leave" className="transition hover:text-cyan-300">
                Leave Management
              </Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-cyan-300">Apply Leave</span>
            </div>
            <h1 className="font-headline text-3xl font-extrabold tracking-tight text-slate-100 sm:text-4xl">Apply Leave</h1>
            <p className="mt-2 text-sm text-slate-500 sm:text-base">Submit a new leave request for your approval workflow.</p>
          </div>

          <Link
            href="/staff/leave/balance"
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-5 py-3 font-headline font-bold text-cyan-300 transition hover:bg-cyan-300/15"
          >
            <span className="material-symbols-outlined text-lg">donut_small</span>
            Leave Balance
          </Link>
        </div>

        <div className="grid gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <section className="staff-glass-card rounded-2xl p-6 sm:p-8">
              <div className="mb-8 flex items-center gap-3">
                <span className="material-symbols-outlined text-2xl text-cyan-300">event_note</span>
                <h2 className="font-headline text-xl font-bold text-slate-100">Leave Details</h2>
              </div>

              <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
                {leaveTypes.map((type) => (
                  <button
                    key={type.label}
                    type="button"
                    className={`flex flex-col items-center justify-center rounded-xl border p-5 transition-all ${type.className}`}
                  >
                    <span className="material-symbols-outlined mb-2 text-3xl">{type.icon}</span>
                    <span className="text-sm font-semibold tracking-wide">{type.label}</span>
                  </button>
                ))}
              </div>

              <div className="mb-8 grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <FieldLabel>From Date</FieldLabel>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                      calendar_today
                    </span>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-4 text-slate-100 outline-none transition focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/50"
                      defaultValue="24 Oct 2023"
                      type="text"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <FieldLabel>To Date</FieldLabel>
                  <div className="relative">
                    <span className="material-symbols-outlined pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">
                      calendar_today
                    </span>
                    <input
                      className="w-full rounded-xl border border-white/10 bg-slate-900/60 px-4 py-4 text-slate-100 outline-none transition focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/50"
                      defaultValue="27 Oct 2023"
                      type="text"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-8 flex flex-wrap gap-x-8 gap-y-4">
                <label className="flex cursor-pointer items-center gap-3">
                  <input defaultChecked name="duration" type="radio" className="h-5 w-5 border-2 border-cyan-300 bg-transparent text-cyan-300 focus:ring-0" />
                  <span className="text-slate-100">Full Day</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input name="duration" type="radio" className="h-5 w-5 border-2 border-white/20 bg-transparent text-cyan-300 focus:ring-0" />
                  <span className="text-slate-500 transition hover:text-slate-100">Half Day (First Half)</span>
                </label>
                <label className="flex cursor-pointer items-center gap-3">
                  <input name="duration" type="radio" className="h-5 w-5 border-2 border-white/20 bg-transparent text-cyan-300 focus:ring-0" />
                  <span className="text-slate-500 transition hover:text-slate-100">Half Day (Second Half)</span>
                </label>
              </div>

              <div className="mb-8 space-y-2">
                <FieldLabel>Reason for Leave</FieldLabel>
                <textarea
                  className="min-h-[140px] w-full resize-none rounded-xl border border-white/10 bg-slate-900/60 px-4 py-4 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-1 focus:ring-cyan-300/50"
                  placeholder="Briefly explain the reason for your request..."
                />
              </div>

              <div className="mb-10 space-y-2">
                <FieldLabel>Attachments (Optional)</FieldLabel>
                <div className="cursor-pointer rounded-2xl border-2 border-dashed border-white/10 p-8 text-center transition hover:border-cyan-300/40 hover:bg-cyan-300/[0.03] sm:p-10">
                  <span className="material-symbols-outlined mb-4 block text-5xl text-cyan-300">cloud_upload</span>
                  <p className="font-medium text-slate-100">Click or drag files to upload</p>
                  <p className="mt-1 text-sm text-slate-500">Support for PDF, JPG, PNG (Max 5MB)</p>
                </div>
              </div>

              <div className="flex flex-col-reverse gap-4 sm:flex-row sm:justify-end">
                <Link
                  href="/staff/leave"
                  className="inline-flex items-center justify-center rounded-xl border border-white/10 px-8 py-3 font-bold tracking-wide text-slate-500 transition hover:bg-slate-800/40 hover:text-slate-100"
                >
                  Cancel
                </Link>
                <button
                  type="button"
                  className="rounded-xl bg-gradient-to-r from-cyan-300 to-cyan-400 px-8 py-3 font-bold tracking-wide text-[#004d57] shadow-[0_0_20px_rgba(0,227,253,0.3)] transition hover:scale-[1.02] active:scale-95"
                >
                  Submit Request
                </button>
              </div>
            </section>
          </div>

          <div className="space-y-8 lg:col-span-4">
            <section id="leave-balance" className="staff-glass-card rounded-2xl p-6">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Leave Balance</h2>
              <div className="space-y-6">
                {balances.map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-end justify-between">
                      <span className="font-headline font-bold text-slate-100">{item.label}</span>
                      <span className="text-sm text-slate-500">{item.value}</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div className={`h-full rounded-full ${item.barClass}`} style={{ width: item.progress }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="staff-glass-card rounded-2xl border-l-4 border-cyan-300 p-6">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Request Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between border-b border-white/10 py-2">
                  <span className="text-slate-500">Calendar Days</span>
                  <span className="font-headline font-bold text-slate-100">4.0 Days</span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-2 text-red-300">
                  <span>Public Holidays</span>
                  <span className="font-headline font-bold">0.0 Days</span>
                </div>
                <div className="flex justify-between border-b border-white/10 py-2 text-red-300">
                  <span>Weekends</span>
                  <span className="font-headline font-bold">0.0 Days</span>
                </div>
                <div className="flex justify-between pt-4">
                  <span className="font-headline text-lg font-bold text-slate-100">Leave Deducted</span>
                  <span className="font-headline text-2xl font-extrabold text-cyan-300">4.0 Days</span>
                </div>
              </div>
            </section>

            <section className="staff-glass-card rounded-2xl p-6">
              <h2 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Approval Workflow</h2>
              <div className="relative space-y-8 pl-8">
                <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10"></div>
                {workflow.map((step) => (
                  <div key={step.label} className="relative">
                    <div
                      className={`absolute -left-8 top-0 z-10 flex h-6 w-6 items-center justify-center rounded-full border-4 border-[#070e1b] ${step.active ? "bg-cyan-400 shadow-[0_0_10px_rgba(0,227,253,0.5)]" : "bg-slate-700"}`}
                    >
                      {step.active ? null : <span className="h-2 w-2 rounded-full bg-slate-500"></span>}
                    </div>
                    <div className="mb-1 flex items-center gap-3">
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${step.avatarClass}`}>
                        {step.icon ? <span className="material-symbols-outlined text-base">{step.icon}</span> : step.avatar}
                      </div>
                      <span className="font-headline font-bold text-slate-100">{step.label}</span>
                    </div>
                    <p className="text-xs text-slate-500">
                      {step.role} - <span className={step.statusClass}>{step.status}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <div className="flex gap-4 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.04] p-5">
              <span className="material-symbols-outlined shrink-0 text-cyan-300">info</span>
              <div>
                <h4 className="mb-1 font-headline text-sm font-bold text-slate-100">Leave Policy</h4>
                <p className="text-xs leading-relaxed text-slate-500">
                  Annual leaves must be applied 3 days in advance. Unused leaves expire on Dec 31st.
                </p>
                <Link href="/staff/leave" className="mt-2 inline-block text-[10px] font-extrabold uppercase tracking-widest text-cyan-300 transition hover:underline">
                  Read Full Policy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
