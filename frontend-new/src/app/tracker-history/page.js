"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import HistoryReplay from "@/components/Map/HistoryReplay";
import { getUser } from "@/config";
import { getDeviceLogs } from "@/lib/api";
import { MapPin, Search, Smartphone } from "lucide-react";
import ProfilePicture from "@/components/ProfilePicture";
import DatePicker from "@/components/ui/DatePicker";
import DropDown from "@/components/ui/DropDown";
import { groupRows } from "./groupRows";

function TrackerHistoryInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [companyId, setCompanyId] = useState(null);

  useEffect(() => {
    try {
      const user = getUser();
      setCompanyId(user?.company_id ?? null);
    } catch (_) {
      setCompanyId(null);
    }
  }, []);

  const userId = params.get("user_id");
  const dateParam = params.get("date");
  const fromTime = params.get("from_time");
  const toTime = params.get("to_time");
  const name = params.get("name") || `Employee ${userId || ""}`;
  const avatar = params.get("avatar") || "";
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  if (companyId === null) {
    return <div className="p-10 text-slate-500 dark:text-slate-400">Loading…</div>;
  }

  if (userId) {
    return (
      <HistoryReplay
        employee={{ id: userId, name, avatar }}
        companyId={companyId}
        apiKey={apiKey}
        date={dateParam}
        fromTime={fromTime}
        toTime={toTime}
        layout="page"
        onClose={() => router.push("/tracker-history")}
      />
    );
  }

  return <TrackerHistoryPicker router={router} initialDate={dateParam} />;
}

