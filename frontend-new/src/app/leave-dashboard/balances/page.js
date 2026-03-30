"use client";

import React, { useState, useMemo } from "react";
import { Search, X, ArrowUpRight, ArrowDownRight, ChevronRight } from "lucide-react";
import {
  employees,
  leaveTypes,
  getLeaveType,
  getEmployeeBalances,
  getEmployeeLedger,
} from "@/lib/leave-store";

/* ------------------------------------------------------------------ */
/*  Unique departments derived from employee data                     */
/* ------------------------------------------------------------------ */
const allDepartments = [...new Set(employees.map((e) => e.department))].sort();

/* ------------------------------------------------------------------ */
/*  Main Page                                                         */
/* ------------------------------------------------------------------ */
export default function LeaveBalancesPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  /* ---------- filtered employees ---------- */
  const filtered = useMemo(() => {
    return employees.filter((emp) => {
      const matchesSearch =
        !search ||
        emp.name.toLowerCase().includes(search.toLowerCase()) ||
        emp.email.toLowerCase().includes(search.toLowerCase());
      const matchesDept = !department || emp.department === department;
      return matchesSearch && matchesDept;
    });
  }, [search, department]);

  /* ---------- drawer data ---------- */
  const drawerBalances = selectedEmployee
    ? getEmployeeBalances(selectedEmployee.id)
    : [];
  const drawerLedger = selectedEmployee
    ? getEmployeeLedger(selectedEmployee.id)
    : [];

  return (
    <div className="p-4 md:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-80px)]">
      {/* ---- Header ---- */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-600 dark:text-white">
          Leave Balances
        </h1>
        <p className="text-sm text-slate-500 mt-0.5">
          View and manage employee leave balances across the organization
        </p>
      </div>

      {/* ---- Filters ---- */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Search employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-white/5 dark:bg-slate-800/50 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
        </div>

        {/* Department filter */}
        <select
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          className="w-full sm:w-48 py-2 px-3 text-sm rounded-lg bg-white/5 dark:bg-slate-800/50 border border-white/10 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none cursor-pointer"
        >
          <option value="" className="bg-slate-800 text-white">
            All Departments
          </option>
          {allDepartments.map((d) => (
            <option key={d} value={d} className="bg-slate-800 text-white">
              {d}
            </option>
          ))}
        </select>
      </div>

      {/* ---- Table ---- */}
      <div className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left font-medium text-slate-400 px-5 py-3 text-xs uppercase tracking-wider">
                  Employee
                </th>
                {leaveTypes.map((lt) => (
                  <th
                    key={lt.id}
                    className="text-center font-medium text-slate-400 px-4 py-3 text-xs uppercase tracking-wider whitespace-nowrap"
                  >
                    {lt.name}
                  </th>
                ))}
                <th className="text-center font-medium text-slate-400 px-4 py-3 text-xs uppercase tracking-wider">
                  Total Used
                </th>
                <th className="px-2 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={leaveTypes.length + 3}
                    className="text-center py-10 text-slate-500"
                  >
                    No employees found
                  </td>
                </tr>
              ) : (
                filtered.map((emp) => {
                  const balances = getEmployeeBalances(emp.id);
                  const totalUsed = balances.reduce((s, b) => s + b.used, 0);

                  return (
                    <tr
                      key={emp.id}
                      onClick={() => setSelectedEmployee(emp)}
                      className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {/* Employee cell */}
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                            {emp.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-white whitespace-nowrap">
                              {emp.name}
                            </p>
                            <p className="text-xs text-slate-500">
                              {emp.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Leave type columns */}
                      {leaveTypes.map((lt) => {
                        const bal = balances.find(
                          (b) => b.leaveTypeId === lt.id
                        );
                        return (
                          <td
                            key={lt.id}
                            className="px-4 py-3 text-center whitespace-nowrap"
                          >
                            {bal ? (
                              <span className="text-white font-medium">
                                {bal.remaining}
                                <span className="text-slate-500 font-normal">
                                  /{bal.entitled}
                                </span>
                              </span>
                            ) : (
                              <span className="text-slate-600">-</span>
                            )}
                          </td>
                        );
                      })}

                      {/* Total used */}
                      <td className="px-4 py-3 text-center">
                        <span className="font-semibold text-white">
                          {totalUsed}
                        </span>
                      </td>

                      {/* Chevron */}
                      <td className="px-2 py-3">
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---- Drawer Backdrop + Panel ---- */}
      {selectedEmployee && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSelectedEmployee(null)}
          />

          {/* Drawer */}
          <div className="fixed top-0 right-0 h-full w-full max-w-lg z-50 bg-slate-900 border-l border-white/10 shadow-2xl overflow-y-auto">
            {/* Drawer header */}
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-bold text-primary">
                  {selectedEmployee.avatar}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {selectedEmployee.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {selectedEmployee.department} &middot;{" "}
                    {selectedEmployee.category}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedEmployee(null)}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-6">
              {/* ---- Balance Cards ---- */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Leave Balances
                </h3>
                {drawerBalances.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No balances assigned to this employee.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {drawerBalances.map((bal) => {
                      const lt = getLeaveType(bal.leaveTypeId);
                      return (
                        <div
                          key={bal.leaveTypeId}
                          className="bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-xl p-4"
                        >
                          <div className="flex items-center gap-2 mb-3">
                            <div
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ background: lt?.color || "#888" }}
                            />
                            <p className="text-sm font-semibold text-white truncate">
                              {lt?.name || bal.leaveTypeId}
                            </p>
                          </div>
                          <div className="grid grid-cols-2 gap-y-2 text-xs">
                            <div>
                              <p className="text-slate-500">Remaining</p>
                              <p className="text-lg font-bold text-white">
                                {bal.remaining}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Entitled</p>
                              <p className="text-lg font-bold text-white">
                                {bal.entitled}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Used</p>
                              <p className="text-sm font-semibold text-red-400">
                                {bal.used}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-500">Pending</p>
                              <p className="text-sm font-semibold text-yellow-400">
                                {bal.pending}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ---- Leave Ledger ---- */}
              <div>
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                  Leave Ledger
                </h3>
                {drawerLedger.length === 0 ? (
                  <p className="text-sm text-slate-500">
                    No ledger entries found.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {drawerLedger.map((entry) => {
                      const lt = getLeaveType(entry.leaveTypeId);
                      const isCredit = entry.type === "credit";

                      return (
                        <div
                          key={entry.id}
                          className="flex items-start gap-3 bg-white/5 dark:bg-slate-800/50 border border-white/10 rounded-lg px-4 py-3"
                        >
                          {/* Arrow icon */}
                          <div
                            className={`mt-0.5 p-1 rounded-full shrink-0 ${
                              isCredit
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-red-500/20 text-red-400"
                            }`}
                          >
                            {isCredit ? (
                              <ArrowUpRight className="w-4 h-4" />
                            ) : (
                              <ArrowDownRight className="w-4 h-4" />
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <p className="text-sm font-medium text-white truncate">
                                {entry.description}
                              </p>
                              <span
                                className={`text-sm font-bold shrink-0 ${
                                  isCredit ? "text-emerald-400" : "text-red-400"
                                }`}
                              >
                                {isCredit ? "+" : "-"}
                                {entry.amount}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-xs text-slate-500">
                                {entry.date}
                              </span>
                              <span className="text-xs text-slate-600">
                                &middot;
                              </span>
                              <span className="text-xs text-slate-400">
                                {lt?.name || entry.leaveTypeId}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
