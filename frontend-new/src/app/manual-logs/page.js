"use client";

import { useState, useEffect } from "react";
import { Eye, X } from "lucide-react";
import { API_BASE_URL } from "@/config";
import { getUser } from "@/config/index";
import ProfilePicture from "@/components/ProfilePicture";
import DateRangeSelect from "@/components/ui/DateRange";

export default function ManualLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLog, setSelectedLog] = useState(null);
  const [from, setFrom] = useState(() => {
    const dt = new Date();
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-01`;
  });
  const [to, setTo] = useState(() => {
    const dt = new Date();
    return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, "0")}-${String(new Date(dt.getFullYear(), dt.getMonth() + 1, 0).getDate()).padStart(2, "0")}`;
  });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const user = getUser();
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_BASE_URL}/attendance_logs?company_id=${user?.company_id || 0}&DeviceID=Manual&from_date=${from}&to_date=${to}&per_page=500&sortDesc=true`,
        { headers: { Authorization: `Bearer ${token}`, Accept: "application/json" } }
      );
      const data = await res.json();
      setLogs(Array.isArray(data?.data) ? data.data : []);
    } catch (e) {
      console.error(e);
      setLogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (from && to) fetchLogs();
  }, [from, to]);

  return (
    <div className="p-6 w-full">
      {/* Main Table */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Manual Logs</h1>
          <div className="w-72">
            <DateRangeSelect
              value={{ from, to }}
              onChange={({ from, to }) => { setFrom(from); setTo(to); }}
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-white/10 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 dark:bg-white/5 text-xs uppercase text-slate-500 dark:text-slate-400 font-semibold tracking-wider border-b border-gray-200 dark:border-white/10">
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">Approved By</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Log Type</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr>
              ) : logs.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No manual logs found</td></tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className={`hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer ${selectedLog?.id === log.id ? "bg-primary/5 dark:bg-primary/10" : ""}`}
                    onClick={() => setSelectedLog(log)}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <ProfilePicture src={log.employee?.profile_picture} />
                        <div>
                          <div className="text-sm font-medium text-slate-800 dark:text-white">
                            {log.employee?.full_name || log.employee?.first_name || `ID: ${log.UserID}`}
                          </div>
                          <div className="text-xs text-slate-400">
                            {log.employee?.department?.name || ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {log.approver ? (
                        <div className="flex items-center gap-3">
                          <ProfilePicture src={log.approver.employee?.profile_picture} />
                          <div>
                            <div className="text-sm font-medium text-slate-800 dark:text-white">
                              {log.approver.employee?.first_name || log.approver.name || "Admin"}
                            </div>
                            <div className="text-xs text-slate-400">
                              {log.approver.employee?.department?.name || ""}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-slate-800 dark:text-white">Admin</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{log.date || log.log_date}</td>
                    <td className="px-4 py-3 text-sm font-medium text-slate-700 dark:text-slate-200">{log.time || log.LogTime?.split(" ")[1]?.substring(0, 5)}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${log.log_type?.toLowerCase() === "in" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"}`}>
                        {log.log_type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600 dark:text-slate-300">{log.reason || "---"}</td>
                    <td className="px-4 py-3">
                      <button
                        onClick={(e) => { e.stopPropagation(); setSelectedLog(log); }}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-md text-primary hover:bg-primary/5"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Center Popup Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedLog(null)}></div>
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-white/10 p-6 w-[500px] max-h-[80vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800 dark:text-white">Log Details</h2>
              <button onClick={() => setSelectedLog(null)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Employee Info */}
            <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-100 dark:border-white/10">
              <ProfilePicture src={selectedLog.employee?.profile_picture} size={48} />
              <div>
                <div className="text-base font-semibold text-slate-800 dark:text-white">
                  {selectedLog.employee?.full_name || selectedLog.employee?.first_name || `ID: ${selectedLog.UserID}`}
                </div>
                <div className="text-sm text-slate-400">
                  {selectedLog.employee?.department?.name || ""} {selectedLog.employee?.employee_id ? `| ${selectedLog.employee.employee_id}` : ""}
                </div>
              </div>
            </div>

            {/* Approved By */}
            {selectedLog.approver ? (
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
                <span className="text-sm text-slate-400">Approved By:</span>
                <ProfilePicture src={selectedLog.approver.employee?.profile_picture} size={32} />
                <div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {selectedLog.approver.employee?.first_name || selectedLog.approver.name || "Admin"}
                  </span>
                  {selectedLog.approver.employee?.department?.name && (
                    <div className="text-xs text-slate-400">{selectedLog.approver.employee.department.name}</div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
                <span className="text-sm text-slate-400">Approved By:</span>
                <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">Admin</span>
              </div>
            )}

            {/* Details */}
            <div className="space-y-4">
              <DetailRow label="Log Time" value={selectedLog.LogTime || `${selectedLog.log_date} ${selectedLog.time}`} />
              <DetailRow label="Log Type">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${selectedLog.log_type?.toLowerCase() === "in" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-orange-100 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400"}`}>
                  {selectedLog.log_type}
                </span>
              </DetailRow>
              <DetailRow label="Device" value={selectedLog.DeviceID || "Manual"} />
              <DetailRow label="Reason" value={selectedLog.reason || "---"} />
              <DetailRow label="Note" value={selectedLog.note || "---"} />
              <DetailRow label="GPS Location" value={selectedLog.gps_location || "---"} />
              <DetailRow label="Attachment">
                {selectedLog.attachment ? (
                  <a
                    href={`${API_BASE_URL.replace('/api', '')}/ManualLog/attachments/${selectedLog.attachment}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Attachment
                  </a>
                ) : (
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">---</span>
                )}
              </DetailRow>
              <DetailRow label="Created At" value={selectedLog.created_at || "---"} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, children }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-slate-400">{label}</span>
      {children || <span className="text-sm font-medium text-slate-700 dark:text-slate-200">{value}</span>}
    </div>
  );
}
