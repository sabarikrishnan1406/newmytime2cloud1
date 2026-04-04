"use client";

import { useState } from "react";
import { FileText, Download, FileSpreadsheet, File, Users, Clock, Shield, BarChart3 } from "lucide-react";

const reports = [
  { id: "daily_log", name: "Daily Visitor Log", desc: "Complete check-in/out log for a specific date", icon: FileText, category: "Logs" },
  { id: "weekly_summary", name: "Weekly Summary Report", desc: "Visitor count, peak hours, and trends for the week", icon: BarChart3, category: "Logs" },
  { id: "monthly_summary", name: "Monthly Summary Report", desc: "Monthly visitor statistics and comparisons", icon: FileSpreadsheet, category: "Logs" },
  { id: "visitor_type", name: "Visitor Type Report", desc: "Breakdown by visitor type (Business, Contractor, VIP, etc.)", icon: Users, category: "Analytics" },
  { id: "host_report", name: "Host Activity Report", desc: "Visitors per host employee", icon: Users, category: "Analytics" },
  { id: "peak_hours", name: "Peak Hours Analysis", desc: "Busiest check-in/out times and capacity utilization", icon: Clock, category: "Analytics" },
  { id: "overstay", name: "Overstay Report", desc: "Visitors who exceeded their expected visit duration", icon: Clock, category: "Security" },
  { id: "blacklist", name: "Blacklist Report", desc: "Blocked/blacklisted visitors and incident history", icon: Shield, category: "Security" },
  { id: "access_method", name: "Access Method Report", desc: "Breakdown by verification method (Face ID, QR, RFID)", icon: Shield, category: "Security" },
  { id: "no_show", name: "No-Show Report", desc: "Pre-registered visitors who didn't arrive", icon: File, category: "Compliance" },
  { id: "compliance", name: "Compliance Report", desc: "NDA, safety induction, and ID verification status", icon: FileSpreadsheet, category: "Compliance" },
];

export default function VisitorReports() {
  const [dateRange, setDateRange] = useState({ from: "", to: "" });

  const categories = [...new Set(reports.map(r => r.category))];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Visitor Reports</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Generate and download visitor management reports</p>
      </div>

      <div className="flex gap-3">
        <div className="space-y-1">
          <span className="text-[10px] text-gray-500">From</span>
          <input type="date" value={dateRange.from} onChange={e => setDateRange({ ...dateRange, from: e.target.value })}
            className="rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300" />
        </div>
        <div className="space-y-1">
          <span className="text-[10px] text-gray-500">To</span>
          <input type="date" value={dateRange.to} onChange={e => setDateRange({ ...dateRange, to: e.target.value })}
            className="rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300" />
        </div>
      </div>

      {categories.map(cat => (
        <div key={cat} className="space-y-3">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{cat}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reports.filter(r => r.category === cat).map(report => (
              <div key={report.id} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-900/10">
                  <report.icon className="h-4 w-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-medium text-gray-800 dark:text-gray-100">{report.name}</h4>
                  <p className="text-[10px] text-gray-500 mt-0.5">{report.desc}</p>
                  <div className="flex gap-1.5 mt-2.5">
                    {["PDF", "CSV"].map(fmt => (
                      <button key={fmt}
                        className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-[10px] font-medium transition ${
                          fmt === "PDF"
                            ? "border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 hover:bg-red-100"
                            : "border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}>
                        <Download className="h-2.5 w-2.5" /> {fmt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
