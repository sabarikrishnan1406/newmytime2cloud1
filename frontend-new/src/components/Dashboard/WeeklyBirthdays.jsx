"use client";

import React, { useEffect, useState } from "react";
import { getWeeklyBirthdays } from "@/lib/endpoint/dashboard";

export default function WeeklyBirthdays() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const res = await getWeeklyBirthdays();
        if (!cancelled) setRows(res?.data || []);
      } catch (e) {
        if (!cancelled) setError(e?.message || "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center py-10 opacity-50 text-[10px] uppercase tracking-widest">
        Loading birthdays…
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center py-10 text-[10px] text-rose-400">
        {error}
      </div>
    );
  }

  if (!rows.length) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-10 opacity-50">
        <span className="material-symbols-outlined text-4xl mb-2">cake</span>
        <p className="text-[10px] font-bold uppercase tracking-widest">
          No birthdays this week
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
      <div className="space-y-2">
        {rows.map((r) => (
          <div
            key={r.employee_id}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg border transition-colors ${
              r.is_today
                ? "bg-pink-500/10 border-pink-500/30 hover:bg-pink-500/15"
                : "bg-white/[0.02] border-white/5 hover:bg-white/5"
            }`}
          >
            {/* Avatar / cake icon */}
            <div className={`shrink-0 size-10 rounded-full overflow-hidden flex items-center justify-center ${
              r.is_today ? "bg-pink-500/20 ring-2 ring-pink-400/60" : "bg-slate-700/40"
            }`}>
              {r.profile_picture ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={r.profile_picture.startsWith("http")
                    ? r.profile_picture
                    : `https://backend.mytime2cloud.com/media/employee/profile_picture/${r.profile_picture}`}
                  alt=""
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <span className="text-lg" aria-hidden="true">🎂</span>
              )}
            </div>

            {/* Main info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">
                  {r.full_name}
                </p>
                {r.is_today && (
                  <span className="text-[8px] font-black tracking-widest uppercase bg-pink-500 text-white px-1.5 py-0.5 rounded">
                    TODAY
                  </span>
                )}
                {r.age_turning ? (
                  <span className="text-[9px] text-slate-500">turns {r.age_turning}</span>
                ) : null}
              </div>
              <p className="text-[10px] text-slate-500 truncate italic mt-0.5">
                {r.wish}
              </p>
            </div>

            {/* Date column */}
            <div className="shrink-0 text-right">
              <p className={`text-[10px] font-bold uppercase tracking-wider ${
                r.is_today ? "text-pink-500 dark:text-pink-400" : "text-slate-500"
              }`}>
                {r.day_of_week}
              </p>
              <p className="text-[10px] text-gray-600 dark:text-gray-400 font-mono">
                {r.display_date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
