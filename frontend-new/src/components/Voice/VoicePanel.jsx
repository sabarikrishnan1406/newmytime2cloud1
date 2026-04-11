"use client";

import { Users, Calendar, Clock, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

function ResultCard({ result }) {
  if (!result || !result.data) return null;

  switch (result.type) {
    case "employee_list":
      return (
        <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
          {result.data.employees?.length === 0 ? (
            <div className="text-center py-4 text-slate-500 text-xs">No employees found</div>
          ) : (
            result.data.employees?.map((emp, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px] font-bold text-indigo-400">
                    {(emp.name || "?").charAt(0)}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-200">{emp.name}</div>
                    <div className="text-[10px] text-slate-500">{emp.branch}</div>
                  </div>
                </div>
                {emp.in !== "---" && (
                  <div className="text-[10px] text-slate-400">
                    {emp.in} - {emp.out}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      );

    case "summary":
      return (
        <div className="grid grid-cols-2 gap-2">
          <SummaryCard label="Present" value={result.data.present} color="emerald" />
          <SummaryCard label="Absent" value={result.data.absent} color="red" />
          <SummaryCard label="Late" value={result.data.late} color="amber" />
          <SummaryCard label="Leave" value={result.data.leave} color="blue" />
          <SummaryCard label="Holiday" value={result.data.holiday} color="purple" />
          <SummaryCard label="Off" value={result.data.off} color="slate" />
        </div>
      );

    case "count":
      return (
        <div className="text-center py-4">
          <div className="text-4xl font-bold text-indigo-400">{result.data.count}</div>
          <div className="text-xs text-slate-500 mt-1">{result.label}</div>
        </div>
      );

    case "leave_list":
      return (
        <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
          {result.data.leaves?.length === 0 ? (
            <div className="text-center py-4 text-slate-500 text-xs">No leave requests found</div>
          ) : (
            result.data.leaves?.map((leave, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                <div>
                  <div className="text-xs font-medium text-slate-200">{leave.name}</div>
                  <div className="text-[10px] text-slate-500">{leave.leave_type} &middot; {leave.days} day{leave.days > 1 ? "s" : ""}</div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  leave.status === "Approved" ? "bg-emerald-500/15 text-emerald-400" :
                  leave.status === "Pending" ? "bg-amber-500/15 text-amber-400" :
                  "bg-red-500/15 text-red-400"
                }`}>
                  {leave.status}
                </span>
              </div>
            ))
          )}
        </div>
      );

    case "change_list":
      return (
        <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
          {result.data.requests?.length === 0 ? (
            <div className="text-center py-4 text-slate-500 text-xs">No change requests</div>
          ) : (
            result.data.requests?.map((req, i) => (
              <div key={i} className="px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                <div className="text-xs font-medium text-slate-200">{req.name}</div>
                <div className="text-[10px] text-slate-500">{req.date} &middot; {req.reason}</div>
              </div>
            ))
          )}
        </div>
      );

    case "holiday_list":
      return (
        <div className="space-y-1.5 max-h-[250px] overflow-y-auto pr-1">
          {result.data.holidays?.length === 0 ? (
            <div className="text-center py-4 text-slate-500 text-xs">No upcoming holidays</div>
          ) : (
            result.data.holidays?.map((h, i) => (
              <div key={i} className="flex items-center justify-between px-3 py-2 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-purple-400" />
                  <div className="text-xs font-medium text-slate-200">{h.name}</div>
                </div>
                <div className="text-[10px] text-slate-400">{h.date}</div>
              </div>
            ))
          )}
        </div>
      );

    default:
      return null;
  }
}

function SummaryCard({ label, value, color }) {
  const colors = {
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    slate: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  };

  return (
    <div className={`rounded-xl border p-3 text-center ${colors[color]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[10px] font-medium uppercase tracking-wider mt-0.5 opacity-70">{label}</div>
    </div>
  );
}

export default function VoicePanel({ state, transcript, result, history, debugLog = [], onClose }) {
  return (
    <div className="absolute bottom-20 right-0 w-[380px] bg-[#0d1529] border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 z-[9999]">
      {/* Header */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${
            state === "waiting" ? "bg-amber-400 animate-pulse" :
            state === "listening" ? "bg-emerald-400 animate-pulse" :
            state === "processing" ? "bg-blue-400 animate-pulse" :
            "bg-slate-600"
          }`} />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            {state === "waiting" ? "Say \"Hey MyTime\"..." :
             state === "listening" ? "Listening..." :
             state === "processing" ? "Processing..." :
             "MyTime Assistant"}
          </span>
        </div>
        <button onClick={onClose} className="text-slate-500 hover:text-slate-300 transition">
          <XCircle size={16} />
        </button>
      </div>

      {/* Listening Animation */}
      {(state === "waiting" || state === "listening") && (
        <div className="flex items-center justify-center py-6">
          <div className="relative">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
              state === "listening" ? "bg-emerald-500/20" : "bg-indigo-500/20"
            }`}>
              <span className="material-symbols-outlined text-2xl text-white">mic</span>
            </div>
            {state === "listening" && (
              <>
                <div className="absolute inset-0 rounded-full border-2 border-emerald-400/40 animate-ping" />
                <div className="absolute -inset-2 rounded-full border border-emerald-400/20 animate-pulse" />
                <div className="absolute -inset-4 rounded-full border border-emerald-400/10 animate-pulse" style={{ animationDelay: "0.3s" }} />
              </>
            )}
            {state === "waiting" && (
              <div className="absolute inset-0 rounded-full border-2 border-indigo-400/30 animate-pulse" />
            )}
          </div>
        </div>
      )}

      {/* Live Transcript */}
      {transcript && (state === "waiting" || state === "listening") && (
        <div className="px-4 pb-3">
          <div className="bg-white/5 rounded-xl px-3 py-2 text-sm text-slate-300 italic">
            "{transcript}"
          </div>
        </div>
      )}

      {/* Processing */}
      {state === "processing" && (
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Result */}
      {result && state === "idle" && (
        <div className="px-4 py-3 space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={14} className="text-emerald-400" />
            <span className="text-xs font-bold text-slate-200">{result.label}</span>
          </div>
          {result.speech && (
            <div className="text-xs text-slate-400 bg-white/5 rounded-xl px-3 py-2">
              {result.speech}
            </div>
          )}
          <ResultCard result={result} />
        </div>
      )}

      {/* Navigation result */}
      {result && result.type === "navigate" && state === "idle" && (
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 bg-indigo-500/10 rounded-xl px-3 py-3 border border-indigo-500/20">
            <CheckCircle2 size={16} className="text-indigo-400" />
            <span className="text-sm text-indigo-300">Navigated to <strong>{result.label}</strong></span>
          </div>
        </div>
      )}

      {/* Error */}
      {result && result.type === "error" && (
        <div className="px-4 py-4">
          <div className="flex items-center gap-2 bg-red-500/10 rounded-xl px-3 py-3 border border-red-500/20">
            <AlertCircle size={16} className="text-red-400" />
            <span className="text-sm text-red-300">{result.speech}</span>
          </div>
        </div>
      )}

      {/* History */}
      {history.length > 0 && state === "idle" && (
        <div className="px-4 py-3 border-t border-white/5">
          <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Recent</div>
          <div className="space-y-1">
            {history.slice(0, 3).map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-[11px] text-slate-500">
                <Clock size={10} />
                <span className="truncate">{h.command}</span>
                <span className="text-slate-600 ml-auto shrink-0">{h.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Debug Log */}
      {debugLog.length > 0 && (
        <div className="px-4 py-2 border-t border-white/5">
          <details className="group">
            <summary className="text-[10px] font-bold text-slate-600 uppercase tracking-wider cursor-pointer hover:text-slate-400">
              Debug Log
            </summary>
            <div className="mt-1 max-h-[120px] overflow-y-auto space-y-0.5">
              {debugLog.map((msg, i) => (
                <div key={i} className="text-[9px] text-slate-600 font-mono">{msg}</div>
              ))}
            </div>
          </details>
        </div>
      )}

      {/* Footer hint */}
      <div className="px-4 py-2 border-t border-white/5 bg-white/[0.02]">
        <div className="text-[10px] text-slate-600 text-center">
          Click mic to speak directly, or say <span className="text-indigo-400 font-medium">"Hey MyTime"</span> for hands-free
        </div>
      </div>
    </div>
  );
}
