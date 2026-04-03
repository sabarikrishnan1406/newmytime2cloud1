"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { KPICard } from "@/components/payroll/KPICard";
import { StatusBadge } from "@/components/payroll/StatusBadge";
import { api, buildQueryParams } from "@/lib/api-client";
import {
  Users, DollarSign, TrendingDown, Wallet, Clock, CheckCircle, CreditCard,
  AlertCircle, Plus, Play, ThumbsUp, Download, FileText, Eye
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = ['hsl(199,89%,38%)', 'hsl(152,60%,40%)', 'hsl(38,92%,50%)', 'hsl(262,52%,47%)', 'hsl(0,72%,51%)', 'hsl(199,89%,58%)'];

export default function PayrollDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [batches, setBatches] = useState([]);
  const [month] = useState(new Date().toISOString().slice(0, 7));
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [deptCost, setDeptCost] = useState([]);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const params = await buildQueryParams({});
      try {
        const { data } = await api.get("/payroll-management/dashboard", { params: { ...params, month } });
        setStats(data);
        setMonthlyTrend(data.monthly_trend || []);
        setDeptCost(data.department_cost || []);
      } catch (e) { console.warn("Dashboard stats error", e); }
      try {
        const batchRes = await api.get("/payroll-management/batches", { params: { ...params, per_page: 10 } });
        console.log("Batches API response:", batchRes.data);
        setBatches(batchRes.data?.data || []);
      } catch (e) { console.warn("Batches error", e?.response?.data || e); }
    };
    fetchData();
  }, [month]);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const params = await buildQueryParams({});
      const { data } = await api.post("/payroll-management/generate", { ...params, month });
      alert(data.message || "Payroll generated");
      // Refresh
      const res = await api.get("/payroll-management/dashboard", { params: { ...params, month } });
      setStats(res.data);
      setMonthlyTrend(res.data.monthly_trend || []);
      setDeptCost(res.data.department_cost || []);
      const bRes = await api.get("/payroll-management/batches", { params: { ...params, per_page: 10 } });
      setBatches(bRes.data?.data || []);
    } catch (e) {
      alert(e?.response?.data?.message || "Error generating payroll");
    } finally {
      setGenerating(false);
    }
  };

  const totals = {
    gross: stats?.total_gross || 0,
    ded: stats?.total_deductions || 0,
    net: stats?.total_net || 0,
    ot: stats?.total_ot || 0,
    approved: stats?.approved || 0,
    paid: stats?.paid || 0,
    pending: stats?.pending || 0,
    empCount: stats?.total_employees || 0,
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">Payroll Dashboard</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">Manage salary processing, approvals, deductions, allowances, and payslip generation</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => router.push('/payslips/salary-structures')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition"
          >
            <Plus className="h-3.5 w-3.5" /> Salary Structures
          </button>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 transition shadow-sm disabled:opacity-50"
          >
            <Play className="h-3.5 w-3.5" /> {generating ? "Generating..." : "Generate Payroll"}
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <KPICard title="Total Employees" value={totals.empCount} icon={Users} variant="primary" />
        <KPICard title="Gross Salary" value={totals.gross.toLocaleString()} icon={DollarSign} variant="primary" />
        <KPICard title="Total Deductions" value={totals.ded.toLocaleString()} icon={TrendingDown} variant="destructive" />
        <KPICard title="Net Salary" value={totals.net.toLocaleString()} icon={Wallet} variant="success" />
        <KPICard title="Overtime Amount" value={totals.ot.toLocaleString()} icon={Clock} variant="warning" />
        <KPICard title="Pending Approval" value={totals.pending} icon={AlertCircle} variant="warning" />
        <KPICard title="Approved" value={totals.approved} icon={CheckCircle} variant="success" />
        <KPICard title="Paid Employees" value={totals.paid} icon={CreditCard} variant="primary" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Monthly Payroll Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.1)" />
              <XAxis dataKey="month" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 11 }} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => v.toLocaleString()} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
              <Bar dataKey="gross" name="Gross" fill="hsl(199,89%,38%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="net" name="Net" fill="hsl(152,60%,40%)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="deductions" name="Deductions" fill="hsl(0,72%,51%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 p-4">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-4">Department Salary Cost</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={deptCost} dataKey="cost" nameKey="department" cx="50%" cy="50%" outerRadius={85}
                label={({ department, percent }) => `${department} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                {deptCost.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => v.toLocaleString()} contentStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Batches Table */}
      <div className="rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-gray-900/50 overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Recent Payroll Batches</h3>
          <button onClick={() => router.push('/payslips')} className="text-[10px] font-bold text-primary hover:underline uppercase tracking-wider">
            View All
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] font-bold uppercase tracking-wider text-gray-500">
                <th className="px-4 py-3">Month</th>
                <th className="px-4 py-3">Branch</th>
                <th className="px-4 py-3">Employees</th>
                <th className="px-4 py-3">Gross</th>
                <th className="px-4 py-3">Deductions</th>
                <th className="px-4 py-3">Net</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {batches.map(b => (
                <tr key={b.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition text-xs text-gray-600 dark:text-gray-300">
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-100">{b.month}</td>
                  <td className="px-4 py-3">{b.branch_id || "All"}</td>
                  <td className="px-4 py-3">{b.total_employees}</td>
                  <td className="px-4 py-3">{parseFloat(b.total_gross || 0).toLocaleString()}</td>
                  <td className="px-4 py-3">{parseFloat(b.total_deductions || 0).toLocaleString()}</td>
                  <td className="px-4 py-3 font-semibold text-gray-800 dark:text-gray-100">{parseFloat(b.total_net || 0).toLocaleString()}</td>
                  <td className="px-4 py-3"><StatusBadge status={b.status} /></td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {b.status === "draft" && (
                        <button onClick={async () => {
                          if (!confirm("Approve this batch?")) return;
                          const params = await buildQueryParams({});
                          try {
                            await api.post(`/payroll-management/approve/${b.id}`, params);
                            const res = await api.get("/payroll-management/batches", { params: { ...params, per_page: 10 } });
                            setBatches(res.data?.data || []);
                          } catch (e) { alert("Failed"); }
                        }} className="px-2 py-1 rounded text-[10px] font-bold bg-emerald-100 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200 transition">
                          Approve
                        </button>
                      )}
                      {b.status === "approved" && (
                        <button onClick={async () => {
                          if (!confirm("Mark as Paid?")) return;
                          const params = await buildQueryParams({});
                          try {
                            await api.post(`/payroll-management/mark-paid/${b.id}`, params);
                            const res = await api.get("/payroll-management/batches", { params: { ...params, per_page: 10 } });
                            setBatches(res.data?.data || []);
                          } catch (e) { alert("Failed"); }
                        }} className="px-2 py-1 rounded text-[10px] font-bold bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 transition">
                          Mark Paid
                        </button>
                      )}
                      {b.status === "paid" && (
                        <span className="text-[10px] text-gray-400">Completed</span>
                      )}
                      <button title="View Records" onClick={() => router.push(`/payslips/register?batch=${b.id}`)}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {batches.length === 0 && (
                <tr><td colSpan="8" className="px-4 py-8 text-center text-gray-400 text-xs">No batches yet. Click "Generate Payroll" to create one.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Buttons */}
      {batches.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {batches[0]?.status === "draft" && (
            <button onClick={async () => {
              if (!confirm("Approve the latest payroll batch?")) return;
              try {
                const params = await buildQueryParams({});
                await api.post(`/payroll-management/approve/${batches[0].id}`, params);
                alert("Payroll approved!");
                const { data } = await api.get("/payroll-management/batches", { params: { ...params, per_page: 10 } });
                setBatches(data?.data || []);
              } catch (e) { alert(e?.response?.data?.message || "Approve failed"); }
            }} className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-300 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-900/10 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition">
              <ThumbsUp className="h-3.5 w-3.5" /> Approve Payroll
            </button>
          )}
          {batches[0]?.status === "approved" && (
            <button onClick={async () => {
              if (!confirm("Mark the latest batch as Paid?")) return;
              try {
                const params = await buildQueryParams({});
                await api.post(`/payroll-management/mark-paid/${batches[0].id}`, params);
                alert("Payroll marked as paid!");
                const { data } = await api.get("/payroll-management/batches", { params: { ...params, per_page: 10 } });
                setBatches(data?.data || []);
              } catch (e) { alert(e?.response?.data?.message || "Failed"); }
            }} className="inline-flex items-center gap-1.5 rounded-lg border border-blue-300 dark:border-blue-500/30 bg-blue-50 dark:bg-blue-900/10 px-3 py-2 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition">
              <CreditCard className="h-3.5 w-3.5" /> Mark as Paid
            </button>
          )}
          <button onClick={() => router.push('/payslips/register')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <FileText className="h-3.5 w-3.5" /> View Register
          </button>
          <button onClick={() => router.push('/payslips/reports')}
            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 dark:border-white/10 bg-white dark:bg-gray-800 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
            <Download className="h-3.5 w-3.5" /> Download Reports
          </button>
        </div>
      )}
    </div>
  );
}
