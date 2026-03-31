const payrollMetrics = [
  {
    label: "Next Payout",
    value: "Oct 31, 2023",
    icon: "event",
    iconTint: "bg-cyan-400/10 text-cyan-300",
    iconGhost: "text-cyan-300/10",
    meta: "In 12 days",
    metaIcon: "schedule",
    metaClass: "text-emerald-300",
    glow: true,
  },
  {
    label: "Last Payout",
    value: "$8,450.00",
    icon: "history",
    iconTint: "bg-purple-400/10 text-purple-300",
    iconGhost: "text-purple-300/10",
    meta: "Paid Oct 15",
    metaIcon: "check_circle",
    metaClass: "text-emerald-300",
  },
  {
    label: "Total YTD Earnings",
    value: "$92,100.00",
    icon: "payments",
    iconTint: "bg-cyan-400/10 text-cyan-300",
    iconGhost: "text-cyan-300/10",
    meta: "Fiscal Year 2023",
    metaIcon: "info",
    metaClass: "text-slate-500",
  },
  {
    label: "Tax Deductions",
    value: "$21,450.32",
    icon: "receipt_long",
    iconTint: "bg-red-400/10 text-red-300",
    iconGhost: "text-red-300/10",
    meta: "23.2% Effective Rate",
    metaIcon: "analytics",
    metaClass: "text-slate-500",
  },
];

const payoutHistory = [
  { date: "Oct 15, 2023", amount: "$8,450.00", status: "Paid" },
  { date: "Sep 30, 2023", amount: "$8,450.00", status: "Paid" },
  { date: "Sep 15, 2023", amount: "$8,210.45", status: "Paid" },
  { date: "Aug 31, 2023", amount: "$8,210.45", status: "Paid" },
];

const quickTags = ["W-2 (2022)", "1095-C", "Direct Deposit"];

function PayrollMetricCard({ label, value, icon, iconTint, iconGhost, meta, metaIcon, metaClass, glow }) {
  return (
    <div
      className={`staff-glass-card relative overflow-hidden rounded-[1.6rem] p-5 transition hover:bg-slate-800/45 ${
        glow ? "shadow-[0_0_20px_rgba(129,236,255,0.12)]" : ""
      }`}
    >
      <div className={`pointer-events-none absolute right-0 top-0 p-4 ${iconGhost}`}>
        <span className="material-symbols-outlined text-5xl">{icon}</span>
      </div>

      <div className="relative z-10 flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconTint}`}>
          <span className="material-symbols-outlined text-xl">{icon}</span>
        </div>
        <span className="text-[10px] uppercase tracking-[0.16em] text-slate-500">{label}</span>
      </div>

      <div className="relative z-10 mt-5">
        <div className="font-headline text-3xl font-bold tracking-tight text-slate-100">{value}</div>
        <div className={`mt-2 flex items-center gap-1.5 text-xs ${metaClass}`}>
          <span className="material-symbols-outlined text-xs">{metaIcon}</span>
          <span>{meta}</span>
        </div>
      </div>
    </div>
  );
}

function PayoutStatus() {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
      Paid
    </span>
  );
}

