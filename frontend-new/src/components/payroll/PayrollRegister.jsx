"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { StatusBadge } from "@/components/payroll/StatusBadge";
import { api, buildQueryParams } from "@/lib/api-client";
import { Search, Download, Eye, FileText, X } from "lucide-react";

export default function PayrollRegister() {
  const searchParams = useSearchParams();
  const batchIdParam = searchParams.get("batch");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("all");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [batchInfo, setBatchInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = await buildQueryParams({});
        let batch;
        if (batchIdParam) {
          // View specific batch from dashboard eye icon
          const batchRes = await api.get("/payroll-management/batches", { params: { ...params, per_page: 50 } });
          batch = (batchRes.data?.data || []).find(b => String(b.id) === batchIdParam);
        }
        if (!batch) {
          // Fallback: get latest batch
          const batchRes = await api.get("/payroll-management/batches", { params: { ...params, per_page: 1 } });
          batch = batchRes.data?.data?.[0];
        }
        if (!batch) { setLoading(false); return; }
        setBatchInfo(batch);

        const { data } = await api.get(`/payroll-management/records/${batch.id}`, { params: { ...params, per_page: 100 } });
        const items = (data?.data || []).map(r => ({
          id: r.id,
          employeeId: r.employee?.employee_id || r.employee_id,
          name: r.employee ? `${r.employee.first_name} ${r.employee.last_name || ""}`.trim() : `Emp ${r.employee_id}`,
          department: r.employee?.department?.name || "---",
          branch: r.employee?.branch?.branch_name || "---",
          grossEarned: parseFloat(r.gross_earned) || 0,
          totalDeduction: parseFloat(r.total_deduction) || 0,
          netSalary: parseFloat(r.net_salary) || 0,
          otAmount: parseFloat(r.ot_amount) || 0,
          basicSalary: parseFloat(r.basic_salary) || 0,
          totalAllowances: parseFloat(r.total_allowances) || 0,
          status: r.status,
        }));
        setRecords(items);
      } catch (e) {
        console.warn("Register error", e);
        console.warn("Response:", e?.response?.data);
      }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filtered = records.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase());
    const matchDept = deptFilter === "all" || e.department === deptFilter;
    return matchSearch && matchDept;
  });

  const departments = [...new Set(records.map(e => e.department))];
  const totalNet = filtered.reduce((s, e) => s + e.netSalary, 0);
  const totalGross = filtered.reduce((s, e) => s + e.grossEarned, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Payroll Register</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {batchInfo?.month || "---"} &middot; {filtered.length} employees &middot; Net: {totalNet.toLocaleString()}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => {
            const printContent = document.getElementById("payroll-register-table");
            if (!printContent) return;
            const win = window.open("", "_blank");
            win.document.write(`<html><head><title>Payroll Register - ${batchInfo?.month || ""}</title>
              <style>body{font-family:Arial,sans-serif;padding:20px}table{width:100%;border-collapse:collapse;font-size:12px}
              th,td{border:1px solid #ddd;padding:8px;text-align:left}th{background:#f5f5f5;font-weight:bold;font-size:10px;text-transform:uppercase}
              h1{font-size:18px;margin-bottom:4px}p{font-size:12px;color:#666;margin-bottom:16px}
              .footer{margin-top:16px;font-size:12px;display:flex;justify-content:space-between}</style></head><body>
              <h1>Payroll Register</h1><p>${batchInfo?.month || ""} &middot; ${filtered.length} employees</p>
              ${printContent.outerHTML}
              <div class="footer"><span>Showing ${filtered.length} employees</span><span>Total Gross: ${totalGross.toLocaleString()} | Total Net: ${totalNet.toLocaleString()}</span></div>
              </body></html>`);
            win.document.close();
            win.print();
          }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <Download className="h-3.5 w-3.5" /> Export PDF
          </button>
          <button onClick={() => {
            if (filtered.length === 0) return;
            const headers = ["Employee", "ID", "Dept", "Branch", "Basic", "OT Amt", "Gross", "Deductions", "Net Salary", "Status"];
            const rows = filtered.map(e => [e.name, e.employeeId, e.department, e.branch, e.basicSalary, e.otAmount, e.grossEarned, e.totalDeduction, e.netSalary, e.status]);
            rows.push(["", "", "", "", "", "", totalGross, "", totalNet, ""]);
            const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");
            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `payroll_register_${batchInfo?.month || "export"}.csv`;
            a.click();
            URL.revokeObjectURL(url);
          }}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 transition shadow-sm">
            <FileText className="h-3.5 w-3.5" /> Export Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search employee..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 pl-9 pr-3 py-2 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value)}
          className="rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300"
        >
          <option value="all">All Departments</option>
          {departments.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table id="payroll-register-table" className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Employee</th>
                <th className="px-3 py-3">Dept</th>
                <th className="px-3 py-3">Branch</th>
                <th className="px-3 py-3">Basic</th>
                <th className="px-3 py-3">OT Amt</th>
                <th className="px-3 py-3">Gross</th>
                <th className="px-3 py-3">Deductions</th>
                <th className="px-3 py-3">Net Salary</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filtered.map(e => (
                <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition text-xs text-gray-600 dark:text-gray-300 cursor-pointer"
                  onClick={() => { setSelectedEmp(e); setDrawerOpen(true); }}>
                  <td className="px-4 py-3">
                    <div className="text-xs font-medium text-gray-800 dark:text-gray-100">{e.name}</div>
                    <div className="text-[10px] text-gray-400">ID: {e.employeeId}</div>
                  </td>
                  <td className="px-3 py-3 text-[11px]">{e.department}</td>
                  <td className="px-3 py-3 text-[11px]">{e.branch}</td>
                  <td className="px-3 py-3">{e.basicSalary.toLocaleString()}</td>
                  <td className="px-3 py-3">{e.otAmount.toLocaleString()}</td>
                  <td className="px-3 py-3">{e.grossEarned.toLocaleString()}</td>
                  <td className="px-3 py-3">{e.totalDeduction.toLocaleString()}</td>
                  <td className="px-3 py-3 font-semibold text-gray-800 dark:text-gray-100">{e.netSalary.toLocaleString()}</td>
                  <td className="px-3 py-3"><StatusBadge status={e.status} /></td>
                  <td className="px-3 py-3">
                    <div className="flex gap-1" onClick={ev => ev.stopPropagation()}>
                      <button title="View Details" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition"
                        onClick={() => { setSelectedEmp(e); setDrawerOpen(true); }}>
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button title="Download Payslip" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-emerald-500 transition"
                        onClick={async () => {
                          try {
                            const params = await buildQueryParams({});
                            const url = `${api.defaults.baseURL}/payroll-management/payslip/${e.id}?company_id=${params.company_id}`;
                            window.open(url, "_blank");
                          } catch (err) { alert("Failed to load payslip"); }
                        }}>
                        <FileText className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {loading && (
                <tr><td colSpan="10" className="px-4 py-8 text-center text-gray-400 text-xs">Loading payroll data...</td></tr>
              )}
              {!loading && filtered.length === 0 && records.length === 0 && (
                <tr><td colSpan="10" className="px-4 py-8 text-center text-gray-400 text-xs">No payroll generated yet. Go to Dashboard and click "Generate Payroll" first.</td></tr>
              )}
              {!loading && filtered.length === 0 && records.length > 0 && (
                <tr><td colSpan="10" className="px-4 py-8 text-center text-gray-400 text-xs">No employees match your search</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Totals */}
      <div className="flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50">
        <span className="text-xs text-gray-500">Showing {filtered.length} of {records.length} employees</span>
        <div className="text-xs font-semibold text-gray-700 dark:text-gray-200">
          Total Gross: {totalGross.toLocaleString()} | Total Net: {totalNet.toLocaleString()}
        </div>
      </div>

      {/* Detail Drawer */}
      {drawerOpen && selectedEmp && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)}></div>
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-white/10 shadow-2xl overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-white/10 px-5 py-4 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-gray-800 dark:text-gray-100">{selectedEmp.name}</h3>
                <p className="text-[10px] text-gray-500">{selectedEmp.department} &middot; {selectedEmp.branch} &middot; ID: {selectedEmp.employeeId}</p>
              </div>
              <button onClick={() => setDrawerOpen(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Earnings</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Basic Salary</span><span className="text-gray-800 dark:text-gray-200 font-medium">{selectedEmp.basicSalary.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Allowances</span><span className="text-gray-800 dark:text-gray-200 font-medium">{selectedEmp.totalAllowances.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Overtime</span><span className="text-gray-800 dark:text-gray-200 font-medium">{selectedEmp.otAmount.toLocaleString()}</span></div>
                  <div className="flex justify-between text-xs border-t border-gray-100 dark:border-white/10 pt-2"><span className="font-semibold text-gray-700 dark:text-gray-300">Gross Earned</span><span className="font-bold text-gray-800 dark:text-gray-100">{selectedEmp.grossEarned.toLocaleString()}</span></div>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Deductions</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-gray-500">Total Deductions</span><span className="text-red-500 font-medium">-{selectedEmp.totalDeduction.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-500/20 p-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">Net Salary</span>
                  <span className="text-xl font-bold text-emerald-700 dark:text-emerald-400">{selectedEmp.netSalary.toLocaleString()}</span>
                </div>
              </div>

              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">Status</h4>
                <StatusBadge status={selectedEmp.status} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
