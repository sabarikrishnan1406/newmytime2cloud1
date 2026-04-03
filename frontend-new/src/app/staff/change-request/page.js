"use client";

import { useEffect, useState } from "react";
import { api, buildQueryParams } from "@/lib/api-client";
import { getStaffUser } from "@/lib/staff-user";
import Link from "next/link";

const defaultSummaryCards = [
  {
    label: "Total Requests",
    value: "128",
    helper: "Current Month",
    icon: "analytics",
    iconClass: "bg-purple-400/12 text-purple-300",
    badgeClass: "bg-purple-400/12 text-purple-200",
  },
  {
    label: "Pending Approval",
    value: "14",
    helper: "Action Needed",
    icon: "pending_actions",
    iconClass: "bg-cyan-400/12 text-cyan-300",
    badgeClass: "bg-cyan-400/12 text-cyan-300",
    valueClass: "text-cyan-300",
  },
  {
    label: "Approved",
    value: "105",
    helper: "Completed",
    icon: "check_circle",
    iconClass: "bg-emerald-400/12 text-emerald-300",
    badgeClass: "bg-emerald-400/12 text-emerald-200",
  },
  {
    label: "Rejected",
    value: "9",
    helper: "Historical",
    icon: "cancel",
    iconClass: "bg-red-400/12 text-red-300",
    badgeClass: "bg-red-400/12 text-red-200",
  },
];

const defaultRequests = [
  {
    id: "REQ-4821",
    type: "Missing Punch",
    typeIcon: "emergency_home",
    typeClass: "text-purple-300",
    date: "Oct 24, 2023",
    previousValue: "--:--",
    updatedValue: "17:30",
    updatedClass: "text-emerald-300",
    status: "Pending",
    statusClass: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20",
    reason: "Forgot to clock out due to emergency system check",
    canEdit: true,
  },
  {
    id: "REQ-4819",
    type: "Incorrect Time",
    typeIcon: "schedule",
    typeClass: "text-cyan-300",
    date: "Oct 22, 2023",
    previousValue: "08:15",
    updatedValue: "08:00",
    updatedClass: "text-emerald-300",
    status: "Approved",
    statusClass: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20",
    reason: "Security badge failure at main entrance gate",
    canEdit: false,
  },
  {
    id: "REQ-4802",
    type: "Duplicate Entry",
    typeIcon: "warning",
    typeClass: "text-red-300",
    date: "Oct 20, 2023",
    previousValue: "12:00",
    updatedValue: "REMOVAL",
    updatedClass: "text-red-300",
    status: "Rejected",
    statusClass: "bg-red-400/10 text-red-300 border-red-400/20",
    reason: "Manual entry error during shift changeover",
    canEdit: true,
  },
];

function SummaryCard({ label, value, helper, icon, iconClass, badgeClass, valueClass }) {
  return (
    <div className="staff-glass-card relative overflow-hidden rounded-2xl p-6">
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/[0.03] blur-2xl"></div>
      <div className="mb-5 flex items-start justify-between gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${iconClass}`}>
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-tight ${badgeClass}`}>{helper}</span>
      </div>
      <div className="flex flex-col">
        <span className={`font-headline text-3xl font-bold text-slate-100 ${valueClass || ""}`}>{value}</span>
        <span className="mt-1 text-xs font-medium uppercase tracking-widest text-slate-500">{label}</span>
      </div>
    </div>
  );
}

function StatusBadge({ status, statusClass }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase ${statusClass}`}>
      {status}
    </span>
  );
}