function TrackerHistoryPicker({ router, initialDate }) {
  const [selectedDate, setSelectedDate] = useState(initialDate || new Date().toISOString().slice(0, 10));
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [branchFilter, setBranchFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    getDeviceLogs({
      page: 1,
      per_page: 1000,
      sortDesc: "false",
      device_ids: ["Mobile"],
      from_date: selectedDate,
      to_date: selectedDate,
      with_shift_type: 1,
    })
      .then((result) => {
        const rows = Array.isArray(result?.data) ? result.data : [];
        const mobile = rows.filter(
          (r) => String(r?.DeviceID || "").toLowerCase().includes("mobile") || r?.device?.name?.toLowerCase?.() === "mobile"
        );
        setLogs(mobile);
        setLoading(false);
      })
      .catch((err) => {
        setError(err?.message || "Failed to load logs");
        setLoading(false);
      });
  }, [selectedDate]);

  const branches = useMemo(() => {
    const map = new Map();
    logs.forEach((l) => {
      const b = l?.employee?.branch;
      if (b?.id && b?.branch_name) map.set(b.id, b.branch_name);
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [logs]);

  const departments = useMemo(() => {
    const map = new Map();
    logs.forEach((l) => {
      const d = l?.employee?.department;
      const bId = l?.employee?.branch?.id;
      if (d?.id && d?.name) {
        if (!branchFilter || String(bId) === String(branchFilter)) {
          map.set(d.id, d.name);
        }
      }
    });
    return Array.from(map, ([id, name]) => ({ id, name }));
  }, [logs, branchFilter]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filteredLogs = logs.filter((l) => {
      const bId = l?.employee?.branch?.id;
      const dId = l?.employee?.department?.id;
      if (branchFilter && String(bId) !== String(branchFilter)) return false;
      if (deptFilter && String(dId) !== String(deptFilter)) return false;
      if (q) {
        const hay = `${l?.employee?.first_name || ""} ${l?.employee?.last_name || ""} ${l?.UserID || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    return groupRows(filteredLogs);
  }, [logs, branchFilter, deptFilter, search]);

  const toIsoDate = (raw) => {
    if (!raw) return selectedDate;
    if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;
    const d = new Date(raw);
    if (!isNaN(d.getTime())) return d.toISOString().slice(0, 10);
    return selectedDate;
  };

  const openHistory = (row) => {
    const anyLog = row?.inLog || row?.outLog;
    const emp = anyLog?.employee || {};
    const fullName = [emp.first_name, emp.last_name].filter(Boolean).join(" ").trim() || `Employee ${anyLog?.UserID || ""}`;
    const isoDate = anyLog?.edit_date || toIsoDate(anyLog?.date);
    const params = {
      user_id: String(anyLog?.UserID || ""),
      date: isoDate,
      name: fullName,
      avatar: emp.profile_picture || "",
    };
    if (row?.inLog?.time) params.from_time = row.inLog.time;
    if (row?.outLog?.time) params.to_time = row.outLog.time;
    router.push(`/tracker-history?${new URLSearchParams(params).toString()}`);
  };

  const ctl = "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border border-gray-300 dark:border-slate-700 rounded-xl px-4 h-11 text-sm w-[180px] focus:outline-none focus:ring-2 focus:ring-primary/40";

  return (
    <div className="p-6 min-h-[calc(100vh-70px)] text-slate-700 dark:text-slate-200">
      <div className="flex items-center gap-2 mb-5">
        <MapPin size={22} className="text-primary" />
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Tracker History</h1>
      </div>

      <div className="flex flex-wrap gap-6 mb-6">
        <Field label="Branch">
          <div className="w-[200px]">
            <DropDown
              items={[{ id: "", name: "All branches" }, ...branches]}
              value={branchFilter}
              onChange={(v) => { setBranchFilter(v ?? ""); setDeptFilter(""); }}
              placeholder="All branches"
              width="w-[200px]"
            />
          </div>
        </Field>
        <Field label="Department">
          <div className="w-[200px]">
            <DropDown
              items={[{ id: "", name: "All departments" }, ...departments]}
              value={deptFilter}
              onChange={(v) => setDeptFilter(v ?? "")}
              placeholder="All departments"
              width="w-[200px]"
            />
          </div>
        </Field>
        <Field label="Date">
          <div className="w-[180px]">
            <DatePicker
              value={selectedDate}
              onChange={(d) => setSelectedDate(d)}
              placeholder="Pick a date"
            />
          </div>
        </Field>
        <Field label="Search">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Name or ID"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`${ctl} w-[220px] pl-9`}
            />
          </div>
        </Field>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <div className="max-h-[calc(100vh-260px)] overflow-y-auto">
          <table className="w-full border-collapse text-sm">
            <thead className="bg-gray-50 dark:bg-slate-800 sticky top-0 z-[1]">
              <tr>
                <Th>Personnel</Th>
                <Th>Branch / Department</Th>
                <Th>Date</Th>
                <Th>Login</Th>
                <Th>Logout</Th>
                <Th>Shift</Th>
                <Th>Mode</Th>
                <Th>Location</Th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} className="p-6 text-center text-slate-500 dark:text-slate-400">Loading logs…</td></tr>
              )}
              {!loading && error && (
                <tr><td colSpan={8} className="p-6 text-center text-red-500">{error}</td></tr>
              )}
              {!loading && !error && filtered.length === 0 && (
                <tr><td colSpan={8} className="p-6 text-center text-slate-500 dark:text-slate-400">No mobile clock-ins found for {selectedDate}.</td></tr>
              )}
              {!loading && !error && filtered.map((row) => {
                const anyLog = row.inLog || row.outLog;
                const emp = anyLog?.employee || {};
                const fullName = [emp.first_name, emp.last_name].filter(Boolean).join(" ").trim();
                const branchName = emp?.branch?.branch_name || "—";
                const deptName = emp?.department?.name || "—";
                const inLoc = row?.inLog?.gps_location || row?.inLog?.device?.location;
                const outLoc = row?.outLog?.gps_location || row?.outLog?.device?.location;
                return (
                  <tr key={row.key} className={`${row.groupRowIndex === 0 ? "border-t border-gray-100 dark:border-slate-800" : ""} hover:bg-gray-50 dark:hover:bg-slate-800/50 align-top`}>
                    {row.groupRowIndex === 0 && (
                      <>
                        <Td rowSpan={row.groupRowCount}>
                          <div className="flex items-center gap-2.5">
                            <ProfilePicture src={emp.profile_picture} />
                            <div>
                              <div className="text-slate-700 dark:text-slate-200 font-medium">{fullName || "—"}</div>
                              <div className="text-[11px] text-slate-500 dark:text-slate-400">ID: {emp.employee_id || anyLog?.UserID}</div>
                            </div>
                          </div>
                        </Td>
                        <Td rowSpan={row.groupRowCount}>{branchName} / {deptName}</Td>
                        <Td rowSpan={row.groupRowCount}>{anyLog?.date || "—"}</Td>
                      </>
                    )}
                    <Td>
                      {row.inLog ? (
                        <div className="flex flex-col gap-1">
                          <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                            {row.inLog.time}
                          </span>
                          {row.extraPunches && row.extraPunches.length > 0 && (
                            <span
                              className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 cursor-help"
                              title={row.extraPunches.map((p) => `${p.time} ${String(p.log_type || "").toUpperCase()}`).join("\n")}
                            >
                              +{row.extraPunches.length} punches
                            </span>
                          )}
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[180px] truncate" title={inLoc || ""}>
                            {inLoc || "—"}
                          </span>
                        </div>
                      ) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                    </Td>
                    <Td>
                      {row.outLog ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="inline-flex w-fit items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            {row.outLog.time}
                          </span>
                          <span className="text-[10px] text-slate-500 dark:text-slate-400 max-w-[180px] truncate" title={outLoc || ""}>
                            {outLoc || "—"}
                          </span>
                        </div>
                      ) : <span className="text-slate-400 dark:text-slate-500">—</span>}
                    </Td>
                    <Td>
                      {row.shiftLabel && row.shiftLabel !== "—" ? (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                          {row.shiftLabel}
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-[11px]">—</span>
                      )}
                    </Td>
                    <Td><Smartphone size={16} className="text-slate-400 dark:text-slate-500" /></Td>
                    <Td>
                      <button
                        onClick={() => openHistory(row)}
                        title="Play movement between these times"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-primary text-white hover:bg-primary/90 shadow-sm transition"
                      >
                        <MapPin size={14} />
                        Play
                      </button>
                    </Td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">{label}</span>
      {children}
    </label>
  );
}

function Th({ children }) {
  return <th className="px-3.5 py-3 text-left text-[11px] font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">{children}</th>;
}
function Td({ children, rowSpan }) {
  return <td rowSpan={rowSpan} className="px-3.5 py-2.5 text-slate-600 dark:text-slate-300 align-middle">{children}</td>;
}

export default function TrackerHistoryPage() {
  return (
    <Suspense fallback={<div className="p-10 text-slate-500 dark:text-slate-400">Loading…</div>}>
      <TrackerHistoryInner />
    </Suspense>
  );
}
