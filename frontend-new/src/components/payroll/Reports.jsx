"use client";

import { useState } from "react";
import { api, buildQueryParams } from "@/lib/api-client";
import { FileText, Download, FileSpreadsheet, File } from "lucide-react";

const reports = [
  { id: "register", name: "Payroll Register Report", desc: "Complete payroll register with all employee details", icon: FileText, category: "Payroll" },
  { id: "dept_summary", name: "Department Salary Summary", desc: "Salary cost breakdown by department", icon: FileSpreadsheet, category: "Payroll" },
  { id: "deduction", name: "Deduction Report", desc: "All deductions including absence, late, loans", icon: File, category: "Deductions" },
  { id: "overtime", name: "Overtime Report", desc: "Normal, weekend, and holiday overtime details", icon: FileText, category: "Overtime" },
  { id: "loan_recovery", name: "Loan Recovery Report", desc: "Monthly loan installment recovery status", icon: FileSpreadsheet, category: "Loans" },
  { id: "advance_recovery", name: "Advance Recovery Report", desc: "Salary advance recovery tracking", icon: File, category: "Loans" },
  { id: "variance", name: "Variance Report", desc: "Month-over-month payroll variance analysis", icon: FileText, category: "Analysis" },
  { id: "salary_history", name: "Salary History Report", desc: "Employee salary revision history", icon: FileSpreadsheet, category: "History" },
  { id: "bank_transfer", name: "Bank Transfer Report", desc: "Bank transfer file for salary disbursement", icon: File, category: "Banking" },
  { id: "wps_sif", name: "WPS / SIF Export", desc: "UAE WPS Salary Information File", icon: FileSpreadsheet, category: "Banking" },
];

export default function PayrollReports() {
  const [month, setMonth] = useState("2026-04");
  const [downloading, setDownloading] = useState(null);

  const handlePdfDownload = async (reportId, reportName) => {
    setDownloading(`${reportId}-pdf`);
    try {
      const params = await buildQueryParams({});
      const { data } = await api.get("/payroll-management/export-report", {
        params: { ...params, report_type: reportId, month, format: "csv" },
        responseType: "text",
      });
      // Parse CSV and render as printable HTML
      const lines = data.split("\n").filter(l => l.trim());
      const headers = lines[0].split(",").map(h => h.replace(/"/g, "").trim());
      const rows = lines.slice(1).map(l => l.split(",").map(c => c.replace(/"/g, "").trim()));
      const win = window.open("", "_blank");
      win.document.write(`<html><head><title>${reportName} - ${month}</title>
        <style>body{font-family:Arial,sans-serif;padding:30px}table{width:100%;border-collapse:collapse;font-size:12px;margin-top:16px}
        th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5;font-weight:bold;font-size:10px;text-transform:uppercase}
        h1{font-size:18px;margin-bottom:4px}p{font-size:12px;color:#666}
        @media print{body{padding:10px}}</style></head><body>
        <h1>${reportName}</h1><p>Month: ${month}</p>
        <table><thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
        <tbody>${rows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</tbody></table>
        </body></html>`);
      win.document.close();
      win.print();
    } catch (e) {
      alert("Download failed. Make sure payroll has been generated for this month.");
    } finally {
      setDownloading(null);
    }
  };

  const handleDownload = async (reportId, format) => {
    setDownloading(`${reportId}-${format}`);
    try {
      const params = await buildQueryParams({});
      const { data } = await api.get("/payroll-management/export-report", {
        params: { ...params, report_type: reportId, month, format },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${reportId}_${month}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      alert("Download failed. Make sure payroll has been generated for this month.");
    } finally {
      setDownloading(null);
    }
  };

  const categories = [...new Set(reports.map(r => r.category))];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Reports</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Generate and download payroll reports in PDF, Excel, or CSV format</p>
      </div>

      <div>
        <span className="text-[10px] text-gray-500 block mb-1">Payroll Month</span>
        <input type="month" value={month} onChange={e => setMonth(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 w-44" />
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
                    <button onClick={() => handleDownload(report.id, "csv")}
                      disabled={downloading === `${report.id}-csv`}
                      className="inline-flex items-center gap-1 rounded-md border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-2 py-1 text-[10px] font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition disabled:opacity-50">
                      <Download className="h-2.5 w-2.5" /> {downloading === `${report.id}-csv` ? "..." : "CSV"}
                    </button>
                    <button onClick={() => handlePdfDownload(report.id, report.name)}
                      disabled={downloading === `${report.id}-pdf`}
                      className="inline-flex items-center gap-1 rounded-md border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-900/10 px-2 py-1 text-[10px] font-medium text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition disabled:opacity-50">
                      <Download className="h-2.5 w-2.5" /> {downloading === `${report.id}-pdf` ? "..." : "PDF"}
                    </button>
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
