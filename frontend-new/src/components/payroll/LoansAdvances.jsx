"use client";

import { useState, useEffect } from "react";
import { api, buildQueryParams } from "@/lib/api-client";
import { Plus, Landmark, HandCoins, X } from "lucide-react";

const emptyLoanForm = { employee_id: "", loan_amount: "", monthly_installment: "", start_month: "", end_month: "", remarks: "" };
const emptyAdvForm = { employee_id: "", advance_amount: "", monthly_recovery: "", issue_date: "", remarks: "" };

export default function LoansAdvances() {
  const [activeTab, setActiveTab] = useState("loans");
  const [loanDialog, setLoanDialog] = useState(false);
  const [advDialog, setAdvDialog] = useState(false);
  const [loans, setLoans] = useState([]);
  const [advances, setAdvances] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loanForm, setLoanForm] = useState(emptyLoanForm);
  const [advForm, setAdvForm] = useState(emptyAdvForm);
  const [saving, setSaving] = useState(false);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selBranch, setSelBranch] = useState("");
  const [selDept, setSelDept] = useState("");

  const fetchLoans = async () => {
    try {
      const params = await buildQueryParams({});
      const { data } = await api.get("/payroll-management/loans", { params: { ...params, per_page: 100 } });
      setLoans((data?.data || []).map(l => ({
        ...l,
        employeeName: l.employee ? `${l.employee.first_name} ${l.employee.last_name || ""}`.trim() : `Emp ${l.employee_id}`,
        employeeId: String(l.employee?.employee_id || l.employee_id),
        loanAmount: parseFloat(l.loan_amount) || 0,
        monthlyInstallment: parseFloat(l.monthly_installment) || 0,
        outstandingBalance: parseFloat(l.outstanding_balance) || 0,
        startMonth: l.start_month || "---",
        endMonth: l.end_month || "---",
      })));
    } catch (e) {}
  };

  const fetchAdvances = async () => {
    try {
      const params = await buildQueryParams({});
      const { data } = await api.get("/payroll-management/advances", { params: { ...params, per_page: 100 } });
      setAdvances((data?.data || []).map(a => ({
        ...a,
        employeeName: a.employee ? `${a.employee.first_name} ${a.employee.last_name || ""}`.trim() : `Emp ${a.employee_id}`,
        employeeId: String(a.employee?.employee_id || a.employee_id),
        advanceAmount: parseFloat(a.advance_amount) || 0,
        monthlyRecovery: parseFloat(a.monthly_recovery) || 0,
        outstandingBalance: parseFloat(a.outstanding_balance) || 0,
        issueDate: a.issue_date || "---",
      })));
    } catch (e) {}
  };

  useEffect(() => {
    fetchLoans();
    fetchAdvances();
    const fetchEmployees = async () => {
      try {
        const params = await buildQueryParams({});
        const { data } = await api.get("/payroll-management/employees", { params });
        setEmployees(data || []);
        const bMap = {}, dMap = {};
        (data || []).forEach(e => {
          if (e.branch) bMap[e.branch.id] = e.branch.branch_name;
          if (e.department) dMap[e.department.id] = { name: e.department.name, branchId: e.branch_id };
        });
        setBranches(Object.entries(bMap).map(([id, name]) => ({ id, name })));
        setDepartments(Object.entries(dMap).map(([id, v]) => ({ id, name: v.name, branchId: v.branchId })));
      } catch (e) {}
    };
    fetchEmployees();
  }, []);

  const filtDepts = selBranch ? departments.filter(d => String(d.branchId) === String(selBranch)) : departments;
  const filtEmps = employees.filter(e => {
    if (selBranch && String(e.branch_id) !== String(selBranch)) return false;
    if (selDept && String(e.department_id) !== String(selDept)) return false;
    return true;
  });

  const BranchDeptEmpFilter = ({ formValue, onEmpChange }) => (
    <div className="grid grid-cols-3 gap-3">
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500">Branch</label>
        <select value={selBranch} onChange={e => { setSelBranch(e.target.value); setSelDept(""); onEmpChange(""); }}
          className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
          <option value="">All Branches</option>
          {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500">Department</label>
        <select value={selDept} onChange={e => { setSelDept(e.target.value); onEmpChange(""); }}
          className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
          <option value="">All Depts</option>
          {filtDepts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500">Employee</label>
        <select value={formValue} onChange={e => onEmpChange(e.target.value)}
          className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300">
          <option value="">Select employee</option>
          {filtEmps.map(emp => <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name || ""}</option>)}
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Loans & Advances</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Manage employee loans, salary advances, and recovery schedules</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200 dark:border-white/10">
        <button onClick={() => setActiveTab("loans")} className={`pb-3 text-xs font-bold flex items-center gap-1.5 transition ${activeTab === "loans" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-gray-600"}`}>
          <Landmark className="h-3.5 w-3.5" /> Loans
        </button>
        <button onClick={() => setActiveTab("advances")} className={`pb-3 text-xs font-bold flex items-center gap-1.5 transition ${activeTab === "advances" ? "border-b-2 border-primary text-primary" : "text-gray-400 hover:text-gray-600"}`}>
          <HandCoins className="h-3.5 w-3.5" /> Advances
        </button>
      </div>

      {/* Loans Tab */}
      {activeTab === "loans" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setLoanDialog(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 transition shadow-sm">
              <Plus className="h-3.5 w-3.5" /> Add Loan
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loans.length === 0 && (
              <div className="col-span-full text-center py-8 text-gray-400 text-xs">No loans found. Click "Add Loan" to create one.</div>
            )}
            {loans.map(l => {
              const paidPercent = Math.round(((l.loanAmount - l.outstandingBalance) / l.loanAmount) * 100);
              return (
                <div key={l.id} className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100">{l.employeeName}</div>
                      <div className="text-[10px] text-gray-400">{l.employeeId}</div>
                    </div>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${l.status === "active" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>{l.status}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div><span className="text-gray-400">Amount: </span><span className="font-semibold text-gray-700 dark:text-gray-200">{l.loanAmount.toLocaleString()}</span></div>
                    <div><span className="text-gray-400">Installment: </span><span className="font-semibold text-gray-700 dark:text-gray-200">{l.monthlyInstallment.toLocaleString()}</span></div>
                    <div><span className="text-gray-400">Outstanding: </span><span className="font-semibold text-red-500">{l.outstandingBalance.toLocaleString()}</span></div>
                    <div><span className="text-gray-400">Period: </span><span className="text-[10px] text-gray-500">{l.startMonth} - {l.endMonth}</span></div>
                  </div>
                  <div>
                    <div className="flex justify-between text-[10px] text-gray-400 mb-1"><span>Recovered</span><span>{paidPercent}%</span></div>
                    <div className="h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                      <div className="h-full bg-primary rounded-full" style={{ width: `${paidPercent}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Advances Tab */}
      {activeTab === "advances" && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button onClick={() => setAdvDialog(true)} className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 transition shadow-sm">
              <Plus className="h-3.5 w-3.5" /> Add Advance
            </button>
          </div>

          <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                    <th className="px-4 py-3">Employee</th><th className="px-3 py-3">Advance</th><th className="px-3 py-3">Monthly Recovery</th><th className="px-3 py-3">Outstanding</th><th className="px-3 py-3">Issue Date</th><th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {advances.map(a => (
                    <tr key={a.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition text-xs text-gray-600 dark:text-gray-300">
                      <td className="px-4 py-3"><div className="text-xs font-medium text-gray-800 dark:text-gray-100">{a.employeeName}</div><div className="text-[10px] text-gray-400">{a.employeeId}</div></td>
                      <td className="px-3 py-3 font-semibold">{a.advanceAmount.toLocaleString()}</td>
                      <td className="px-3 py-3">{a.monthlyRecovery.toLocaleString()}</td>
                      <td className="px-3 py-3 font-semibold text-red-500">{a.outstandingBalance.toLocaleString()}</td>
                      <td className="px-3 py-3 text-[11px]">{a.issueDate}</td>
                      <td className="px-3 py-3"><span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold ${a.status === "active" ? "bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400" : "bg-gray-100 dark:bg-gray-800 text-gray-500"}`}>{a.status}</span></td>
                    </tr>
                  ))}
                  {advances.length === 0 && (
                    <tr><td colSpan="6" className="px-4 py-8 text-center text-gray-400 text-xs">No advances found. Click "Add Advance" to create one.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Add Loan Dialog */}
      {loanDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setLoanDialog(false)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">New Loan</h3>
              <button onClick={() => setLoanDialog(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <BranchDeptEmpFilter formValue={loanForm.employee_id} onEmpChange={v => setLoanForm({ ...loanForm, employee_id: v })} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Loan Amount</label>
                  <input type="number" placeholder="0" value={loanForm.loan_amount} onChange={e => setLoanForm({ ...loanForm, loan_amount: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Monthly Installment</label>
                  <input type="number" placeholder="0" value={loanForm.monthly_installment} onChange={e => setLoanForm({ ...loanForm, monthly_installment: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Start Month</label>
                  <input type="month" value={loanForm.start_month} onChange={e => setLoanForm({ ...loanForm, start_month: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">End Month</label>
                  <input type="month" value={loanForm.end_month} onChange={e => setLoanForm({ ...loanForm, end_month: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">Remarks</label>
                <textarea placeholder="Reason..." rows={2} value={loanForm.remarks} onChange={e => setLoanForm({ ...loanForm, remarks: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 resize-none"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setLoanDialog(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
              <button disabled={saving} onClick={async () => {
                if (!loanForm.employee_id || !loanForm.loan_amount || !loanForm.monthly_installment) { alert("Employee, Loan Amount, and Monthly Installment are required"); return; }
                setSaving(true);
                try {
                  const params = await buildQueryParams({});
                  await api.post("/payroll-management/loans", { ...params, ...loanForm, status: "active" });
                  setLoanDialog(false);
                  setLoanForm(emptyLoanForm);
                  fetchLoans();
                } catch (e) { alert(e?.response?.data?.message || "Save failed"); }
                finally { setSaving(false); }
              }}
                className="px-4 py-2 rounded-lg bg-primary text-xs font-medium text-white hover:bg-blue-600 transition shadow-sm disabled:opacity-50">
                {saving ? "Saving..." : "Save Loan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Advance Dialog */}
      {advDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setAdvDialog(false)}></div>
          <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-white/10 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">New Advance</h3>
              <button onClick={() => setAdvDialog(false)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"><X className="h-4 w-4" /></button>
            </div>
            <div className="space-y-4">
              <BranchDeptEmpFilter formValue={advForm.employee_id} onEmpChange={v => setAdvForm({ ...advForm, employee_id: v })} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Advance Amount</label>
                  <input type="number" placeholder="0" value={advForm.advance_amount} onChange={e => setAdvForm({ ...advForm, advance_amount: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-500">Monthly Recovery</label>
                  <input type="number" placeholder="0" value={advForm.monthly_recovery} onChange={e => setAdvForm({ ...advForm, monthly_recovery: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">Issue Date</label>
                <input type="date" value={advForm.issue_date} onChange={e => setAdvForm({ ...advForm, issue_date: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-500">Remarks</label>
                <textarea placeholder="Reason..." rows={2} value={advForm.remarks} onChange={e => setAdvForm({ ...advForm, remarks: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-sm text-gray-700 dark:text-gray-300 resize-none"></textarea>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setAdvDialog(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
              <button disabled={saving} onClick={async () => {
                if (!advForm.employee_id || !advForm.advance_amount || !advForm.monthly_recovery) { alert("Employee, Advance Amount, and Monthly Recovery are required"); return; }
                setSaving(true);
                try {
                  const params = await buildQueryParams({});
                  await api.post("/payroll-management/advances", { ...params, ...advForm, status: "active" });
                  setAdvDialog(false);
                  setAdvForm(emptyAdvForm);
                  fetchAdvances();
                } catch (e) { alert(e?.response?.data?.message || "Save failed"); }
                finally { setSaving(false); }
              }}
                className="px-4 py-2 rounded-lg bg-primary text-xs font-medium text-white hover:bg-blue-600 transition shadow-sm disabled:opacity-50">
                {saving ? "Saving..." : "Save Advance"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