export default function StaffChangeRequestPage() {
  const [summaryCards, setSummaryCards] = useState(defaultSummaryCards);
  const [requests, setRequests] = useState(defaultRequests);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const u = await getStaffUser();
        const params = await buildQueryParams({});

        const { data } = await api.get("/change_request", {
          params: { ...params, employee_id: u.employee_id, per_page: 50 },
        });
        const items = data?.data || [];

        if (items.length > 0) {
          const total = items.length;
          const pending = items.filter((r) => r.status === 0 || r.status === "pending").length;
          const approved = items.filter((r) => r.status === 1 || r.status === "approved").length;
          const rejected = items.filter((r) => r.status === 2 || r.status === "rejected").length;

          setSummaryCards([
            { ...defaultSummaryCards[0], value: String(total) },
            { ...defaultSummaryCards[1], value: String(pending) },
            { ...defaultSummaryCards[2], value: String(approved) },
            { ...defaultSummaryCards[3], value: String(rejected) },
          ]);

          setRequests(items.map((r, i) => {
            const st = r.status === 1 || r.status === "approved"
              ? { status: "Approved", statusClass: "bg-emerald-400/10 text-emerald-300 border-emerald-400/20" }
              : r.status === 2 || r.status === "rejected"
              ? { status: "Rejected", statusClass: "bg-red-400/10 text-red-300 border-red-400/20" }
              : { status: "Pending", statusClass: "bg-cyan-400/10 text-cyan-300 border-cyan-400/20" };

            return {
              id: `REQ-${r.id}`,
              type: r.type || r.request_type || "Change Request",
              typeIcon: "schedule",
              typeClass: "text-cyan-300",
              date: r.date || r.created_at ? new Date(r.date || r.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "---",
              previousValue: r.previous_value || r.old_time || "---",
              updatedValue: r.updated_value || r.new_time || "---",
              updatedClass: "text-emerald-300",
              reason: r.reason || r.note || "---",
              canEdit: st.status === "Pending",
              ...st,
            };
          }));
        }
      } catch (e) { console.warn("Change request error", e); }
    };
    fetchData();
  }, []);
  return (
    <div className="p-4 sm:p-6 lg:p-8 min-h-screen relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[120px]"></div>
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-purple-400/10 blur-[120px]"></div>
      </div>

      <div className="flex flex-col">
        <header className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-headline text-2xl font-bold text-slate-100">Change Request</h1>
            <p className="text-sm text-slate-500">Track and manage attendance change requests awaiting review.</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link
              href="/staff/change-request/new"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-cyan-400 px-5 py-3 font-headline font-bold text-[#004d57] shadow-[0_0_15px_rgba(0,227,253,0.3)] transition hover:brightness-110 active:scale-95"
            >
              <span className="material-symbols-outlined text-xl">add_circle</span>
              New Change Request
            </Link>
          </div>
        </header>

        <main className="flex flex-1 flex-col gap-8">
          <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {summaryCards.map((card) => (
              <SummaryCard key={card.label} {...card} />
            ))}
          </section>

          <section className="staff-glass-card flex flex-1 flex-col overflow-hidden rounded-[1.75rem] p-5 sm:p-6 xl:p-8">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <h2 className="font-headline text-xl font-bold text-slate-100">Recent Submissions</h2>
            </div>

            <div className="space-y-4 xl:hidden">
              {requests.map((request) => (
                <article key={request.id} className="rounded-[1.35rem] border border-white/5 bg-slate-900/30 p-4">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-headline text-base font-bold text-cyan-300">{request.id}</p>
                      <p className="mt-1 text-sm text-slate-500">{request.date}</p>
                    </div>
                    <StatusBadge status={request.status} statusClass={request.statusClass} />
                  </div>

                  <div className="mb-4 flex items-center gap-2 text-sm text-slate-100">
                    <span className={`material-symbols-outlined text-base ${request.typeClass}`}>{request.typeIcon}</span>
                    {request.type}
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-800/40 p-3">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">Correction</p>
                      <div className="mt-2 flex flex-col gap-1">
                        <span className="text-xs text-slate-500 line-through">{request.previousValue}</span>
                        <span className={`font-headline text-lg font-bold ${request.updatedClass}`}>{request.updatedValue}</span>
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-800/40 p-3">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">Reason</p>
                      <p className="mt-2 text-sm text-slate-300">{request.reason}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end gap-3">
                    <button className="rounded-lg p-2 text-cyan-300 transition hover:bg-cyan-300/10">
                      <span className="material-symbols-outlined text-lg">visibility</span>
                    </button>
                    <button
                      className={`rounded-lg p-2 transition ${request.canEdit ? "text-purple-300 hover:bg-purple-300/10" : "cursor-not-allowed text-purple-300/30"}`}
                    >
                      <span className="material-symbols-outlined text-lg">edit</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto xl:block">
              <table className="w-full border-separate border-spacing-y-4 text-left">
                <thead>
                  <tr className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-500">
                    <th className="px-4 pb-2">Request ID</th>
                    <th className="px-4 pb-2">Type</th>
                    <th className="px-4 pb-2">Date</th>
                    <th className="px-4 pb-2">Correction</th>
                    <th className="px-4 pb-2">Status</th>
                    <th className="px-4 pb-2">Reason</th>
                    <th className="px-4 pb-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {requests.map((request) => (
                    <tr key={`${request.id}-desktop`} className="group transition-all duration-300 hover:bg-slate-900/20">
                      <td className="rounded-l-2xl bg-slate-900/30 px-4 py-5 font-headline font-bold text-cyan-300 group-hover:bg-transparent">
                        {request.id}
                      </td>
                      <td className="bg-slate-900/30 px-4 py-5 group-hover:bg-transparent">
                        <div className="flex items-center gap-2">
                          <span className={`material-symbols-outlined text-xs ${request.typeClass}`}>{request.typeIcon}</span>
                          {request.type}
                        </div>
                      </td>
                      <td className="bg-slate-900/30 px-4 py-5 font-medium text-slate-100 group-hover:bg-transparent">{request.date}</td>
                      <td className="bg-slate-900/30 px-4 py-5 group-hover:bg-transparent">
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs text-slate-500 line-through">{request.previousValue}</span>
                          <span className={`font-bold ${request.updatedClass}`}>{request.updatedValue}</span>
                        </div>
                      </td>
                      <td className="bg-slate-900/30 px-4 py-5 group-hover:bg-transparent">
                        <StatusBadge status={request.status} statusClass={request.statusClass} />
                      </td>
                      <td className="max-w-[220px] truncate bg-slate-900/30 px-4 py-5 text-slate-500 group-hover:bg-transparent">{request.reason}</td>
                      <td className="rounded-r-2xl bg-slate-900/30 px-4 py-5 text-right group-hover:bg-transparent">
                        <div className="flex justify-end gap-3">
                          <button className="rounded-lg p-2 text-cyan-300 transition hover:bg-cyan-300/10">
                            <span className="material-symbols-outlined text-lg">visibility</span>
                          </button>
                          <button
                            className={`rounded-lg p-2 transition ${request.canEdit ? "text-purple-300 hover:bg-purple-300/10" : "cursor-not-allowed text-purple-300/30"}`}
                          >
                            <span className="material-symbols-outlined text-lg">edit</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs font-medium text-slate-500">
                Showing <span className="text-slate-100">1 - 10</span> of <span className="text-slate-100">128</span> entries
              </p>
              <div className="flex gap-2">
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/70 text-slate-500 transition hover:bg-slate-700/70">
                  <span className="material-symbols-outlined text-xl">chevron_left</span>
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-sm font-bold text-[#004d57] shadow-[0_0_10px_rgba(0,227,253,0.3)]">
                  1
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/70 text-sm font-medium text-slate-500 transition hover:bg-slate-700/70">
                  2
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/70 text-sm font-medium text-slate-500 transition hover:bg-slate-700/70">
                  3
                </button>
                <button className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800/70 text-slate-500 transition hover:bg-slate-700/70">
                  <span className="material-symbols-outlined text-xl">chevron_right</span>
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
