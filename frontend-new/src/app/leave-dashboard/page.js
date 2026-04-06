"use client";

import React, { useState, useEffect } from "react";
import {
  Clock, CheckCircle2, XCircle, Users, TrendingUp, CalendarDays, FileText,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { getLeavesRequest } from "@/lib/endpoint/leaves";
import { getBranches, getDepartments, getDepartmentsByBranchIds } from "@/lib/api";
import MultiDropDown from "@/components/ui/MultiDropDown";
import DropDown from "@/components/ui/DropDown";
import ProfilePicture from "@/components/ProfilePicture";

const statusColors = {
  0: { label: "Pending", bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
  1: { label: "Approved", bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
  2: { label: "Rejected", bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
};

const leaveTypeColors = ["#40ab63", "#e74c3c", "#f39c12", "#8e44ad", "#3498db", "#1abc9c", "#e67e22", "#2ecc71"];

const KpiCard = ({ title, value, subtitle, icon: Icon, trend }) => (
  <div className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl p-5 flex justify-between items-start hover:shadow-lg transition-all">
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
      <h3 className="text-3xl font-bold text-white mt-1">{value}</h3>
      <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
      {trend && (
        <p className={`text-xs mt-1 font-medium ${trend.positive ? "text-emerald-400" : "text-red-400"}`}>
          {trend.positive ? "↑" : "↓"} {trend.value}% vs last month
        </p>
      )}
    </div>
    <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20">
      <Icon className="w-5 h-5 text-primary" />
    </div>
  </div>
);

const StatusBadge = ({ status }) => {
  const config = statusColors[status] || statusColors[0];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${config.bg} ${config.text} ${config.border}`}>
      {config.label}
    </span>
  );
};

export default function LeaveDashboard() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [branches, setBranches] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedBranchIds, setSelectedBranchIds] = useState([]);
  const [selectedDepartmentIds, setSelectedDepartmentIds] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);

  useEffect(() => {
    getBranches().then(setBranches).catch(console.error);
  }, []);

  useEffect(() => {
    const loadDepartments = async () => {
      try {
        if (selectedBranchIds.length > 0) {
          setDepartments(await getDepartmentsByBranchIds(selectedBranchIds));
        } else {
          setDepartments(await getDepartments());
        }
      } catch (error) {
        console.error("Failed to fetch departments:", error);
        setDepartments([]);
      }
    };

    loadDepartments();
  }, [selectedBranchIds]);

  useEffect(() => {
    fetchLeaves();
  }, [selectedBranchIds, selectedDepartmentIds, selectedStatus]);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const params = {
        per_page: 100,
        branch_ids: selectedBranchIds.length > 0 ? selectedBranchIds : undefined,
        department_ids: selectedDepartmentIds.length > 0 ? selectedDepartmentIds : undefined,
        status_ids: selectedStatus !== null ? [String(selectedStatus)] : undefined,
      };
      const result = await getLeavesRequest(params);
      setLeaves(Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : []);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  // KPI calculations
  const pendingCount = leaves.filter((l) => l.status === 0).length;
  const approvedCount = leaves.filter((l) => l.status === 1).length;
  const rejectedCount = leaves.filter((l) => l.status === 2).length;
  const totalLeaves = leaves.length;

  // Monthly trends
  const monthlyData = (() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return months.map((month, idx) => {
      const monthLeaves = leaves.filter((l) => {
        const d = new Date(l.from_date || l.start_date);
        return d.getMonth() === idx;
      });
      return {
        month,
        approved: monthLeaves.filter((l) => l.status === 1).length,
        rejected: monthLeaves.filter((l) => l.status === 2).length,
        pending: monthLeaves.filter((l) => l.status === 0).length,
      };
    }).filter((m) => m.approved > 0 || m.rejected > 0 || m.pending > 0);
  })();

  // Leave type distribution
  const typeDistribution = (() => {
    const typeMap = {};
    leaves.forEach((l) => {
      const name = l.leave_type?.name || l.leave_group_type?.leave_type?.name || "Other";
      typeMap[name] = (typeMap[name] || 0) + 1;
    });
    return Object.entries(typeMap).map(([name, value], i) => ({
      name,
      value,
      color: leaveTypeColors[i % leaveTypeColors.length],
    }));
  })();

  const utilization = totalLeaves > 0 ? Math.round((approvedCount / totalLeaves) * 100) : 0;

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="space-y-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-600 dark:text-white">Leave Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Overview of leave management across your organization</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <MultiDropDown
            placeholder="Select Branch"
            items={branches}
            value={selectedBranchIds}
            onChange={setSelectedBranchIds}
            badgesCount={1}
            portalled={false}
          />
          <MultiDropDown
            placeholder="Select Department"
            items={departments}
            value={selectedDepartmentIds}
            onChange={setSelectedDepartmentIds}
            badgesCount={1}
            portalled={false}
          />
          <DropDown
            placeholder="All Status"
            items={[
              { id: -1, name: "All Status" },
              { id: 0, name: "Pending" },
              { id: 1, name: "Approved" },
              { id: 2, name: "Rejected" },
            ]}
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val === -1 ? null : val)}
            portalled={false}
          />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard title="Pending Requests" value={pendingCount} subtitle="Awaiting approval" icon={Clock} trend={{ value: 12, positive: false }} />
        <KpiCard title="Approved" value={approvedCount} subtitle="Leaves approved" icon={CheckCircle2} trend={{ value: 8, positive: true }} />
        <KpiCard title="Total Requests" value={totalLeaves} subtitle="All leave requests" icon={CalendarDays} />
        <KpiCard title="Approval Rate" value={`${utilization}%`} subtitle="Leave approval rate" icon={TrendingUp} trend={{ value: 5, positive: true }} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Monthly Trends */}
        <div className="lg:col-span-2 bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Monthly Leave Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyData.length > 0 ? monthlyData : [{ month: "No Data", approved: 0, rejected: 0, pending: 0 }]}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="rgba(255,255,255,0.1)" />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} stroke="rgba(255,255,255,0.1)" />
              <Tooltip contentStyle={{ borderRadius: "8px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13 }} />
              <Bar dataKey="approved" fill="#40ab63" radius={[4, 4, 0, 0]} />
              <Bar dataKey="rejected" fill="#e74c3c" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pending" fill="#f39c12" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Leave Type Distribution */}
        <div className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Leave Type Distribution</h3>
          {typeDistribution.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={typeDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                    {typeDistribution.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: "8px", background: "#1e293b", border: "1px solid rgba(255,255,255,0.1)", color: "#fff", fontSize: 13 }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {typeDistribution.map((t) => (
                  <div key={t.name} className="flex items-center gap-2 text-xs text-slate-400">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: t.color }} />
                    <span>{t.name}</span>
                    <span className="ml-auto font-medium text-white">{t.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500 text-center py-10">No data available</p>
          )}
        </div>
      </div>

      {/* Recent Leave Requests Table */}
      <div className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">Recent Leave Requests</h3>
          <p className="text-xs text-slate-500 mt-0.5">Latest leave requests from your organization</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase">Employee</th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase">Leave Type</th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase">Duration</th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase">Days</th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase">Status</th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-500">Loading...</td></tr>
              ) : leaves.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-10 text-slate-500">No leave requests found</td></tr>
              ) : (
                leaves.slice(0, 10).map((req) => (
                  <tr key={req.id} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2.5">
                        <ProfilePicture src={req.employee?.profile_picture} />
                        <div>
                          <p className="font-medium text-white">{req.employee?.first_name || "—"}</p>
                          <p className="text-xs text-slate-500">{req.employee?.department?.name || "—"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-slate-300">
                      {req.leave_type?.name || req.leave_group_type?.leave_type?.name || "—"}
                    </td>
                    <td className="px-5 py-3 text-slate-400">
                      {req.from_date || req.start_date} → {req.to_date || req.end_date}
                    </td>
                    <td className="px-5 py-3 font-medium text-white">{req.days || req.total_days || "—"}</td>
                    <td className="px-5 py-3"><StatusBadge status={req.status} /></td>
                    <td className="px-5 py-3 text-slate-400">{req.created_at?.split("T")[0] || "—"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
