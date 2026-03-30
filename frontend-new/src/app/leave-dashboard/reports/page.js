"use client";

import React, { useState, useMemo } from "react";
import { Download, FileText, Filter } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  leaveTypes, employees, leaveRequests, getEmployee, getLeaveType,
} from "@/lib/leave-store";

const reportTypes = [
  { value: "usage", label: "Usage Summary" },
  { value: "department", label: "Department Breakdown" },
  { value: "monthly", label: "Monthly Trends" },
];

const statusColors = {
  pending: { text: "text-yellow-400" },
  approved: { text: "text-emerald-400" },
  rejected: { text: "text-red-400" },
};

const allDepartments = [...new Set(employees.map((e) => e.department))];

export default function LeaveReportsPage() {
  const [reportType, setReportType] = useState("usage");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [selectedLeaveType, setSelectedLeaveType] = useState("all");

  // Filtered leave requests
  const filteredRequests = useMemo(() => {
    return leaveRequests.filter((req) => {
      const emp = getEmployee(req.employeeId);
      if (!emp) return false;
      if (selectedDepartment !== "all" && emp.department !== selectedDepartment) return false;
      if (selectedLeaveType !== "all" && req.leaveTypeId !== selectedLeaveType) return false;
      return true;
    });
  }, [selectedDepartment, selectedLeaveType]);

  // Chart data: leave usage by department
  const chartData = useMemo(() => {
    const deptMap = {};
    allDepartments.forEach((dept) => {
      deptMap[dept] = { department: dept, totalDays: 0, approvedDays: 0 };
    });

    leaveRequests.forEach((req) => {
      const emp = getEmployee(req.employeeId);
      if (!emp) return;
      if (selectedLeaveType !== "all" && req.leaveTypeId !== selectedLeaveType) return;
      if (deptMap[emp.department]) {
        deptMap[emp.department].totalDays += req.days;
        if (req.status === "approved") {
          deptMap[emp.department].approvedDays += req.days;
        }
      }
    });

    return Object.values(deptMap).filter((d) => d.totalDays > 0);
  }, [selectedLeaveType]);

  // Table rows
  const tableRows = useMemo(() => {
    return filteredRequests.map((req) => {
      const emp = getEmployee(req.employeeId);
      const lt = getLeaveType(req.leaveTypeId);
      return {
        id: req.id,
        employee: emp?.name || "Unknown",
        department: emp?.department || "Unknown",
        leaveType: lt?.name || "Unknown",
        days: req.days,
        status: req.status,
      };
    });
  }, [filteredRequests]);

  // Export CSV
  const handleExportCSV = () => {
    const headers = ["Employee", "Department", "Leave Type", "Days", "Status"];
    const csvRows = [
      headers.join(","),
      ...tableRows.map((row) =>
        [row.employee, row.department, row.leaveType, row.days, row.status].join(",")
      ),
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leave_report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-600 dark:text-white">Leave Reports</h1>
          <p className="text-sm text-slate-500 mt-0.5">Generate and analyze leave usage reports</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors text-sm font-medium"
        >
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Filters Card */}
      <div className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-white">Filters</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Report Type */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
            >
              {reportTypes.map((rt) => (
                <option key={rt.value} value={rt.value} className="bg-slate-800 text-white">
                  {rt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              Department
            </label>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-800 text-white">All Departments</option>
              {allDepartments.map((dept) => (
                <option key={dept} value={dept} className="bg-slate-800 text-white">
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Leave Type */}
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 uppercase tracking-wider">
              Leave Type
            </label>
            <select
              value={selectedLeaveType}
              onChange={(e) => setSelectedLeaveType(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
            >
              <option value="all" className="bg-slate-800 text-white">All Leave Types</option>
              {leaveTypes.map((lt) => (
                <option key={lt.id} value={lt.id} className="bg-slate-800 text-white">
                  {lt.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-slate-400" />
          <h3 className="text-sm font-semibold text-white">Leave Usage by Department</h3>
        </div>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis
                dataKey="department"
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                stroke="rgba(255,255,255,0.05)"
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8" }}
                stroke="rgba(255,255,255,0.05)"
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  background: "#1e293b",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "#fff",
                  fontSize: 13,
                }}
              />
              <Bar dataKey="totalDays" name="Total Days" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="approvedDays" name="Approved" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-sm text-slate-500 text-center py-16">No data available for the selected filters</p>
        )}
      </div>

      {/* Data Table */}
      <div className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl">
        <div className="p-5 border-b border-white/10">
          <h3 className="text-sm font-semibold text-white">Leave Details</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {tableRows.length} record{tableRows.length !== 1 ? "s" : ""} found
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Employee
                </th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Department
                </th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Leave Type
                </th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Days
                </th>
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-slate-500">
                    No leave records found
                  </td>
                </tr>
              ) : (
                tableRows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-5 py-3 font-medium text-white">{row.employee}</td>
                    <td className="px-5 py-3 text-slate-400">{row.department}</td>
                    <td className="px-5 py-3 text-slate-300">{row.leaveType}</td>
                    <td className="px-5 py-3 font-medium text-white">{row.days}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`font-semibold capitalize ${
                          statusColors[row.status]?.text || "text-slate-400"
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
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