export default function StaffPayrollPage() {
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen relative">
      <div className="pointer-events-none fixed right-[-9rem] top-[12rem] h-80 w-80 rounded-full bg-cyan-400/10 blur-[150px]"></div>
      <div className="pointer-events-none fixed bottom-[8rem] left-[-10rem] h-[28rem] w-[28rem] rounded-full bg-purple-400/10 blur-[180px]"></div>

      <div>
        <section className="mb-8 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="font-headline text-2xl font-bold tracking-tight text-slate-100">Payroll Engine</h1>
            <p className="mt-1 text-sm text-slate-500">
              Detailed employee compensation and tax overview for the current fiscal cycle.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button className="rounded-xl border border-white/10 bg-slate-800/80 px-6 py-2.5 text-sm font-medium text-slate-100 transition hover:bg-slate-700">
              Download Report
            </button>
            <button className="rounded-xl bg-gradient-to-r from-cyan-300 to-cyan-400 px-6 py-2.5 text-sm font-bold text-[#004d57] shadow-[0_0_20px_rgba(129,236,255,0.3)] transition hover:scale-[1.02] active:scale-95">
              Update Payment Method
            </button>
          </div>
        </section>

        <section className="mb-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {payrollMetrics.map((metric) => (
            <PayrollMetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="mb-8 grid gap-8 xl:grid-cols-12">
          <div className="staff-glass-card rounded-[1.8rem] p-6 xl:col-span-4 xl:p-8">
            <h3 className="mb-8 font-headline text-xl font-semibold text-slate-100">Pay Breakdown</h3>

            <div className="mb-8 flex justify-center">
              <div className="relative h-64 w-64">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                  <circle cx="18" cy="18" r="15.915" fill="transparent" stroke="rgba(129,236,255,0.1)" strokeWidth="3"></circle>
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="url(#payroll-primary-gradient)"
                    strokeDasharray="75 25"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></circle>
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="transparent"
                    stroke="#af88ff"
                    strokeDasharray="25 75"
                    strokeDashoffset="-75"
                    strokeLinecap="round"
                    strokeWidth="4"
                  ></circle>
                  <defs>
                    <linearGradient id="payroll-primary-gradient" x1="0%" x2="100%" y1="0%" y2="0%">
                      <stop offset="0%" stopColor="#81ecff"></stop>
                      <stop offset="100%" stopColor="#00e3fd"></stop>
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-headline text-4xl font-bold text-slate-100">75%</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-500">Net Pay</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-xl border-l-4 border-cyan-300 bg-cyan-400/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-cyan-300"></span>
                  <span className="text-sm font-medium text-slate-100">Net Salary</span>
                </div>
                <span className="font-bold text-slate-100">$6,337.50</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border-l-4 border-purple-300 bg-purple-400/5 px-4 py-3">
                <div className="flex items-center gap-3">
                  <span className="h-2 w-2 rounded-full bg-purple-300"></span>
                  <span className="text-sm font-medium text-slate-100">Taxes &amp; Deductions</span>
                </div>
                <span className="font-bold text-slate-100">$2,112.50</span>
              </div>
            </div>
          </div>

          <div className="staff-glass-card overflow-hidden rounded-[1.8rem] xl:col-span-8">
            <div className="flex flex-col gap-3 p-6 pb-4 sm:flex-row sm:items-center sm:justify-between xl:p-8 xl:pb-4">
              <h3 className="font-headline text-xl font-semibold text-slate-100">Recent Payout History</h3>
              <button className="text-sm font-medium text-cyan-300 transition hover:underline">View All History</button>
            </div>

            <div className="space-y-4 px-4 pb-4 sm:hidden">
              {payoutHistory.map((item) => (
                <div key={`${item.date}-${item.amount}`} className="rounded-[1.25rem] border border-white/5 bg-slate-900/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-slate-100">{item.date}</p>
                      <p className="mt-1 text-[11px] text-slate-500">Employee Payroll</p>
                    </div>
                    <PayoutStatus />
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-100">{item.amount}</span>
                    <button className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-cyan-300 transition hover:bg-cyan-400/10">
                      <span className="material-symbols-outlined text-base">receipt</span>
                      View Payslip
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[860px] text-left">
                <thead>
                  <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.18em] text-slate-500">
                    <th className="px-8 py-4 font-medium">Date</th>
                    <th className="px-8 py-4 font-medium">Amount</th>
                    <th className="px-8 py-4 font-medium">Status</th>
                    <th className="px-8 py-4 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payoutHistory.map((item) => (
                    <tr key={`${item.date}-${item.amount}-desktop`} className="transition hover:bg-slate-900/20">
                      <td className="px-8 py-5 text-sm font-medium text-slate-100">{item.date}</td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-100">{item.amount}</td>
                      <td className="px-8 py-5">
                        <PayoutStatus />
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="inline-flex items-center gap-1 rounded-lg p-2 text-cyan-300 transition hover:bg-cyan-400/10">
                          <span className="material-symbols-outlined">receipt</span>
                          <span className="text-xs">View Payslip</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="grid gap-8 md:grid-cols-2">
          <div className="staff-glass-card relative overflow-hidden rounded-[1.8rem] border-l-4 border-purple-300 p-6 shadow-[0_0_20px_rgba(175,136,255,0.12)] xl:p-8">
            <div className="pointer-events-none absolute right-[-2rem] top-[-2rem] h-40 w-40 rounded-full bg-purple-400/10 blur-3xl"></div>
            <div className="relative flex items-start gap-4">
              <div className="flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-purple-400/20 text-purple-200">
                <span className="material-symbols-outlined text-3xl">psychology</span>
              </div>
              <div>
                <h4 className="font-headline text-lg font-bold text-slate-100">AI Tax Optimization</h4>
                <p className="mt-2 text-sm leading-relaxed text-slate-400">
                  Based on your recent earnings, increasing your 401(k) contribution by 2% could reduce your tax liability by an estimated $1,240 for this fiscal year.
                </p>
                <button className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-purple-200 transition hover:translate-x-1">
                  Apply Suggestion
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div className="staff-glass-card group rounded-[1.8rem] border-l-4 border-cyan-300 p-6 transition hover:bg-slate-800/45 xl:p-8">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/20 text-cyan-300">
                  <span className="material-symbols-outlined text-3xl">account_balance</span>
                </div>
                <div>
                  <h4 className="font-headline text-lg font-bold text-slate-100">Bank &amp; Tax Forms</h4>
                  <p className="text-sm text-slate-400">Manage direct deposit and W-2 forms.</p>
                </div>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-800 transition group-hover:bg-cyan-300 group-hover:text-[#004d57]">
                <span className="material-symbols-outlined">chevron_right</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              {quickTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-lg border border-white/10 bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
